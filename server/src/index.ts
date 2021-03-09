import { GraphQLFileLoader } from "@graphql-tools/graphql-file-loader";
import { loadSchemaSync } from "@graphql-tools/load";
import {
  addResolveFunctionsToSchema,
  ApolloServer,
  attachDirectiveResolvers,
} from "apollo-server-express";
import express from "express";
import { join } from "path";
import directives from "./directives";
import resolvers from "./resolvers";

let schema = loadSchemaSync(join(__dirname, "schema.gql"), {
  loaders: [new GraphQLFileLoader()],
});

schema = addResolveFunctionsToSchema({
  schema,
  resolvers: resolvers as any,
});

attachDirectiveResolvers(schema, directives as any);

const app = express();
const server = new ApolloServer({
  schema,
});

server.applyMiddleware({ app });

app.listen({ port: 4000 }, () =>
  console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`)
);
