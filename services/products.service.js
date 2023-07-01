const faker = require('faker');
const handleConnection = require('../store/mysql');

class ProductService {
  constructor() {
    this.connection = handleConnection();
  }

  async list() {
    return new Promise((resolve, reject) => {
      this.connection.query('SELECT * FROM products', (err, data) => {
        if (err) {
          console.error('Error ocurred when getting products', err.mesage);
          reject(err);
        } else {
          /* I have to do a map because in reality what's coming from the query are objects called "RowDataPocket", and I want to access the objects
          on the array without calling that attribute */
          const products = data.map((objetFromQuery) => ({
            ...objetFromQuery,
          }));

          /* console.log('ESTA ES LA DATA -->', products); */
          resolve(products);
        }
      });
    });
  }

  /*  */
  get({ id }) {
    return this.products.filter((product) => product.id === id);
  }
  getByName({ name }) {
    const nameInLowerCase = name.toLowerCase();

    return this.products.filter(
      (product) => product.name.toLowerCase() === nameInLowerCase
    );
  }
  create() {}
  generate() {
    const limit = 100;

    for (let index = 0; index <= limit; index++) {
      this.products.push({
        id: faker.datatype.uuid(),
        name: faker.commerce.product(),
        price: parseInt(faker.commerce.price(), 10),
        image: faker.image.imageUrl(),
      });
    }
  }
  update() {}
  delete() {}
}

module.exports = ProductService;
