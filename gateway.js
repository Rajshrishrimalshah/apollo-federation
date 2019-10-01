import { ApolloServer } from "apollo-server";
import { ApolloGateway } from "@apollo/gateway";

const gateway = new ApolloGateway({
  serviceList: [
    { name: "persons", url: "http://localhost:4001/graphql" },
    { name: "companies", url: "http://localhost:4003/graphql" },
    { name: "addresses", url: "http://localhost:4004/graphql" },
    { name: "cities", url: "http://localhost:4002/graphql" }
  ]
});

(async () => {
  const { schema, executor } = await gateway.load();

  const server = new ApolloServer({ schema, executor });

  server.listen().then(({ url }) => {
    console.log(`🚀 Server ready at ${url}`);
  });
})();