
import {useState, useEffect, useContext} from "react";

import {StateContext} from "../../StateContext.mjs";

import EvaluacionRow from "./EvaluacionRow.jsx";


const EvaluacionesBody = () => {

    const {asignatura} = useContext(StateContext);

    const [evaluacionesLength, setEvaluacionesLength] = useState(0);

    useEffect(() => {
        console.log("Obtener el numero de evaluaciones.");
        (async () => {
            try {
                const ne = await asignatura.evaluacionesLength();
                setEvaluacionesLength(ne.toNumber());
            } catch (e) {
                console.log(e);
            }
        })();
    }, []);   // [] -> Sin dependencias. Solo se llama a useEffect una vez.

    let rows = [];
    for (let i = 0; i < evaluacionesLength; i++) {
        rows.push(<EvaluacionRow key={i} evaluacionIndex={i}/>);
    }
    return <tbody>{rows}</tbody>;
};

export default EvaluacionesBody;
