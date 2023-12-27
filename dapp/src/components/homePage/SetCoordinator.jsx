import React, {useContext, useState, useEffect} from 'react';

import {StateContext} from "../StateContext.mjs";

const setCoordinator = () => {
    const {asignatura} = useContext(StateContext);
    const [caddr, setCAddr] = useState();
    const [result, setResult] = useState('');
    const [cerrada, setCerrada] = useState(false);
    const [isOwner, setIsOwner] = useState(true);
    const [isCoordinador, setIsCoordinador] = useState(true);


    
    const submitHandler = async (e) => {
    try {
        e.preventDefault();
        asignatura.setCoordinador(e.target.elements.addr.value);
        const accounts = await window.web3.eth.getAccounts();
        console.log(accounts)
        const account = accounts[0];
    if (!account) {
        throw new Error('No hay cuenta');
    }
    setResult("Peticion pendiente");
    const r = await asignatura.setCoordinador(caddr, {from: account});
    setResult(r.receipt.status ? "Peticion ok" : "Peticion fallida");
    } catch(err) {
    console.log(err);
    }
    };

    useEffect(() => {
        verificarSiEsOwner();
    }, []);

    useEffect(() => {
        verificarSiEsCoordinador();
    }, []);

    // Comprobación de que la cuenta que se está usando es la del owner
    const obtenerDireccionPropietario = async () => {
        try {
            const direccionPropietario = await asignatura.owner();
            console.log(direccionPropietario)
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
            console.log(direccionCoordinador)
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
                console.log(accounts)
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

   
    const cerrar = async (e) => {
        try {
            e.preventDefault();
            const accounts = await window.web3.eth.getAccounts();
            console.log(accounts)
            const account = accounts[0];
        if (!account) {
            throw new Error('No hay cuenta');
        }
        const r = await asignatura.cerrar({from: account});
        } catch(err) {
        console.log(err);
        }
    };
    
    return (
        <div className="setCoordinator">
            <div className="addCoord">
            {isOwner && (
                <form onSubmit={submitHandler}>
                    <input type={"text"}
                    name={"addr"}
                    onChange={ev => setCAddr(ev.target.value)}
                    value={caddr}
                    placeholder={'Dirección del coordinador'}/>
                    <h2>Cambiar coordinador</h2>
                    <button type="submit">Pon</button>
                    <p> Último resultado = {result} </p>
                     
                </form>
                )}
            </div>
            <div className="cerrar">
                {isCoordinador && (
                <form onSubmit={cerrar}>   
                    <h2>Cerrar asignatura</h2>
                    <button type="submit"onClick={cerrar}>
                        Cerrar
                        </button>
                        <p> Ultimo resultado: {cerrada} </p>
                </form>
                )}
            </div>
        </div>
    );
    }

export default setCoordinator;