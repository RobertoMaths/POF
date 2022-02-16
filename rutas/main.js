const express = require("express");
const path = require("path");
const Router = express.Router();
const Pool = require("../config/database");
const {validContraseña, genContraseña} = require("../lib/contraseñas");
const {crearJWT, verificarJWT} = require("../lib/JWT");

Router.get("/index.js",(req,res)=> {
    res.sendFile(path.resolve(__dirname,"../public/index.js"))
})

Router.get("/estilo.css",(req,res)=> {
    res.sendFile(path.resolve(__dirname,"../public/estilo.css"))
})

Router.get("/perfil",verificarJWT,(req,res,next)=> {
    if (!req.sesión) return res.redirect("/login");
    next();
});

Router.get("/logout",(req,res)=> {
    res.set({
        "Set-Cookie": "autorizacion=; Max-Age=0"
    });
    res.redirect("/")
})

Router.get("/autorización",verificarJWT,(req,res)=> {
    if (req.sesión) return res.send("1");
    else return res.send("0");
})

Router.get("/usuario",verificarJWT,(req,res)=> {
    if (req.sesión) {
        Pool.query(`SELECT * FROM archivos WHERE autor = "${req.usuario}"`,(error,rows,fields)=> {
            if (error) {
                console.log(error);
                return res.json({error: true, message: error.message});
            }
            const archivos = rows.map(row => {
                return {
                    tipo: row.tipo,
                    nombre: row.nombre,
                }
            })
            return res.json({error: false, usuario: req.usuario, archivos})
        });
    }
})

Router.get("*", (req,res)=> {
    res.sendFile(path.resolve(__dirname,"../public/index.html"));
})

Router.post("/login",(req,res)=> {
    Pool.query(`SELECT nombre, contraseña FROM usuarios WHERE nombre = "${req.body.usuario}"`,(error,rows,fields)=> {
        if (error) {
            console.log(error.message);
            return res.json({error: true, message: error.message});
        }
        const contraseñaVálida = validContraseña(req.body.contraseña,rows[0].contraseña);
        if (contraseñaVálida) {
            const JWT = crearJWT(req.body.usuario);
            res.set({
                "Set-Cookie": `autorizacion=${JWT}; Path=/; HttpOnly; Secure; Ephemeral`
            })
            return res.json({error: false});
        }
        res.json({error: true, message: "Credenciales no válidas"});
    })
})

Router.post("/registro",(req,res)=> {
    const hash = genContraseña(req.body.contraseña);
    if (req.body.correo) {
        Pool.query(`INSERT INTO usuarios (nombre,correo,contraseña) VALUES ("${req.body.usuario}","${req.body.correo}","${hash}");`,(error)=> {
            if (error) {
                console.log(error.message);
                return res.json({error: true, message: error.message})
            }
            const JWT = crearJWT(req.body.usuario);
            res.set({
                "Set-Cookie": `autorizacion=${JWT}; Path=/; HttpOnly; Secure; Ephemeral`
            })
            res.json({error: false});
        });
    }
    else {
        Pool.query(`INSERT INTO usuarios (nombre,contraseña) VALUES ("${req.body.usuario}","${hash}");`,(error)=> {
            if (error) {
                console.log(error);
                return res.json({error: true, message: error.message})
            }
            const JWT = crearJWT(req.body.usuario);
            res.set({
                "Set-Cookie": `autorizacion=${JWT}; Path=/; HttpOnly; Secure; Ephemeral`
            })
            res.json({error: false});
        });
    }
})

module.exports = Router;