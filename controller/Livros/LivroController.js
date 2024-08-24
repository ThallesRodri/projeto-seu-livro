const express = require("express");
const LivrosModel = require("../../model/Livro/Livro");

class LivroController {
    constructor(database) {
        this.router = express.Router();
        this.livroModel = new LivrosModel(database);
        this.id = this.livroModel.id

        this.router.post('/adm/livro/save', this.create.bind(this));
        this.router.get('/:titulo', this.findByTitulo.bind(this));
        this.router.get('/produto/:id', this.findByProd.bind(this));
        // this.router.get('/adm/cliente/lista/:cpf', this.findByCPF.bind(this));
        // this.router.get('/adm/cliente/detalhes/:id', (req, res) => this.findById(req, res, ''));
        // this.router.get('/minhaconta/endereco/editar/:id', this.findByEndId.bind(this));
        // this.router.post('/minhaconta/endereco/update/:id', this.updateEndereco.bind(this));

        // this.router.post('/minhaconta/endereco/novo/:id', this.createNovoEndereco.bind(this));

        // this.router.delete('/minhaconta/endereco/delete/:id', this.deleteEndereco.bind(this));

    }

    async create(req, res) {
        const { titulo, autor, editora, edicao, ano, sinopse, numeroPages,  altura, largura, profundidade, preco, quantidade, codBarras } = req.body;
        const categorias = req.body.categoria;
        try {
            console.log("cat: ",categorias)
            const categoriasJSON = JSON.stringify(categorias);
            console.log("json: ",categoriasJSON)
            const livro = await this.livroModel.create(titulo, autor, editora, edicao, ano, categoriasJSON, sinopse, numeroPages,  altura, largura, profundidade, preco, quantidade, codBarras);
            
            res.redirect("/");
        } catch (error) {
            console.error('Erro ao criar livro:', error);
            res.status(500).json({ error: 'Erro ao criar livro' });
        }
    }

    async list(req, res) {
        try {
            const livros = await this.livroModel.getAll();
            res.render('index', { livros });
        } catch (error) {
            console.error('Erro ao listar livros:', error);
            res.status(500).json({ error: 'Erro ao listar livros' });
        }
    }

    async getAll(filter = {}) {
        try {
            const livros = await this.livroModel.getAll(filter);
            return livros;
        } catch (error) {
            throw error;
        }
    }
    
    async search(req, res) {
        const titulo = req.query.titulo || "";
        const filter = titulo ? { titulo: { [this.livroModel.database.Sequelize.Op.like]: `%${titulo}%` } } : {};
        try {
            const livros = await this.getAll(filter);
            res.render("index", { livros: livros, titulo: titulo });
        } catch (error) {
            console.error('Erro ao listar livros:', error);
            res.status(500).json({ error: 'Erro ao listar livros' });
        }
    }

    async findByTitulo(req, res) {
        const titulo = req.params.titulo;
        //const { titulo } = req.query;
        try {
            const livro = await this.livroModel.findByTitulo(titulo);
            res.status(200).json(livro);
        } catch (error) {
            console.error('Erro ao encontrar livro por titulo:', error);
            res.status(500).json({ error: 'Erro ao encontrar livro por titulo' });
        }
    }

    async findByProd(req, res) {
        const id = req.params.id;
        try {
            const livro = await this.livroModel.findById(id);
    
            if (!livro) {
                return res.status(404).json({ error: 'Livro não encontrado' });
            }
            return livro
            //res.render('produto', { livro: livro });
        } catch (error) {
            console.error('Erro ao encontrar detalhes do livro por ID:', error);
            res.status(500).json({ error: 'Erro ao encontrar detalhes do livro' });
        }
        // //const titulo = req.params.titulo;
        // //const { titulo } = req.query;
        // try {
        //     //const livro = await this.livroModel.findByTitulo(titulo);
        //     res.redirect("/produto");
        // } catch (error) {
        //     console.error('Erro ao encontrar livro por titulo:', error);
        //     res.status(500).json({ error: 'Erro ao encontrar livro por titulo' });
        // }
    }

    async findById(req, res, rota) {
        const id = req.params.id;
        try {
            const livro = await this.livroModel.findById(id);

            if (!livro) {
                console.error('livro não encontrado');
                return res.status(404).json({ error: 'livro não encontrado' });
            }

            // Construir o objeto livro com informações adicionais
            const livroComDetalhes = {
                id: livro.id,
                titulo: livro.titulo,
                autor: livro.autor,
                editora: livro.editora,
                edicao: livro.edicao,
                ano: livro.ano,
                categorias: livro.categorias,
                sinopse: livro.sinopse,
                numeroPages: livro.numeroPages,
                altura: livro.altura,
                largura: livro.largura,
                profundidade: livro.profundidade,
                preco: livro.preco,
                quantidade: livro.quantidade,
                codBarras: livro.codBarras
                
            };
            res.render('/', { livro: livroComDetalhes });
        
        } catch (error) {
            console.error('Erro ao encontrar detalhes de contato por ID do livro:', error);
            throw new Error('Erro ao encontrar detalhes de contato por ID do livro');
        }
    }

    getRouter() {
        return this.router;
    }
}

module.exports = LivroController;
