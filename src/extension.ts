import { createExtension, LoggerFactory, MetafoksAppConfig } from '@metafoks/app';
import { MongoDbComponent } from './components';
import { ConfigWithMongoDb } from './config';

export const mongoDbExtension = createExtension(context => {
    const config = context.getConfig() as ConfigWithMongoDb & MetafoksAppConfig;

    if (!config.mongodb) {
        throw new Error('`config:mongodb.*` configuration required!');
    }

    const componentName = config.mongodb.componentName ?? 'db';
    context.addClass(componentName, MongoDbComponent);

    return {
        identifier: 'ru.metafoks.extension.MongoDB',
        autorun: async () => await context.resolve<MongoDbComponent>(componentName).connect(),
    };
});
