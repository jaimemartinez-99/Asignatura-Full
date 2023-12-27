
import {useState, useEffect, useContext} from "react";
import {useParams, Link} from "react-router-dom";

import {StateContext} from "../StateContext.mjs";


const ProfesorDetail = () => {


   
    const {asignatura} = useContext(StateContext);
    const [datosProfesor, setDatosProfesor] = useState([]);

    let {addr} = useParams();
    console.log("addr: ", addr);


    useEffect(() => {
        (async () => {
            try {
                const datosProfesor = await asignatura.datosProfesor(addr);
                setDatosProfesor(datosProfesor);
                const datosArray = [];
                datosArray.push({ datos: datosProfesor, direccion: addr });
            } catch (e) {
                console.log(e);
            }
        })();
    }, []);   // [] -> Sin dependencias. Solo se llama a useEffect una vez.

    return <>
        <header className="AppAlumno">
            <h2>Profesor Info</h2>
        </header>
        <ul>
            <li><b>Nombre:</b> {datosProfesor}</li>
            <li><b>Address:</b> {addr}</li>
        </ul>
        <Link to="/profesores">Volver</Link>
    </>

};

export default ProfesorDetail;