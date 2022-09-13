const { gql } = require("apollo-server");

const schema = gql`

    type Query {
        getFrogs: [Frog!]!
        getFrog(id: ID!):Frog
        getUsers: [User!]!
    }

    type Mutation {
        addFrog(name: String!, description: String!, imageUrl: String!, userId: ID!):addFrogResponse
        Register(username: String!, password: String!, image: String):RegisterResponse
        Login(username: String!, password: String!):LoginResponse
        incrementFrogViews(id: ID!):IncrementFrogViewsResponse!
        removeFrog(id: ID!):RemoveFrogResponse
        makeModerator(id: ID!):MakeModeratorResponse
    }

    type MakeModeratorResponse {
        user: User
    }

    type RemoveFrogResponse {
        code: Int!
        success: Boolean!
        message: String!
        frog: Frog
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
        accessToken: String
        userImage: String
    }

    type RegisterResponse {
        code: Int!
        success: Boolean!
        message: String!
        accessToken: String
        userImage: String
        role: String!
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
        role: String!
        image: String
    }
    type IncrementFrogViewsResponse {
    code: Int!
    success: Boolean!
    message: String!
    frog: Frog
  }
`;


module.exports = schema;


