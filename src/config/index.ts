export type MongoDbUriConnection = { uri: string }
export type MongoDbHostConnection = { host: string; port?: number }
export type MongoDbAuthorizedConnection = { login: string; password: string; host: string; port?: number }

export type MongoDbConnection = MongoDbUriConnection | MongoDbHostConnection | MongoDbAuthorizedConnection

export type MongoDbConfig = {
  database: string
} & MongoDbConnection
