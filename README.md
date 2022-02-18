# POF

---Español---

Este es un proyecto de github creado para ser presentado como evidencia en la competencia de Rise. La idea, era una página web con todo tipo de contenidos, pero solo puede almacenar audios e imágenes, por el momento. Se usa React para el frontend y para el backend, NodeJS, junto con ExpressJS. Para autenticar a los usuarios, se hace uso de Json Web Tokens. Para la base de datos de SQL, se hace uso de la siguiente estructura:

CREATE TABLE usuarios (
    nombre VARCHAR(40) PRIMARY KEY UNIQUE NOT NULL,
    contraseña VARCHAR(70) NOT NULL,
    imagen VARCHAR(100) NOT NULL
);

CREATE TABLE archivos (
    titulo VARCHAR(40) PRIMARY KEY UNIQUE NOT NULL,
    tipo VARCHAR(30) NOT NULL,
    nombre VARCHAR(40) NOT NULL,
    portada VARCHAR(40) DEFAULT "/5571.jpg",
    autor VARCHAR(40) NOT NULL
);

Para iniciar el proyecto, debe utilizar el comando "npm start", teniendo instalado NodeJS.


---English---

This is a proyect of github created for Rise Challenge. The idea, was a webpage with all type of contents, however, it can only store audios and images, for the moment. React is used in the frontend, meanwhile, NodeJS is used in the backend with ExpressJS. For authenticating the users, Json Web Tokens are used. For SQL database:

CREATE TABLE usuarios (
    nombre VARCHAR(40) PRIMARY KEY UNIQUE NOT NULL,
    contraseña VARCHAR(70) NOT NULL,
    imagen VARCHAR(100) NOT NULL
);

CREATE TABLE archivos (
    titulo VARCHAR(40) PRIMARY KEY UNIQUE NOT NULL,
    tipo VARCHAR(30) NOT NULL,
    nombre VARCHAR(40) NOT NULL,
    portada VARCHAR(40) DEFAULT "/5571.jpg",
    autor VARCHAR(40) NOT NULL
);

To start the proyect, use "npm start" command, having NodeJS installed.