const Fastify = require("fastify");
const fastify = Fastify();
const graphqlFastify = require("./index");

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

class User {
    constructor(u) {
        this.name = u.name;
        this.id = u.id;
        this.age = u.age;
    }
    friends(user, args, context) {
        return [{ name: "Sherlock"}];
    }
}
var resolver = {
    getUser: (args, context) => {
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

fastify.register(graphqlFastify, {
    prefix: "/graphql",
    graphQLOptions: {
        schema: schema,
        rootValue: resolver
    }
});
// Run the server!
const start = async () => {
    try {
        await fastify.listen(3000);
        console.info(`server listening on ${fastify.server.address().port}`);
    } catch (err) {
        fastify.log.error(err);
        process.exit(1);
    }
};
start();
