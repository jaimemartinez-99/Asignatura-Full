import { useState, useEffect, useContext } from 'react';
import { StateContext } from '../StateContext.mjs';
import SetCoordinator from './SetCoordinator.jsx';

function HomePage() {
    const {asignatura, forceReloadEffect} = useContext(StateContext);
    const forceReload = forceReloadEffect();
    const [ownerAddress, setOwnerAddress] = useState(null);
    const [coordinatorAddress, setCoordinatorAddress] = useState(null);
    const [cerrada, setCerrada] = useState(false);
    // Can be splitted into two useEffects, one for owner and one for coordinator
    // (only the second one would depend on forceReload)
    useEffect(() => {
        (async () => {
            setOwnerAddress(await asignatura.owner());
            setCoordinatorAddress(await asignatura.coordinador());
            setCerrada(await asignatura.cerrada())
        })()
    }, [forceReload]);

    return (
        <>
            <p>Página Home de la Asignatura Full</p>
            <p>Owner = {ownerAddress}</p>
            <p>Coordinador = {coordinatorAddress}</p>
            <h2>Estado de la asignatura: {cerrada ? "Cerrada" : "Abierta"}</h2>            
            <SetCoordinator/>
        </>
    );
}

export default HomePage;
