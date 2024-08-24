const { DataTypes } = require("sequelize");

class ContatoClienteModel {
    constructor(database) {
        this.db = database;
        this.ContatoCliente = this.db.sequelize.define('db_cli_contato', {
            clienteId: {
                type: DataTypes.INTEGER,
                primaryKey: true, // Definir o clienteId como chave primária
                autoIncrement: false, // Não permitir autoincremento
                allowNull: false,
                references: {
                    model: 'db_clientes', // Nome da tabela de clientes
                    key: 'id'
                }
            },
            tipo_tel: {
                type: DataTypes.STRING,
                allowNull: false
            },
            ddd: {
                type: DataTypes.STRING,
                allowNull: false
            },
            numero_tel: {
                type: DataTypes.STRING,
                allowNull: false
            },
            email: {
                type: DataTypes.STRING,
                allowNull: false
            }
        });

        //this.ContatoCliente.hasOne(database.ContatoCliente, { foreignKey: 'clienteId' });

        this.defineAssociations();
        this.sync();
    }

    async defineAssociations() {
        try {
            const ClienteModel = require('../../model/ClientesModel'); // Importe o modelo de cliente aqui
            const clienteModel = new ClienteModel(this.db);
            this.ContatoCliente.belongsTo(clienteModel.Cliente, { foreignKey: 'clienteId', onDelete: 'CASCADE' });
        } catch (error) {
            console.error('Erro ao definir associação:', error);
        }
    }

    async sync() {
        try {
            await this.ContatoCliente.sync();
            console.log('Tabela de contatos de cliente sincronizada com sucesso.');
        } catch (error) {
            console.error('Erro ao sincronizar tabela de contatos de cliente:', error);
        }
    }

    async create(clienteId, tipo_tel, ddd, numero_tel, email) {
        try {
            const contato = await this.ContatoCliente.create({
                clienteId,
                tipo_tel,
                ddd,
                numero_tel,
                email
            });
            console.log('Contato do cliente criado:', contato.toJSON());
            return contato;
        } catch (error) {
            console.error('Erro ao criar contato do cliente:', error);
            throw error;
        }
    }

    async getAll() {
        try {
            return await this.ContatoCliente.findAll();
        } catch (error) {
            console.error('Erro ao buscar todos os clientes:', error);
            throw error;
        }
    }

    async findByClienteId(id) {
        try {
            const contato = await this.ContatoCliente.findOne({ where: { clienteId: id } });
            return contato;
        } catch (error) {
            throw new Error('Erro ao buscar cliente por CPF');
        }
    }

    async update(clienteId, dadosAtualizados) {
        try {
            // Use a função de atualização fornecida pela sua biblioteca de ORM
            await this.ContatoCliente.update(
                dadosAtualizados,
                { where: { clienteId } }
            );
            console.log('Dados de contato do cliente atualizados com sucesso');
        } catch (error) {
            console.error('Erro ao atualizar dados de contato do cliente:', error);
            throw new Error('Erro ao atualizar dados de contato do cliente');
        }
    }
}

module.exports = ContatoClienteModel;