const express = require("express"); 
const app = express();
const path = require('path');
const favicon = require('serve-favicon');
const bodyParser = require('body-parser');
const { Op } = require('sequelize'); // Importar Op do Sequelize
//const Clientes = require("./model/Cliente/Clientes");

const Database = require('./database/Database');
const ClienteController = require('./controller/Cliente/ClientesController');
const ContatoClienteController = require('./controller/Cliente/ContatoClienteController');
const EnderecoClienteController = require('./controller/Cliente/EnderecoClienteController');
const CartaoClienteController = require('./controller/Cliente/CartaoClienteController');
const LivroController = require('./controller/Livros/LivroController');
const CarrinhoController = require('./controller/CarrinhoCompras/CarroComprasController');

const db = new Database();

// Conectando ao banco de dados do Cliente
const clienteController = new ClienteController(db);
const contatoClienteController = new ContatoClienteController(db);
const enderecoClienteController = new EnderecoClienteController(db);
const cartaoClienteController = new CartaoClienteController(db);
const livroController = new LivroController(db);
const carrinhoController = new CarrinhoController(db);

// Body parser
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

// VIEW
app.set('view engine', 'ejs');

// Static
app.use(express.static('public'));
app.use('/favicon.ico', express.static('/img/favicons/favicon.ico'));

// Pagina Inicial
app.get("/", async (req, res) => {
    try {
        const titulo = req.query.titulo || "";
        const filter = titulo ? { titulo: { [Op.like]: `%${titulo}%` } } : {};

        const livros = await livroController.getAll(filter);

        res.render("index", { livros: livros, titulo: titulo });
    } catch (error) {
        console.error('Erro ao listar livros:', error);
        res.status(500).json({ error: 'Erro ao listar livros' });
    }
});

app.get("/produto/:id", async (req, res) => {

    try {
        const id = req.params.id;
        const livro = await livroController.findByProd(req, res);

        res.render("produto", { livro:livro });
    } catch (error) {
        console.error('Erro ao listar livros:', error);
        res.status(500).json({ error: 'Erro ao listar livros' });
    }
})
app.use('/carrinho', carrinhoController.getRouter());
app.get("/carrinho", async (req, res) => {
    try {
        await carrinhoController.getCart(req, res);
    } catch (error) {
        console.error('Erro ao exibir o carrinho:', error);
        res.status(500).json({ error: 'Erro ao exibir o carrinho' });
    }
});
//app.use('/carrinho', carrinhoController.getRouter());
//app.use('/', carrinhoController.router);
// app.get("/carrinho/:id", async (req, res) => {
//     //res.render("cliente/carrinho");

//     const id = req.params.id;

//     try {
//         const cart = await carrinhoController.getCart();

//         // if (!cliente) {
//         //     return res.status(404).json({ error: 'Cliente não encontrado' });
//         // }

//         res.render("cliente/carrinho", { cart:cart });
//     } catch (error) {
//         console.error('Erro ao encontrar carrinho do cliente:', error);
//         res.status(500).json({ error: 'Erro ao encontrar carrinho do cliente' });
//     }
// })

// CADASTRO CLIENTE
app.get("/cadastro", (req, res) => {
    //res.render("cliente/cadastro");
    const errorMessage = false;
    return res.render('cliente/cadastro', { errorMessage });
})

app.use('/', clienteController.getRouter());
app.use('/', contatoClienteController.getRouter());

app.get("/cadastroConcluido", (req, res) => {
    res.render("cliente/confirmacaoCadastro");
})

// ADM
app.get("/adm/areaadm", (req, res) => {
    res.render("adm/areaAdm");
})

// Listagem de Clientes ADM
app.get('/adm/cliente/lista', async (req, res, next) => {
    try {
        const clientes = await clienteController.getAll(); // Método fictício para buscar todos os clientes
        //const contato = await contatoClienteController.getAll();
        const cpf = req.query.cpf || ""; // Define cpf como uma string vazia se não estiver definido
        res.render('adm/listaClientes', { clientes, cpf }); // Passa o valor de cpf como variável para o arquivo EJS
    } catch (error) {
        console.error('Erro ao criar cliente:', error);
        res.status(500).json({ error: 'Erro ao listar cliente' });
    }
});

// PEsquisar CLiente por CPF
app.get('/adm/cliente/lista/:cpf', async (req, res) => {
    const { cpf } = req.body;
    try {
      const cliente = await clienteController.findByCPF(cpf); // Método para buscar cliente pelo CPF
      res.render('clientes', { cliente }); // Renderiza a página 'clientes' passando o cliente encontrado como variável
    } catch (error) {
        console.error('Erro ao criar cliente:', error);
        res.status(500).json({ error: 'Erro ao listar cliente' });
    }
});

// Rota para exibir os detalhes de um cliente específico
app.get('/adm/cliente/detalhes/:id', async (req, res) => {
    const { id } = req.params.id;
    try {
        const cliente = await clienteController.findById(id); // Método para buscar cliente pelo ID
        res.render('adm/detalhesCliente', { cliente }); // Renderiza a página 'detalhesCliente' passando o cliente encontrado como variável
    } catch (error) {
        console.error('Erro ao encontrar detalhes do cliente:', error);
        res.status(500).json({ error: 'Erro ao encontrar detalhes do cliente' });
    }
});

// CADASTRAR LIVROS ADM
app.get("/adm/livros/cadastroLivros", (req, res) => {
    const errorMessage = false;
    return res.render('adm/formLivro', { errorMessage });
})

app.use('/', livroController.getRouter());

// PERFIL CLIENTE
function formatarData(dataString) {
    // Divide a string da data em ano, mês e dia
    const partesData = dataString.split("-");
    
    // Formata a data para o formato "dd/mm/yyyy"
    const dataFormatada = partesData[2] + "/" + partesData[1] + "/" + partesData[0];

    return dataFormatada;
}

app.locals.formatarData = formatarData;

app.get("/minhaconta/dadospessoais/:id", async  (req, res) => {
    const id = req.params.id;

    try {
        const cliente = await clienteController.findById(id);
        res.render('cliente/dadosCliente', { cliente});
    } catch (error) {
        console.error('Erro ao encontrar detalhes do cliente:', error);
        res.status(500).json({ error: 'Erro ao encontrar detalhes do cliente' });
    }
})

app.get("/minhaconta/contato/:id", async (req, res) => {
    const id = req.params.id;

    try {
        const cliente = await clienteController.findById(id);
        res.render("cliente/contatoCliente", { cliente });
    } catch (error) {
        console.error('Erro ao encontrar detalhes do cliente:', error);
        res.status(500).json({ error: 'Erro ao encontrar detalhes do cliente' });
    }
})

app.post("/minhaconta/contato/update/:id", async (req, res) => {
    const id = req.params.id;
    const { email, tipo_tel, ddd, numero_tel } = req.body;

    try {
        const cliente = await clienteController.updateContato();
        res.render("cliente/contatoCliente", { cliente });
    } catch (error) {
        console.error('Erro ao encontrar detalhes do cliente:', error);
        res.status(500).json({ error: 'Erro ao encontrar detalhes do cliente' });
    }
})

app.get("/minhaconta/contato/contatoAtualizado", (req, res) => {
    res.render("cliente/contatoAtualizado");
})

app.get("/minhaconta/endereco/:id", async (req, res) => {
    const id = req.params.id;

    try {
        const cliente = await clienteController.findById(id);
        res.render("cliente/enderecoCliente", { cliente });
    } catch (error) {
        console.error('Erro ao encontrar detalhes do cliente:', error);
        res.status(500).json({ error: 'Erro ao encontrar detalhes do cliente' });
    }
})

app.get("/minhaconta/endereco/editar/:id", async (req, res) => {
    const enderecoId = req.params.id;

    try {
        const endereco = await enderecoClienteController.findByEndId(enderecoId);
        res.render("cliente/editarEndereco", { endereco });
    } catch (error) {
        console.error('Erro ao encontrar detalhes do cliente:', error);
        res.status(500).json({ error: 'Erro ao encontrar detalhes do cliente' });
    }
})

app.post("/minhaconta/endereco/update/:id", async (req, res) => {
    const id = req.params.id;
    try {
        await enderecoClienteController.updateEndereco(req, res);
        res.redirect(`/minhaconta/endereco/1`);
    } catch (error) {
        console.error('Erro ao encontrar detalhes do cliente:', error);
        res.status(500).json({ error: 'Erro ao encontrar detalhes do cliente' });
    }
})

app.post("/minhaconta/endereco/novo/:id", async (req, res) => {
    const clienteId = req.params.id;
    const { tp_residencia, tp_logradouro, logradouro, numero, bairro, cep, cidade, estado, pais, observacoes, tp_endereco, nomeResi } = req.body;
    try {
        //const endereco = await enderecoClienteController.updateEndereco(req, res);
        //res.render("cliente/editarEndereco", { endereco });
        await enderecoClienteController.createNovoEndereco(clienteId,tp_residencia, tp_logradouro, logradouro, numero, bairro, cep, cidade, estado, pais, observacoes, tp_endereco, nomeResi);
        res.redirect(`/minhaconta/endereco/${clienteId}`);
    } catch (error) {
        console.error('Erro ao encontrar detalhes do cliente:', error);
        res.status(500).json({ error: 'Erro ao encontrar detalhes do cliente' });
    }
})

app.delete("/minhaconta/endereco/delete/:id", async (req, res) => {
    const clienteId = req.params.id;
    try {
        await enderecoClienteController.deleteEndereco(req, res);
        //res.redirect(`/minhaconta/endereco/1`);
    } catch (error) {
        console.error('Erro ao excluir endereço:', error);
        res.status(500).json({ error: 'Erro ao excluir endereço' });
    }
});

app.get("/minhaconta/cartoes/:id", async (req, res) => {
    const id = req.params.id;

    try {
        const cliente = await clienteController.findById(id);
        res.render("cliente/meusCartoes", { cliente });
    } catch (error) {
        console.error('Erro ao encontrar detalhes do cliente:', error);
        res.status(500).json({ error: 'Erro ao encontrar detalhes do cliente' });
    }
})

app.get("/minhaconta/cartao/editar/:id", async (req, res) => {
    const cartaoId = req.params.id;

    try {
        const cartao = await cartaoClienteController.findByCartaoId(cartaoId);
        res.render("cliente/editarCartão", { cartao });
    } catch (error) {
        console.error('Erro ao encontrar detalhes do cliente:', error);
        res.status(500).json({ error: 'Erro ao encontrar detalhes do cliente' });
    }
})

app.post("/minhaconta/cartao/update/:id", async (req, res) => {
    const id = req.params.id;

    try {
        await cartaoClienteController.updateCartao(req, res);
        res.redirect(`/minhaconta/cartao/1`);
    } catch (error) {
        console.error('Erro ao encontrar detalhes do cliente:', error);
        res.status(500).json({ error: 'Erro ao encontrar detalhes do cliente' });
    }
})

app.post("/minhaconta/cartao/novo/:id", async (req, res) => {
    const clienteId = req.params.id;
    const { nomeCartao, numCartao, validadeCartao, cvc } = req.body;
    try {
        await cartaoClienteController.createNovoCartao(clienteId, nomeCartao, numCartao, validadeCartao, cvc);
        res.redirect(`/minhaconta/cartoes/${clienteId}`);
    } catch (error) {
        console.error('Erro ao encontrar detalhes do cliente:', error);
        res.status(500).json({ error: 'Erro ao encontrar detalhes do cliente' });
    }
})

app.delete("/minhaconta/cartao/delete/:id", async (req, res) => {
    const clienteId = req.params.id;
    try {
        await cartaoClienteController.deleteCartao(req, res);
    } catch (error) {
        console.error('Erro ao excluir Cartão:', error);
        res.status(500).json({ error: 'Erro ao excluir cartão' });
    }
});

app.get("/minhaconta/pedidos/:id", async (req, res) => {
    const id = req.params.id;

    try {
        const cliente = await clienteController.findById(id);
        res.render("cliente/clientePedidos", { cliente });
    } catch (error) {
        console.error('Erro ao encontrar detalhes do cliente:', error);
        res.status(500).json({ error: 'Erro ao encontrar detalhes do cliente' });
    }
})

app.get("/minhaconta/cupons/:id", async (req, res) => {
    const id = req.params.id;

    try {
        const cliente = await clienteController.findById(id);
        res.render("cliente/clienteCupons", { cliente });
    } catch (error) {
        console.error('Erro ao encontrar detalhes do cliente:', error);
        res.status(500).json({ error: 'Erro ao encontrar detalhes do cliente' });
    }
})

app.get("/minhaconta/pedidos/produto/:id", async (req, res) => {
    const id = req.params.id;

    try {
        const cliente = await clienteController.findById(id);
        res.render("cliente/clienteProdPedido", { cliente });
    } catch (error) {
        console.error('Erro ao encontrar detalhes do cliente:', error);
        res.status(500).json({ error: 'Erro ao encontrar detalhes do cliente' });
    }
})

app.get("/minhaconta/pedidos/produto/troca/:id", async (req, res) => {
    const id = req.params.id;

    try {
        const cliente = await clienteController.findById(id);
        res.render("cliente/solicitacaoTroca", { cliente });
    } catch (error) {
        console.error('Erro ao encontrar detalhes do cliente:', error);
        res.status(500).json({ error: 'Erro ao encontrar detalhes do cliente' });
    }
})

app.get("/minhaconta/pedidos/produto/troca/trocasolicitada/:id", (req, res) => {
    res.render("cliente/solicitacaoTrocaEnviada");
})

// Quem Somos
app.get("/quemSomos", (req, res) => {
    res.render("quemSomos");
})

// Contato
app.get("/contato", (req, res) => {
    res.render("contato");
})

////
app.listen(8080, () => {
    console.log("Servidor rodando!!!")
})

// Middleware de log para registrar todas as requisições
// app.use((req, res, next) => {
//     console.log(`${req.method} ${req.url}`);
//     next();
// });

// app.listen(8080, () => {
//     console.log("Servidor rodando!!!")
// });
app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
  });