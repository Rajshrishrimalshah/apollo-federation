import { ApolloServer, gql } from "apollo-server";
import { buildFederatedSchema } from "@apollo/federation";

const typeDefs = gql`
  extend type Address @key(fields: "addressId") {
    addressId: ID! @external
    city: City
  }

  type City {
    cityId: ID!
    name: String
  }
`;

const resolvers = {
  Address: {
    city(city) {
      return cities.find(cid => cid.addressId === city.addressId);
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
    name: "Pune",
    cityId: "48"
  },
  {
    addressId: "1001",
    name: "Pune",
    cityId: "49"
  },
  {
    addressId: "1002",
    name: "Pune",
    cityId: "50"
  }
];
