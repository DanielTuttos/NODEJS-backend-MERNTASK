const Usuario = require('../models/UsuarioModel');
const bcriptjs = require('bcryptjs');
const { validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');

exports.autenticarUsuario = async (req, res) => {
    body = req.body;

    // revisar si hay errores
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            ok: false,
            errores: errors.array()
        })
    }

    // extraer elemail y password
    const { email, password } = body;

    try {
        // revisar que sea un usuario registrado
        let usuario = await Usuario.findOne({ email });
        if (!usuario) {
            return res.status(400).json({
                ok: false,
                msg: 'El usuario no existe'
            })
        }

        // revisar el password
        const passCorrecto = await bcriptjs.compare(password, usuario.password);
        if (!passCorrecto) {
            return res.status(400).json({
                ok: false,
                msg: 'Password incorrecto'
            })
        }

        // si todo es correcto creamos en jwt crear y firmar el JWT
        const payload = {
            usuario: {
                id: usuario.id
            }
        }

        // firmar el JWT
        jwt.sign(payload, process.env.SECRETA, {
            expiresIn: 3600 // 1 hora
        }, (error, token) => {
            if (error) throw error;
            // Mensaje de confirmacion
            res.json({
                ok: true,
                token
            })
        })


    } catch (error) {
        console.log(error);
    }


}

// obtiene el usuario que esta autenticado
exports.usuarioAutenticado = async (req, res) => {
    try {
        const usuario = await Usuario.findById(req.usuario.id).select('-password');
        res.json({
            ok:true,
            usuario
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ msg: 'Hubo un error', error })
    }
}
