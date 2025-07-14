
class autorizaçãoMiddleware {

  static autorizar(papeisPermitidos) { // os papeis permitidos vem da rota, por exemplo: ['aluno', 'professor']
        return (requesicao, resposta, proximo) => {
          const usuario = requesicao.usuario;

            if (!usuario || !papeisPermitidos.includes(usuario.papel)) {      // ja usuario.papel vem do banco          
                return resposta.status(403).json({ mensagem: 'Acesso nao autoraizado para este recurso.' });
            }
            proximo();
  
      };
    }
    }
module.exports = autorizaçãoMiddleware;
