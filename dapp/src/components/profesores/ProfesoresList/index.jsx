
import ProfesorHead from "./ProfesorHead.jsx";
import ProfesorBody from "./ProfesorBody.jsx";


const ProfesoresList = () => (
    <section className="AppProfesores">
        <h3>Todos los Profesores</h3>
        <table>
            <ProfesorHead/>
            <ProfesorBody/>
        </table>
    </section>
);

export default ProfesoresList;