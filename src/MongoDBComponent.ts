import { CollectionOptions, Db, MongoClient } from 'mongodb'
import { MongoDbConfig } from './config'
import { Document } from 'bson'
import { ExtensionFactory, LoggerFactory, MetafoksExtension } from 'metafoks-application'

export class MongoDB {
  /**
   * Расширения для Metafoks Application для работы с MongoDB
   */
  public static extension = ExtensionFactory.create<MongoDbConfig>({
    identifier: 'com.metafoks.extension.MongoDB',
    configProperty: 'mongodb',
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
  })

  private readonly logger = LoggerFactory.create(MongoDB)
  private readonly connectionString: string

  public readonly client: MongoClient
  public readonly database: Db

  /**
   * Создание строки подключения к базе данных
   * @param config
   */
  public static createConnectionString(config: MongoDbConfig) {
    if ('uri' in config) {
      return config.uri
    } else {
      const port = config.port ?? 27017

      if ('login' in config && 'password' in config) {
        return `mongodb://${config.login}:${config.password}@${config.host}:${port}/?authMechanism=DEFAULT`
      } else {
        return `mongodb://${config.host}:${port}/?authMechanism=DEFAULT`
      }
    }
  }

  public constructor(config: MongoDbConfig) {
    const dbConfig = config

    this.connectionString = MongoDB.createConnectionString(dbConfig)
    this.client = new MongoClient(this.connectionString)
    this.database = this.client.db(dbConfig.database)
  }

  /**
   * Подключение к базе данных
   */
  public async connect() {
    this.logger.debug(`connection to database`)

    await this.client.connect()
    this.logger.info(`connected to database`)
  }

  /**
   * Закрытие соединения с базой данных
   * @param force
   */
  public async close(force: boolean = false) {
    this.logger.debug(`closing connection to database...`)

    await this.client.close(force)
    this.logger.info(`connection to database closed`)
  }

  /**
   * Получение коллекции из базы данных
   * @param name
   * @param options
   */
  public getCollection<T extends Document = Document>(name: string, options: CollectionOptions = {}) {
    return this.database.collection<T>(name, options)
  }
}
