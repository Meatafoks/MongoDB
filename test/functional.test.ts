import { ConfigWithMongoDb, mongoDbExtension } from '../src';
import { createAbstractApplication } from '@metafoks/app';

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
        const app = await createAbstractApplication<ConfigWithMongoDb>({
            config: {
                mongodb: {
                    database: 'randomDb',
                    uri: 'random uri',
                },
            },
            extensions: [mongoDbExtension],
        });

        expect(app.getContext().has('db')).toBeTruthy();

        expect(dbFn).toHaveBeenCalledTimes(1);
        expect(connectFn).toHaveBeenCalledTimes(1);

        expect(dbFn).toHaveBeenCalledWith('randomDb');
    });
});
