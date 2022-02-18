const express = require("express");
const fileUpload = require("express-fileupload");
const path = require("path");
const fs = require("fs");
const Router = express.Router();
const Pool = require("../config/database");
const {validContraseña, genContraseña} = require("../lib/contraseñas");
const {crearJWT, verificarJWT} = require("../lib/JWT");

const verificarRutas = (usuario,tipo,extensión)=> {
    if (!fs.existsSync(path.resolve(__dirname,`../public/${usuario}`))) {
        fs.mkdirSync(path.resolve(__dirname,`../public/${usuario}`));
    }
    if (!fs.existsSync(path.resolve(__dirname,`../public/${usuario}/${tipo}`))) {
        fs.mkdirSync(path.resolve(__dirname,`../public/${usuario}/${tipo}`));
    }
    if (!fs.existsSync(path.resolve(__dirname,`../public/${usuario}/${tipo}/${extensión}`))) {
        fs.mkdirSync(path.resolve(__dirname,`../public/${usuario}/${tipo}/${extensión}`));
    }
}

Router.use(fileUpload());

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

Router.get("/autorizacion",verificarJWT,(req,res)=> {
    if (req.sesión) return res.send("1");
    else return res.send("0");
})

Router.get("/usuario",verificarJWT,(req,res)=> {
    if (req.sesión) {
        Pool.query(`SELECT tipo, nombre, titulo FROM archivos WHERE autor = "${req.usuario}" UNION SELECT nombre, imagen, correo FROM usuarios WHERE nombre = "${req.usuario}"`,(error,rows,fields)=> {
            if (error) {
                console.log(error);
                return res.json({error: true, message: error.message});
            }
            else {
                const index = rows.length - 1;
                const img = rows[index].nombre;
                let archivos = rows.map(row => {
                    if (row.tipo !== req.usuario) {
                        return {
                            tipo: row.tipo,
                            nombre: row.nombre,
                            titulo: row.titulo
                        }
                    }
                })
                archivos = archivos.filter(archivo => archivo !== undefined);
                return res.json({error: false, usuario: req.usuario, archivos, img});
            }
        });
    }
})

Router.get("/:usr/:tipo/:ext/:nombre/portada",(req,res)=> {
    Pool.query(`SELECT portada FROM archivos WHERE autor = "${req.params.usr}" AND tipo = "${req.params.tipo}/${req.params.ext}" AND nombre = "${req.params.nombre}"`,(error,rows,fields)=> {
        if (error) {
            console.log(error);
            return res.send("/5571.jpg");
        }
        return res.send(rows[0].portada)
    })
})

Router.get("/usuario/:usr/info",(req,res)=> {
    Pool.query(`SELECT tipo, nombre, titulo FROM archivos WHERE autor = "${req.params.usr}" UNION SELECT nombre, imagen, correo FROM usuarios WHERE nombre = "${req.params.usr}"`,(error,rows,fields)=> {
        if (error) {
            console.log(error);
            return res.json({error: true, message: error.message});
        }
        else {
            const index = rows.length - 1;
            const img = rows[index].nombre;
            let archivos = rows.map(row => {
                if (row.tipo !== req.params.usr) {
                    return {
                        tipo: row.tipo,
                        nombre: row.nombre,
                        titulo: row.titulo
                    }
                }
            })
            archivos = archivos.filter(archivo => archivo !== undefined);
            return res.json({error: false, usuario: req.params.usr, archivos, img});
        }
    });
})

Router.get("/contenidos",(req,res)=> {
    Pool.query(`SELECT * FROM archivos`,(error,rows,fields)=> {
        if (error) {
            return res.json({error: true, message: error.message});
        }
        const contenidos = [...rows];
        return res.json({contenidos});
    })
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

Router.post("/upload",verificarJWT,(req,res)=> {
    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).redirect("/upload?error=No se subió ningún archivo")
    }
    const archivo = req.files.archivo;
    if (archivo.mimetype.startsWith("image") || !req.files.portada) {
        Pool.query(`INSERT INTO archivos (nombre,tipo,autor,titulo) VALUES ("${archivo.name}","${archivo.mimetype}","${req.usuario}","${req.body.titulo}")`,(error)=> {
            if (error) return res.redirect(`/upload?error=${error.message}`);
            archivo.mv(path.resolve(__dirname,`../public/${req.usuario}/${archivo.mimetype}/${archivo.name}`),(error)=> {
                if (error && error.message.startsWith("ENOENT: no such file or directory")) {
                    const [tipoDeArchivo,extensión] = archivo.mimetype.split("/");
                    verificarRutas(req.usuario,tipoDeArchivo,extensión);
                    archivo.mv(path.resolve(__dirname,`../public/${req.usuario}/${archivo.mimetype}/${archivo.name}`),(error)=> {
                        if (error) {
                            console.log(error);
                            return res.redirect(`/upload?error=${error.message}`);
                        }
                        return res.redirect("/upload?msg=Se subió el archivo")
                    })
                }
                else if (error) {
                    console.log(error.message)
                    Pool.query(`DELETE FROM archivos WHERE titulo = "${req.body.titulo}"`,(error)=> {
                        if (error) {
                            console.log(error);
                        }
                    });
                    return res.redirect(`/upload?error=${error.message}`);
                }
                return res.redirect("/upload?msg=Se subió el archivo");
            })
        })
    }
    else if (archivo.mimetype.startsWith("audio")) {
        const portada = req.files.portada;

        Pool.query(`INSERT INTO archivos (nombre,tipo,autor,portada,titulo) VALUES ("${archivo.name}","${archivo.mimetype}","${req.usuario}","/${req.usuario}/${portada.mimetype}/${portada.name}","${req.body.titulo}")`,(error)=> {
            if (error) return res.redirect(`/upload?error=${error.message}`);
            archivo.mv(path.resolve(__dirname,`../public/${req.usuario}/${archivo.mimetype}/${archivo.name}`),(error)=> {
                if (error && error.message.startsWith("ENOENT: no such file or directory")) {
                    const [tipoDeArchivo,extensión] = archivo.mimetype.split("/");
                    verificarRutas(req.usuario,tipoDeArchivo,extensión);
                    archivo.mv(path.resolve(__dirname,`../public/${req.usuario}/${archivo.mimetype}/${archivo.name}`),(error)=> {
                        if (error) {
                            console.log(error);
                            return res.redirect(`/upload?error=${error.message}`);
                        }
                        portada.mv(path.resolve(__dirname,`../public/${req.usuario}/${portada.mimetype}/${portada.name}`),(error)=> {
                            if (error && error.message.startsWith("ENOENT: no such file or directory")) {
                                const [tipo,ext] = portada.mimetype.split("/");
                                verificarRutas(req.usuario,tipo,ext);
                                portada.mv(path.resolve(__dirname,`../public/${req.usuario}/${portada.mimetype}/${portada.name}`),(error)=> {
                                    if (error) {
                                        console.log(error);
                                        res.redirect(`/upload?error=${error.message}`);
                                    }
                                    return res.redirect("/upload?msg=Se subió el archivo")
                                })
                            }
                            else if (error) {
                                console.log(error.message)
                                return Pool.query(`DELETE FROM archivos WHERE titulo = "${req.body.titulo}"`,(error)=> {
                                    if (error) {
                                        console.log(error);
                                    }
                                });
                                return res.redirect(`/upload?error=${error.message}`);
                            }
                            return res.redirect("/upload?msg=Se subió el archivo")
                        })
                    })
                }
                else if (error) {
                    console.log(error.message)
                    Pool.query(`DELETE FROM archivos WHERE titulo = "${req.body.titulo}"`,(error)=> {
                        if (error) {
                            console.log(error);
                        }
                    });
                    return res.redirect(`/upload?error=${error.message}`);
                }
                portada.mv(path.resolve(__dirname,`../public/${req.usuario}/${portada.mimetype}/${portada.name}`),(error)=> {
                    if (error && error.message.startsWith("ENOENT: no such file or directory")) {
                        const [tipo,ext] = portada.mimetype.split("/");
                        verificarRutas(req.usuario,tipo,ext);
                        portada.mv(path.resolve(__dirname,`../public/${req.usuario}/${portada.mimetype}/${portada.name}`),(error)=> {
                            if (error) {
                                console.log(error);
                                res.redirect(`/upload?error=${error.message}`);
                            }
                            return res.redirect("/upload?msg=Se subió el archivo")
                        })
                    }
                    else if (error) {
                        console.log(error.message)
                        Pool.query(`DELETE FROM archivos WHERE titulo = "${req.body.titulo}"`,(error)=> {
                            if (error) {
                                console.log(error);
                            }
                        });
                        return res.redirect(`/upload?error=${error.message}`);
                    }
                    return res.redirect("/upload?msg=Se subió el archivo")
                })
            })
        })
    }
})

module.exports = Router;