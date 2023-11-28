
const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt")
const nodemailer = require("nodemailer")

var transport = nodemailer.createTransport({
    host: process.env.MAILER_HOST,
    port: 2525,
    auth: {
      user: process.env.MAILER_USER,
      pass: process.env.MAILER_PASS
    }
  });

const knex = require("../BancoDados/conexao")

const  cadastrarUsuario = async (req, res) =>{
    const {nome, email, senha} = req.body
    if(!nome || !email || !senha)return res.status(400).json({mensagem: "Os campos precisam ser preenchidos corretamente!"})
    try {
        const emailExiste = await knex.select("*").from("usuarios").where("email", email)
        if(emailExiste.length > 0)return res.status(400).json({mensagem: "E-mail já cadastrado!"})

        const senhaCriptografada = await bcrypt.hash(senha, 10)
        await knex.insert({nome, email, senha: senhaCriptografada}).into("usuarios")
        //Enviar e-mail.
        const info = await transport.sendMail({
            from: "vitor3020@hotmail.com",
            to: email,
            subject: "Boas vindas",
            text: `Seja bem vindo ${nome}`,

        })

        return res.status(200).json({nome, email})

    } catch (error) {
        //TODO: salvar erros do servidor em console.log
        console.log(error)
        return res.status(500).json({mensagem: "Erro interno de servidor!"})
    }
}

const logar = async (req, res)=>{
    const {email, senha} = req.body
    if(!email || !senha)return res.status(400).json({mensagem: "Precisa ser informado email e senha para efetuar o login."})
    try {
        const usuario = await knex.select("*").from("usuarios").where("email", email).returning().first()
        if(usuario.length == 0)return res.status(404).json({mensagem: "E-mail não cadastrado!"})
        const senhaCorreta = await bcrypt.compare(senha, usuario.senha)
        let {senha: senhaUsuario, ...user} = usuario
        const token = await jwt.sign({id: usuario.id}, process.env.JWT_PASS, {expiresIn: "8h"})
        return res.json({usuario: user, token})

    } catch (error) {
        //TODO: Salvar o erro em um log
        console.log(error)
        return res.status(500).json({mensagem: "Erro interno de servidor"})
    }
}

module.exports = {cadastrarUsuario, logar}
