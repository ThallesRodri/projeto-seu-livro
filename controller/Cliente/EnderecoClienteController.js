const express = require("express");
const EnderecoClienteModel = require('../../model/Cliente/Endereco');

class EnderecoClienteController {
    constructor(database) {
        this.router = express.Router();
        this.enderecoClienteModel = new EnderecoClienteModel(database);

        this.router.get('/minhaconta/endereco/editar/:id', this.findByEndId.bind(this));
        this.router.post('/minhaconta/endereco/update/:id', this.updateEndereco.bind(this));

        this.router.post('/minhaconta/endereco/novo/:id', this.createNovoEndereco.bind(this));

        this.router.delete('/minhaconta/endereco/delete/:id', this.deleteEndereco.bind(this));
    }

    async createEndereco(clienteId, tp_residencia, tp_logradouro, logradouro, numero, bairro, cep, cidade, estado, pais, observacoes, tp_endereco, nomeResi) {
        try {
            const endereco = await this.enderecoClienteModel.create(clienteId, tp_residencia, tp_logradouro, logradouro, numero, bairro, cep, cidade, estado, pais, observacoes, tp_endereco, nomeResi);
            console.log("Endereco do cliente criado com sucesso:", endereco);
        } catch (error) {
            console.error('Erro ao criar Endereco do cliente:', error);
        }
    }

    async createNovoEndereco(clienteId, tp_residencia, tp_logradouro, logradouro, numero, bairro, cep, cidade, estado, pais, observacoes, tp_endereco, nomeResi) {
        try {
            const endereco = await this.enderecoClienteModel.create(clienteId, tp_residencia, tp_logradouro, logradouro, numero, bairro, cep, cidade, estado, pais, observacoes, tp_endereco, nomeResi);
            console.log("Endereco do cliente criado com sucesso:", endereco);
            //res.redirect(`/minhaconta/endereco/${clienteId}`);
            return endereco;
        } catch (error) {
            console.error('Erro ao criar Endereco do cliente:', error);
        }
    }

    async deleteEndereco(req, res) {
        try {
            const enderecoId = req.params.id;
            await this.enderecoClienteModel.deleteById(enderecoId);
            res.sendStatus(200); // Retorna um status 200 para indicar sucesso
        } catch (error) {
            console.error('Erro ao excluir endereço:', error);
            res.status(500).json({ error: 'Erro ao excluir endereço' });
        }
    }

    async findByClienteId(clienteId) {
        try {
            const endereco = await this.enderecoClienteModel.findByClienteId(clienteId);
            return endereco;
        } catch (error) {
            console.error('Erro ao encontrar detalhes de endereco por ID do cliente:', error);
            throw new Error('Erro ao encontrar detalhes de endereco por ID do cliente');
        }
    }

    async findByEndId(endId) {
        try {
            const endereco = await this.enderecoClienteModel.findByEnderecoId(endId);
            return endereco;
        } catch (error) {
            console.error('Erro ao encontrar detalhes de endereco por ID do cliente:', error);
            throw new Error('Erro ao encontrar detalhes de endereco por ID do cliente');
        }
    }

    async updateEndereco(req, res) {
        
        try {
            const enderecoId = req.params.id;
            const { tp_residencia, tp_logradouro, logradouro, numero, bairro, cep, cidade, estado, pais, observacoes, tp_endereco, nomeResi } = req.body;
            const enderecoAtual = await this.enderecoClienteModel.findByEnderecoId(enderecoId);

            let dadosAtualizados = {
                tp_residencia: tp_residencia ? tp_residencia : enderecoAtual.tp_residencia, 
                tp_logradouro: tp_logradouro ? tp_logradouro : enderecoAtual.tp_logradouro, 
                logradouro: logradouro ? logradouro : enderecoAtual.logradouro,
                numero: numero ? numero : enderecoAtual.numero,
                bairro: bairro ? bairro : enderecoAtual.bairro,
                cep: cep ? cep : enderecoAtual.cep,
                cidade: cidade ? cidade : enderecoAtual.cidade,
                estado: estado ? estado : enderecoAtual.estado,
                pais: pais ? pais : enderecoAtual.pais,
                observacoes: observacoes ? observacoes : enderecoAtual.observacoes,
                tp_endereco: tp_endereco ? tp_endereco : enderecoAtual.tp_endereco,
                nomeResi: nomeResi ? nomeResi : enderecoAtual.nomeResi
            };
            const enderecoAtualizado = await this.enderecoClienteModel.update(enderecoId, dadosAtualizados);
            res.render('cliente/editarEndereco', { endereco: enderecoAtualizado});
        } catch (error) {
            console.error('Erro ao atualizar dados de endereco do cliente:', error);
            throw new Error('Erro ao atualizar dados de endereco do cliente');
        }
    }

    getRouter() {
        return this.router;
    }
}

module.exports = EnderecoClienteController;