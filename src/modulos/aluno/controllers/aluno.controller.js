const Aluno = require("../models/aluno.model");
const bcrypt =require('bcryptjs')

class AlunoController {
  static async cadastrar(req, res) {
    try {
      const { nome, matricula, email, senha } = req.body;
      if (!matricula || !nome || !email || !senha) {
        return res
          .status(400)
          .json({ msg: "Todos os campos devem serem preenchidos!" });
      }
      // criptografando a senha
      const senhaCriptografada = await bcrypt.hash(senha, 15);
      await Aluno.create({ nome, matricula, email, senha: senhaCriptografada });
      res.status(200).json({ msg: 'Aluno criado com sucesso' });
    } catch (error) {
        res.status(500).json({msg: 'Erro do servidor. Tente novamente mais tarde!', erro: error.message})
    }
  }
  static async perfil(req, res) {
    try {
      
      const { matricula } = req.usuario; // vindo do token

      // Busca mais dados se necessário
      const aluno = await Aluno.findOne({
        where: { matricula },
        attributes: ['nome', 'matricula', 'email'], // apenas os campos públicos
        //          { exclude: "senha"} caso haja varias tabelas e relacionamentos
      });

      if (!aluno) {
        return res.status(404).json({ msg: "Aluno não encontrado." });
      }

      res.status(200).json({ perfil: aluno });
    } catch (error) {
      res.status(500).json({
        msg: "Erro ao buscar perfil.",
        erro: error.message
      });
    }
  }
}

module.exports = AlunoController