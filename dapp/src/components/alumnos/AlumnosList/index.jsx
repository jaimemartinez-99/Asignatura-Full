
import AlumnosHead from "./AlumnosHead.jsx";
import AlumnosBody from "./AlumnosBody.jsx";


const AlumnosList = () => (
    <section className="AppAlumnos">
        <h3>Todos los Alumnos</h3>
        <table>
            <AlumnosHead/>
            <AlumnosBody/>
        </table>
    </section>
);

export default AlumnosList;