const Proyecto = require('../models/ProyectoModel');
const { validationResult } = require('express-validator');

exports.crearProyecto = async (req, res) => {
    const body = req.body;

    // revisar si hay errores
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            ok: false,
            errores: errors.array()
        })
    }

    try {
        // Crear un nuevo proyecto
        const proyecto = new Proyecto(body);
        // guardar el creador via jwt
        proyecto.creador = req.usuario.id;
        // guardamos el proyecto
        proyecto.save();
        res.json({
            ok: true,
            proyecto
        })
    } catch (error) {
        console.log(error);
        res.status(500).send('Hubo un Error');
    }
}

// obtiene todos los proyectos del usuario actual
exports.obtenerProyectos = async (req, res) => {
    try {
        const proyectos = await Proyecto.find({ creador: req.usuario.id }).sort({ creado: -1 });
        res.json({
            ok: true,
            proyectos
        })
    } catch (error) {
        console.log(error);
        res.status(500).send('Hubo un error');
    }
}

// actualiza un proyecto
exports.actualizarProyecto = async (req, res) => {
    const body = req.body;

    // revisar si hay errores
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            ok: false,
            errores: errors.array()
        })
    }

    // extraer la informacion del proyecto
    const { nombre } = body;

    const nuevoProyecto = {};

    if (nombre) {
        nuevoProyecto.nombre = nombre;
    }

    try {
        // revisar el id
        const id = req.params.id;

        let proyecto = await Proyecto.findById(id);

        // si el proyecto existe o no
        if (!proyecto) {
            return res.status(404).json({
                ok: false,
                msg: 'Proyecto no encontrado'
            })
        }

        // verificar el creador delproyecto
        if (proyecto.creador.toString() !== req.usuario.id) {
            return res.status(401).json({
                ok: false,
                msg: 'No autorizado'
            })
        }

        // actualizar
        proyecto = await Proyecto.findOneAndUpdate({ _id: id }, { $set: nuevoProyecto }, { new: true });

        res.json({
            ok: true,
            proyecto
        })

    } catch (error) {
        console.log(error);
        res.status(500).send('Hubo un error en el servidor');
    }
}


// Eliminar un proyecto por si id

exports.eliminarProyecto = async (req, res) => {
    try {

        // revisar el id
        const id = req.params.id;

        let proyecto = await Proyecto.findById(id);

        // si el proyecto existe o no
        if (!proyecto) {
            return res.status(404).json({
                ok: false,
                msg: 'Proyecto no encontrado'
            })
        }

        // verificar el creador delproyecto
        if (proyecto.creador.toString() !== req.usuario.id) {
            return res.status(401).json({
                ok: false,
                msg: 'No autorizado'
            })
        }

        // eliminar el proyecto
        await Proyecto.findOneAndRemove({ _id: id });

        res.json({
            ok: true,
            msg: 'Proyecto eliminado'
        })


    } catch (error) {
        console.log(error);
        res.status(500).send('Hubo un error en el servidor');
    }
}