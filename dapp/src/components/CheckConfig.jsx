
const chainId = "0x539"; // Ganache: es donde he desplegado el contrato

const CheckConfig = ({children}) => {

    // Comprobar que el navegador soporta Ethereum
    if (typeof window.ethereum === "undefined") {
        return (<main><h1>⚠️ Instale MetaMask.</h1></main>);
    }

    // Manejar el cambio de red:
    ethereum.on('chainChanged', chainId => {
        // Recargar la pagina
        console.log("Seleccionada otra red.");
        window.location.reload();
    });

    // Comprobar que MetaMask está conectado a la red que quiero:
    if (window.ethereum.chainId && window.ethereum.chainId !== chainId) {
        return (<main><h1>⚠️ Use Ganache</h1></main>);
    }

    // Atender al evento que indica que el usuario ha seleccionado otra cuenta en Metamask:
    window.ethereum.on('accountsChanged', accounts => {
        // Recargar el UI con accounts[0]
        console.log("Seleccionada la cuenta =", accounts[0]);
        window.location.reload();
    });

    return <>
        {children}
    </>
};

export default CheckConfig;
