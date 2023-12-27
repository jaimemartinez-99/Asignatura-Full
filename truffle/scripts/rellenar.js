module.exports = async callback => {

    try {
        const Asignatura = artifacts.require("./Asignatura.sol");

        // Usar las cuentas de usuario
        const accounts = await web3.eth.getAccounts();
        if (accounts.length < 8) {
            throw new Error("No hay cuentas.");
        }

        // Addresses:
        const coordinadorAddr = accounts[1];
        const profe1Addr = accounts[2];
        const profe2Addr = accounts[3];
        const alumno1Addr = accounts[4];
        const alumno2Addr = accounts[5];
        const alumno3Addr = accounts[6];


        // Abstraccion del contrato:
        let asignatura = await Asignatura.deployed();

        // Identificar al owner:
        let owner = await asignatura.owner();
        console.log("Cuenta del owner =", owner);

        // Asignar el coordinador:
        console.log("Asignar el coordinador:");
        await asignatura.setCoordinador(coordinadorAddr);
        const coordinadorAccount = await asignatura.coordinador()
        console.log("Cuenta del coordinador =", coordinadorAccount);

        // AÃ±adir profesores:
        console.log("AÃ±adir profesores:");
        console.log("Cuenta del primer profesor =", profe1Addr);
        console.log("Cuenta del segundo profesor =", profe2Addr);

        await asignatura.addProfesor(profe1Addr, "Santiago Pavon");
        await asignatura.addProfesor(profe2Addr, "Joaqui­n Salvachua");
        let spgAccount = await asignatura.profesores(0);
        let jsrAccount = await asignatura.profesores(1);
        console.log("Profesor 1 =", await asignatura.datosProfesor(spgAccount));
        console.log("Profesor 2 =", await asignatura.datosProfesor(jsrAccount));


        // Matricular a tres alumnos:
        console.log("Matricular a tres alumnos:");
        let evaAccount = alumno1Addr;
        let pepeAccount = alumno2Addr;
        let luisAccount = alumno3Addr;
        console.log("Cuenta de Eva =", evaAccount);
        console.log("Cuenta de Pepe =", pepeAccount);
        console.log("Cuenta de Luis =", luisAccount);
        await asignatura.automatricula("Eva Marti­nez", "11111111A", "em@dominio.es", {from: evaAccount});
        await asignatura.automatricula("Jose Redondo", "22222222B", "jr@sitio.com", {from: pepeAccount});
        await asignatura.automatricula("Luis Marti­n",  "33333333C", "lm@aqui.com", {from: luisAccount});

        console.log("Crear evaluaciones:");
        await asignatura.creaEvaluacion("Primera Practica",  Date.now() + 60 * 24 * 3600000, 20, 300, {from: coordinadorAccount});
        await asignatura.creaEvaluacion("Segundo Practica", Date.now() + 120 * 24 * 3600000, 30, 400, {from: coordinadorAccount});
        await asignatura.creaEvaluacion("Examen Final",    Date.now() + 140 * 24 * 3600000, 50, 400, {from: coordinadorAccount});
        const el = (await asignatura.evaluacionesLength()).toNumber();
        console.log("Creadas", el, "evaluaciones.");

        console.log("Añadir calificaciones.");
        await asignatura.califica(evaAccount, 0, 2, 650, {from: spgAccount});
        await asignatura.califica(evaAccount, 1, 2, 750, {from: jsrAccount});

        await asignatura.califica(pepeAccount, 0, 1, 0, {from: spgAccount});
        await asignatura.califica(pepeAccount, 1, 2, 500, {from: jsrAccount});
        await asignatura.califica(pepeAccount, 2, 2, 500, {from: spgAccount});

        await asignatura.califica(luisAccount, 2, 2, 800, {from: spgAccount});

        } catch (err) {   // Capturar errores
        console.log(`Error: ${err}`);
    } finally {
        console.log("FIN");
    }

    callback();      // Terminar
};
