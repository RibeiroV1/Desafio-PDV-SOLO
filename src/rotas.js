const express = require("express")
const { cadastrarUsuario, logar } = require("./Controladores/usuario")
const validarLogin = require("./Intermediarios/login")
const multer = require("./Intermediarios/multer")
const { cadastrarProduto, listarProdutos, detalharProduto, excluirProduto } = require("./Controladores/produtos")
const { cadastrarPedido } = require("./Controladores/pedidos")

const rotas = express()

rotas.post("/usuario", cadastrarUsuario)
rotas.post("/login", logar)

rotas.use(validarLogin)

rotas.post("/produto", multer.single('produto_imagem'), cadastrarProduto)
rotas.get("/produto", listarProdutos)
rotas.get("/produto/:id_produto", detalharProduto)
rotas.delete("/produto/:id_produto", excluirProduto)

rotas.post("/pedido", cadastrarPedido)


module.exports = {rotas}
