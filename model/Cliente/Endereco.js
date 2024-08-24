const { DataTypes } = require("sequelize");

class EnderecoClienteModel {
    constructor(database) {
        this.db = database;
        this.EnderecoCliente = this.db.sequelize.define('db_cli_endereco', {
            clienteId: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: 'db_clientes', // Nome da tabela de clientes
                    key: 'id'
                }
            },
            tp_residencia: {
                type: DataTypes.STRING,
                allowNull: false
            },
            tp_logradouro: {
                type: DataTypes.STRING,
                allowNull: false
            },
            logradouro: {
                type: DataTypes.STRING,
                allowNull: false
            },
            numero: {
                type: DataTypes.STRING,
                allowNull: false
            },
            bairro: {
                type: DataTypes.STRING,
                allowNull: false
            },
            cep: {
                type: DataTypes.STRING,
                allowNull: false
            },
            cidade: {
                type: DataTypes.STRING,
                allowNull: false
            },
            estado: {
                type: DataTypes.STRING,
                allowNull: false
            },
            pais: {
                type: DataTypes.STRING,
                allowNull: false
            },
            observacoes: {
                type: DataTypes.STRING,
                allowNull: false
            },
            tp_endereco: {
                type: DataTypes.STRING,
                allowNull: false
            },
            nomeResi: {
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
            this.EnderecoCliente.belongsTo(clienteModel.Cliente, { foreignKey: 'clienteId', onDelete: 'CASCADE' });
        } catch (error) {
            console.error('Erro ao definir associação:', error);
        }
    }

    async sync() {
        try {
            await this.EnderecoCliente.sync();
            console.log('Tabela de contatos de endereço sincronizada com sucesso.');
        } catch (error) {
            console.error('Erro ao sincronizar tabela de endereços de cliente:', error);
        }
    }

    async create(clienteId, tp_residencia, tp_logradouro, logradouro, numero, bairro, cep, cidade, estado, pais, observacoes, tp_endereco, nomeResi) {
        try {
            const endereco = await this.EnderecoCliente.create({
                clienteId,
                tp_residencia,
                tp_logradouro,
                logradouro,
                numero,
                bairro,
                cep, 
                cidade, 
                estado, 
                pais, 
                observacoes, 
                tp_endereco, 
                nomeResi
            });
            console.log('Endereco do cliente criado:', endereco.toJSON());
            return endereco;
        } catch (error) {
            console.error('Erro ao criar endereco do cliente:', error);
            throw error;
        }
    }

    async findByClienteId(id) {
        try {
            const endereco = await this.EnderecoCliente.findAll({ where: { clienteId: id } });
            return endereco;
        } catch (error) {
            throw new Error('Erro ao buscar cliente por CPF');
        }
    }

    async findByEnderecoId(id) {
        try {
            const endereco = await this.EnderecoCliente.findOne({ where: { id: id } });
            return endereco;
        } catch (error) {
            throw new Error('Erro ao buscar cliente por CPF');
        }
    }

    async update(id, dadosAtualizados) {
        try {
            // Use a função de atualização fornecida pela sua biblioteca de ORM
            await this.EnderecoCliente.update(
                dadosAtualizados,
                { where: { id } }
            );
            console.log('Dados de endereco do cliente atualizados com sucesso');
        } catch (error) {
            console.error('Erro ao atualizar dados de endereco do cliente:', error);
            throw new Error('Erro ao atualizar dados de endereco do cliente');
        }
    }

    async deleteById(id) {
        try {
            const deletedRowCount = await this.EnderecoCliente.destroy({
                where: { id }
            });
            if (deletedRowCount === 0) {
                throw new Error('Endereço não encontrado para exclusão');
            }
            console.log('Endereço excluído com sucesso');
        } catch (error) {
            console.error('Erro ao excluir endereço:', error);
            throw error;
        }
    }
}

module.exports = EnderecoClienteModel;