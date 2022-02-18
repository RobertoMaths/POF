import React, {useState,useEffect} from "react";
import {useParams, Link, useLocation} from "react-router-dom";

const ShowPage = ({setPathname})=> {
    const params = useParams();
    const [portada,setPortada] = useState("/5571.jpg");
    const query = new URLSearchParams(useLocation().search);

    const obtenerPortada = async (url)=> {
        const respuesta = await fetch(url);
        const port = await respuesta.text();
        setPortada(port)
    }

    useEffect(()=> setPathname("/"),[]);
    useEffect(()=> obtenerPortada(`/${params.usr}/${params.tipo}/${params.ext}/${params.nombre}/portada`),[]);

    return <main className="show-main">
        <h1>{query.get("titulo")}</h1>
        <Link to={"/usuario/" + params.usr}><h3>{params.usr}</h3></Link>
        {query.get("tipo") === "audio"
        ?
        <div>
            <img src={portada}></img>
            <audio controls>
                <source src={`/${params.usr}/${params.tipo}/${params.ext}/${params.nombre}`} type="audio/mpeg"></source>
            </audio>
        </div>
        :
        <img src={`/${params.usr}/${params.tipo}/${params.ext}/${params.nombre}`}></img>
        }
    </main>
};

export default ShowPage;