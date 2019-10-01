import { ApolloServer, gql } from "apollo-server";
import { buildFederatedSchema } from "@apollo/federation";

const typeDefs = gql`
  extend type Query {
    me: Person
    users(first: Int = 5): [Person]
    newUsers: NewUser
  }

  type NewUser {
    id: ID!
    name: String
    company: NewCompany
  }

  extend type NewCompany @key(fields: "id") {
    id: ID! @external
  }

  type Person @key(fields: "id") {
    id: ID!
    name: String
  }
`;

const resolvers = {
  Query: {
    me() {
      return persons[0];
    },
    users(_, args) {
      console.log('args', args)
      return persons.slice(0, args.first);
    },
    newUsers() {
      return persons[0];
    }
  },

  Person: {
    async __resolveReference(object) {
      const res = await persons.find(person => person.id === object.id);
      return res;
    },
},
  NewUser: {
    company(object) {
      console.log('NewUser', object)
      return { __typename: "NewCompany", id : object.id }
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
    name: "Mayank",
    companyId: "100"
  },
  {
    id: "2",
    name: "Krishna",
    companyId: "100"
  },
  {
    id: "3",
    name: "Mangesh",
    companyId: "101"
  },
  {
    id: "4",
    name: "Leena",
    companyId: "101"
  },
  {
    id: "5",
    name: "Trupti",
    companyId: "102"
  }
];
