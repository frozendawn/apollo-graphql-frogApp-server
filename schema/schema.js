const { gql } = require("apollo-server");

const schema = gql`

    type Query {
        getFrogs: [Frog!]!
        getFrog(id: ID!):Frog
    }

    type Mutation {
        addFrog(name: String!, description: String!, imageUrl: String!, userId: ID!):addFrogResponse
        Register(username: String!, password: String!, image: String):RegisterResponse
        Login(username: String!, password: String!):LoginResponse
        incrementFrogViews(id: ID!):IncrementFrogViewsResponse!
    }

    type addFrogResponse {
        code: Int!
        success: Boolean!
        message: String!
        frog: Frog
    }

    type LoginResponse {
        code: Int!
        success: Boolean!
        message: String!
        id: ID
        accessToken: String
        username: String
        userImage: String
    }

    type RegisterResponse {
        code: Int!
        success: Boolean!
        message: String!
        id: ID!
        accessToken: String!
        username: String!
        userImage: String
    }

    type Frog {
        id: ID!
        name: String!
        description: String!
        imageUrl: String!
        numberOfViews: Int!
        userId: User!
    }

    type User {
        id: ID!
        username: String!
    }
    type IncrementFrogViewsResponse {
    code: Int!
    success: Boolean!
    message: String!
    frog: Frog
  }
`;


module.exports = schema;


