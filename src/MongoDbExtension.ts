import { MetafoksExtension } from 'metafoks-application'
import { ConfigWithMongoDb } from './config'
import { MongoDB } from './components'

export const MongoDbExtension: MetafoksExtension<ConfigWithMongoDb> = {
  identifier: 'com.metafoks.extension.MongoDB',
  install: (container, config) => {
    container.set(MongoDB, new MongoDB(config))
  },
  autorun: async container => {
    const db = container.get(MongoDB)
    await db.connect()
  },
  close: async (force, container) => {
    const db = container.get(MongoDB)
    await db.close(force)
  },
}
