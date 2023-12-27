import {useState, useContext, useEffect} from "react";

import {Link} from "react-router-dom";

import {StateContext} from "../StateContext.mjs";

import {useParams} from "react-router-dom";

import SoyProfesor from "../roles/SoyProfesor.jsx";


const Calificar = () => {

    const {asignatura} = useContext(StateContext);


    let {alumnoIndex, indexEval} = useParams();
    // Conservar los valores metidos en el formulario
    let [alumnoAddr, setAlumnoAddr] = useState("");
    let [tipo, setTipo] = useState("");
    let [calificacion, setCalificacion] = useState("");
    let [evaluacion, setEvaluacion] = useState(indexEval);

    const [result, setResult] = useState("");

    useEffect(() => {

        (async () => {
            const addr = await asignatura.matriculas(alumnoIndex);
            setAlumnoAddr(addr);
        }
        );
    }, []);

    return (<article className="AppMisDatos">
        <SoyProfesor>
            <h3>Calificar</h3>

            <form>
                <p>
                    Dirección del Alumno:  &nbsp;
                    <input key="alumno" type="text" name="alumno" value={alumnoAddr} placeholder="Dirección del alumno"
                           onChange={ev => setAlumnoAddr(ev.target.value)}/>
                </p>
                <p>
                    Evaluación:  &nbsp;
                    <input key="evaluacion" type="number" name="evaluacion" value={evaluacion} placeholder="Evaluacion"
                           onChange={ev => setEvaluacion(ev.target.value)}/>
                </p>
                <p>
                    Tipo: (0=Pendiente 1=N.P. 2=Normal):  &nbsp;
                    <input key="tipo" type="number" name="tipo" value={tipo} placeholder="Tipo de nota"
                           onChange={ev => setTipo(ev.target.value)}/>
                </p>
                
                <p>
                    Nota (x100):  &nbsp;
                    <input key="calificacion" type="number" name="calificacion" value={calificacion} placeholder="Nota"
                           onChange={ev => setCalificacion(ev.target.value)}/>
                </p>


                <button key="submit" className="pure-button" type="button"
                        onClick={async ev => {
                            ev.preventDefault();

                            const accounts = await window.web3.eth.getAccounts();
                            const account = accounts[0];
                            if (!account) { throw new Error('No se puede acceder a las cuentas de usuario.'); }

                            setResult('Enviando petición.');

                            const r = await asignatura.califica(alumnoAddr, evaluacion, tipo, calificacion, {from: account});
                            if (r.receipt.status === true) { setResult('La transacción fue exitosa.');
                            } else if (r.receipt.status === false) { setResult('La transacción falló.');
                            } else { setResult('La transacción está pendiente.');
                            }

                        }}>Calificar</button>

                <p> Último estado = {result}</p>
            </form>
            <Link to={"/calificaciones"}>  Volver</Link>
        </SoyProfesor>
    </article>);
};

export default Calificar;
