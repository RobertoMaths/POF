const express = require("express");
const MainRouter = require("./rutas/main");
const server = express();
require("./config/database");

// Configuración

server.set("port", 3000);

// Middlewares

server.use(express.static(__dirname + "/public"));
server.use(express.json());

// Rutas

server.use(MainRouter);

// Server escuchando

server.listen(server.get("port"), ()=> {
    console.log(`Server en puerto: ${server.get("port")}`);
})