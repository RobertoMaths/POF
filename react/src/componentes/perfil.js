import React, { useState, useEffect } from "react";
import {Link, useNavigate} from "react-router-dom";

const Perfil = ({setPathname})=> {
    const [usuario,setUsuario] = useState("");
    const [error,setError] = useState(false);
    const [img,setImg] = useState("/img.jpeg");
    const [mensaje, setMensaje] = useState("");
    const [contenido,setContenido] = useState([]);
    const [portada,setPortada] = useState("/5571.jpg");
    const navigate = useNavigate();

    const obtenerPortada = async (url)=> {
        const respuesta = await fetch(url);
        const port = await respuesta.text();
        setPortada(port)
    }

    useEffect(()=> setPathname("/perfil"),[])

    useEffect(async ()=> {
        try {
            const respuesta = await fetch("/usuario");
            const info = await respuesta.json();
            if (info.error) {
                setError(true);
                setMensaje(info.message);
            }
            setUsuario(info.usuario);
            setContenido(info.archivos);
            setImg(info.img);
        }
        catch(e) {
            console.log(e);
        }
    },[navigate])

    return <main className="perfil-main">
        <img src={img}></img>
        <h1>{usuario}</h1>
        <h2>Contenido</h2>
        {
            contenido[0]
            ?
            <div>
                {
                    contenido.map((archivo) => {
                        const url = `/${usuario}/${archivo.tipo}/${archivo.nombre}`;
                        const [tipo,ext] = archivo.tipo.split("/");
                        if (archivo.tipo === "image/jpeg" || archivo.tipo === "image/png") {
                            return <Link to={url+"/show"+`?titulo=${archivo.titulo}&tipo=${tipo}&ext=${ext}`}>
                                <img src={url}></img>
                                <p>{archivo.titulo}</p>
                            </Link>
                        }
                        else if (archivo.tipo === "audio/mpeg") {
                            obtenerPortada(url+"/portada");
                            return <Link to={url+"/show"+`?titulo=${archivo.titulo}&tipo=${tipo}&ext=${ext}`}>
                                <img src={portada}></img>
                                <p>{archivo.titulo}</p>
                            </Link>
                        }
                    })
                }
            </div>
            :
            <h3>Sin contenido</h3>
        }
        {error && <p>Hubo un error: {mensaje}</p>}
        <Link to="/upload"><button>Subir Contenido</button></Link>
    </main>
};

export default Perfil;