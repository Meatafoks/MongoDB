import { LoggerFactory, MetafoksAppConfig, MetafoksContext } from '@metafoks/app';
import { MongoDbComponent } from './components';
import { ConfigWithMongoDb } from './config';

export async function mongoDbExtension(context: MetafoksContext) {
    const logger = LoggerFactory.createLoggerByName('MongoDbExtension');
    const config = context.getConfig() as ConfigWithMongoDb & MetafoksAppConfig;
    logger.level = config.metafoks?.logger?.level?.app ?? 'INFO';

    if (!config.mongodb) {
        throw new Error('config.mongodb configuration required!');
    }

    const componentName = config.mongodb.componentName ?? 'db';

    logger.debug('starting loading extension');
    context.addClass(componentName, MongoDbComponent);

    if (config.mongodb.autorun !== false) {
        await context.resolve<MongoDbComponent>(componentName).connect();
    }

    logger.info('extension loaded');
}
