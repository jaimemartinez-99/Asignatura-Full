
import {useState, useEffect, useContext} from "react";
import { StateContext } from "../StateContext.mjs";


const MiCuenta = () => {
    const { asignatura} = useContext(StateContext);

    const [addr, setAddr] = useState(null);
    const [balance, setBalance] = useState(null);
    const [profesores, setProfesores] = useState([]);
    const [rol, setRol] = useState('');

    useEffect(() => {
        (async () => {
            try {
                const profes = await asignatura.getProfesores();
                const owner = await asignatura.owner();
                const coordinador = await asignatura.coordinador();
                
                setProfesores(profes);
                
                const accounts = await window.web3.eth.getAccounts();
                const account = accounts[0];
                const datos = await asignatura.datosAlumno(account);
                setAddr(account);

                const balance = await window.web3.eth.getBalance(account);
                setBalance(web3.utils.fromWei(balance, "ether"));
                if (profes.includes(addr)) {
                    setRol('Profesor');
                } else if (addr === owner) {
                    setRol('Owner');
                } else if (addr === coordinador) {
                    setRol('Coordinador');
                } else if(datos[0] !== '') {
                    setRol('Alumno');
                } else {
                    setRol('No registrado');
                }
            } catch (e) {
                console.log(e);
            }
        })();
    }, [rol]);


    return (
        <article className="AppMiCuenta">
            <h3>Mi Cuenta</h3>
            <ul>
                <li>Dirección: <span style={{color: "blue"}}>{addr}</span></li>
                <li>Balance: <span style={{color: "blue"}}>{balance ?? "??"}</span> ethers</li>
                <li>Rol: <span style={{color: "blue"}}>{rol}</span></li>
            </ul>
        </article>);
};

export default MiCuenta;
