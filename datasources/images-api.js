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

  //trqbva da dobavq endpoint + schema i resolver za deleteById samo v clienta sam dobavil da se pokazva kop4eto za triene ako e s rolq admin
  async removeFrogById (id) {
    const response = await this.delete(`/frog/${id}`);
    return response;
  }
}

module.exports = ImagesAPI;