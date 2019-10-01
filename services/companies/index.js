import { ApolloServer, gql } from "apollo-server";
import { buildFederatedSchema } from "@apollo/federation";

const typeDefs = gql`

  type Company @key(fields: "companyId") {
    companyId: ID!
    name: String
    person: Person
  }

  extend type Person @key(fields : "id") {
    id: ID! @external
    company: Company
  }

  type NewCompany @key(fields: "id") {
    id: ID!
    companyId: ID!
    name: String
    person: Person
  }
`;

const resolvers = {
  Person: {
    company(object) {
        return companies.find(company => company.id === object.id);
      
    }
  },
  Company: {
    async __resolveReference(object) {
      console.log('object', object)
      const res = await persons.find(person => person.id === object.id);
      return res;
    },
},
NewCompany: {
  async __resolveReference(object) {
    console.log('NewCompany', object)
    const res = await companies.find(company => company.id === company.id);
    return res;
  },
}
}

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
    id: "1",
    companyId: "100",
    name: "Successive Technologies",
  },
  {
    id: "2",
    companyId: "100",
    name: "Successive Technologies",
  },
  {
    id: "3",
    companyId: "101",
    name: "Dentsu Aegis Network",
  },
  {
    id: "4",
    companyId: "101",
    name: "Dentsu Aegis Network",
  },
  {
    id: "5",
    companyId: "102",
    name: "Parker Consultancy",
  }
];
