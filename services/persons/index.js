import { ApolloServer, gql } from "apollo-server";
import { buildFederatedSchema } from "@apollo/federation";

const typeDefs = gql`
  extend type Query {
    person: Person
    persons(first: Int = 5): [Person]
  }

  type Person {
    personId: ID
    personName: String
    company: Company
  }

  extend type Company @key(fields: "companyId") {
    companyId: ID @external
  }
`;

const resolvers = {
  Query: {
    person() {
      return persons[0];
    },
    persons(_, args) {
      return persons.slice(0, args.first);
    }
  },
  Person: {
    company(object) {
      return { __typename: "Company", companyId: object.companyId };
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
    personId: "1",
    personName: "Mayank",
    companyId: "100"
  },
  {
    personId: "2",
    personName: "Krishna",
    companyId: "100",
  },
  {
    personId: "3",
    personName: "Mangesh",
    companyId: "101",
  },
  {
    personId: "4",
    personName: "Leena",
    companyId: "102",
  },
  {
    personId: "5",
    personName: "Trupti",
    companyId: "102",
  }
];
