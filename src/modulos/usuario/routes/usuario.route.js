const express = require('express');
const UsuarioController = require('../controllers/usuario.controller')
const AutenticacaoMiddleware = require('../../../middleware/autenticacao.middleware')
const autorizaçãoMiddleware = require('../../../middleware/autorizacao.middleware')

const router = express.Router()

// rota de cadastro
router.post('/cadastrar', UsuarioController.cadastrar)

// rota protegida para exibir perfil do aluno
router.get('/perfil', AutenticacaoMiddleware.autenticarToken, UsuarioController.perfil);

// rota de tarefa aluno
router.get('/listar-tarefa', AutenticacaoMiddleware.autenticarToken, autorizaçãoMiddleware.autorizar(['professor', 'secreatrio']));
// router.post('/tarefa', AutenticacaoMiddleware.autenticarToken, autorizaçãoMiddleware.autorizar(['aluno']), AlunoController.tarefa);



module.exports = router