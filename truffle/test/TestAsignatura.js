var Asignatura = artifacts.require("./Asignatura.sol");

contract('Uso normal de Asignatura:', accounts => {

    const owner = accounts[0];
    const coordinador = accounts[1];

    const desconocido = accounts[9];

    const profesores = [
        {addr: accounts[1], nombre: "Santiago PG"},
        {addr: accounts[2], nombre: "Joaquin SR"}
    ];

    // AlumnosList que se van a automatricular
    const alumnos1 = [
        {addr: accounts[4], nombre: "Pepe", email: "pepe@upm.es", dni: "11110001A"},
        {addr: accounts[5], nombre: "Sara", email: "sara@upm.es", dni: "11110002A"},
        {addr: accounts[6], nombre: "Luis", email: "luis@upm.es", dni: "11110003A"},
    ];

    // AlumnosList matriculados por el owner
    const alumnos2 = [
        {addr: accounts[7], nombre: "Lucia", email: "lucia@upm.es", dni: "11110004A"},
        {addr: accounts[8], nombre: "Jaime", email: "jaime@upm.es", dni: "11110005A"},
    ];

    // Todos los alumnos
    const alumnos = alumnos1.concat(alumnos2);

    // Evaluaciones
    const evaluaciones = [
        {nombre: "Parcial 1", fecha: Date.now() + 60 * 24 * 3600000, porcentaje: 30, minimo: 500},
        {nombre: "Parcial 2", fecha: Date.now() + 120 * 24 * 3600000, porcentaje: 30, minimo: 500},
        {nombre: "Practica 1", fecha: Date.now() + 50 * 24 * 3600000, porcentaje: 20, minimo: 400},
        {nombre: "Practica 1", fecha: Date.now() + 110 * 24 * 3600000, porcentaje: 20, minimo: 400}
    ];

    // Notas de todos los alumnos en todas las evaluaciones.
    // Primer subarray: uno para cada alumno.
    // Segundo subsubarray: uno para cada evaluacion.
    const calificaciones = [
        [[1, 0], [2, 400], [2, 750], [2, 900]],   // Notas del primer alumno
        [[2, 500], [2, 600], [2, 750], [2, 800]], // Notas del segundo alumno
        [[0, 0], [0, 0], [0, 0], [0, 0]],         // Notas del tercer alumno
        [[2, 950], [2, 800], [1, 0], [1, 0]],      // Notas del cuarto alumno
        [[1, 0], [1, 0], [1, 0], [1, 0]]          // Notas del quito alumno
    ];

    it("El nombre y curso deben ser BCDA y 2023", async () => {
        const asignatura = await Asignatura.deployed();

        const nombre = await asignatura.nombre.call();
        assert.equal(nombre, "BCDA", "El nombre debe ser BCDA.");

        const curso = await asignatura.curso.call();
        assert.equal(curso, "2023", "El curso debe ser 2023.");
    });

    it("El owner debe ser la primera cuenta.", async () => {
        const asignatura = await Asignatura.deployed();

        const owner = await asignatura.owner.call();
        assert.equal(owner, accounts[0], "El owner debe ser la primera cuenta.");
    });

    it("No puede enviarse dinero al contrato.", async () => {
        const asignatura = await Asignatura.deployed();
        try {
            await asignatura.send(200);
            assert.fail("El contrato no debe aceptar envios de dinero.")
        } catch (error) {
        }
    });

    it("Asignar el coordinador.", async () => {
        const asignatura = await Asignatura.deployed();

        const zero = await asignatura.coordinador.call();
        assert.equal(zero, 0x0, "No debe existir coordinador al principio.");

        await asignatura.setCoordinador(coordinador);
        const addr = await asignatura.coordinador.call();
        assert.equal(addr, coordinador, "El coordinador no se ha guardado.");
    });

    it("Solo el owner puede asignar el coordinador.", async () => {
        const asignatura = await Asignatura.deployed();

        try {
            await asignatura.setCoordinador(desconocido, "nombre", {from: desconocido});
            assert.fail("Solo el owner puede asignar el coordinador.");
        } catch {
        }
    });

    it("AÃ±adir los profesores.", async () => {
        const asignatura = await Asignatura.deployed();

        const zero = await asignatura.profesoresLength.call();
        assert.equal(zero, 0, "No debe haber profesores al principio.");

        for (const profesor of profesores) {
            await asignatura.addProfesor(profesor.addr, profesor.nombre);
        }

        const pl = await asignatura.profesoresLength.call();
        assert.equal(pl, profesores.length, "No se han aÃ±adido todos los profesores.");

        for (const profesor of profesores) {
            const p = await asignatura.datosProfesor.call(profesor.addr);
            assert.equal(p, profesor.nombre, "El nombre del profesor no se ha guardado bien.");
        }
    });

    it("Solo el owner puede aÃ±adir profesores.", async () => {
        const asignatura = await Asignatura.deployed();

        try {
            await asignatura.addProfesor(desconocido, "nombre", {from: desconocido});
            assert.fail("Solo el owner puede aÃ±adir profesores.");
        } catch {
        }
    });

    it("Automatricularse.", async () => {
        const asignatura = await Asignatura.deployed();

        const zero = await asignatura.matriculasLength.call();
        assert.equal(zero, 0, "No debe haber alumnos al principio.");

        for (const alumno of alumnos1) {
            await asignatura.automatricula(alumno.nombre, alumno.dni, alumno.email, {from: alumno.addr});
        }

        const ml = await asignatura.matriculasLength.call();
        assert.equal(ml, alumnos1.length, "No se han aÃ±adido todos los alumnos.");

        for (const alumno of alumnos1) {
            let a = await asignatura.datosAlumno.call(alumno.addr);

            assert.equal(a[0], alumno.nombre, "El nombre de un alumno no se ha guardado bien.");
            assert.equal(a[1], alumno.dni, "El DNI de un alumno no se ha guardado bien.");
            assert.equal(a[2], alumno.email, "El email de un alumno no se ha guardado bien.");
        }

        // No se puede matricular un alumno dos veces.
        try {
            const alumno = alumnos1[1];
            await asignatura.automatricula(alumno.nombre, alumno.dni, alumno.email, {from: alumno.addr});
            assert.fail("No se puede matricular un alumno dos veces.")
        } catch {
        }
    });


    it("El owner puede matricular alumnos.", async () => {
        const asignatura = await Asignatura.deployed();

        for (const alumno of alumnos2) {
            await asignatura.matricular(alumno.addr, alumno.nombre, alumno.dni, alumno.email, {from: owner});
        }

        const ml = await asignatura.matriculasLength.call();
        assert.equal(ml, alumnos.length, "No se han aÃ±adido todos los alumnos.");

        for (const alumno of alumnos2) {
            let a = await asignatura.datosAlumno.call(alumno.addr);

            assert.equal(a[0], alumno.nombre, "El nombre de un alumno no se ha guardado bien.");
            assert.equal(a[1], alumno.dni, "El DNI de un alumno no se ha guardado bien.");
            assert.equal(a[2], alumno.email, "El email de un alumno no se ha guardado bien.");
        }

        // No se puede matricular un alumno dos veces.
        try {
            const alumno = alumnos2[0];
            await asignatura.matricular(alumno.nombre, alumno.dni, alumno.email, {from: owner});
            assert.fail("No se puede matricular un alumno dos veces.")
        } catch {
        }
    });

    it("El DNI de los alumnos no puede repetirse.", async () => {
        const asignatura = await Asignatura.deployed();

        try {
            await asignatura.automatricula("nombre", alumnos[0].dni, "email", {from: desconocido});
            assert.fail("El DNI de los alumnos no puede repetirse.");
        } catch {
        }
    });

    it("No puede dejarse el nombre ni el dni vacio al automatricularse.", async () => {
        const asignatura = await Asignatura.deployed();

        try {
            await asignatura.automatricula("", "1111", "email", {from: desconocido});
            assert.fail("No puede dejarse el nombre vacio al automatricularse.");
        } catch {
        }

        try {
            await asignatura.automatricula("nombre", "", "email", {from: desconocido});
            assert.fail("No puede dejarse el dni vacio al automatricularse.");
        } catch {
        }
    });

    it("Obtener mis datos con quienSoy.", async () => {
        const asignatura = await Asignatura.deployed();

        const sara = alumnos[1];
        let alumno = await asignatura.quienSoy.call({from: sara.addr});

        assert.equal(alumno[0], sara.nombre, "No puedo accedr a mi nombre.");
        assert.equal(alumno[1], sara.dni, "No puedo accedr a mi DNI.");
        assert.equal(alumno[2], sara.email, "No puedo accedr a mi email.");
    });

    it("Solo un alumno matriculado puede consultar quienSoy.", async () => {
        const asignatura = await Asignatura.deployed();

        try {
            await asignatura.quienSoy({from: desconocido});
            assert.fail("Solo un alumno matriculado puede consultar quienSoy.");
        } catch {
        }
    });

    it("Crear las evaluaciones.", async () => {
        const asignatura = await Asignatura.deployed();

        const zero = await asignatura.evaluacionesLength.call();
        assert.equal(zero, 0, "No debe haber evaluaciones al principio.");

        for (const evaluacion of evaluaciones) {
            await asignatura.creaEvaluacion(evaluacion.nombre, evaluacion.fecha, evaluacion.porcentaje, evaluacion.minimo, {from: coordinador});
        }

        const el = await asignatura.evaluacionesLength.call();
        assert.equal(el, evaluaciones.length, "No se han aÃ±adido todas las evaluaciones.");

        for (let i = 0; i < evaluaciones.length; i++) {
            let e = await asignatura.evaluaciones.call(i);

            assert.equal(e[0], evaluaciones[i].nombre, "El nombre de una evaluacion alumno no se ha guardado bien.");
            assert.equal(e[1], evaluaciones[i].fecha, "La fecha de una evaluacion no se ha guardado bien.");
            assert.equal(e[2], evaluaciones[i].porcentaje, "El porcentaje de una evaluacion no se ha guardado bien.");
            assert.equal(e[3], evaluaciones[i].minimo, "Los puntos minimos de una evaluacion no se han guardado bien.");
        }
    });

    it("Solo el coordinador puede crear una evaluacion.", async () => {
        const asignatura = await Asignatura.deployed();

        try {
            await asignatura.creaEvaluacion("nombre", 2000, 5, {from: desconocido});
            assert.fail("Solo el coordinador puede crear una evaluacion.");
        } catch {
        }
    });

    it("Crear las calificaciones.", async () => {
        const asignatura = await Asignatura.deployed();

        for (let ai = 0; ai < calificaciones.length; ai++) {
            let alumnoAddr = alumnos[ai].addr;
            for (let ei = 0; ei < evaluaciones.length; ei++) {
                await asignatura.califica(alumnoAddr, ei, calificaciones[ai][ei][0], calificaciones[ai][ei][1], {from: profesores[0].addr});
            }
        }

        for (let ai = 0; ai < calificaciones.length; ai++) {
            let alumnoAddr = alumnos[ai].addr;
            for (let ei = 0; ei < evaluaciones.length; ei++) {
                let c = await asignatura.calificaciones(alumnoAddr, ei);
                assert.equal(c[0].toNumber(), calificaciones[ai][ei][0], "El tipo de una calificacion no se ha guardado bien.");
                assert.equal(c[1].toNumber(), calificaciones[ai][ei][1], "La nota de una calificacion no se ha guardado bien.");
            }
        }
    });

    it("Solo puede calificar un profesor.", async () => {
        const asignatura = await Asignatura.deployed();

        try {
            await asignatura.califica(alumnos[0].addr, 0, 0, 0, {from: desconocido});
            assert.fail("Solo puede calificar un profesor.");
        } catch {
        }
    });

    it("Consultar mi nota.", async () => {
        const asignatura = await Asignatura.deployed();

        const alumno = alumnos[1];

        for (let i = 0; i < evaluaciones.length; i++) {
            let c1 = await asignatura.miNota(i, {from: alumno.addr});
            assert.equal(c1[0].toNumber(), calificaciones[1][i][0], "El tipo de una calificacion mia no se ha guardado bien.");
            assert.equal(c1[1].toNumber(), calificaciones[1][i][1], "La nota de una calificacion mia no se ha guardado bien.");
        }
    });

    it("Solo pueden llamar a miNota los alumnos matriculados.", async () => {
        const asignatura = await Asignatura.deployed();

        try {
            await asignatura.miNota(0, {from: desconocido});
            assert.fail("Solo pueden llamar a miNota los alumnos matriculados.");
        } catch {
        }
    });

    it("Consultar mi nota final.", async () => {
        const asignatura = await Asignatura.deployed();

        const notasFinales = [[2, 450], [2, 640], [0, 0], [2, 499], [1, 0]];

        for (let i = 0; i < alumnos.length; i++) {
            let alumno = alumnos[i];
            let nf = await asignatura.miNotaFinal({from: alumno.addr});
            console.log("Nota Final de ", alumno.nombre, "=", nf[0].toNumber(), nf[1].toNumber());

            assert.equal(nf[0].toNumber(), notasFinales[i][0], "El tipo de una calificacion final no se ha calculado bien.");
            assert.equal(nf[1].toNumber(), notasFinales[i][1], "La nota de una calificacion final no se ha calculado bien.");
        }
    });

    it("El coordinador consulta la nota final de un alumno.", async () => {
        const asignatura = await Asignatura.deployed();

        const notasFinales = [[2, 450], [2, 640], [0, 0], [2, 499], [1, 0]];

        for (let i = 0; i < alumnos.length; i++) {
            let alumno = alumnos[i];
            let nf = await asignatura.notaFinal(alumno.addr, {from: coordinador});
            console.log("Nota Final de ", alumno.nombre, "=", nf[0].toNumber(), nf[1].toNumber());

            assert.equal(nf[0].toNumber(), notasFinales[i][0], "El tipo de una calificacion final no se ha calculado bien.");
            assert.equal(nf[1].toNumber(), notasFinales[i][1], "La nota de una calificacion final no se ha calculado bien.");
        }
    });
});


contract('Cerrar Asignatura:', accounts => {

    it("La asignatura esta abierta al principio.", async () => {
        const asignatura = await Asignatura.deployed();

        const cerrada = await asignatura.cerrada.call();
        assert.isNotOk(cerrada, "La asignatura no esta abierta al principio.");
    });

    it("No se puede cerrar sin coordinador.", async () => {
        const asignatura = await Asignatura.deployed();

        try {
            await asignatura.cerrar();
            assert.fail("Solo un coordinador puede cerrar la asignatura.")
        } catch (error) {
        }
    });

    it("Cerrar la asignatura.", async () => {
        const asignatura = await Asignatura.deployed();

        const acc1 = accounts[1];
        await asignatura.setCoordinador(acc1);

        await asignatura.cerrar({from: acc1});

        const cerrada = await asignatura.cerrada.call();
        assert.isOk(cerrada, "La asignatura no se cierra.");
    });
});
