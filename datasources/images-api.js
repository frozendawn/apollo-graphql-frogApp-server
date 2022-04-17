const { RESTDataSource } = require('apollo-datasource-rest');

class ImagesAPI extends RESTDataSource {
  constructor() {
    super();
    this.baseURL = 'http://localhost:5000';
  }


}

module.exports = ImagesAPI;