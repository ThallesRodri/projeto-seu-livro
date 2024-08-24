const { DataTypes, Op } = require("sequelize");

class LivrosModel {
    constructor(database) {
        this.db = database;
        this.Livro = this.db.sequelize.define('db_livros', {
            titulo: {
                type: DataTypes.STRING,
                allowNull: false
            },
            autor: {
                type: DataTypes.STRING,
                allowNull: false
            },
            editora: {
                type: DataTypes.STRING,
                allowNull: false
            },
            edicao: {
                type: DataTypes.STRING,
                allowNull: false
            },
            ano: {
                type: DataTypes.STRING,
                allowNull: false
            },
            categorias: {
                type: DataTypes.TEXT,
                allowNull: false,
                defaultValue: []
            },
            sinopse: {
                type: DataTypes.TEXT,
                allowNull: false
            },
            numeroPages: {
                type: DataTypes.STRING,
                allowNull: false
            },
            altura: {
                type: DataTypes.STRING,
                allowNull: false
            },
            largura: {
                type: DataTypes.STRING,
                allowNull: false
            },
            profundidade: {
                type: DataTypes.STRING,
                allowNull: false
            },
            preco: {
                type: DataTypes.STRING,
                allowNull: false
            },
            quantidade: {
                type: DataTypes.STRING,
                allowNull: false
            },
            codBarras: {
                type: DataTypes.STRING,
                allowNull: false
            },
        });
        this.sync();
    }

    async sync() {
        try {
            await this.Livro.sync();
            console.log('Tabela de livros sincronizada com sucesso.');
        } catch (error) {
            console.error('Erro ao sincronizar tabela de livros:', error);
        }
    }

    async create(titulo, autor, editora, edicao, ano, categorias, sinopse, numeroPages, altura, largura, profundidade, preco, quantidade, codBarras) {
        try {
            const livro = await this.Livro.create({
                titulo,
                autor,
                editora,
                edicao,
                ano,
                categorias: JSON.stringify(categorias),
                sinopse,
                numeroPages,
                altura,
                largura,
                profundidade,
                preco,
                quantidade,
                codBarras
            });
            console.log('Livro criado:', livro.toJSON());
            return livro;
        } catch (error) {
            console.error('Erro ao criar livro:', error);
            throw error;
        }
    }

    async getAll(filter = {}) {
        try {
            return await this.Livro.findAll({ where: filter, order: [['id', 'DESC']] });
        } catch (error) {
            console.error('Erro ao buscar todos os livros:', error);
            throw error;
        }
    }

    // async getAll() {
    //     try {
    //         return await this.Livro.findAll({ order: [['id', 'DESC']] });
    //     } catch (error) {
    //         console.error('Erro ao buscar todos os livros:', error);
    //         throw error;
    //     }
    // }

    async findByTitulo(titulo) {
        try {
            const livros = await this.Livro.findAll({ 
                where: { 
                    titulo: {
                        [Op.like]: `%${titulo}%`
                    }
                }
            });
            return livros;
        } catch (error) {
            console.error('Erro ao buscar livro por título:', error);
            throw new Error('Erro ao buscar livro por título');
        }
    }
    // async findByTitulo(titulo) {
    //     try {
    //         const livros = await this.Livro.findAll({ 
    //             where: { 
    //                 titulo: {
    //                     [Sequelize.Op.like]: `%${titulo}%`
    //                 }
    //             }
    //         });
    //         return livros;
    //     } catch (error) {
    //         throw new Error('Erro ao buscar livro por titulo');
    //     }

        
    // }

    async findById(id) {
        try {
            const livro = await this.Livro.findOne({ where: { id: id } });
            return livro;
        } catch (error) {
            throw new Error('Erro ao buscar livro por id');
        }
    }
}

module.exports = LivrosModel;
