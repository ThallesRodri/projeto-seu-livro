// controllers/CartController.js
const express = require("express");
const CarrinhoCompraModel = require('../../model/CarrinhoCompra/CarrinhoCompras');
const LivroModel = require('../../model/Livro/Livro');

class CartController {
    constructor(database) {
        this.carrinhoCompraModel = new CarrinhoCompraModel(database);

        const express = require('express');
        this.router = express.Router();
        //const database = require('../config/database'); // ajuste o caminho conforme necessário
        //const CartController = require('../controller/CartController');

        //const cartController = new CartController(database);

        this.router.post('/add-to-cart/:livroId', (req, res) => this.addToCart(req, res));
        this.router.get('/carrinho', (req, res) => this.getCart(req, res));
    }

    async addToCart(req, res) {
        const livroId = req.params.livroId;
        const clienteId = req.user.id; 

        try {
            await this.carrinhoCompraModel.create(clienteId, livroId);
            res.redirect('/cart');
        } catch (error) {
            console.error('Erro ao adicionar ao carrinho:', error);
            res.status(500).send('Erro ao adicionar ao carrinho');
        }
    }

    // async getCart(req, res) {
    //     const clienteId = req.user.id;

    //     try {
    //         const items = await this.carrinhoCompraModel.CarrinhoCompra.findAll({
    //             where: { clienteId },
    //             include: [LivroModel]
    //         });
    //         res.render('cart', { items });
    //     } catch (error) {
    //         console.error('Erro ao obter o carrinho:', error);
    //         res.status(500).send('Erro ao obter o carrinho');
    //     }
    // }
    async getCart(req, res) {
        try {
            const clienteId = req.query.clienteId; 
            const itensCarrinho = await this.db.models.db_carr_compra.findAll({
                where: { clienteId },
                include: [this.db.models.Livro]
            });

            res.render('cliente/carrinho', { itensCarrinho });
        } catch (error) {
            console.error('Erro ao obter itens do carrinho:', error);
            res.status(500).json({ error: 'Erro ao obter itens do carrinho' });
        }
    }

    getRouter() {
        return this.router;
    }
}

module.exports = CartController;
