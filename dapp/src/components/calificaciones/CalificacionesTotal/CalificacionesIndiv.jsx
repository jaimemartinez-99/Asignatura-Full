// CalificacionesIndiv.js

import React, { useState, useEffect } from "react";
import { useContext } from "react";
import { Link, useParams } from "react-router-dom";
import {StateContext} from "../../StateContext.mjs";

const CalificacionesIndiv = () => {

  const {asignatura} = useContext(StateContext);

  // Se define el indice del alumno y el indice de la evaluación
  const { alumnoIndex, indexEval } = useParams();
  const [alumnoAddr, setAlumnoAddr] = useState("");
  const [tipo, setTipo] = useState(0);
  const [result, setResult] = useState("");
  const [calificacion, setCalificacion] = useState(0);

  useEffect(() => {
    const obtenerDireccionAlumno = async () => {
      try {
        // Obtener la dirección del alumno usando el índice
        const addr = await asignatura.matriculas(alumnoIndex);
        setAlumnoAddr(addr);
      } catch (error) {
        console.error("Error al obtener la dirección del alumno:", error);
      }
    }; obtenerDireccionAlumno();
  }, [alumnoIndex]);
  // Se define el estado de la calificación

  return (
    <div>
      <h2>Calificaciones Individuales</h2>
      <p> Alumno: {alumnoIndex} </p>
      <p> Dirección alumno: {alumnoAddr}</p>
      <form> 
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

                            const r = await asignatura.califica(alumnoAddr, indexEval, tipo, calificacion, {from: account});
                            if (r.receipt.status === true) { setResult('La transacción fue exitosa.');
                            } else if (r.receipt.status === false) { setResult('La transacción falló.');
                            } else { setResult('La transacción está pendiente.');
                            }

                        }}>Calificar alumno</button>
  
                <p> Último estado = {result}</p>
                <Link to={"/calificaciones"}>Volver</Link>  
            </form>
      {/* Otras partes de tu componente */}
    </div>
  );
};

export default CalificacionesIndiv;
