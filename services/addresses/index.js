import { ApolloServer, gql } from "apollo-server";
import { buildFederatedSchema } from "@apollo/federation";

const typeDefs = gql`
  extend type Company @key(fields: "companyId") {
    companyId: ID! @external
    address: Address
  }

  type Address @key(fields : "addressId"){
    addressId: ID!
    name: String
  }

`;

const resolvers = {
  Company: {
    address(object) {
      return addresses.find(add => add.companyId === object.companyId);
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
    companyId: '100',
    addressId: '1000',
    name: '@Creaticity Mall, Near Golf Course'
  },
  {
    companyId: '101',
    addressId: '1001',
    name: '@Inorbit Mall, Kalyani Nagar'
  },
  {
    companyId: '102',
    addressId: '1002',
    name: '@Cyber Link, Swargate'
  }

];
