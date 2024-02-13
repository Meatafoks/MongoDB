import { MongoDbComponent, mongoDbMemoryExtension } from '../src';
import { runMetafoksApplication, TestingApplication, With } from '@metafoks/app';

describe('connection test', () => {
    @TestingApplication
    @With(mongoDbMemoryExtension)
    class App {}

    it('should load connection', async () => {
        const container = await runMetafoksApplication(App);

        expect(container.context.has('db')).toBeTruthy();
        const component = container.context.resolve<MongoDbComponent>('db');

        await expect(component.connect()).resolves.toBe(void {});
    });
});
