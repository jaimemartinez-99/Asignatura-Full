import Web3 from 'https://esm.sh/web3@1.10.0';

import EventEmitter from 'events';
import {useState, useEffect} from 'react';
import json from "./Asignatura.json";

console.log("Inicializando estado ...");

let asignatura = null;   // Instancia desplegada del contrato.

// Emite un evento "tx" vez que llega un bloque que contiene
// transacciones del contrato asignatura.
let txEmitter = new EventEmitter();

try {
    // Crear una instancia nueva de web3. Usando proveedor de MetaMask.
    window.web3 = new Web3(ethereum);
    console.log("web3 =", web3.version);

    let Asignatura = TruffleContract(json); // Crear la abstraccion
    Asignatura.setProvider(window.web3.eth.currentProvider);  // Provisionar abstraccion Asignatura con el proveedor web3
    asignatura = await Asignatura.deployed(); // Obtener instancia del asignatura desplegado.

    const subscription = web3.eth.subscribe('newBlockHeaders');
    subscription.on('data', async (blockHeader, error) => {
        const block = await web3.eth.getBlock(blockHeader.hash, true);
        for (const transaction of block.transactions) {
            if (transaction.to === asignatura.address) {
                console.log('Transacción afectando al contrato.');
                txEmitter.emit("tx", transaction);
                break;
            }
        }
    });

    // Muestra el Login de Metamask."
    const accounts = await ethereum.request({method: 'eth_requestAccounts'});
    console.log("Logueado con la cuenta =", accounts[0]);
} catch (error) {
    console.log(error.message || error);
    alert('Se ha producido un error: ' + (error.message || error));
}

const forceReloadEffect = () => {
    const [forceReload, setForceReload] = useState(0);
    useEffect(() => {
        const eh = (tx) => { setForceReload(fr => fr + 1); };
        txEmitter.on("tx", eh);
        return () => { txEmitter.off("tx", eh); }
    }, []);
    return forceReload;
}

// Es estado es un objeto con las siguiente propiedades:
//  - asignatura - abstraccion del contrato asignatura desplegado.
//  - txEmitter  - Event Emitter que emite un evento "tx" vez que llega
//                 un bloque que contiene transacciones del contrato asignatura.
const state = {asignatura, txEmitter, forceReloadEffect};
export default state;
