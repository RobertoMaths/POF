import React, {useState, useEffect} from "react";
import {useLocation} from "react-router-dom";

const UploadPage = ({setPathname})=> {
    const [tipo,setTipo] = useState("");
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
            <form action="/upload" method="POST" encType="multipart/form-data">
                <fieldset>
                    <legend>Contenido</legend>
                    <input type="file" name="archivo" accept="image/*,audio/mpeg" onChange={(e)=> {
                        setTipo(e.currentTarget.files[0].type.split("/")[0])
                    }}></input>
                </fieldset>
                {tipo === "audio" && <fieldset>
                    <legend>Portada</legend>
                    <input type="file" name="portada" accept="image/*"></input>
                </fieldset>}
                <fieldset>
                    <legend>Título</legend>
                    <input type="text" name="titulo" required maxLength="50"></input>
                </fieldset>
                <button type="submit">Subir</button>
            </form>
        </div>
        {error && <p>Hubo un error: {errorMsg}</p>}
        {msg && <p>{msg}</p>}
    </main>
};

export default UploadPage;