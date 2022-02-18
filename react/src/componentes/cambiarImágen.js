import React, {useState, useEffect} from "react";
import {useLocation} from "react-router-dom";

const CambiarImágen = ({setPathname})=> {
    const [error,setError] = useState(false);
    const [errorMsg,setErrorMsg] = useState("");
    const [msg,setMsg] = useState("");
    const query = new URLSearchParams(useLocation().search);

    useEffect(()=> setPathname("/upload"),[])
    useEffect(()=> {
        if (query.get("error")) {
            setError(true);
            setErrorMsg(query.get("error"));
        }
        if (query.get("msg")) {
            setMsg(query.get("msg"));
        }
    },[])

    return <main className="upload-main">
        <h1>Sube Contenido</h1>
        <div>
            <form action="/cambiarImagen" method="POST" encType="multipart/form-data">
                <fieldset>
                    <legend>Imágen</legend>
                    <input type="file" name="archivo" accept="image/*,audio/mpeg"></input>
                </fieldset>
                <button type="submit">Subir</button>
            </form>
        </div>
        {error && <p>Hubo un error: {errorMsg}</p>}
        {msg && <p>{msg}</p>}
    </main>
};

export default CambiarImágen;