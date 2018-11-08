
## GrapQL-Fastify

This [Fastify](https://github.com/fastify/fastify) plugin uses [graphql-js](https://github.com/graphql/graphql-js) implementation.

## Why this one?
A unique advantage of this plugin is that it gives you access to http request and response before executing graphql query, so that you can create a context for the resolver. If you are thinking of implementing any user authentication (eg jwt), then this is your bet (see graphQLOptions as function below).

### Alternative implementations

-   [fastify-graphql](https://github.com/sirsavary/fastify-graphql) is based on [Apollo's graphql implementation](https://github.com/apollographql/apollo-server)
-   [apollo-fastify](https://www.npmjs.com/package/apollo-fastify) is not actively maintained

## Installation

    npm i graphql-fastify --save

## Usage

Create `/graphql` endpoint like following

    const graphqlFastify = require("graphql-fastify");

    fastify.register(graphqlFastify, {
        prefix: "/graphql",
        graphQLOptions
    });

### graphQLOptions

graphQLOptions can be provided as an **_object_** or a **_function_** that returns graphql options

    graphQLOptions: {
        schema: schema,
        rootValue: resolver
        contextValue?: context
    }

If it is a function, you have access to http request and response. This allows you to do authentication and pass authentication scopes to graphql context. See the following pseudo-code

    const graphQLOptions = function (request,reply) {
        const auth = decodeBearerToken(request.headers.Authorization);
        // auth may contain userId, scope permissions

        return  {
    	     schema: schema,
    		 rootValue: resolver,
    	     contextValue: {auth}
         }
    });

This way, `context.auth` is accessible to resolver functions (see signature below), allowing you to check user's scope/permissions before proceeding. For convenience, you may set fastify and/or db connection on context s

### schema

You can build schema using graphql's buildschema method or programatically. See [graphql-js](https://github.com/graphql/graphql-js) for more info

```
var { graphql, buildSchema } = require("graphql");
var schema = buildSchema(`
    type Query {
        getUser(id:ID): User
    }
    type Mutation {
        updateUser (id:ID,name:String,age:Int): User
    }
    type User {
        id: ID,
        name: String,
        age: Int
        friends: [Friend]
    }
    type Friend{
        name: String
    }
`);
```

## Example resolver

Following example shows how to (nested) query user and user's friends

```
class User {
    constructor(u) {
        this.name = u.name;
        this.id = u.id;
        this.age = u.age;
    }
    friends(user, args, context) {
	    // retrive user's friends by user.id
        return [{ name: "Sherlock" }];
    }
}
var resolver = {
    getUser: (args, context) => {
	    //retrieve user by args.id
        return new User({
            name: "Watson",
            id: args.id,
            age: 44
        });
    },
    updateUser: (args, context) => {
        return new User({
            id: args.id,
            name: args.name,
            age: args.age
        });
    }
};
```

Following is an example query and its response using above schema and resolver

**GraphQL Query**
```
 {
  getUser(id:5) {
    id
    name
    age
    friends {
      name
    }
  }
}
```

**Result**
```
{
  "data": {
    "getUser": {
      "id": "5",
      "name": "Watson",
      "age": 44,
      "friends": [
        {
          "name": "Sherlock"
        }
      ]
    }
  }
}
```
 

### Licence

Licensed under [MIT](./LICENSE).
