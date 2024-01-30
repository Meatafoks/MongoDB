export type MongoDbConnection =
    | { uri: string }
    | { host: string; port?: number }
    | { login: string; password: string; host: string; port?: number };

export type MongoDbConfig = {
    database: string;
    autorun?: boolean;
    componentName?: string;
} & MongoDbConnection;

export interface ConfigWithMongoDb {
    mongodb: MongoDbConfig;
}
