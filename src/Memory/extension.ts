import { ExtensionFactory } from '@metafoks/app';
import { ConfigWithMongoDb } from '../config';
import { createMongoDbInMemoryServer } from './memoryServer';
import { mongoDbExtension } from '../extension';

export const mongoDbMemoryExtension = ExtensionFactory.create({
    manifest: { identifier: 'org.metafoks.extension.MongoDB.Memory' },
    install: context => mongoDbExtension.install?.(context),
    autorun: async context => {
        const config = context.getConfig<ConfigWithMongoDb>();
        const server = await createMongoDbInMemoryServer();
        context.addValue('config', { ...config, mongodb: { ...config.mongodb, uri: server.getUri() } });

        await mongoDbExtension.autorun?.(context);
    },
});
