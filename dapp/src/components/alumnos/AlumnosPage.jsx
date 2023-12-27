import AlumnosList from "./AlumnosList/index.jsx";
import {useState, useEffect, useContext} from "react";
import {StateContext} from "../StateContext.mjs";

const AlumnosPage = () => {
    const {asignatura} = useContext(StateContext);

    const [isOwner, setIsOwner] = useState(true);
    const [isCoordinador, setIsCoordinador] = useState(true);
    const [isProfesor, setIsProfesor] = useState(false);

    const [address, setAddress] = useState('');
    const [nombre, setNombre] = useState('');
    const [dni, setDni] = useState('');
    const [email, setEmail] = useState('');
    const [result, setResult] = useState('');

    useEffect(() => {
        verificarSiEsOwner();
    }, []);

    useEffect(() => {
        verificarSiEsCoordinador();
    }, []);
    useEffect(() => {
        verificarSiEsProfesor();
    }, []);


    // Comprobación de que la cuenta que se está usando es la del owner
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
            } else {
                setIsOwner(false);
            }
        } catch (error) {
            console.error("Error al verificar si es propietario:", error);
            setIsOwner(false);
        }
    };

    // Comprobación de que la cuenta que se está usando es la del coordinador
    const obtenerDireccionCoordinador = async () => {
        try {
            const direccionCoordinador = await asignatura.coordinador();
            return direccionCoordinador;
        } catch (error) {
            console.error("Error al obtener la dirección del coordinador:", error);
            return null;
        }
    };

    const verificarSiEsCoordinador = async () => {
        try {
            const direccionCoordinador = await obtenerDireccionCoordinador();
            if (direccionCoordinador) {
                const accounts = await window.web3.eth.getAccounts();
                const direccionCuentaActual = accounts[0];
                setIsCoordinador(direccionCoordinador.toLowerCase() === direccionCuentaActual.toLowerCase());
            } else {
                setIsCoordinador(false);
            }
        } catch (error) {
            console.error("Error al verificar si es coordinador:", error);
            setIsCoordinador(false);
        }
    };

    const obtenerDireccionProfesor = async () => {
        try {
            const aux = await asignatura.getProfesores()
            console.log("array de profes",aux)  
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
            console.log(direccionCuentaActual)
            for (var i = 0; i < profes.length; i++) {
                if(profes[i].toLowerCase() === direccionCuentaActual.toLowerCase()){
                    console.log("es profesor")
                    setIsProfesor(true);
                }
            }
        } catch (error) {
            console.error("Error al verificar si es profesor:", error);
            setIsProfesor(false);
        }
    };
    const autoMatricula = async (e) => {
        try {
            e.preventDefault();
            asignatura.automatricula(e.target.elements.nombre.value, e.target.elements.dni.value,
                e.target.elements.email.value);
            const accounts = await window.web3.eth.getAccounts();
            console.log(accounts)
            const account = accounts[0];
            if (!account) {
                throw new Error('No hay cuenta');
            }
            setResult("Peticion pendiente");
            const r = await asignatura.automatricula(e.target.elements.nombre.value, e.target.elements.dni.value,
                e.target.elements.email.value, { from: account });
            setResult(r.receipt.status ? "Automatricula completada" : "Peticion fallida");
        } catch (err) {
            console.log(err);
        }
    };

    const matricular = async (e) => {
        try {
            e.preventDefault();
            asignatura.matricular(e.target.elements.address.value, e.target.elements.nombre.value, e.target.elements.dni.value,
                e.target.elements.email.value);
            const accounts = await window.web3.eth.getAccounts();
            console.log(accounts)
            const account = accounts[0];
            if (!account) {
                throw new Error('No hay cuenta');
            }
            setResult("Peticion pendiente");
            const r = await asignatura.matricular(e.target.elements.address.value, e.target.elements.nombre.value, e.target.elements.dni.value,
                e.target.elements.email.value, { from: account });
            setResult(r.receipt.status ? "Matricula completada" : "Peticion fallida");
        } catch (err) {
            console.log(err);
        }
    };

//function matricular (address  _direccion, string memory  _nombre, string memory _dni, string memory _email) soloOwner public {

    if (isOwner){
        return(
            <section className="AppAlumnos">
            <p> Eres owner </p>
            <h2>Alumnos</h2>
            <AlumnosList/>
            <form onSubmit={matricular}>
                    <h2>Realizar matricula de algún alumno</h2>
                    <input type={"text"}
                    name={"address"}
                    onChange={ev => setAddress(ev.target.value)}
                    value={address}
                    placeholder={'Address del Alumno'}/>
                    <input type={"text"}
                    name={"nombre"}
                    onChange={ev => setNombre(ev.target.value)}
                    value={nombre}
                    placeholder={'Nombre del Alumno'}/>
                    <input type={"text"}
                    name={"dni"}
                    onChange={ev => setDni(ev.target.value)}
                    value={dni}
                    placeholder={'DNI del Alumno'}/>
                    <input type={"text"}
                    name={"email"}
                    onChange={ev => setEmail(ev.target.value)}
                    value={email}
                    placeholder={'Email del Alumno'}/>
                    <button type="submit">Terminar registro</button>
                    <p> Último resultado = {result} </p>
                </form> 
            </section>
        )
    } else if (isCoordinador || isProfesor) {
        return (
            <section className="AppAlumnos">
        <h2>Alumnos</h2>

        <AlumnosList/>
    </section>
        );
    } else {
        return (
            <form onSubmit={autoMatricula}>
                    <h2>Realizar automatricula</h2>
                    <input type={"text"}
                    name={"nombre"}
                    onChange={ev => setNombre(ev.target.value)}
                    value={nombre}
                    placeholder={'Nombre del Alumno'}/>
                    <input type={"text"}
                    name={"dni"}
                    onChange={ev => setDni(ev.target.value)}
                    value={dni}
                    placeholder={'DNI del Alumno'}/>
                    <input type={"text"}
                    name={"email"}
                    onChange={ev => setEmail(ev.target.value)}
                    value={email}
                    placeholder={'Email del Alumno'}/>
                    <button type="submit">Terminar registro</button>
                    <p> Último resultado = {result} </p>
                </form> 
        );
    }

};


export default AlumnosPage;
