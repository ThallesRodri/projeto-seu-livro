const { DataTypes } = require("sequelize");

class CarrinhoCompraModel {
    constructor(database) {
        this.db = database;
        this.CarrinhoCompra = this.db.sequelize.define('db_carr_compra', {
            clienteId: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: 'db_clientes', // Nome da tabela de clientes
                    key: 'id'
                }
            },
            livroId: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: 'db_livros', // Nome da tabela de livros
                    key: 'id'
                }
            },
            quantidade: {
                type: DataTypes.INTEGER,
                allowNull: false,
                defaultValue: 1
            }
        });

        // Chamaremos a função para definir associações fora do construtor
        this.sync();
    }

    async sync() {
        try {
            await this.CarrinhoCompra.sync();
        } catch (error) {
            console.error('Erro ao sincronizar o modelo CarrinhoCompra:', error);
        }
    }

    static defineAssociations(database) {
        const { Cliente, Livro } = database.models;

        if (Cliente && Livro) {
            database.models.db_carr_compra.belongsTo(Cliente, { foreignKey: 'clienteId' });
            database.models.db_carr_compra.belongsTo(Livro, { foreignKey: 'livroId' });
        } else {
            console.error('Modelos Cliente ou Livro não encontrados no banco de dados.');
        }
    }

    async create(clienteId, livroId) {
        try {
            const itemExistente = await this.CarrinhoCompra.findOne({ where: { clienteId, livroId } });
            if (itemExistente) {
                itemExistente.quantidade += 1;
                await itemExistente.save();
                return itemExistente;
            } else {
                const novoItem = await this.CarrinhoCompra.create({ clienteId, livroId });
                return novoItem;
            }
        } catch (error) {
            console.error('Erro ao criar item no carrinho de compras:', error);
            throw error;
        }
    }

    async update(id, dadosAtualizados) {
        try {
            const [numOfRowsUpdated] = await this.CarrinhoCompra.update(dadosAtualizados, { where: { id } });
            return numOfRowsUpdated > 0;
        } catch (error) {
            console.error('Erro ao atualizar item no carrinho de compras:', error);
            throw error;
        }
    }

    async deleteById(id) {
        try {
            const numOfRowsDeleted = await this.CarrinhoCompra.destroy({ where: { id } });
            return numOfRowsDeleted > 0;
        } catch (error) {
            console.error('Erro ao deletar item do carrinho de compras:', error);
            throw error;
        }
    }
}

module.exports = CarrinhoCompraModel;
