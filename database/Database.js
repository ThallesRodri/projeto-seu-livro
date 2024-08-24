const Sequelize = require("sequelize");

class Database{
    constructor(){
        this.sequelize = new Sequelize('seulivro', 'root', '357943', {
            host: 'localhost',
            dialect: 'mysql',
            timezone: '-03:00'
        });
        this.connect();
    }

    async connect() {
        try {
          await this.sequelize.authenticate();
          console.log('Conexão com o banco de dados estabelecida com sucesso.');
        } catch (error) {
          console.error('Erro ao conectar ao banco de dados:', error);
        }
      }
    
}

module.exports = Database;