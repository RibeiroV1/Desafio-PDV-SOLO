const knex = require("../BancoDados/conexao")
const { uploadArquivo, excluirArquivo } = require("./arquivos")


const cadastrarProduto = async (req, res)=>{
    const {descricao, valor} = req.body
    const produto_imagem = req.file
    if(!descricao)return res.status(400).json({mensagem : "campo 'descricao' é obrigatório"})
    if(!valor)return res.status(400).json({mensagem : "campo 'valor' é obrigatório"})
    try {
        const arquivo = await uploadArquivo(
            `produtos_imagem/${produto_imagem.originalname}`,
            produto_imagem.buffer,
            produto_imagem.mimetype
        )
        const produto = {
            descricao,
            valor,
            produto_imagem: arquivo.url
        }
        const produtoSalvo = await knex("produtos").insert(produto, '*')
        return res.status(201).json(produtoSalvo)
    } catch (error) {
        reportarErro(error)
        return res.status(500).json({mensagem: "Erro interno de servidor!"})
    }

}

const listarProdutos = async (req, res)=>{
    const produtosCadastrados = await knex("produtos").select('*')
    return res.status(200).json(produtosCadastrados)
}
const detalharProduto = async (req, res)=>{
    const {id_produto} = req.params
    try {
        const produto = await knex("produtos").select('*').where({id: id_produto})
        if(produto.length == 0)return res.status(404).json({mensagem: "Produto não encontrado!"})
        return res.json(produto)
    } catch (error) {
        reportarErro(error)
        return res.status(500).json({mensagem: "Erro interno de servidor"})
    }
}
const excluirProduto = async (req, res)=>{
    const {id_produto} = req.params
    try {
        const produto = await knex("produtos").delete('*').where({id: id_produto})
        if(produto.length == 0)return res.status(404).json({mensagem: "Produto não encontrado."})
        excluirArquivo(produto[0].url)
        return res.status(200).json(produto[0])
    } catch (error) {
        reportarErro(error)
        return res.status(500).json({mensagem: "Erro interno de servidor"})
    }
}
module.exports = {
    cadastrarProduto,
    listarProdutos,
    detalharProduto,
    excluirProduto
}
