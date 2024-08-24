const express = require("express");
const ClientesModel = require("../../model/Cliente/Clientes");
const ContatoClienteController = require("./ContatoClienteController");
const EnderecoClienteController = require("./EnderecoClienteController");
const CartaoClienteController = require("./CartaoClienteController");

class ClienteController {
    constructor(database) {
        this.router = express.Router();
        this.clienteModel = new ClientesModel(database);
        this.id = this.clienteModel.id

        this.contatoClienteController = new ContatoClienteController(database)
        this.enderecoClienteController = new EnderecoClienteController(database)
        this.cartaoClienteController = new CartaoClienteController(database)

        this.router.post('/cliente/save', this.create.bind(this));
        this.router.get('/adm/cliente/list', this.list.bind(this));
        this.router.get('/adm/cliente/lista/:cpf', this.findByCPF.bind(this));
        this.router.get('/adm/cliente/detalhes/:id', (req, res) => this.findById(req, res, ''));
        this.router.get('/minhaconta/dadospessoais/:id', (req, res) => this.findById(req, res, 'minha conta'));
        this.router.get('/minhaconta/contato/:id', (req, res) => this.findById(req, res, 'cliconta'));
        this.router.get('/minhaconta/endereco/:id', (req, res) => this.findById(req, res, 'cliend'));
        this.router.get('/minhaconta/cartoes/:id', (req, res) => this.findById(req, res, 'clicartao'));
        this.router.get('/minhaconta/pedidos/:id', (req, res) => this.findById(req, res, 'cliped'));
        this.router.get('/minhaconta/cupons/:id', (req, res) => this.findById(req, res, 'clicup'));
        this.router.get('/minhaconta/pedidos/produto/:id', (req, res) => this.findById(req, res, 'cliprod'));
        this.router.get('/minhaconta/pedidos/produto/troca/:id', (req, res) => this.findById(req, res, 'clitroca'));
        this.router.get('/carrinho/:id', (req, res) => this.findById(req, res, 'carrinho'));

        // UPDATE CONTATO
        this.router.post('/minhaconta/contato/update/:id', this.updateContato.bind(this));

        // UPDATE ENDERECO
        //this.router.get('/minhaconta/endereco/editar/:id', (req, res) => this.findById(req, res, 'clieditend'));
    }

    async create(req, res) {
        const { cpf, nome, data_nascimento, sexo, tipo_tel, ddd, numero_tel, email,  tp_residencia, tp_logradouro, logradouro, numero, bairro, cep, cidade, estado, pais, observacoes, tp_endereco, nomeResi } = req.body;
        
        if (!/^\d{11}$/.test(cpf)) {
            const errorMessage = 'CPF inválido.';
            return res.render('cliente/cadastro', { errorMessage });
        }

        // Verificação da idade mínima (18 anos)
        const today = new Date();
        const birthDate = new Date(data_nascimento);
        const age = today.getFullYear() - birthDate.getFullYear();

        // Verifica se o cliente tem menos de 18 anos
        if (age < 18) {
            const errorMessage = 'É necessário ter mais de 18 anos para se cadastrar.';
            return res.render('cliente/cadastro', { errorMessage });
        }

        if (!/^\d{2}$/.test(ddd)) {
            const errorMessage = 'DDD inválido.';
            return res.render('cliente/cadastro', { errorMessage });
        }

        if (!/^\d{9}$/.test(numero_tel)) {
            const errorMessage = 'Telefone inválido.';
            return res.render('cliente/cadastro', { errorMessage });
        }

        if (!/^\d{8}$/.test(cep)) {
            const errorMessage = 'CEP inválido.';
            return res.render('cliente/cadastro', { errorMessage });
        }
        
        try {
            const clienteExistente = await this.clienteModel.findByCPF(cpf);
            if (clienteExistente) {
                const errorMessage = 'CPF já cadastrado';
                return res.render('cliente/cadastro', { errorMessage });
            }

            const cliente = await this.clienteModel.create(cpf, nome, data_nascimento, sexo);
            const contato = await this.contatoClienteController.createContato(cliente.id, tipo_tel, ddd, numero_tel, email);
            const endereco = await this.enderecoClienteController.createEndereco(cliente.id, tp_residencia, tp_logradouro, logradouro, numero, bairro, cep, cidade, estado, pais, observacoes, tp_endereco, nomeResi);
            res.redirect("/cadastroConcluido");
        } catch (error) {
            console.error('Erro ao criar cliente:', error);
            res.status(500).json({ error: 'Erro ao criar cliente' });
        }
    }

    async list(req, res) {
        try {
            const clientes = await this.clienteModel.getAll();
            res.render('adm/listaClientes', { clientes });
        } catch (error) {
            console.error('Erro ao listar clientes:', error);
            res.status(500).json({ error: 'Erro ao listar clientes' });
        }
    }

    async getAll() {
        try {
            const clientes = await this.clienteModel.getAll();
            // Para cada cliente, busca os detalhes de contato pelo ID do cliente
            const clientesComContato = await Promise.all(clientes.map(async (cliente) => {
                const contato = await this.contatoClienteController.findByClienteId(cliente.id);
                return {
                    id: cliente.id,
                    nome: cliente.nome,
                    cpf: cliente.cpf,
                    email: contato ? contato.email : '' // Se houver contato, pega o email, senão retorna vazio
                };
            }));
            return clientesComContato;
        } catch (error) {
            throw error;
        }
    }
    

    async findByCPF(req, res) {
        const cpf = req.params.cpf;
        try {
            const cliente = await this.clienteModel.findByCPF(cpf);
            res.status(200).json(cliente);
        } catch (error) {
            console.error('Erro ao encontrar cliente por CPF:', error);
            res.status(500).json({ error: 'Erro ao encontrar cliente por CPF' });
        }
    }

    async findById(req, res, rota) {
        const id = req.params.id;
        try {
            const cliente = await this.clienteModel.findById(id);

            // Se o cliente não for encontrado, retornar um erro ou uma resposta adequada
            if (!cliente) {
                console.error('Cliente não encontrado');
                return res.status(404).json({ error: 'Cliente não encontrado' });
            }

            const contato = await this.contatoClienteController.findByClienteId(cliente.id);
            const endereco = await this.enderecoClienteController.findByClienteId(cliente.id);
            const cartao = await this.cartaoClienteController.findByClienteId(cliente.id);

            // Construir o objeto cliente com informações adicionais
            const clienteComDetalhes = {
                id: cliente.id,
                nome: cliente.nome,
                cpf: cliente.cpf,
                data_nascimento: cliente.data_nascimento,
                sexo: cliente.sexo,
                // Adicionar informações de contato se disponíveis
                email: contato ? contato.email : '',// Se houver contato, pega o email, senão retorna vazio
                ddd: contato ? contato.ddd : '',
                tipo_tel: contato ? contato.tipo_tel : '',
                numero_tel: contato ? contato.numero_tel : '',
                // Adicionar informações de endereço se disponíveis
                endereco: endereco,
                cartao: cartao
                // tp_residencia: endereco ? endereco.tp_residencia : '',
                // tp_logradouro: endereco ? endereco.tp_logradouro : '',
                // logradouro: endereco ? endereco.logradouro : '',
                // numero: endereco ? endereco.numero : '',
                // bairro: endereco ? endereco.bairro : '',
                // cep: endereco ? endereco.cep : '',
                // cidade: endereco ? endereco.cidade : '',
                // estado: endereco ? endereco.estado : '',
                // pais: endereco ? endereco.pais : '',
                // observacoes: endereco ? endereco.observacoes : '',
                // tp_endereco: endereco ? endereco.tp_endereco : '',
                // nomeResi: endereco ? endereco.nomeResi : ''
            };

            // Renderizar a página com os detalhes do cliente
            if (rota == 'minha conta') {
                res.render('cliente/dadosCliente', { cliente: clienteComDetalhes });
            } else if (rota == 'cliconta'){
                res.render('cliente/contatoCliente', { cliente: clienteComDetalhes });
            } else if (rota == 'cliend'){
                res.render('cliente/enderecoCliente', { cliente: clienteComDetalhes });
            } else if (rota == 'clicartao'){
                res.render('cliente/meusCartoes', { cliente: clienteComDetalhes });
            } else if (rota == 'cliped'){
                res.render('cliente/clientePedidos', { cliente: clienteComDetalhes });
            } else if (rota == 'clicup'){
                res.render('cliente/clienteCupons', { cliente: clienteComDetalhes });
            } else if (rota == 'cliprod'){
                res.render('cliente/clienteProdPedido', { cliente: clienteComDetalhes });
            } else if (rota == 'clitroca'){
                res.render('cliente/solicitacaoTroca', { cliente: clienteComDetalhes });
            } else if (rota == 'clieditend'){
                res.render('cliente/editarEndereco', { endereco });
            } else if (rota == 'carrinho'){
                //const carrinho = await this.cartaoClienteController.findByClienteId(cliente.id);
                res.render('cliente/carrinho');
            } else {
                res.render('adm/detalhesCliente', { cliente: clienteComDetalhes });
            }
        
        } catch (error) {
            console.error('Erro ao encontrar detalhes de contato por ID do cliente:', error);
            throw new Error('Erro ao encontrar detalhes de contato por ID do cliente');
        }
    }

    async updateContato(req, res) {
        const clienteId = req.params.id;
        const { tipo_tel, ddd, numero_tel, email } = req.body;
        const cliente = await this.clienteModel.findById(clienteId);
        try {
            const contatoAtual = await this.contatoClienteController.findByClienteId(clienteId);

            // Inicializa um objeto com os dados atuais para serem passados para a função de atualização
            let dadosAtualizados = {
                tipo_tel: tipo_tel ? tipo_tel : contatoAtual.tipo_tel, // Se tipo_tel for fornecido, use-o; caso contrário, use o valor atual
                ddd: ddd ? ddd : contatoAtual.ddd, // Se ddd for fornecido, use-o; caso contrário, use o valor atual
                numero_tel: numero_tel,
                email: email ? email : contatoAtual.email // Se email for fornecido, use-o; caso contrário, use o valor atual
            };
            
            const contatoAtualizado = await this.contatoClienteController.updateContato(clienteId, dadosAtualizados);
            res.render('cliente/contatoAtualizado', { cliente: contatoAtualizado});
        } catch (error) {
            console.error('Erro ao atualizar dados de contato do cliente:', error);
            res.status(500).json({ error: 'Erro ao atualizar dados de contato do cliente' });
        }
    }

    getRouter() {
        return this.router;
    }
}

module.exports = ClienteController;
