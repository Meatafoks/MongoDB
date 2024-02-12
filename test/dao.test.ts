import { SingleIdentifierDataAccessObject, MongoDbComponent, mongoDbTestingExtension } from '../src';
import { asComponent, Autowire, containerOf, MetafoksTestingApplication, With } from '@metafoks/app';

interface TestEntity {
    taskId: string;
    name: string;
}

describe('data access object test', () => {
    class TestDao extends SingleIdentifierDataAccessObject<TestEntity, 'taskId'> {
        public constructor(protected deps: { db: MongoDbComponent }) {
            super({ db: deps.db, collectionName: 'tasks', singleIdentifierField: 'taskId' });
        }
    }

    @MetafoksTestingApplication()
    @With(mongoDbTestingExtension)
    @Autowire('testDao', asComponent(TestDao))
    class App {}

    it('should insert data', async () => {
        // given
        const container = await containerOf(App);
        const testDao = container.context.resolve<TestDao>('testDao');
        const db = container.context.resolve<MongoDbComponent>('db');
        const collection = db.getCollection<TestEntity>('tasks');

        // when-0
        const taskId = await testDao.create({ name: 'John' });
        const result = await collection.findOne({ name: 'John' });

        // then-0
        expect(result!.taskId).toBe(taskId);

        // when-1
        await testDao.updateById(taskId, { name: 'Sam' });
        const result2 = await collection.findOne({ taskId });

        // then-1
        expect(result2!.name).toBe('Sam');

        // when-2
        await testDao.delete(taskId);
        const result3 = await collection.findOne({ taskId });

        // then-2
        expect(result3).toBe(null);
    });
});
