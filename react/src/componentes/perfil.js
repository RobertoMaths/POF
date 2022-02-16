import React, { useState, useEffect } from "react";

const Perfil = ()=> {
    const [usuario,setUsuario] = useState("");
    const [error,setError] = useState(false);
    const [mensaje, setMensaje] = useState("");
    const [contenido,setContenido] = useState([]);

    useEffect(async ()=> {
        try {
            const respuesta = await fetch("/usuario");
            const info = await respuesta.json();
            if (info.error) {
                setError(true);
                setMensaje(info.message);
            }
            setUsuario(info.usuario);
            setContenido(info.archivos)
        }
        catch(e) {
            console.log(e);
        }
    })

    return <main className="perfil-main">
        <h1>{usuario}</h1>
        <h2>Contenido</h2>
        {
            contenido
            ?
            contenido.map(archivo => {
                if (archivo.tipo === "jpg/img" || archivo.tipo === "png/img") {
                    const url = `/${usuario}/${archivo.tipo}/${archivo.nombre}`;
                    return <img src={url}></img>
                }
            })
            :
            <h3>Sin contenido</h3>
        }
        {error && <p>Hubo un error: {mensaje}</p>}
    </main>
};

export default Perfil;