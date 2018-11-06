## GrapQL-Fastify
This [Fastify](https://github.com/fastify/fastify) plugin uses [graphql-js](https://github.com/graphql/graphql-js) implementation.

### Alternative implementations
 - [fastify-graphql](https://github.com/sirsavary/fastify-graphql) is based on [Apollo's graphql implementation](https://github.com/apollographql/apollo-server) 
 - [apollo-fastify](https://www.npmjs.com/package/apollo-fastify) is not actively maintained

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
graphQLOptions can be provided as an ***object*** or a ***function*** that returns graphql options

    graphQLOptions: {
        schema: schema,
        rootValue: resolver
        context?: context
    }


If it is a function, you have access to http request and response. This allows you to do authentication and pass authentication scopes to graphql context. See the following pseudo-code

	 graphQLOptions(request,reply)=>{
        const auth = decodeBearerToken(request.headers.Authorization);
	    // auth may contain userId, scope permissions
	    
	    return  {
		     schema: schema,
			 rootValue: resolver,
		     context: {auth}
	     }
     });
This way, `context.auth` is accessible to resolver functions where you can retrieve data based on user's scope/permissions.

###  schema
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
Following example shows nested resolver to query user's friends
```
class User {
    constructor(u) {
        this.name = u.name;
        this.id = u.id;
        this.age = u.age;
    }
    friends(user, args, context) {
	    // retrive user's friends
        return [{ name: "Sherlock" }];
    }
}
var resolver = {
    getUser: (args, context) => {
	    //retrieve user from database
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





### Licence
Licensed under [MIT](./LICENSE).

