import {useState, useEffect, useContext} from "react";

import {StateContext} from "../../StateContext.mjs";

const EvaluacionRow = ({evaluacionIndex}) => {

    const {asignatura} = useContext(StateContext);

    const [evaluacion, setEvaluacion] = useState(null);

    useEffect(() => {
        console.log("Obtener la evaluacion del indice indicado.");
        (async () => {
            try {
                const ev = await asignatura.evaluaciones(evaluacionIndex);
                setEvaluacion(ev);
            } catch (e) {
                console.log(e);
            }
        })();
    }, []);   // [] -> Sin dependencias. Solo se llama a useEffect una vez.

    return <tr key={"EVA-" + evaluacionIndex}>
        <th>E<sub>{evaluacionIndex}</sub></th>
        <td>{evaluacion?.nombre}</td>
        <td>{evaluacion?.fecha ? (new Date(1000 * evaluacion.fecha)).toLocaleString() : ""}</td>
        <td>{evaluacion?.porcentaje.toString()}</td>
        <td>{evaluacion?.minimo.toString()}</td>
    </tr>;
};

export default EvaluacionRow;
