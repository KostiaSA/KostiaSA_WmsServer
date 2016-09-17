//
// import * as _ from 'lodash';
// import {TYPES} from "mssql";
// import {MsSqlDb} from "./MsSqlDb";
// import {IReply} from "hapi";
//
//
// export var dbList: {[key: string]: Db } = {};
//
// export interface ExecuteSqlSocketRequest {
//     dbName: string;
//     sql: string;
// }
//
// export interface ExecuteSqlBatchSocketRequest {
//     dbName: string;
//     sql: string[];
// }
//
// export type SqlValueParseMode= "" | "Date";
//
// export interface SqlAnswerColumn {
//     name: string;
// }
//
// export interface SqlAnswerRow {
//     values?: any[];
// }
//
// export interface ExecuteSqlSocketAnswer {
//     columns?: any[];
//     rows?: SqlAnswerRow[];
//     error?: string;
//     errorSql?: string;
// }
//
// export interface ExecuteSqlBatchSocketAnswer {
//     answers?: ExecuteSqlSocketAnswer[];
//     error?: string;
//     errorSql?: string;
// }
//
// export class Db {
//     dbName: string;
//
//     host: string;
//     port: number;
//     user: string;
//     password: string;
//     database: string;
//
//     //knex: Knex;
//     executeSqlBatch(reply: IReply, request: ExecuteSqlBatchSocketRequest) {
//
//     }
//
//
// }
//
//
// let db = new MsSqlDb();
// db.dbName = "wms";
//
// //schemaDb.host = "ps-web";
// //schemaDb.port = 1433;
// db.host = "5.19.239.191";
// db.port = 52538;
//
// db.user = "sa1";
// db.password = "sonyk";
// db.database = "BuhtaSchema2017";
// dbList[db.dbName] = db;
//
// //
// //
// // //--------  MSSQL
// // let schemaDb = new Db();
// // schemaDb.dbName = "schema-mssql";
// // schemaDb.dialect = "mssql";
// //
// // schemaDb.knex = Knex({
// //     client: schemaDb.dialect,
// //     connection: {
// //         host: 'ps-web',
// //         //host     : '5.19.239.191',
// //         //port     : '52538',
// //         user: 'sa1',
// //         password: 'sonyk',
// //         database: 'BuhtaSchema2017'
// //     }
// // });
// // dbList[schemaDb.dbName] = schemaDb;
// //
// // //--------  POSTGRES
// // schemaDb = new Db();
// // schemaDb.dbName = "schema-pg";
// // schemaDb.dialect = "pg";
// // schemaDb.knex = Knex({
// //     client: schemaDb.dialect,
// //     connection: {
// //         host: '192.168.0.70',
// //         port: '5432',
// //         user: 'postgres',
// //         password: 'sonyk795',
// //         database: 'BuhtaSchema2017'
// //     }
// // });
// // dbList[schemaDb.dbName] = schemaDb;
// //
// //
// // //--------  MYSQL
// // schemaDb = new Db();
// // schemaDb.dbName = "schema-mysql";
// // schemaDb.dialect = "mysql";
// // schemaDb.knex = Knex({
// //     client: schemaDb.dialect,
// //     connection: {
// //         host: '192.168.0.70',
// //         port: '3306',
// //         user: 'root',
// //         password: 'sonyk795',
// //         database: 'BuhtaSchema2017'
// //     }
// // });
// // dbList[schemaDb.dbName] = schemaDb;
// //
// //
// // //--------  TEST-MSSQL
// // schemaDb = new Db();
// // schemaDb.dbName = "test-mssql";
// // schemaDb.dialect = "mssql";
// //
// // schemaDb.knex = Knex({
// //     client: schemaDb.dialect,
// //     connection: {
// //         host: 'ps-web',
// //         //host     : '5.19.239.191',
// //         //port     : '52538',
// //         user: 'sa1',
// //         password: 'sonyk',
// //         database: 'BuhtaSchema2017'
// //     }
// // });
// // dbList[schemaDb.dbName] = schemaDb;
// //
// // //--------  TEST-POSTGRES
// // schemaDb = new Db();
// // schemaDb.dbName = "test-pg";
// // schemaDb.dialect = "pg";
// // schemaDb.knex = Knex({
// //     client: schemaDb.dialect,
// //     connection: {
// //         host: '192.168.0.70',
// //         port: '5432',
// //         user: 'postgres',
// //         password: 'sonyk795',
// //         database: 'BuhtaSchema2017'
// //     }
// // });
// // dbList[schemaDb.dbName] = schemaDb;
// //
// //
// // //--------  TEST-MYSQL
// // schemaDb = new Db();
// // schemaDb.dbName = "test-mysql";
// // schemaDb.dialect = "mysql";
// // schemaDb.knex = Knex({
// //     client: schemaDb.dialect,
// //     connection: {
// //         host: '192.168.0.70',
// //         port: '3306',
// //         user: 'root',
// //         password: 'sonyk795',
// //         database: 'BuhtaSchema2017'
// //     }
// // });
// // dbList[schemaDb.dbName] = schemaDb;
