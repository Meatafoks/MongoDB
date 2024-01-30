import { ConfigWithMongoDb, MongoDbComponent, mongoDbExtension } from '../src';
import { MetafoksAbstractApplication } from '@metafoks/app';
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
        const app = await MetafoksAbstractApplication.createInstant<ConfigWithMongoDb>({
            config: {
                mongodb: {
                    database: 'database',
                    uri: mongod.getUri(),
                    autorun: false,
                },
                metafoks: { logger: { level: { app: 'trace' } } },
            },
            with: [mongoDbExtension],
        });

        expect(app.getContext().getContainer().hasRegistration('db')).toBeTruthy();
        const component = app.resolve<MongoDbComponent>('db');

        await expect(component.connect()).resolves.toBe(void {});
    });
});
