import { ExtensionFactory } from '@metafoks/app';
import { MongoDbComponent } from './components';
import { ConfigWithMongoDb } from './config';

export const mongoDbExtension = ExtensionFactory.create({
    manifest: { identifier: 'org.metafoks.extension.MongoDB' },
    install: context => {
        const config = context.getConfig<Partial<ConfigWithMongoDb>>();
        const componentName = config.mongodb?.componentName ?? 'db';

        context.addClass(componentName, MongoDbComponent);
    },
    autorun: async context => {
        const config = context.getConfig<Partial<ConfigWithMongoDb>>();
        const componentName = config.mongodb?.componentName ?? 'db';

        if (!config.mongodb) {
            throw new Error('`config:mongodb.*` configuration required!');
        }
        await context.resolve<MongoDbComponent>(componentName).connect();
    },
});
