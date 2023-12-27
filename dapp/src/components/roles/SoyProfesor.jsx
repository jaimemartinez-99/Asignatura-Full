
import {useState, useEffect, useContext} from "react";

import {StateContext} from "../StateContext.mjs";

const SoyProfesor = ({children}) => {

    const {asignatura} = useContext(StateContext);
    const [aux, setAux] = useState([]);
    const [myAddr, setMyAddr] = useState(null);

  

    useEffect(() => {
        (async () => {
            try {
                // Obtener addr del profesor:
                const aux = await asignatura.getProfesores()
                setAux(aux);
                console.log("aux", aux);    
                // Obtener mi addr:
                const accounts = await window.web3.eth.getAccounts();
                setMyAddr(accounts[0]);
            } catch (e) {
                console.log(e);
            }
        })();
    }, []);   // [] -> Sin dependencias. Solo se llama a useEffect una vez.

    if (!aux.includes(myAddr))  {
        return (
            <p> No tienes permisos para acceder a esta página</p> 
        );
    }
    return <>
        {children}
    </>
};

export default SoyProfesor;
