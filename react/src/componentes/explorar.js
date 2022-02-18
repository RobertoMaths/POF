import React, {useState, useEffect} from "react";
import {Link} from "react-router-dom";

const Explorar = ({setPathname})=> {
    const [contenidos,setContenidos] = useState([]);
    const [portada,setPortada] = useState("/5571.jpg");

    const obtenerPortada = async (url)=> {
        const respuesta = await fetch(url);
        const port = await respuesta.text();
        setPortada(port)
    }
    
    useEffect(()=> setPathname("/explorar"),[])
    useEffect(async ()=> {
        const respuesta = await fetch("/contenidos");
        const objeto = await respuesta.json();
        setContenidos(objeto.contenidos);
    },[])
    
    return <main className="explorar-main">
        <h1>Explorar</h1>
        {
            contenidos && contenidos[0]
            ?
            <div>
                {
                    contenidos.map(archivo => {
                        console.log(contenidos, archivo)
                        const url = `/${archivo.autor}/${archivo.tipo}/${archivo.nombre}`;
                        const [tipo,ext] = archivo.tipo.split("/");
                        if (archivo.tipo === "image/jpeg" || archivo.tipo === "image/png") {
                            return <Link to={url+"/show"+`?titulo=${archivo.titulo}&tipo=${tipo}&ext=${ext}`}>
                                <img src={url}></img>
                                <p>{archivo.titulo}</p>
                            </Link>
                        }
                        else if (archivo.tipo === "audio/mpeg") {
                            obtenerPortada(`${url}/portada`)
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
    </main>
};

export default Explorar;