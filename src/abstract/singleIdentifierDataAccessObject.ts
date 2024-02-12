import { Collection, Filter, Document, UUID } from '../types';
import { MongoDbComponent } from '../components';
import { v4 } from 'uuid';
import { OptionalUnlessRequiredId } from 'mongodb';

export abstract class SingleIdentifierDataAccessObject<
    TSchema extends Document,
    IdentifierField extends keyof TSchema,
    IdentifierType extends UUID = TSchema[IdentifierField],
> {
    protected readonly collection: Collection<TSchema>;
    private readonly singleIdentifierField: IdentifierField;

    protected constructor(deps: {
        collectionName: string;
        db: MongoDbComponent;
        singleIdentifierField: IdentifierField;
    }) {
        this.collection = deps.db.getCollection<TSchema>(deps.collectionName);
        this.singleIdentifierField = deps.singleIdentifierField;
    }

    public async findById(identifier: IdentifierType) {
        return await this.collection.findOne({ [this.singleIdentifierField]: identifier } as Filter<TSchema>);
    }

    public async create(payload: Omit<TSchema, IdentifierField>): Promise<IdentifierType> {
        const id = v4() as IdentifierType;
        const constructedPayload = {
            ...payload,
            [this.singleIdentifierField]: id,
            created: new Date(),
            updated: new Date(),
        } as OptionalUnlessRequiredId<any>;
        const result = await this.collection.insertOne(constructedPayload);
        return id;
    }

    public async updateById(identifier: IdentifierType, payload: Omit<TSchema, IdentifierField>) {
        const constructedPayload = { ...payload, updated: new Date() } as OptionalUnlessRequiredId<any>;
        const result = await this.collection.updateOne(
            { [this.singleIdentifierField]: identifier } as Filter<TSchema>,
            { $set: constructedPayload },
            { upsert: true },
        );
        return result.modifiedCount;
    }

    /**
     * Deletes object by identity
     * @param identifier
     */
    public async delete(identifier: IdentifierType) {
        const result = await this.collection.deleteOne({
            [this.singleIdentifierField]: identifier,
        } as Filter<TSchema>);
        return result.deletedCount;
    }
}
