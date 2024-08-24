const { DataTypes } = require("sequelize");

class CartaoClienteModel {
    constructor(database) {
        this.db = database;
        this.CartaoCliente = this.db.sequelize.define('db_cli_cartao', {
            clienteId: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: 'db_clientes', // Nome da tabela de clientes
                    key: 'id'
                }
            },
            nomeCartao: {
                type: DataTypes.STRING,
                allowNull: false
            },
            numCartao: {
                type: DataTypes.STRING,
                allowNull: false
            },
            validadeCartao: {
                type: DataTypes.DATEONLY,
                allowNull: false
            },
            cvc: {
                type: DataTypes.STRING,
                allowNull: false
            }
        });

        this.defineAssociations();
        this.sync();
    }

    async defineAssociations() {
        try {
            const ClienteModel = require('../../model/ClientesModel'); // Importe o modelo de cliente aqui
            const clienteModel = new ClienteModel(this.db);
            this.CartaoCliente.belongsTo(clienteModel.Cliente, { foreignKey: 'clienteId', onDelete: 'CASCADE' });
        } catch (error) {
            console.error('Erro ao definir associação:', error);
        }
    }

    async sync() {
        try {
            await this.CartaoCliente.sync();
            console.log('Tabela de cartoes do cliente sincronizada com sucesso.');
        } catch (error) {
            console.error('Erro ao sincronizar tabela de cartoes de cliente:', error);
        }
    }

    async create(clienteId, nomeCartao, numCartao, validadeCartao, cvc) {
        try {
            const cartao = await this.CartaoCliente.create({
                clienteId,
                nomeCartao,
                numCartao,
                validadeCartao,
                cvc
            });
            console.log('Cartao do cliente criado:', cartao.toJSON());
            return cartao;
        } catch (error) {
            console.error('Erro ao criar cartao do cliente:', error);
            throw error;
        }
    }

    async findByClienteId(id) {
        try {
            const cartao = await this.CartaoCliente.findAll({ where: { clienteId: id } });
            return cartao;
        } catch (error) {
            throw new Error('Erro ao buscar cliente por ID');
        }
    }

    async findByCartaoId(id) {
        try {
            const cartao = await this.CartaoCliente.findOne({ where: { id: id } });
            return cartao;
        } catch (error) {
            throw new Error('Erro ao buscar cartao por ID');
        }
    }

    async update(id, dadosAtualizados) {
        try {
            // Use a função de atualização fornecida pela sua biblioteca de ORM
            await this.CartaoCliente.update(
                dadosAtualizados,
                { where: { id } }
            );
            console.log('Dados de cartao do cliente atualizados com sucesso');
        } catch (error) {
            console.error('Erro ao atualizar dados de cartao do cliente:', error);
            throw new Error('Erro ao atualizar dados de cartao do cliente');
        }
    }

    async deleteById(id) {
        try {
            const deletedRowCount = await this.CartaoCliente.destroy({
                where: { id }
            });
            if (deletedRowCount === 0) {
                throw new Error('Cartao não encontrado para exclusão');
            }
            console.log('Cartao excluído com sucesso');
        } catch (error) {
            console.error('Erro ao excluir cartao:', error);
            throw error;
        }
    }
}

module.exports = CartaoClienteModel;