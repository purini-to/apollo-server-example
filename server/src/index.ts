import { GraphQLFileLoader } from "@graphql-tools/graphql-file-loader";
import { loadSchemaSync } from "@graphql-tools/load";
import {
  addResolveFunctionsToSchema,
  ApolloServer,
} from "apollo-server-express";
import express from "express";
import { join } from "path";
import resolvers from "./resolvers";

const schema = loadSchemaSync(join(__dirname, "schema.gql"), {
  loaders: [new GraphQLFileLoader()],
});

const schemaWithResolvers = addResolveFunctionsToSchema({
  schema,
  resolvers: resolvers as any,
});

const app = express();
const server = new ApolloServer({
  schema: schemaWithResolvers,
});

server.applyMiddleware({ app });

app.listen({ port: 4000 }, () =>
  console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`)
);
