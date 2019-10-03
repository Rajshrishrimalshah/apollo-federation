import { ApolloServer, gql } from "apollo-server";
import { buildFederatedSchema } from "@apollo/federation";

const typeDefs = gql`
  extend type Query {
    addresses(first: Int = 5): [Address]
  }

  type Address @key(fields: "addressId") {
    addressId: ID
    addressName: String
    city: City
  }

  extend type City @key(fields: "cityId") {
    cityId: ID @external
  }
`;

const resolvers = {
  Query: {
    addresses(_, args) {
      console.log('Inside Address Query');
      return addresses.slice(0, args.first);
    }
  },
  Address: {
    async __resolveReference(object) {
      const res = await addresses.find(
        address => address.addressId === object.addressId
      );
      return res;
    },
    city(object) {
      return { __typename: "City", cityId: object.cityId };
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
    addressId: "1000",
    addressName: "@Creaticity Mall, Near Golf Course",
    cityId: "48"
  },
  {
    addressId: "1001",
    addressName: "@Inorbit Mall, Kalyani Nagar",
    cityId: "49"
  },
  {
    addressId: "1002",
    addressName: "@Cyber Link, Swargate",
    cityId: "50"
  }
];
