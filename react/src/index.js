import React, {useState, useEffect} from "react";
import ReactDom from "react-dom";
import {BrowserRouter as Router, Redirect, Route, Routes} from "react-router-dom";
import HomePage from "./componentes/homepage";
import Navegación from "./componentes/navegación";
import Footer from "./componentes/footer";
import LoginPage from "./componentes/login";
import Registro from "./componentes/registro";
import Explorar from "./componentes/explorar";
import Perfil from "./componentes/perfil";
import UploadPage from "./componentes/upload";
import ShowPage from "./componentes/show";
import PerfilDeUsuario from "./componentes/perfilDeUsuario";

const WebPage = ()=> {
    const [autorizado,setAutorizado] = useState(false);
    const [pathname,setPathname] = useState(window.location.pathname);

    useEffect(async ()=> {
        const enSesión = await fetch("/autorizacion");
        const autorización = await enSesión.text();
        if (autorización === "1") {
            setAutorizado(true);
        }
        else {
            setAutorizado(false)
        }
    },[pathname]);

    return <Router>
        <Navegación autorizado={autorizado}/>
        <Routes>
            <Route path="/" element={<HomePage setPathname={setPathname}/>}/>
            <Route path="/login" element={<LoginPage setPathname={setPathname}/>}/>
            <Route path="/registro" element={<Registro setPathname={setPathname}/>}/>
            <Route path="/explorar" element={<Explorar setPathname={setPathname}/>}/>
            <Route path="/perfil" element={<Perfil setPathname={setPathname}/>}/>
            <Route path="/upload" element={<UploadPage setPathname={setPathname}/>}/>
            <Route path="/:usr/:tipo/:ext/:nombre/show" element={<ShowPage setPathname={setPathname}/>}/>
            <Route path="/usuario/:usr" element={<PerfilDeUsuario setPathname={setPathname}/>}/>
        </Routes>
    </Router>
};

ReactDom.render(<WebPage/>,document.getElementById("root"));