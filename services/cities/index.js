import { ApolloServer, gql } from "apollo-server";
import { buildFederatedSchema } from "@apollo/federation";

const typeDefs = gql`
  type City @key(fields: "cityId") {
    cityId: ID
    cityName: String
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
        city => city.cityId === object.cityId
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
    addressId: "1000",
    cityId: "48",
    cityName: "Pune"
  },
  {
    addressId: "1001",
    cityId: "49",
    cityName: "Delhi"
  },
  {
    addressId: "1002",
    cityId: "50",
    cityName: "Mumbai"
  }
];
