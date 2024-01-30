import { CollectionOptions, Db, MongoClient } from 'mongodb';
import { ConfigWithMongoDb, MongoDbConfig } from '../config';
import { createLogger } from '@metafoks/app';
import { Document } from 'bson';

export class MongoDbComponent {
    private readonly logger = createLogger(MongoDbComponent);
    private readonly connectionString: string;

    public readonly client: MongoClient;
    public readonly database: Db;

    public static createConnectionString(config: MongoDbConfig) {
        if ('uri' in config) {
            return config.uri;
        } else {
            const port = config.port ?? 27017;

            if ('login' in config && 'password' in config) {
                return `mongodb://${config.login}:${config.password}@${config.host}:${port}/?authMechanism=DEFAULT`;
            } else {
                return `mongodb://${config.host}:${port}/?authMechanism=DEFAULT`;
            }
        }
    }

    public constructor(private deps: { config: ConfigWithMongoDb }) {
        const dbConfig = deps.config.mongodb;
        this.connectionString = MongoDbComponent.createConnectionString(dbConfig);

        this.client = new MongoClient(this.connectionString);
        this.database = this.client.db(dbConfig.database);
    }

    public async connect() {
        this.logger.debug(`connection to database`);

        await this.client.connect();
        this.logger.info(`connected to database`);
    }

    public getCollection<T extends Document = Document>(name: string, options: CollectionOptions = {}) {
        return this.database.collection<T>(name, options);
    }

    public async close() {
        await this.client.close();
    }
}
