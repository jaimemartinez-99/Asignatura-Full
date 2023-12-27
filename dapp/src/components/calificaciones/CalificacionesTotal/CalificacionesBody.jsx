import {useState, useEffect, useContext} from "react";

import {StateContext} from "../../StateContext.mjs";

import CalificacionRow from "./CalificacionRow.jsx";


const CalificacionesBody = () => {

    const {asignatura} = useContext(StateContext);

    const [matriculasLength, setMatriculasLength] = useState(0);
    const [aux, setAux] = useState(false);
    const [datos, setDatos] = useState([]);

    useEffect(() => {
        // Obtener el numero de matriculaciones:
        (async () => {
            try {
                const ml = await asignatura.matriculasLength();
                setMatriculasLength(ml.toNumber());
                const accounts = await window.web3.eth.getAccounts();
                const account = accounts[0];
                console.log("account", account)
                const datos = await asignatura.datosAlumno(account);
                console.log("datos", datos)
                setDatos(datos);
                if (datos[0] === '') {
                    setAux(false);
                } else{
                    setAux(true);
                }
            } catch (e) {
                console.log(e);
            }
        })();
    }, []);   // [] -> Sin dependencias. Solo se llama a useEffect una vez.

    let rows = [];
    console.log(aux)
    if (!aux){
    for (let i = 0; i < matriculasLength; i++) {
       rows.push(<CalificacionRow key={i} alumnoIndex={i}/>);
    } 
} else {
    rows.push(<CalificacionRow key={1} alumnoIndex={1}/>);
}

    return <tbody>{rows}</tbody>;
};

export default CalificacionesBody;
