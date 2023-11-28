const knex = require("../BancoDados/conexao")

const cadastrarPedido = async (req, res)=>{
    let {data, pedido_produtos}= req.body
    if(!data)data = new Date()
    if(pedido_produtos.length == 0)return res.status(400).json({mensagem: "Deve conter itens na lista_produtos"})
    let soma = 0
    try {
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
    } catch (error) {
        //TODO: colocar erro no log
        return res.status(500).json({mensagem: "Erro interno de servidor."})
    }
    return res.status(201).json({mensagem : "Pedido realizado."})
}
const listarPedidos = async (req, res)=>{
    const {a_partir} = req.query
    try {

        const todosPedidos = await knex("pedidos").select('*')
        const listaPedidos = []
        for(pedido of todosPedidos){
            if(!a_partir){
                const pedido_produtos = []
                const todosProdutos_pedidos = await knex("pedido_produtos").select("*")
                for(produto of todosProdutos_pedidos){
                    const {id, pedido_id, produto_id, quantidade_produto} = produto
                    const info = await knex("produtos").select('valor').where({id: produto_id})
                    const item = {
                        id, quantidade_produto, valor_produto: info[0].valor, pedido_id, produto_id
                    }
                    pedido_produtos.push(item)

                }
                listaPedidos.push({pedido, pedido_produtos})
            }else{
                const inicio = new Date(a_partir)
                if(pedido.data >= inicio){
                    const pedido_produtos = []
                    const todosProdutos_pedidos = await knex("pedido_produtos").select("*")
                    for(produto of todosProdutos_pedidos){
                        const {id, pedido_id, produto_id, quantidade_produto} = produto
                        const info = await knex("produtos").select('valor').where({id: produto_id})
                        const item = {
                            id, quantidade_produto, valor_produto: info[0].valor, pedido_id, produto_id
                        }
                        pedido_produtos.push(item)

                    }
                    listaPedidos.push({pedido, pedido_produtos})
                }
            }
        }
        return res.json(listaPedidos)
    } catch (error) {
        console.log(error)
        //TODO: Colocar erro no log
        return res.status(500).json({mensagem: "Erro interno de servidor."})
    }
}

module.exports = {
    cadastrarPedido,
    listarPedidos
}
