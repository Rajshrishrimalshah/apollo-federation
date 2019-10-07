import { ApolloServer, gql } from "apollo-server";
import { buildFederatedSchema } from "@apollo/federation";

const typeDefs = gql`
  extend type Query {
    persons(first: Int = 5): [Person]
  }

  type Person {
    id: ID
    name: String
    company: Company
  }

  extend type Company @key(fields: "id") {
    id: ID @external
  }
`;

const resolvers = {
  Query: {
    persons(_, args) {
      return persons.slice(0, args.first);
    }
  },
  Person: {
    company(object) {
      return { __typename: "Company", id: object.companyId };
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

server.listen({ port: 4001 }).then(({ url }) => {
  console.log(`Server ready at ${url}`);
});

const persons = [
  {
    id: "1",
    name: "Alex",
    companyId: "100"
  },
  {
    id: "2",
    name: "Bob",
    companyId: "100",
  },
  {
    id: "3",
    name: "Simon",
    companyId: "101",
  },
  {
    id: "4",
    name: "Jack",
    companyId: "102",
  },
  {
    id: "5",
    name: "Mike",
    companyId: "102",
  }
];
