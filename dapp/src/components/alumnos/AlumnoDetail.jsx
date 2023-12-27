
import {useState, useEffect, useContext} from "react";
import {useParams, Link} from "react-router-dom";

import {StateContext} from "../StateContext.mjs";


const AlumnoDetail = () => {

    const {asignatura} = useContext(StateContext);

    let {addr} = useParams();

    const [alumnoDatos, setAlumnoDatos] = useState(null);

    useEffect(() => {
        (async () => {
            try {
                console.log("Obtener los datos del alumno.");
                const datos = (await asignatura.datosAlumno(addr));
                setAlumnoDatos(datos);
            } catch (e) {
                console.log(e);
            }
        })();
    }, []);   // [] -> Sin dependencias. Solo se llama a useEffect una vez.

    return <>
        <header className="AppAlumno">
            <h2>Alumno Info</h2>
        </header>
        <ul>
            <li><b>Nombre:</b> {alumnoDatos?.nombre ?? "Desconocido"}</li>
            <li><b>Email:</b> {alumnoDatos?.email ?? "Desconocido"}</li>
            <li><b>Address:</b> {addr}</li>
        </ul>
        <Link to="/alumnos">Volver</Link>
    </>

    /*
    let {addr} = useParams();

    const datos = useCacheCall("Asignatura", "datosAlumno", addr);

    return <>
        <header className="AppAlumno">
            <h2>Alumno Info</h2>
        </header>
        <ul>
            <li><b>Nombre:</b> {datos?.nombre ?? "Desconocido"}</li>
            <li><b>Email:</b> {datos?.email ?? "Desconocido"}</li>
            <li><b>Address:</b> {addr}</li>
        </ul>
        <Link to="/alumnos">Volver</Link>
    </>

     */
};

export default AlumnoDetail;