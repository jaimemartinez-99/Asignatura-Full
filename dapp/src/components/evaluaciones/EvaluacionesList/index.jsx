import EvaluacionesHead from "./EvaluacionesHead.jsx";
import EvaluacionesBody from "./EvaluacionesBody.jsx";


const EvaluacionesList = () => (
    <section className="AppEvaluaciones">
        <h3>Todas las Evaluaciones</h3>

        <table>
            <EvaluacionesHead/>
            <EvaluacionesBody/>
        </table>
    </section>
);

export default EvaluacionesList;
