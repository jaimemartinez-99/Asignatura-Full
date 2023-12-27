import {useState, useEffect, useContext} from "react";

import {StateContext} from "../StateContext.mjs";

const MisNotas = () =>
    <section className="AppMisNotas">
        <h3>Mis Notas</h3>
        <table>
            <MisNotasHead/>
            <MisNotasBody/>
        </table>
    </section>;


const MisNotasHead = () =>
    <thead>
    <tr>
        <th>Evaluación</th>
        <th>Nota</th>
    </tr>
    </thead>;


const MisNotasBody = () => {

    const {asignatura, txEmitter} = useContext(StateContext);

    const [rows, setRows] = useState([]);
    const [forceReload, setForceReload] = useState(0);

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
    }, []);   // [] -> Sin dependencias.
              // Solo se llama a useEffect al renderizar la primera vez que se renderiza el componente.

    useEffect(() => {
        (async () => {
            try {
                const accounts = await window.web3.eth.getAccounts();

                const rows = [];

                const ne = (await asignatura.evaluacionesLength()).toNumber();
                for (let ei = 0; ei < ne; ei++) {
                    const ev = await asignatura.evaluaciones(ei);
                    const nota = await asignatura.miNota(ei, {from: accounts[0]});
                    rows.push(
                        <tr key={ei}>
                            <td>{ev.nombre}</td>
                            <td>
                                {nota?.tipo.toString() === "0" ? "" : ""}
                                {nota?.tipo.toString() === "1" ? "N.P." : ""}
                                {nota?.tipo.toString() === "2" ? (nota?.calificacion / 100).toFixed(2) : ""}
                            </td>
                        </tr>);
                }
                setRows(rows)
            } catch (e) {
                console.log(e);
            }
        })();
    }, [forceReload]);   // Si cambia el valor de forceRenderState, se vuelven a obtener los datos a pintar.

    return <tbody>{rows}</tbody>;
};

export default MisNotas;
