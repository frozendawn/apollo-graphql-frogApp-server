const { gql } = require("apollo-server");

const schema = gql`
    type Query {
        getFrogs: [Frog!]!
        getFrog(id: ID!):Frog
    }

    type Mutation {
        addFrog(name: String!, description: String!, imageUrl: String!):addFrogResponse
    }

    type addFrogResponse {
        code: Int!
        success: Boolean!
        message: String!
        frog: Frog
    }

    type Frog {
        id: ID!
        name: String!
        description: String!
        imageUrl: String!
    }
`;


module.exports = schema;


