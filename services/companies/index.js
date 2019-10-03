import { ApolloServer, gql } from "apollo-server";
import { buildFederatedSchema } from "@apollo/federation";

const typeDefs = gql`
  extend type Query {
    companies(first: Int = 5): [Company]
  }
  type Company @key(fields: "companyId") {
    companyId: ID
    companyName: String
    address: Address
  }

  extend type Address @key(fields: "addressId") {
    addressId: ID @external
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
        company => company.companyId === object.companyId
      );
      return res;
    },
    address(object) {
      return { __typename: "Address", addressId: object.addressId };
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
    companyId: "100",
    companyName: "Successive Technologies",
    addressId: "1000"
  },
  {
    companyId: "100",
    companyName: "Successive Technologies",
    addressId: "1000"
  },
  {
    companyId: "101",
    companyName: "Dentsu Aegis Network",
    addressId: "1001"
  },
  {
    companyId: "101",
    companyName: "Dentsu Aegis Network",
    addressId: "1001"
  },
  {
    companyId: "102",
    companyName: "Parker Consultancy",
    addressId: "1002"
  }
];
