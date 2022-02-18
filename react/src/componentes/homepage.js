import React, {useEffect} from "react";
import {Link} from "react-router-dom";

const Main = ()=> {
    return <main className="homepage-main">
        <div>
            <h1>POF</h1>
            <p>Disfruta de cualquier tipo de experiencia<br></br><br></br>POF te ofrece juegos, imagenes, podcast, artículos, etc.<br></br><br></br>Pero además, también te ofrece la oportunidad de participar en la creación de estos contenidos<br></br><br></br>Te brindamos apoyo para comenzar a crear y te recompensamos por el contenido</p>
            <div>
                <Link to="/explorar"><button>Explora</button></Link>
                <Link to="/registro"><button>Crea</button></Link>
            </div>
        </div>
        <img src="https://cdn2.myminifactory.com/assets/object-assets/5f64c8a499d12/images/720X720-charmander-2.jpg"></img>
    </main>
}

const HomePage = ({setPathname})=> {
    useEffect(()=> setPathname("/"),[])
    return <Main></Main>
};

export default HomePage;