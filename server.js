const express = require("express");
const fileUpload = require("express-fileupload");
const MainRouter = require("./rutas/main");
const server = express();
require("./config/database");

// Configuración

server.set("port", 3000);

// Middlewares

server.use(express.static(__dirname + "/public"));
server.use(express.json());
server.use(express.urlencoded({
    extended: true
}));

// Rutas

server.use(MainRouter);

// Server escuchando

server.listen(server.get("port"), ()=> {
    console.log(`Server en puerto: ${server.get("port")}`);
})