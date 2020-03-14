const Tarea = require('../models/TareaModel');

const Proyecto = require('../models/ProyectoModel');

const { validationResult } = require('express-validator');

// crea una nueva tarea
exports.crearTarea = async (req, res) => {

    // revisar si hay errores
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            ok: false,
            errores: errors.array()
        })
    }

    try {

        // Extraer el proyecto y comprobar si existe
        const { proyecto } = req.body;
        const existeProyecto = await Proyecto.findById(proyecto);
        if (!existeProyecto) {
            return res.status(404).json({
                ok: false,
                msg: 'Proyecto no encontrado'
            })
        }

        // revisar si elproyecto actual pertenece al usuario autenticado
        // verificar el creador delproyecto
        if (existeProyecto.creador.toString() !== req.usuario.id) {
            return res.status(401).json({
                ok: false,
                msg: 'No autorizado'
            })
        }

        // creamos la tarea
        const tarea = new Tarea(req.body);
        await tarea.save();

        res.json({
            ok: true,
            tarea
        })

    } catch (error) {
        console.log(error);
        res.status(500).send('Hubo un error');
    }


}


// obtiene las tareas por proyecto
exports.obtenerTareas = async (req, res) => {

    try {
        // Extraer el proyecto y comprobar si existe
        const { proyecto } = req.query;
        const existeProyecto = await Proyecto.findById(proyecto);
        if (!existeProyecto) {
            return res.status(404).json({
                ok: false,
                msg: 'Proyecto no encontrado'
            })
        }

        // revisar si elproyecto actual pertenece al usuario autenticado
        // verificar el creador delproyecto
        if (existeProyecto.creador.toString() !== req.usuario.id) {
            return res.status(401).json({
                ok: false,
                msg: 'No autorizado'
            })
        }

        // obteenr las tareas por proyecto
        const tareas = await Tarea.find({ proyecto }).sort({ creado: -1 });

        res.json({
            ok: true,
            tareas
        })

    } catch (error) {
        console.log(error);
        res.status(500).send('Hubo un error');
    }
}

// actualizar tarea por id
exports.actualizarTarea = async (req, res) => {
    try {
        // Extraer el proyecto y comprobar si existe
        const { proyecto, nombre, estado } = req.body;

        // si la tarea existe o no
        let tarea = await Tarea.findById(req.params.id);
        if (!tarea) {
            return res.status(404).json({
                ok: false,
                msg: 'No existe esa tarea'
            })
        }

        // extraer proyecto 
        const existeProyecto = await Proyecto.findById(proyecto);

        // revisar si elproyecto actual pertenece al usuario autenticado
        if (existeProyecto.creador.toString() !== req.usuario.id) {
            return res.status(401).json({
                ok: false,
                msg: 'No autorizado'
            })
        }

        // crear un objeto con lanueva informacion
        const nuevaTarea = {};


        nuevaTarea.nombre = nombre;


        nuevaTarea.estado = estado;
        

        // guardar la tarea
        tarea = await Tarea.findOneAndUpdate({ _id: req.params.id }, nuevaTarea, { new: true });
        res.json({
            ok: true,
            tarea
        })


    } catch (error) {
        console.log(error);
        res.status(500).send('Hubo un error')
    }
}

// elimina una tarea
exports.eliminarTarea = async (req, res) => {
    try {
        // Extraer el proyecto y comprobar si existe
        const { proyecto } = req.query;

        // si la tarea existe o no
        let tarea = await Tarea.findById(req.params.id);
        if (!tarea) {
            return res.status(404).json({
                ok: false,
                msg: 'No existe esa tarea'
            })
        }

        // extraer proyecto 
        const existeProyecto = await Proyecto.findById(proyecto);

        // revisar si elproyecto actual pertenece al usuario autenticado
        if (existeProyecto.creador.toString() !== req.usuario.id) {
            return res.status(401).json({
                ok: false,
                msg: 'No autorizado'
            })
        }

        // eliminar
        await Tarea.findOneAndRemove({ _id: req.params.id });

        res.json({
            ok: true,
            msg: 'Tarea eliminada'
        })


    } catch (error) {
        console.log(error);
        res.status(500).send('Hubo un error')
    }
}