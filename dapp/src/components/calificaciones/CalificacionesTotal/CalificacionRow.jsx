import { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import { StateContext } from "../../StateContext.mjs";

const CalificacionRow = ({ alumnoIndex }) => {

    const { asignatura, txEmitter } = useContext(StateContext);

    const [alumnoName, setAlumnoName] = useState(null);
    const [notas, setNotas] = useState([]);
    const [rows, setRows] = useState([]);
    const [forceReload, setForceReload] = useState(0);
    const [auxBool, setAuxBool] = useState(false);
    const [datos, setDatos] = useState([]);

    // Este efecto escucha los eventos "tx" de txEmitter que informan de que se ha
    // recibido una transaccion que afecta al contrato.
    // Si ocurre eso, se fuerza el renderizado del componente cambiando el valor de estado forceReload.
    // El siguiente efecto, que es el obtiene los valores que pinta este componente, depende de forceReload.
    useEffect(() => {
        // Vigilar los eventos tx de txEmitter.
        const eh = (tx) => { setForceReload(fr => fr + 1); };  // Cambiar el valor fuerza el repintado del componente.
        txEmitter.on("tx", eh);

        // Limpiar la subscripcion a eventEmitter.
        return () => { txEmitter.off("tx", eh); }
    }, []);



    const obtenerDireccionProfesor = async () => {
        try {
            const aux = await asignatura.getProfesores()
            console.log("array de profes", aux)
            return aux;
        } catch (error) {
            console.error("Error al obtener la dirección del coordinador:", error);
            return null;
        }
    };

    const verificarSiEsProfesor = async () => {
        try {
            const profes = await obtenerDireccionProfesor();
            const accounts = await window.web3.eth.getAccounts();
            const direccionCuentaActual = accounts[0];
            for (var i = 0; i < profes.length; i++) {
                if (profes[i].toLowerCase() === direccionCuentaActual.toLowerCase()) {
                    return true;
                }
            }
            return false;
        } catch (error) {
            console.error("Error al verificar si es profesor:", error);
            return false;
        }
    };

    // [] -> Sin dependencias.
    // Solo se llama a useEffect al renderizar la primera vez que se renderiza el componente.
    useEffect(() => {
        (async () => {
            try {
                const accounts = await window.web3.eth.getAccounts();
                const account = accounts[0];
                console.log("account", account)
                const datos = await asignatura.datosAlumno(account);
                setDatos(datos);
                if (datos[0] === '') {
                    setAuxBool(true);
                
                
                    // Obtener la direccion del alumno:
                    const addr = await asignatura.matriculas(alumnoIndex);

                    // Obtener el nombre del alumno:
                    const alumnoName = (await asignatura.datosAlumno(addr))?.nombre;
                    setAlumnoName(alumnoName);

                    // Obtener el numero de evaluaciones:
                    const ne = await asignatura.evaluacionesLength();

                    const esProfesor = await verificarSiEsProfesor();
                    let notas = [];
                    for (let ei = 0; ei < ne; ei++) {
                        const nota = await asignatura.calificaciones(addr, ei);
                        console.log(nota)
                        const calificacion = nota?.tipo.toString() === "0" ? "" :
                            nota?.tipo.toString() === "1" ? "N.P." :
                                nota?.tipo.toString() === "2" ? (nota?.calificacion / 100).toFixed(2) : "";

                        notas.push(
                            <td key={"p2-" + alumnoIndex + "-" + ei}>
                                {calificacion}
                                {esProfesor && <Link to={"/calificar/" + alumnoIndex + "/" + ei}>Editar</Link>}
                            </td>
                        );
                    }
                    setNotas(notas);
               } else {
                setAuxBool(false);
                console.log(datos[0]);
                ///tenemos el addr al tener la sesion iniciada
                // el nombre del alumno lo tenemos en datos[0]
                const ne = await asignatura.evaluacionesLength();
                let notas = [];
                    for (let ei = 0; ei < ne; ei++) {
                        const nota = await asignatura.calificaciones(account, ei);
                        const calificacion =    nota?.tipo.toString() === "0" ? "" :
                                                nota?.tipo.toString() === "1" ? "N.P." :
                                                nota?.tipo.toString() === "2" ? (nota?.calificacion / 100).toFixed(2) : "";
                        
                        console.log("califiacion", calificacion)
                        notas.push(
                            <td key={"p2-" + 0 + "-"+ ei}>
                                {calificacion}
                            </td>  
                        )
                        console.log("notas", notas)
                        console.log(notas   [0].props.children)
                    } 
                    setNotas(notas);
            }} catch (e) {
                console.log(e);
            }
            })();
    }, [forceReload]);   // Si cambia el valor de forceReload, se vuelven a obtener los datos a pintar.

    return(
        <>
            {auxBool ? (
            <tr key={"d" + alumnoIndex}>
                <th>A<sub>{alumnoIndex}</sub></th>
                <td>{alumnoName}</td>
                {notas}
            </tr>
             ) : <tr key={"d" + 0}>
             <th>A<sub>0</sub></th>
             <td>{datos[0]}</td>
             {notas}
         </tr>}
        </>
    );
    
};

export default CalificacionRow;
