import { createExtension } from '@metafoks/app';
import { ConfigWithMongoDb } from '../config';
import { createMongoDbInMemoryServer } from './memoryServer';
import { mongoDbExtension } from '../extension';

export const mongoDbTestingExtension = createExtension(context => {
    const config = context.getConfig<ConfigWithMongoDb>();

    return {
        identifier: 'ru.metafoks.extension.MongoDbTesting',
        autorun: async () => {
            const server = await createMongoDbInMemoryServer();
            context.addValue('config', { ...config, mongodb: { ...config.mongodb, uri: server.getUri() } });

            const originalExtension = mongoDbExtension(context);
            await originalExtension.autorun?.();
        },
    };
});
