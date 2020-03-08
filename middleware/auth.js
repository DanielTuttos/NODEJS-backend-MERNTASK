const jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {
    // Leer el token del header
    const token = req.header('x-auth-token');

    // revisar si no hay token
    if (!token) {
        return res.status(401).json({
            ok: false,
            msg: 'No hay token, permiso no valido'
        })
    }
    // validar el token
    try {
        const cifrado = jwt.verify(token, process.env.SECRETA);

        req.usuario = cifrado.usuario;
        next();

    } catch (error) {
        console.log(error);
        res.status(401).json({
            ok: false,
            msg: 'token no valido'
        })
    }
}