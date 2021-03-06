const Usuario = require('../models/UsuarioModel');
const bcriptjs = require('bcryptjs');
const { validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');

exports.crearUsuario = async (req, res) => {
    body = req.body;

    // revisar si hay errores
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            ok: false,
            errores: errors.array()
        })
    }

    // extraer email y password
    const { email, password } = body;

    try {
        // Revisar que el usuario registrado sea unico
        let usuario = await Usuario.findOne({ email });

        if (usuario) {
            return res.status(400).json({
                ok: false,
                msg: 'El usuario ya existe'
            })
        }

        // crear  el nuevo usuario
        usuario = new Usuario(body);

        // Hashear el password
        const salt = await bcriptjs.genSalt(10);
        usuario.password = await bcriptjs.hash(password, salt);

        // guardar usuario
        await usuario.save();

        // crear y firmar el JWT
        const payload = {
            usuario:{
                id:usuario.id
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
                msg: 'El usuario se creo correctamente',
                token
            })
        })
    } catch (error) {
        console.log(error);
        res.status(400).send('Hubo un error');
    }
}