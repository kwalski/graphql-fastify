var { graphql } = require("graphql");

module.exports = (fastify, options, next) => {
    const help = 'Required options: { prefix:"/graphql",graphQLOptions }';
    if (!options) throw new Error("Plugin requires options. " + help);
    else if (!options.prefix) {
        throw new Error("No prefix provided. " + help);
    } else {
        if (!options.graphQLOptions)
            throw new Error("No graphQLOptions provided. " + help);
    }
    
    const handler = async (request, reply) => {
        try {
            const opts =
                typeof options.graphQLOptions === "function"
                    ? options.graphQLOptions(request, reply)
                    : options.graphQLOptions;
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
