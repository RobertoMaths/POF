const express = require("express");
const path = require("path");
const MainRouter = require("./rutas/main");
const server = express();

// Configuración

server.set("port", 3000);
server.set("views",path.join(__dirname,"vistas"))
server.engine("html",require("ejs").renderFile)
server.set("view engine","ejs")

// Middlewares

server.use(express.static(__dirname + "/public"));
server.use(express.json());

// Rutas

server.use(MainRouter);

// Server escuchando

server.listen(server.get("port"), ()=> {
    console.log(`Server en puerto: ${server.get("port")}`);
})