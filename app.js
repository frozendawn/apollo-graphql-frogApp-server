const express = require('express');
const { ApolloServer } = require("apollo-server-express");
const schema = require('./schema/schema');
const resolvers = require('./resolvers/resolvers')
const mongoose = require('mongoose');
const bodyParser = require('body-parser')
const multer = require('multer');
const ImagesAPI = require('./datasources/images-api');
const cors = require('cors');
const path = require('path');
const Frog = require('./models/Frog');
const jwt = require('jsonwebtoken');
const redis = require('redis');

const app = express();

app.use('*', cors())
mongoose.connect('mongodb://localhost:27017/apollo-express');
app.use(bodyParser.json())

app.use(express.static(path.join(__dirname, 'images')));

const REDIS_DEFAULT_EXPIRATION = process.env.REDIS_DEFAULT_EXPIRATION || 240;

// const redisClient = redis.createClient();
// redisClient.connect();

const fileStorage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'images')
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
      cb(null, file.fieldname + '-' + uniqueSuffix + '.' +file.mimetype.split('/')[1])
    }
  })

const fileFilter = (req, file, cb) => {
    if (
      file.mimetype === 'image/png' ||
      file.mimetype === 'image/jpg' ||
      file.mimetype === 'image/jpeg'
    ) {
      cb(null, true);
    } else {
      cb(null, false);
    }
  };

app.use(
multer({ storage: fileStorage, fileFilter: fileFilter }).single('image')
);

const apolloServer = new ApolloServer({
    typeDefs: schema,
    resolvers,
    dataSources: () => {
        return {
          imagesAPI: new ImagesAPI()
        };
      },
    context: async ({req}) => {
      const token = req.headers.authorization;
      if (token) {
        try {
          const decoded = jwt.verify(token, 'super-secret');
          if (decoded) {
            return {
              role: decoded.role,
              id: decoded.id
            }
          }
        } catch(err) {
          console.log('err', err)
        }
      }
    }
});

const apolloServerStart = async () => {
    await apolloServer.start();
    apolloServer.applyMiddleware({
        app
    });
}
apolloServerStart();

app.post('/upload-image', (req, res, next) => {
  res.json({imageUrl: `http://localhost:5000/${req.file.filename}`})
})

app.patch('/incrementFrogViews/:id', async (req, res) => {
  const frog = await Frog.findByIdAndUpdate(req.params.id, { $inc: { numberOfViews : 1 }}, {new: true});
  res.json(frog);
/*   const cacheResult = await redisClient.get(`/incrementFrogViews/${req.params.id}`)
  if (cacheResult) {
    res.json(JSON.parse(cacheResult))
  } else {
    const frog = await Frog.findByIdAndUpdate(req.params.id, { $inc: { numberOfViews : 1 }}, {new: true});
    await redisClient.SETEX(`/incrementFrogViews/${req.params.id}`, REDIS_DEFAULT_EXPIRATION, JSON.stringify(frog));
    res.json(frog);
  } */
})

app.get(`/getUserRoleById/:id`, (req, res, next) => {
  
})

app.delete('/frog/:id', async (req, res) => {
  const removedFrog = await Frog.findOneAndRemove({id: req.params.id});
  if (removedFrog) {
    res.json({
      id: removedFrog._id,
      name: removedFrog.name,
      description: removedFrog.description,
      imageUrl: removedFrog.imageUrl,
      numberOfViews: removedFrog.numberOfViews,
      userId: removedFrog.userId
    })
  }
  else {
    res.json({
      message: "couldn't remove frog"
    })
  }
})

app.listen(5000, () => {
    console.log('express listing on port 5000')
})