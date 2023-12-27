import MiCuenta from "./MiCuenta.jsx";
import MisDatos from "./MisDatos.jsx";
import MisNotas from "./MisNotas.jsx";
import SoyAlumno from "../roles/SoyAlumno";

const MisCosasPage = () => {

    return <section className="AppMisCosas">
        <h2>Mis Cosas</h2>

        <MiCuenta/>

        <SoyAlumno>
            <MisDatos/>
            <MisNotas/>
        </SoyAlumno>

    </section>;
}

export default MisCosasPage;

