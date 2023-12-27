
import {useState, useEffect, useContext} from "react";
import {StateContext} from "../StateContext.mjs";

const MisDatos = () => {

    const {asignatura} = useContext(StateContext);

    const [nombre, setNombre] = useState(null);
    const [email, setEmail] = useState(null);

    useEffect(() => {
        (async () => {
            try {
                const accounts = await window.web3.eth.getAccounts();
                const account = accounts[0];
                // Obtener  datos del alumno:
                const datos = await asignatura.quienSoy({from: account});
                setNombre(datos._nombre);
                setEmail(datos._email);
            } catch (e) {
                console.log(e);
            }
        })();
    }, []);


                return (
        <article className="AppMisDatos">
            <h3>Mis Datos</h3>
            <ul>
                <li>Nombre: <span style={{color: "blue"}}>{nombre}</span></li>
                <li>Email: <span style={{color: "blue"}}>{email}</span></li>
            </ul>
        </article>);
};

export default MisDatos;
