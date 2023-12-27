import {useState, useEffect, useContext} from "react";

import {StateContext} from "./StateContext.mjs";

const Header = () => {

    const {asignatura} = useContext(StateContext);

    const [nombre, setNombre] = useState(null);
    const [curso, setCurso] = useState(null);

    useEffect(() => {
        (async () => {
            try {
                setNombre(await asignatura.nombre());
                setCurso(await asignatura.curso());
            } catch (e) {
                console.log(e);
            }
        })();
    }, []);   // [] -> Sin dependencias. Solo se llama a useEffect una vez.

    return (
        <header className="AppHeader">
            <h1>
                Asignatura Full: {nombre}-<em>{curso}</em>
            </h1>
        </header>
    );
};

export default Header;
