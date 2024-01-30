# Metafoks MongoDB Extension

## How to use?

```shell
npm i @metafoks/mongodb
```

setup `config/config.json` file:

```json
{
  "mongodb": {
    "database": "databaseName",
    "uri": "uri string"
  }
}
```

add extension to your application

```typescript
import { MetafoksApplication } from "@metafoks/app";
import { mongoDbExtension } from "@metafoks/mogodb";

@MetafoksApplication( {
    with: [mongoDbExtension]
} )
```

it will automatically connect to database when the application starts. If you dont want auto-connect,
set `mongodb.autorun:false` in your config file.

## Component

After all you can simply use `db` component. You can change it by config `mongodb.componentName` - set it as you want.

```typescript
import { MetafoksApplication } from "@metafoks/app";
import { MongoDbComponent } from "@metafoks/mongodb";

@MetafoksApplication( {
    with: [mongoDbExtension]
} )
class Application {
    constructor(private deps: { db: MongoDbComponent }) {}

    start() {
        const collection = this.deps.db.getCollection<UserEntity>( "users" );
        //...
    }
}
```