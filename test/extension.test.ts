import { ConfigWithMongoDb, MongoDbComponent, mongoDbExtension } from '../src';
import { createAbstractApplication } from '@metafoks/app';
import { MongoMemoryServer } from 'mongodb-memory-server';

describe('connection test', () => {
    let mongod!: MongoMemoryServer;

    beforeEach(async () => {
        mongod = await MongoMemoryServer.create();
    });

    afterEach(async () => {
        await mongod.stop();
    });

    it('should load connection', async () => {
        const app = await createAbstractApplication<ConfigWithMongoDb>({
            config: {
                mongodb: {
                    database: 'database',
                    uri: mongod.getUri(),
                    autorun: false,
                },
            },
            extensions: [mongoDbExtension],
        });

        expect(app.getContext().has('db')).toBeTruthy();
        const component = app.resolve<MongoDbComponent>('db');

        await expect(component.connect()).resolves.toBe(void {});
    });
});
