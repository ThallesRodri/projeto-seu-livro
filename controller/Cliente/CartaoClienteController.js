const express = require("express");
const CartaoClienteModel = require('../../model/Cliente/Cartoes');

class CartaoClienteController {
    constructor(database) {
        this.router = express.Router();
        this.cartaoClienteModel = new CartaoClienteModel(database);

        this.router.get('/minhaconta/cartao/editar/:id', this.findByCartaoId.bind(this));
        this.router.post('/minhaconta/cartao/update/:id', this.updateCartao.bind(this));

        this.router.post('/minhaconta/cartao/novo/:id', this.createNovoCartao.bind(this));

        this.router.delete('/minhaconta/cartao/delete/:id', this.deleteCartao.bind(this));
    }

    async createCartao(clienteId, nomeCartao, numCartao, validadeCartao, cvc) {
        try {
            const cartao = await this.cartaoClienteModel.create(clienteId, nomeCartao, numCartao, validadeCartao, cvc);
            console.log("Cartao do cliente criado com sucesso:", cartao);
        } catch (error) {
            console.error('Erro ao criar Cartao do cliente:', error);
        }
    }

    async createNovoCartao(clienteId, nomeCartao, numCartao, validadeCartao, cvc) {
        try {
            const cartao = await this.cartaoClienteModel.create(clienteId, nomeCartao, numCartao, validadeCartao, cvc);
            console.log("Cartao do cliente criado com sucesso:", cartao);
            return cartao;
        } catch (error) {
            console.error('Erro ao criar Cartao do cliente:', error);
        }
    }

    async deleteCartao(req, res) {
        try {
            const cartaoId = req.params.id;
            await this.cartaoClienteModel.deleteById(cartaoId);
            res.sendStatus(200); // Retorna um status 200 para indicar sucesso
        } catch (error) {
            console.error('Erro ao excluir cartao:', error);
            res.status(500).json({ error: 'Erro ao excluir cartao' });
        }
    }

    async findByClienteId(clienteId) {
        try {
            const cartao = await this.cartaoClienteModel.findByClienteId(clienteId);
            return cartao;
        } catch (error) {
            console.error('Erro ao encontrar detalhes de cartao por ID do cliente:', error);
            throw new Error('Erro ao encontrar detalhes de cartao por ID do cliente');
        }
    }

    async findByCartaoId(cartoId) {
        try {
            const cartao = await this.cartaoClienteModel.findByCartaoId(cartoId);
            return cartao;
        } catch (error) {
            console.error('Erro ao encontrar detalhes de cartao por ID do cliente:', error);
            throw new Error('Erro ao encontrar detalhes de cartao por ID do cliente');
        }
    }

    async updateCartao(req, res) {
        
        try {
            const cartaoId = req.params.id;
            const { nomeCartao, numCartao, validadeCartao, cvc } = req.body;
            const cartaoAtual = await this.cartaoClienteModel.findByCartaoId(cartaoId);

            let dadosAtualizados = {
                nomeCartao: nomeCartao ? nomeCartao : cartaoAtual.nomeCartao, 
                numCartao: numCartao ? numCartao : cartaoAtual.numCartao, 
                validadeCartao: validadeCartao ? validadeCartao : cartaoAtual.validadeCartao,
                cvc: cvc ? cvc : cartaoAtual.cvc
            };
            const cartaoAtualizado = await this.cartaoClienteModel.update(cartaoId, dadosAtualizados);
            res.render('cliente/editarCartao', { cartao: cartaoAtualizado});
        } catch (error) {
            console.error('Erro ao atualizar dados de cartao do cliente:', error);
            throw new Error('Erro ao atualizar dados de cartao do cliente');
        }
    }

    getRouter() {
        return this.router;
    }
}

module.exports = CartaoClienteController;