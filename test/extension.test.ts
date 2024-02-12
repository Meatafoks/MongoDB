import { MongoDbComponent, mongoDbTestingExtension } from '../src';
import { containerOf, MetafoksTestingApplication, With } from '@metafoks/app';

describe('connection test', () => {
    @MetafoksTestingApplication()
    @With(mongoDbTestingExtension)
    class App {}

    it('should load connection', async () => {
        const container = await containerOf(App);

        expect(container.context.has('db')).toBeTruthy();
        const component = container.context.resolve<MongoDbComponent>('db');

        await expect(component.connect()).resolves.toBe(void {});
    });
});
