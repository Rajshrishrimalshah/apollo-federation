import { ApolloServer, gql } from "apollo-server";
import { buildFederatedSchema } from "@apollo/federation";

const typeDefs = gql`
  type City @key(fields: "id") {
    id: ID
    name: String
  }

  extend type Query {
    cities(first: Int = 5): [City]
  }
`;

const resolvers = {
  Query: {
    cities(_, args) {
      return cities.slice(0, args.first)
    }
  },
  City: {
    async __resolveReference(object) {
      const res = await cities.find(
        city => city.id === object.id
      );
      return res;
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

server.listen({ port: 4002 }).then(({ url }) => {
  console.log(`Server ready at ${url}`);
});

const cities = [
  {
    id: "48",
    name: "Scotland",
    addressId: "1000"
  },
  {
    id: "49",
    name: "England",
    addressId: "1001"
  },
  {
    id: "50",
    name: "Cardiff",
    addressId: "1002"
  }
];
