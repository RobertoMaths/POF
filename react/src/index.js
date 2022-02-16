import React, {useState,useEffect} from "react";
import ReactDom from "react-dom";
import {BrowserRouter as Router, Redirect, Route, Routes} from "react-router-dom";
import HomePage from "./componentes/homepage";
import Navegación from "./componentes/navegación";
import Footer from "./componentes/footer";
import LoginPage from "./componentes/login";
import Registro from "./componentes/registro";
import Explorar from "./componentes/explorar";
import Perfil from "./componentes/perfil";

const WebPage = ()=> {
    const [autorizado,setAutorizado] = useState(false);

    useEffect(async ()=> {
        const enSesión = await fetch("/autorización");
        const autorización = enSesión.text();
        if (autorización === "1") {
            setAutorizado(true);
        }
        else {
            setAutorizado(false)
        }
    })
    return <Router>
        <Navegación autorizado={autorizado}/>
        <Routes>
            <Route path="/" element={<HomePage/>}/>
            <Route path="/login" element={<LoginPage/>}/>
            <Route path="/registro" element={<Registro/>}/>
            <Route path="/explorar" element={<Explorar/>}/>
            <Route path="/perfil" element={<Perfil/>}/>
        </Routes>
        <Footer/>
    </Router>
};

ReactDom.render(<WebPage/>,document.getElementById("root"));