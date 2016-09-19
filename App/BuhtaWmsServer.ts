import {Server} from "hapi";
import {IServerConnectionOptions} from "hapi";
import {IRouteConfiguration} from "hapi";
import {IReply} from "hapi";
import {Request} from "hapi";
import {ExecuteSqlBatchSocketRequest, dbList} from "./MsSqlDb";
//import {dbList, ExecuteSqlBatchSocketRequest} from "./Db"6;


let server = new Server();


let connectionOptions: IServerConnectionOptions = {
    port: 3000
}

server.connection(connectionOptions);


let route: IRouteConfiguration = {

    method: "POST",
    path: "/",
    handler: function (request: Request, reply: IReply) {

        let sqlReq: ExecuteSqlBatchSocketRequest = request.payload;

        console.log({req: "execSql", dbName: sqlReq.dbName, sql: sqlReq.sql.join("\n")});

        //console.log("executeSQL: " + socket.id + ", " + client.login + " from " + socket.handshake.address);

        let db = dbList[sqlReq.dbName];
        if (!db) {
            reply.response({error: "invalid dbName '" + sqlReq.dbName + "'"});
        }
        else
            db.executeSqlBatch(reply, sqlReq);

        //reply("Hello Buhta WMS!");
        //console.log("request.payload.a.length");
        //console.log(request.payload.a.length);
        //reply.response({aaa: "Ok", bbb: "ПИЗДЕЦ" + request.payload.a.length});
    },
    config: {payload: {maxBytes: 104857600}}

}

server.route(route);

server.start((err) => {

    if (err) {
        throw err;
    }
    console.log(`Server running at: ${server.info.uri}`);
});
