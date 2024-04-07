import * as mongo from 'mongodb'

export type Document = mongo.Document
export type Db = mongo.Db
export type ObjectId = mongo.ObjectId
export type WithId<TSchema> = mongo.WithId<TSchema>
export type InferIdType<TSchema> = mongo.InferIdType<TSchema>
export type Condition<T> = mongo.Condition<T>
export type Filter<T> = mongo.Filter<T>
export type Collection<TSchema extends Document = Document> = mongo.Collection<TSchema>
export type UUID = string
