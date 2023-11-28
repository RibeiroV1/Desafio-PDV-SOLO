const jwt = require("jsonwebtoken")
const knex = require("../BancoDados/conexao")

const validarLogin = async (req, res, next)=>{
    const {authorization} = req.headers
    if(!authorization)return res.status(400).json({mensagem: "Não autorizado."})
    const token = authorization.split(" ")[1]
    if(!token)return res.json(400).json({mensagem: "Precisa informar um token para acessar essa secção."})
    try {
        const {id} = jwt.verify(token, process.env.JWT_PASS)
        const usuarioBanco = await knex.select('*').from("usuarios").where({id})
        if(usuarioBanco.length == 0)return res.status(404).json({mensagem: "Usuário não encontrado!"})
        const {senha, ...usuario} = usuarioBanco[0]
        req.usuario = usuario
        next()
    } catch (error) {
        return res.status(401).json({mensagem: "Erro interno de servidor."})
    }
}

module.exports = validarLogin
