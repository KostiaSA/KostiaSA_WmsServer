import * as _ from 'lodash';

// import {
//     Db, ExecuteSqlSocketRequest, SqlAnswerRow, ExecuteSqlSocketAnswer, ExecuteSqlBatchSocketRequest,
//     ExecuteSqlBatchSocketAnswer
// } from "./Db";

import {IPool, config, Connection, Request, TYPES} from "mssql";
import {IReply} from "hapi";
import {ServerConfig} from "./ServerConfig";
const  crypto = require("crypto-js");

let pools: { [connectionId: string]: Connection; } = {};

export var dbList: {[key: string]: MsSqlDb } = {};

export interface ExecuteSqlSocketRequest {
    dbName: string;
    sql: string;
}

export interface ExecuteSqlBatchSocketRequest {
    dbName: string;
    sql: string[];
}

export type SqlValueParseMode= "" | "Date";

export interface SqlAnswerColumn {
    name: string;
}

export interface SqlAnswerRow {
    values?: any[];
}

export interface ExecuteSqlSocketAnswer {
    columns?: any[];
    rows?: SqlAnswerRow[];
    error?: string;
    errorSql?: string;
}

export interface ExecuteSqlBatchSocketAnswer {
    answers?: ExecuteSqlSocketAnswer[];
    error?: string;
    errorSql?: string;
}



export class MsSqlDb  {
    dbName: string;

    host: string;
    instance:string;
    port: number;
    user: string;
    password: string;
    database: string;

    decodeSqlBatch(sql:string[]):string[]{
        return sql.map((item:string)=>{
            //console.log("item:"+item);
            //console.log("key:"+ServerConfig.key+"AgFLsh23iGd");
            //console.log("res:"+crypto.AES.decrypt(item, ServerConfig.key+"AgFLsh23iGd").toString(crypto.enc.Utf8));

            return crypto.AES.decrypt(item, ServerConfig.key+"AgFLsh23iGd").toString(crypto.enc.Utf8);
        });
    }

    executeSqlBatch(reply: IReply, request: ExecuteSqlBatchSocketRequest, attemptsCounter: number = 0) {
        //console.time(request.queryId);
        let options = {instanceName: this.instance} as any;
        let config: config = {
            driver: "msnodesqlv8",
            pool: {
                min: 0,
                max: 20,
                idleTimeoutMillis: 5000 /// не работает
            },
            server: this.host,
            port: this.port || 1433,
            user: this.user,
            database: this.database,
            password: this.password,
            options: options
        }

        let connectionId = JSON.stringify(config);
        let connection = pools[connectionId];
        if (!connection) {
            connection = new Connection(config);
            pools[connectionId] = connection;
        }

        let doRequest = ()=> {
            let req = new Request(connection);
            req.multiple = true;
            req
                .batch(this.decodeSqlBatch(request.sql).join(";\n"))
                .then((rowsSet: any) => {
                    let answers: ExecuteSqlSocketAnswer[] = [];
                    if (rowsSet) {
                        answers = rowsSet.map((rows: any)=> {
                            //console.timeEnd(request.queryId);
                            let dataRows: SqlAnswerRow[];
                            if (rows && rows.map) {
                                dataRows = rows.map((row: any) => {
                                    return _.values(row);
                                });
                            }
                            else
                                dataRows = [];

                            let dataColumns: any = [];

                            if (rows) {
                                dataColumns = _.values((rows as any).columns);

                                dataColumns.forEach((col: any)=> {
                                    for (let typeName in TYPES) {
                                        if (col.type === TYPES[typeName]) {
                                            col.type = typeName;
                                            break;
                                        }
                                    }
                                });
                            }

                            let answer: ExecuteSqlSocketAnswer = {columns: dataColumns, rows: dataRows};
                            return answer;
                        });
                    }

                    let answer: ExecuteSqlBatchSocketAnswer = {answers: answers};
                    reply(answer);

                })
                .catch((err) => {
                    let answer: ExecuteSqlBatchSocketAnswer = {
                        error: err.toString().replace("RequestError","sql-error"),
                        errorSql: request.sql.join(";\n")
                    };
                    reply(answer);
                });
        }


        if (!connection.connected && !connection.connecting) {
            //console.log("connect");
            connection.connect().catch((err)=> {
                delete pools[connectionId];
                connection = null;
                let answer: ExecuteSqlBatchSocketAnswer = {
                    error: err.toString() + `", server:${config.server}, db:${config.database}, login:${config.user}`,
                    errorSql: request.sql.join(";\n")
                };
                reply(answer);
            });
        }

        if (pools[connectionId] && connection && connection.connected) {
            doRequest();
        }
        // else {
        //     let counter = 0;
        //     let interval = setInterval(()=> {
        //         //console.log("interval",counter);
        //         counter++;
        //         if (counter > 1000 || !connection || !pools[connectionId]) {
        //             clearInterval(interval);
        //             let answer: ExecuteSqlBatchSocketAnswer = {
        //                 error: `"mssql connection error, server:${config.server}, db:${config.database}, login:${config.user}`,
        //                 errorSql: request.sql.join(";\n")
        //             };
        //             reply(answer);
        //         }
        //         else if (connection.connected) {
        //             clearInterval(interval);
        //             doRequest();
        //         }
        //     }, 1000)
        // }


    }

}

let db = new MsSqlDb();
db.dbName = "wms";
db.host = ServerConfig.sqlHost;
db.instance =ServerConfig.sqlInstance;
db.port =  ServerConfig.sqlPort;
db.user =  ServerConfig.sqlUser;
db.password = ServerConfig.sqlPassword;
db.database =ServerConfig.sqlDatabase;

dbList[db.dbName] = db;
