import {useState, useEffect, useContext} from "react";

import {StateContext} from "../../StateContext.mjs";

import {Link} from "react-router-dom";

const AlumnoRow = ({alumnoIndex}) => {

    const {asignatura} = useContext(StateContext);

    const [alumnoAddr, setAlumnoAddr] = useState(null);
    const [alumnoDatos, setAlumnoDatos] = useState(null);
    
    useEffect(() => {
        (async () => {
            try {
                console.log("Obtener la direccion del alumno.");
                const addr = await asignatura.matriculas(alumnoIndex);
                setAlumnoAddr(addr.toString());

                console.log("Obtener los datos del alumno.");
                const datos = (await asignatura.datosAlumno(addr));
                setAlumnoDatos(datos);

            } catch (e) {
                console.log(e);
            }
        })();
    }, []);   // [] -> Sin dependencias. Solo se llama a useEffect una vez.
        return (
            <tr key={"ALU-" + alumnoIndex}>
              <th>A<sub>{alumnoIndex}</sub></th>
              <td>{alumnoDatos?.nombre}</td>
              <td>{alumnoDatos?.email}</td>
              <td>{alumnoDatos?.dni}</td>
              <td><Link to={`/alumnos/${alumnoAddr}`}>Info</Link></td>
            </tr>
        );

};

export default AlumnoRow;
