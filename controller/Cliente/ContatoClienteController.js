const express = require("express");
const ContatoClienteModel = require('../../model/Cliente/Contato');

class ContatoClienteController {
    constructor(database) {
        this.router = express.Router();
        this.contatoClienteModel = new ContatoClienteModel(database);

        //this.router.post('/cliente/save', this.createContato.bind(this));
    }

    async createContato(clienteId, tipo_tel, ddd, numero_tel, email) {
        try {
            const contato = await this.contatoClienteModel.create(clienteId, tipo_tel, ddd, numero_tel, email);
            console.log("Contato do cliente criado com sucesso:", contato);
            //res.status(201).json(contato);
        } catch (error) {
            console.error('Erro ao criar contato do cliente:', error);
            //res.status(500).json({ error: 'Erro ao criar contato do cliente' });
        }
    }

    async getAll() {
        try {
          return await this.contatoClienteModel.getAll(); // Chama o método getAll do ClienteModel para buscar todos os clientes
        } catch (error) {
          throw error;
        }
      }

    async findByClienteId(clienteId) {
        try {
            // Busca o detalhe de contato pelo ID do cliente
            const contato = await this.contatoClienteModel.findByClienteId(clienteId);
            return contato;
        } catch (error) {
            console.error('Erro ao encontrar detalhes de contato por ID do cliente:', error);
            throw new Error('Erro ao encontrar detalhes de contato por ID do cliente');
        }
    }

    async updateContato(clienteId, dadosAtualizados) {
        try {
            // Chame o método correspondente no modelo para atualizar os dados de contato
            const contatoAtualizado = await this.contatoClienteModel.update(clienteId, dadosAtualizados);
            return contatoAtualizado;
        } catch (error) {
            console.error('Erro ao atualizar dados de contato do cliente:', error);
            throw new Error('Erro ao atualizar dados de contato do cliente');
        }
    }

    getRouter() {
        return this.router;
    }
}

module.exports = ContatoClienteController;