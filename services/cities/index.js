import { ApolloServer, gql } from "apollo-server";
import { buildFederatedSchema } from "@apollo/federation";

const typeDefs = gql`
  type City @key(fields: "cityId") {
    cityId: ID
    cityName: String
  }
`;

const resolvers = {
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
    cityName: "Pune"
  },
  {
    addressId: "1002",
    cityId: "50",
    cityName: "Pune"
  }
];
