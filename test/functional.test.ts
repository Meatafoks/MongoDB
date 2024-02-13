import { ConfigWithMongoDb, mongoDbExtension } from '../src';
import { TestingApplication, Override, With, runMetafoksApplication } from '@metafoks/app';

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
    @TestingApplication
    @With(mongoDbExtension)
    @Override<ConfigWithMongoDb>({
        mongodb: {
            database: 'randomDb',
            uri: 'random uri',
        },
    })
    class App {}

    it('should call mongodb functions', async () => {
        const container = await runMetafoksApplication(App);

        expect(container.context.has('db')).toBeTruthy();

        expect(dbFn).toHaveBeenCalledTimes(1);
        expect(connectFn).toHaveBeenCalledTimes(1);

        expect(dbFn).toHaveBeenCalledWith('randomDb');
    });
});
