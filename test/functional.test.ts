import { ConfigWithMongoDb, MongoDbComponent, mongoDbExtension } from '../src';
import { createAbstractApplication, MetafoksAbstractApplication } from '@metafoks/app';
import { MongoMemoryServer } from 'mongodb-memory-server';

const dbFn = jest.fn();
const connectFn = jest.fn();

jest.mock('mongodb', () => ({
    MongoClient: class {
        constructor() {}

        db = dbFn;
        connect = connectFn;
    },
}));

describe('functional test', () => {
    beforeEach(() => {
        dbFn.mockReset();
        connectFn.mockReset();
    });

    it('should call mongodb functions', async () => {
        const app = createAbstractApplication<ConfigWithMongoDb>({
            config: {
                overrides: {
                    mongodb: {
                        database: 'randomDb',
                        uri: 'random uri',
                    },
                },
            },
            with: [mongoDbExtension],
        });

        expect(app.getContext().getContainer().hasRegistration('db')).toBeTruthy();

        expect(dbFn).toHaveBeenCalledTimes(1);
        expect(connectFn).toHaveBeenCalledTimes(1);

        expect(dbFn).toHaveBeenCalledWith('randomDb');
    });
});
