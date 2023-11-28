const knex = require("../BancoDados/conexao")

const cadastrarPedido = async (req, res)=>{
    let {data, pedido_produtos}= req.body
    if(!data)data = new Date()
    if(pedido_produtos.length == 0)return res.status(400).json({mensagem: "Deve conter itens na lista_produtos"})
    let soma = 0

    for(produto of pedido_produtos){
        const existe = await knex("produtos").select("*").where({id : produto.produto_id})
        if(existe.length == 0)return res.status(404).json({mensagem: `Produto de id ${produto.id} não encontrado.`})
        soma+=(Number(existe[0].valor) * Number(produto.quantidade_produto))
    }
    const pedido = await knex('pedidos').insert({data, valor_total: soma}).returning('*')

    for(produto of pedido_produtos){
        await knex("pedido_produtos").insert({
            pedido_id: pedido[0].id,
            produto_id: produto.produto_id,
            quantidade_produto: produto.quantidade_produto
        })
    }

    return res.status(201).json({mensagem : "Pedido realizado."})
}

module.exports = {
    cadastrarPedido
}
