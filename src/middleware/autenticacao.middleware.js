const jwt = require("jsonwebtoken");

class AutenticacaoMiddleware {
  static autenticarToken(req, res, next) {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1]; // formato "Bearer TOKEN"

    if (!token) {
      return res.status(401).json({ msg: "Token de acesso não fornecido!" });
    }

    jwt.verify(token, process.env.SECRET_KEY, (err, usuario) => {
      if (err) {
        return res.status(403).json({ msg: "Token de acesso não fornecido!" });
      }

      req.usuario = usuario; 
      next();
    });
  }

//   static verificarPermissao(roles) {
//     return (req, res, next) => {
//       if (!req.usuario || !req.usuario.role || !roles.includes(req.usuario.role)) {
//         return res.status(403).json({ msg: "Acesso negado!" });
//       }
//       next();
//     };
//   }
}

module.exports = AutenticacaoMiddleware;
