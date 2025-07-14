const Usuario = require("../models/usuario.model");
const bcrypt =require('bcryptjs')

class UsuarioController {
  static async cadastrar(req, res) {
    try {
      const { nome, matricula, email, senha, papel } = req.body;
      if (!matricula || !nome || !email || !senha || papel)
         return res
          .status(400)
          .json({ msg: "Todos os campos devem serem preenchidos!" });
      }
      // criptografando a senha
      const senhaCriptografada = await bcrypt.hash(senha, 15);
      await Usuario.create({ nome, matricula, email, senha: senhaCriptografada });
      res.status(200).json({ msg: 'Aluno criado com sucesso' });
    } catch (error) {
        res.status(500).json({msg: 'Erro do servidor. Tente novamente mais tarde!', erro: error.message})
    }
  }
  static async perfil(req, res) {
    try {
      
      const { matricula } = req.usuario; // vindo do token

      // Busca mais dados se necessário
      const usuario = await Usuario.findOne({
        where: { matricula },
        attributes: ['nome', 'matricula', 'email'], // apenas os campos públicos
        //          { exclude: "senha"} caso haja varias tabelas e relacionamentos
      });

      if (!usuario) {
        return res.status(404).json({ msg: "Usuario não encontrado." });
      }

      res.status(200).json({ perfil: usuario });
    } catch (error) {
      res.status(500).json({
        msg: "Erro ao buscar perfil.",
        erro: error.message
      });
    }
  }
}

module.exports = UsuarioController;