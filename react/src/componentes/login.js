import React, {useState} from "react";
import {useNavigate} from "react-router-dom";

const LoginPage = ()=> {
    const [usuario,setUsuario] = useState("");
    const [contraseña,setContraseña] = useState("");
    const [error,setError] = useState(false);
    const [mensaje,setMensaje] = useState("");
    const navigate = useNavigate();

    const IniciarSesión = async (e)=> {
        e.preventDefault();
        try {
            const respuesta = await fetch("/login",{
                method: "POST",
                body: JSON.stringify({
                    usuario,
                    contraseña
                }),
                headers: {
                    "Content-Type": "application/json"
                }
            })
            const objeto = await respuesta.json();
            if (!objeto.error) {
                setError(false);
                navigate("/perfil");
            }
            setError(true);
            setMensaje(objeto.message);
        }
        catch(e) {
            console.log(e);
            setError(true);
            setMensaje(e.message);
        }
    };

    return <main className="login-main">
        <h1>Inicia Sesión</h1>
        <form onSubmit={IniciarSesión}>
            <fieldset>
                <legend>Usuario</legend>
                <input type="text" name="usuario" onChange={(e)=> {setUsuario(e.currentTarget.value)}}></input>
            </fieldset>
            <fieldset>
                <legend>Contraseña</legend>
                <input type="password" name="contraseña" onChange={(e)=> {setContraseña(e.currentTarget.value)}}></input>
            </fieldset>
            <button type="submit">Enviar</button>
        </form>
        {error && <p>Hubo un error: {mensaje}</p>}
    </main>
}

export default LoginPage