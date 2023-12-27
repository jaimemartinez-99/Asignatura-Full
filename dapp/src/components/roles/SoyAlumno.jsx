
import {useState, useEffect, useContext} from "react";

import {StateContext} from "../StateContext.mjs";

const SoyAlumno = ({children}) => {

    const {asignatura} = useContext(StateContext);

    const [soyAlumno, setSoyAlumno] = useState(null);

    useEffect(() => {
        (async () => {
            try {
                const accounts = await window.web3.eth.getAccounts();
                const datos = await asignatura.datosAlumno(accounts[0]);
                setSoyAlumno(datos.nombre);
            } catch (e) {
                console.log(e);
            }
        })();
    }, []);   // [] -> Sin dependencias. Solo se llama a useEffect una vez.

    if (!soyAlumno) {
        return null
    }
    return <>
        {children}
    </>
};

export default SoyAlumno;
