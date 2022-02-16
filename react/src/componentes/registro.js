import React, {useState} from "react";
import {useNavigate} from "react-router-dom";

const Registro = ()=> {
    const [usuario,setUsuario] = useState("");
    const [correo,setCorreo] = useState("");
    const [contraseña,setContraseña] = useState("");
    const [rContraseña,setRContraseña] = useState("");
    const [incoincidencia,setIncoincidencia] = useState(false);
    const [error,setError] = useState(false);
    const [mensaje,setMensaje] = useState("");
    const navigate = useNavigate();

    const Registrarse = async (e)=> {
        e.preventDefault();
        if (rContraseña !== contraseña) {
            setIncoincidencia(true);
            return;
        }
        setIncoincidencia(false);
        try {
            const respuesta = await fetch("/registro",{
                method: "POST",
                body: JSON.stringify({
                    usuario,
                    correo,
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

    return <main className="registro-main">
        <h1>Registro</h1>
        <form onSubmit={Registrarse}>
            <fieldset>
                <legend>Usuario</legend>
                <input type="text" name="usuario" maxLength="40" onChange={(e)=> {setUsuario(e.currentTarget.value)}}></input>
            </fieldset>
            <fieldset>
                <legend>Correo Electrónico</legend>
                <input type="email" name="contraseña" maxLength="100" onChange={(e)=> {setCorreo(e.currentTarget.value)}}></input>
            </fieldset>
            <fieldset>
                <legend>Contraseña</legend>
                <input type="password" name="contraseña" maxLength="50" onChange={(e)=> {setContraseña(e.currentTarget.value)}}></input>
            </fieldset>
            <fieldset>
                <legend>Repite la contraseña</legend>
                <input type="password" name="contraseña" maxLength="50" onChange={(e)=> {setRContraseña(e.currentTarget.value)}}></input>
            </fieldset>
            <button type="submit">Enviar</button>
        </form>
        {incoincidencia && <p>Las contraseñas no coinciden</p>}
        {error && <p>Hubo un error: {mensaje}</p>}
    </main>
};

export default Registro;