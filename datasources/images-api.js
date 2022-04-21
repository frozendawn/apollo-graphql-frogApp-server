const { RESTDataSource } = require('apollo-datasource-rest');

class ImagesAPI extends RESTDataSource {
  constructor() {
    super();
    this.baseURL = 'http://localhost:5000';
  }
  
  async incrementFrogViews(id) {
    const response = await this.patch(`incrementFrogViews/${id}`);
    return response
  }
}

module.exports = ImagesAPI;