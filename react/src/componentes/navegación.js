import React, {useState,useEffect} from "react";
import {Link} from "react-router-dom";

const Navegación = ({autorizado})=> {
    return <nav>
        <Link to="/"><h2>POF</h2></Link>
        {autorizado
        ?
        <ul className="nav-lista">
        <li className="nav-lista__item"><Link to="/">Home</Link></li>
        <li className="nav-lista__item"><Link to="/explorar">Explorar</Link></li>
        <li className="nav-lista__item"><Link to="/perfil">Perfil</Link></li>
        <li className="nav-lista__item registro"><a href="/logout">Cerrar sesión</a></li>
        </ul>
        :
        <ul className="nav-lista">
        <li className="nav-lista__item"><Link to="/">Home</Link></li>
        <li className="nav-lista__item"><Link to="/explorar">Explorar</Link></li>
        <li className="nav-lista__item"><Link to="/login">Iniciar sesión</Link></li>
        <li className="nav-lista__item registro"><Link to="/registro">Registrarse</Link></li>
        </ul>
        }
    </nav>
};

export default Navegación;