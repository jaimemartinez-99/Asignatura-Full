import {useState, useEffect, useContext} from "react";

import {StateContext} from "../../StateContext.mjs";

import {Link} from "react-router-dom";

const ProfesorRow = ({ item, index }) => {

    const {asignatura} = useContext(StateContext);

    
    const [direcciones, setDirecciones] = useState([]);
    const [datos, setDatos] = useState([]);
    const [pintar, setPintar] = useState([]);

    useEffect(() => {
        (async () => {
            try {
                const aux = await asignatura.getProfesores()
                const datosArray = [];
                for (let i = 0; i < aux.length; i++) {
                    const datosProfesor = await asignatura.datosProfesor(aux[i]);
                    datosArray.push({ datos: datosProfesor, direccion: aux[i] });
                }
                setDirecciones(aux);
                setDatos(datosArray);
            } catch (e) {
                console.log(e);
            }
        })();
    }, []);
    
    
    // [] -> Sin dependencias. Solo se llama a useEffect una vez.
    return (
        <>
            {datos.map((item, index) => (
                <tr key={"ALU-" + index}>
                    <th>P<sub>{index}</sub></th>
                    <td>{item.datos}</td> 
                    <td>{item.direccion}</td>
                    <td><Link to={`/profesores/${item.direccion}`}>Info</Link></td>
                </tr>
            ))}
        </>
    );

};

export default ProfesorRow;
