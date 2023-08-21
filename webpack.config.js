const Dotenv = require('dotenv-webpack');

module.exports = {
  // ... suas outras configurações do webpack aqui ...

  plugins: [
    new Dotenv()
  ]
};
