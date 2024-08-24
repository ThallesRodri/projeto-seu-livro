const { DataTypes } = require("sequelize");

class ClientesModel {
    constructor(database) {
        this.db = database;
        this.Cliente = this.db.sequelize.define('db_clientes', {
            cpf: {
                type: DataTypes.STRING,
                allowNull: false,
                unique: true // CPF deve ser único
            },
            nome: {
                type: DataTypes.STRING,
                allowNull: false
            },
            data_nascimento: {
                type: DataTypes.DATEONLY,
                allowNull: false
            },
            sexo: {
                type: DataTypes.STRING,
                allowNull: false
            }
        });
        this.sync();
    }

    async sync() {
        try {
            await this.Cliente.sync();
            console.log('Tabela de clientes sincronizada com sucesso.');
        } catch (error) {
            console.error('Erro ao sincronizar tabela de clientes:', error);
        }
    }

    async create(cpf, nome, data_nascimento, sexo) {
        try {
            const cliente = await this.Cliente.create({
                cpf,
                nome,
                data_nascimento,
                sexo
            });
            console.log('Cliente criado:', cliente.toJSON());
            return cliente;
        } catch (error) {
            console.error('Erro ao criar cliente:', error);
            throw error;
        }
    }

    async getAll() {
        try {
            return await this.Cliente.findAll({ order: [['id', 'DESC']] });
        } catch (error) {
            console.error('Erro ao buscar todos os clientes:', error);
            throw error;
        }
    }

    async findByCPF(cpf) {
        try {
            const cliente = await this.Cliente.findOne({ where: { cpf: cpf } });
            return cliente;
        } catch (error) {
            throw new Error('Erro ao buscar cliente por CPF');
        }
    }

    async findById(id) {
        try {
            const cliente = await this.Cliente.findOne({ where: { id: id } });
            return cliente;
        } catch (error) {
            throw new Error('Erro ao buscar cliente por CPF');
        }
    }
}

module.exports = ClientesModel;
