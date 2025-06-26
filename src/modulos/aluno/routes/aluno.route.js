const express = require('express');
const AlunoController = require('../controllers/aluno.controller')
const AutenticacaoMiddleware = require('../middleware/aluno.autenticacao')

const router = express.Router()

// rota de cadastro
router.post('/cadastrar', AlunoController.cadastrar)

// rota protegida para exibir perfil do aluno
router.get('/perfil', AutenticacaoMiddleware.autenticarToken, AlunoController.perfil);

module.exports = router