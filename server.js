const express = require("express");
const server = express();

// Configuración

server.set("port", 3000);

// Rutas

server.get("/", (req, res)=> {
    res.json({
        server: "Server funcionando"
    })
})

// Server escuchando

server.listen(server.get("port"), ()=> console.log("Server en puerto: ", server.get("port")))