import React, { useState, useEffect } from "react";

const Perfil = ()=> {
    const [usuario,setUsuario] = useState("");

    useEffect(async ()=> {
        const respuesta = await fetch("/usuario");
        const info = await respuesta.json();
        setUsuario = info.usuario;
        console.log(info);
    })

    return <main>
        <h1>{usuario}</h1>
    </main>
};

export default Perfil;