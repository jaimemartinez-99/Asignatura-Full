import ProfesoresList from "./ProfesoresList/index.jsx";
import {useState, useEffect, useContext} from "react";
import {StateContext} from "../StateContext.mjs";

const AlumnosPage = () => {
    const {asignatura} = useContext(StateContext);

    const [isOwner, setIsOwner] = useState(true);


    const [nombre, setNombre] = useState('');
    const [address, setAddress] = useState('');
    const [result, setResult] = useState('');

    useEffect(() => {
        verificarSiEsOwner();
    }, []);

    const obtenerDireccionPropietario = async () => {
        try {
            const direccionPropietario = await asignatura.owner();
            return direccionPropietario;
            
        } catch (error) {
            console.error("Error al obtener la dirección del propietario:", error);
            return null;
        }
    };

    const verificarSiEsOwner = async () => {
        try {
            const direccionPropietario = await obtenerDireccionPropietario();
            if (direccionPropietario) {
                const accounts = await window.web3.eth.getAccounts();
                const direccionCuentaActual = accounts[0];
                setIsOwner(direccionPropietario.toLowerCase() === direccionCuentaActual.toLowerCase());
                console.log("Es owner: ", isOwner)
            } else {
                setIsOwner(false);
            }
        } catch (error) {
            console.error("Error al verificar si es propietario:", error);
            setIsOwner(false);
        }
    };

    const addProfesor = async (e) => {
        try {
            e.preventDefault();
            asignatura.addProfesor(e.target.elements.address.value, e.target.elements.nombre.value);
            const accounts = await window.web3.eth.getAccounts();
            const account = accounts[0];
            console.log(account)
            if (!account) {
                throw new Error('No hay cuenta');
            }
            setResult("Peticion pendiente");
            const r = await asignatura.addProfesor(e.target.elements.address.value, e.target.elements.nombre.value, { from: account });
            setResult(r.receipt.status ? "Profesor Añadido" : "Peticion fallida");
        } catch (err) {
            console.log(err);
        }
    };

    if (isOwner) {
        return (
            <div>
            <h2>Profesores</h2>
            <ProfesoresList/>
            <form onSubmit={addProfesor}>
                    <h2>Añadir Profesor a la asignatura</h2>
                    <input type={"text"}
                    name={"address"}
                    onChange={ev => setAddress(ev.target.value)}
                    value={address}
                    placeholder={'Address del Profesor'}/>
                    <input type={"text"}
                    name={"nombre"}
                    onChange={ev => setNombre(ev.target.value)}
                    value={nombre}
                    placeholder={'Nombre del Profesor'}/>
                    <button type="submit">Terminar registro</button>
                    <p> Último resultado = {result} </p>
                </form> 
                </div>
            
        );
    } else {
        return (
            <section className="AppAlumnos">
        <h2>Profesores</h2>

        <ProfesoresList/>
    </section>
        );
    }

};


export default AlumnosPage;
