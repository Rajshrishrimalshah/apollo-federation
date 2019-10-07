import { ApolloServer, gql } from "apollo-server";
import { buildFederatedSchema } from "@apollo/federation";

const typeDefs = gql`
  extend type Query {
    addresses(first: Int = 5): [Address]
  }

  type Address @key(fields: "id") {
    id: ID
    name: String
    city: City
  }

  extend type City @key(fields: "id") {
    id: ID @external
  }
`;

const resolvers = {
  Query: {
    addresses(_, args) {
      return addresses.slice(0, args.first);
    }
  },
  Address: {
    async __resolveReference(object) {
      const res = await addresses.find(
        address => address.id === object.id
      );
      return res;
    },
    city(object) {
      return { __typename: "City", id: object.cityId };
    }
  }
};

const server = new ApolloServer({
  schema: buildFederatedSchema([
    {
      typeDefs,
      resolvers
    }
  ])
});

server.listen({ port: 4004 }).then(({ url }) => {
  console.log(`Server ready at ${url}`);
});

const addresses = [
  {
    id: "1000",
    name: "Edinburgh",
    cityId: "48"
  },
  {
    id: "1001",
    name: "Brighton",
    cityId: "49"
  },
  {
    id: "1002",
    name: "Roath",
    cityId: "50"
  }
];
