const express = require('express');

const { verificaToken, verificaAdmin_Role } = require("../middlewares/autenticacion");

const app = express();
const Categoria = require("../models/categoria");

// ==============================
// Mostrar una categoria por ID
// ==============================
app.get('/categoria', verificaToken, (req, res) => {

    Categoria.find({})
        .sort("descripcion")
        .populate("usuario", "nombre email")
        .exec((err, categorias) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            Categoria.count((err, conteo) => {
                res.json({
                    ok: true,
                    cuantos: conteo,
                    categorias
                });
            });

        });

});

// ==============================
// Mostrar una categoria por ID
// ==============================
app.get('/categoria/:id', verificaToken, (req, res) => {
    let id = req.params.id;
    Categoria.findById(id, (err, categoriaDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        if (!categoriaDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: "Categoria no encontrado"
                }
            });
        }

        res.json({
            ok: true,
            categoria: categoriaDB
        })
    });
});

// ==============================
// Crear nueva categoria
// ==============================
app.post('/categoria', verificaToken, (req, res) => {
    let body = req.body;

    let categoria = new Categoria({
        descripcion: body.descripcion,
        usuario: req.usuario._id
    });

    categoria.save((err, categoriaDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!categoriaDB) {
            return res.status(400).json({
                ok: false,
                err
            });
        }


        res.json({
            ok: true,
            categoria: categoriaDB
        });
    });


});

// ==============================
// Actualizar una categoria por ID
// ==============================
app.put('/categoria/:id', verificaToken, (req, res) => {
    let id = req.params.id;
    let body = req.body;

    let desCategoria = {
        descripcion: body.descripcion
    };

    Categoria.findByIdAndUpdate(id, desCategoria, { new: true, runValidators: true }, (err, categoriaDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        if (!categoriaDB) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({ ok: true, categoria: categoriaDB, id: id });
    });
});

// ==============================
// Eliminar una categoria
// ==============================
app.delete('/categoria/:id', [verificaToken, verificaAdmin_Role], (req, res) => {
    let id = req.params.id;
    Categoria.findByIdAndRemove(id, (err, categoriaB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        if (!categoriaB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: "Categoria no encontrado"
                }
            });
        }

        res.json({
            ok: true,
            message: "Categoria Eliminada"
        });
    });
});


module.exports = app;