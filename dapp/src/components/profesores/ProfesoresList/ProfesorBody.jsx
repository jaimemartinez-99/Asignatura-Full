
import {useState, useEffect, useContext} from "react";

import {StateContext} from "../../StateContext.mjs";

import ProfesorRow from "./ProfesorRow.jsx";


const ProfesorBody = () => {

    const {asignatura} = useContext(StateContext);

    const [direcciones, setDirecciones] = useState([]);
    const [datos, setDatos] = useState([]);

    useEffect(() => {
        console.log("Obtener el numero de matriculaciones.");
        (async () => {
            try {
                const addr1 = await asignatura.profesores(0);
                const addr2 = await asignatura.profesores(1);
                const addr = [addr1, addr2];
                const datosArray = [];
                for (let i = 0; i < addr.length; i++) {
                    const datosProfesor = await asignatura.datosProfesor(addr[i]);
                    datosArray.push({ datos: datosProfesor, direccion: addr[i] });
                }
                setDirecciones(addr);
                setDatos(datosArray);
            } catch (e) {
                console.log(e);
            }
        })();
    }, []);   // [] -> Sin dependencias. Solo se llama a useEffect una vez.

    let rows = [];
    for (let i = 0; i < datos.length-1; i++) {
        rows.push(<ProfesorRow key={"ab-"+i} profesorIndex={i}/>);
    }

    return <tbody>{rows}</tbody>;
};

export default ProfesorBody;
