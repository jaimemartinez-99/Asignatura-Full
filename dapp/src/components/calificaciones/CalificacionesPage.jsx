import CalificacionesTotal from "./CalificacionesTotal/index.jsx";
import Calificar from "./Calificar.jsx";

const CalificacionesPage = () => {

    return (
        <section className="AppCalificaciones">
            <h2>Calificaciones</h2>

            <CalificacionesTotal/>

            <Calificar/>
        </section>
    );
};

export default CalificacionesPage;
