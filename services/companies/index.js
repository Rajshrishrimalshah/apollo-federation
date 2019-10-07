import { ApolloServer, gql } from "apollo-server";
import { buildFederatedSchema } from "@apollo/federation";

const typeDefs = gql`
  extend type Query {
    companies(first: Int = 5): [Company]
  }
  type Company @key(fields: "id") {
    id: ID
    name: String
    address: Address
  }

  extend type Address @key(fields: "id") {
    id: ID @external
  }

`;

const resolvers = {
  Query: {
    companies(_, args) {
      return companies.slice(0, args.first);
    }
  },
  Company: {
    async __resolveReference(object) {
      const res = await companies.find(
        company => company.id === object.id
      );
      return res;
    },
    address(object) {
      return { __typename: "Address", id: object.addressId };
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

server.listen({ port: 4003 }).then(({ url }) => {
  console.log(`Server ready at ${url}`);
});

const companies = [
  {
    id: "100",
    name: "Google",
    addressId: "1000"
  },
  {
    id: "100",
    name: "Microsoft",
    addressId: "1000"
  },
  {
    id: "101",
    name: "Dentsu Aegis Network",
    addressId: "1001"
  },
  {
    id: "101",
    name: "Facebook",
    addressId: "1001"
  },
  {
    id: "102",
    name: "Tesla",
    addressId: "1002"
  }
];
