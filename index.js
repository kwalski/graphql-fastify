var { graphql } = require("graphql");

module.exports = (fastify, { prefix, graphQLOptions }, next) => {
    if (!prefix) throw new Error("Fastify GraphQL requires options!");
    else if (!prefix) {
        throw new Error(
            "Fastify GraphQL requires `prefix` to be part of passed options!"
        );
    } else {
        if (!graphQLOptions)
            throw new Error(
                "Fastify GraphQL requires `graphQLOptions` to be part of passed options!"
            );
    }
    const handler = async (request, reply) => {
        try {
            console.log("request:", request);
            const opts =
                typeof graphQLOptions === "function"
                    ? graphQLOptions(request, reply)
                    : graphQLOptions;
            opts.source = request.body.query;
            graphql(opts).then(result => reply.send(result));
        } catch (e) {
            reply.code(500).send({ error: "An error has occured" });
        }
    };

    fastify.post("/", handler);

    fastify.setNotFoundHandler((request, reply) => {
        if (request.method !== "POST") {
            reply.code(405);
            reply.header("allow", ["POST"]);
        } else {
            reply.code(404);
        }
        reply.send();
    });

    next();
};
