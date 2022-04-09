const express = require('express');
const { ApolloServer } = require("apollo-server-express");
const schema = require('./schema/schema');
const resolvers = require('./resolvers/resolvers')
const mongoose = require('mongoose');

const app = express();

mongoose.connect('mongodb://localhost:27017/apollo-express');

const apolloServer = new ApolloServer({
    typeDefs: schema,
    resolvers
});


const apolloServerStart = async () => {
    await apolloServer.start();
    apolloServer.applyMiddleware({
        app
    });
}
apolloServerStart();

app.listen(5000, () => {
    console.log('express listing on port 5000')
})