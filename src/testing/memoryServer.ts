import { MongoMemoryServer } from 'mongodb-memory-server';

export async function createMongoDbInMemoryServer() {
    return await MongoMemoryServer.create();
}
