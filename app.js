const express = require('express');
const { ApolloServer } = require("apollo-server-express");
const schema = require('./schema/schema');
const resolvers = require('./resolvers/resolvers')
const mongoose = require('mongoose');
const bodyParser = require('body-parser')
const bcrypt = require('bcrypt');
const User = require('./models/User');

const app = express();

mongoose.connect('mongodb://localhost:27017/apollo-express');
app.use(bodyParser.json())

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


app.post('/login', async (req, res, next) => {
    const user = await User.findOne({username: req.body.username });
    if (user) {
        if(await bcrypt.compare(req.body.password, user.password)) {
            req.isAuthenticated = true;
            res.json(user)
        } else {
            res.json({message: "invalid credentials"})
        }
    }
})

app.listen(5000, () => {
    console.log('express listing on port 5000')
})