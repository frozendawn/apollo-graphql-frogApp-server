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

const app = express();

app.use('*', cors())
mongoose.connect('mongodb://localhost:27017/apollo-express');
app.use(bodyParser.json())

app.use(express.static(path.join(__dirname, 'images')));

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
  res.json(frog)
})

app.listen(5000, () => {
    console.log('express listing on port 5000')
})