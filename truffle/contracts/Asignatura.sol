// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.16;

/**
 *  El contrato Asignatura que representa una asignatura de la carrera.
 * 
 * Version Lite - Practicas
 */
 
 contract Asignatura {

    /// Version 2022 Lite - Teoria
    string public version = "2022 Lite";

    /**
     * address del profesor que ha desplegado el contrato.
     * El contrato lo despliega el profesor.
     */
     /// Dirección del owner
    address public owner;
    /// Dirección del coordinador
    address public coordinador;
    /// Setter de la dirección del coordinador
    function setCoordinador(address _nuevaDireccion) soloOwner soloAbierta public {
        require(msg.sender == owner, "Solo el owner puede establecer al coordinador");
        coordinador = _nuevaDireccion;
    }


    ///Booleano para ver si una asignatura está cerrada
    bool public cerrada;

    /// Función para poner cerrada a true
     function cerrar() public soloCoordinador{
        require(msg.sender == coordinador, "Solo el coordinador puede cerrar la asignatura");
        cerrada = !cerrada;
    }
    
    /// Array de profesores
    address[] public profesores;
    /// Nombre de la asignatura
    string public nombre;
    /// Array de alumnos
    address[] public matriculas;
    /**
     * El numero de alumnos matriculados.
     *
     * @return El numero de alumnos matriculados.
     */
    
    function matriculasLength() public view returns (uint) {
        return matriculas.length;
    }
    /**
     * Permite a un alumno obtener sus propios datos.
     * 
     * @return _nombre El nombre del alumno que invoca el metodo.
     * @return _dni El dni del alumno que invoca el metodo.
     * @return _email  El email del alumno que invoca el metodo.
     */
    function quienSoy() soloMatriculados public view returns (string memory _nombre, string memory _dni, string memory _email) {
        DatosAlumno memory datos = datosAlumno[msg.sender];
        _nombre = datos.nombre;
        _dni = datos.dni;
        _email = datos.email;
        
    }

    /// Curso academico
    string public curso;
    
    /// Datos de un alumno.
    struct DatosAlumno {
        string nombre;
        string dni;
        string email;
    }

    struct DatosProfesor {
        string nombre;
    }
    
    /// Acceder a los datos de un alumno dada su direccion.
    mapping (address => DatosAlumno) public datosAlumno;
    mapping(address => DatosProfesor) public datosProfesor;  

    function addProfesor(address _direccionProfesor, string memory _nombreProfesor) soloOwner soloAbierta public {
    require(msg.sender == owner, "Solo el owner puede usar esta funcion");
    require(bytes(_nombreProfesor).length != 0, "El nombre del profesor no puede estar vacio");
    
    bool profesorYaAgregado = false;
    for (uint i = 0; i < profesores.length; i++) {
        if (profesores[i] == _direccionProfesor) {
            profesorYaAgregado = true;
            break;
        }
    }

    require(!profesorYaAgregado, "El profesor ya esta en la lista");

    datosProfesor[_direccionProfesor].nombre = _nombreProfesor;

    profesores.push(_direccionProfesor);
}
    function profesoresLength() public view returns (uint) {
        return profesores.length;
    }
    
    /**
     * Datos de una evaluacion.
     */
    struct Evaluacion {
        string nombre;
        uint fecha;
        uint porcentaje;
        uint notaMinima;
    }
    
    /// Evaluaciones de la asignatura.
    Evaluacion[] public evaluaciones;
        
    /// Tipos de notas: sin usar, no presentado, y nota normal entre 0 y 1000.
    enum TipoNota {Empty, NP, Normal}
    
    /**
     * Datos de una nota.
     * La calificacion esta multiplicada por 100 porque no hay decimales.
     */
    struct Nota {
        TipoNota tipo;
        uint calificacion;
    }
    
    // Dada la direccion de un alumno, y el indice de la evaluacion, devuelve
    // la nota del alumno.
    mapping (address => mapping (uint => Nota)) public calificaciones;

    
     /**
     * Constructor.
     * 
     * @param _nombre Nombre de la asignatura.
     * @param _curso  Curso academico.
     */
    constructor(string memory _nombre, string memory _curso) {
        require(bytes(_nombre).length != 0, "El nombre de la asignatura no puede estar vacio");
        require(bytes(_curso).length != 0, "El curso no puede estar vacio");
      
        owner = msg.sender;
        nombre = _nombre;
        curso = _curso;
    }
    
    
    /**
     * Los alumnos pueden automatricularse con el metodo automatricula.
     * 
     * Impedir que se pueda meter un nombre vacio.
     * 
     * @param _nombre El nombre del alumno. 
     * @param _email  El email del alumno.
     */
        function automatricula(string memory _nombre, string memory _dni, string memory _email) soloNoMatriculados soloAbierta public {
        require(bytes(_nombre).length != 0, "El nombre no puede estar vacio");
        require(bytes(_dni).length != 0, "El nombre no puede estar vacio");
        require(!cerrada, "No se pueden realizar cambios en una asignatura cerrada");
        for (uint i = 0; i < matriculas.length; i++) {
        if (keccak256(abi.encodePacked(datosAlumno[matriculas[i]].dni)) == keccak256(abi.encodePacked(_dni))) {                
            revert DNIAlreadyInUse(); 
            }
    }

        DatosAlumno memory datos = DatosAlumno(_nombre, _dni, _email);
        datosAlumno[msg.sender] = datos;
        matriculas.push(msg.sender);

        
    }

    
function matricular(address  _direccion, string memory  _nombre, string memory _dni, string memory _email) soloOwner public {
        require(bytes(_nombre).length != 0, "El nombre no puede estar vacio");
        require(bytes(_dni).length != 0, "El dni no puede estar vacio");
        require(bytes(datosAlumno[_direccion].dni).length == 0, "Este alumno ya esta registrado");
        require(!cerrada, "No se pueden realizar cambios en una asignatura cerrada");
        for (uint i = 0; i < matriculas.length; i++) {
            require(keccak256(abi.encodePacked(datosAlumno[matriculas[i]].dni)) != keccak256(abi.encodePacked(_dni)), "Este DNI ya esta en uso por otro alumno.");
    }
        DatosAlumno memory datos = DatosAlumno(_nombre, _dni, _email);
        datosAlumno[_direccion] = datos;
        matriculas.push(_direccion);
    }


    /**
     * Crear una prueba de evaluacion de la asignatura. Por ejemplo, el primer parcial, o la practica 3. 
     *
     * Las evaluaciones se meteran en el array evaluaciones, y nos referiremos a ellas por su posicion en el array.
     * 
     * @param _nombre El nombre de la evaluacion.
     * @param _fecha  La fecha de evaluacion (segundos desde el 1/1/1970).
     * @param _porcentaje El porcentaje de puntos que proporciona a la nota final.
     *
     * @return La posicion en el array evaluaciones,
     */
    function creaEvaluacion(string memory _nombre, uint _fecha, uint _porcentaje, uint _notaMinima) public soloCoordinador soloAbierta returns (uint) {
        require(bytes(_nombre).length != 0, "El nombre de la evaluacion no puede estar vacio");
        require(!cerrada, "No se pueden realizar cambios en una asignatura cerrada");        
        evaluaciones.push(Evaluacion(_nombre, _fecha, _porcentaje, _notaMinima));
        return evaluaciones.length - 1;
    }
    
    /**
     * El numero de evaluaciones creadas.
     *
     * @return El numero de evaluaciones creadas.
     */
    function evaluacionesLength() public view returns(uint) {
        return evaluaciones.length;
    }
    
    /**
     * Poner la nota de un alumno en una evaluacion.
     * 
     * @param alumno        La direccion del alumno.
     * @param evaluacion    El indice de una evaluacion en el array evaluaciones.
     * @param tipo          Tipo de nota.
     * @param calificacion  La calificacion, multipilicada por 100 porque no hay decimales.
     */
    function califica(address alumno, uint evaluacion, TipoNota tipo, uint calificacion) soloProfesor soloAbierta public {
        require(estaMatriculado(alumno), "Solo se puede calificar a un alumno matriculado.");
        require(evaluacion < evaluaciones.length, "No se puede calificar una evaluacion que no existe.");
        require(calificacion <= 1000, "No se puede calificar con una nota superior a la maxima permitida.");
        require(!cerrada, "No se pueden realizar cambios en una asignatura cerrada");
        Nota memory nota = Nota(tipo, calificacion);
        
        calificaciones[alumno][evaluacion] = nota;
    }
    
    /**
     * Devuelve el tipo de nota y la calificacion que ha sacado el alumno que invoca el metodo en la evaluacion pasada como parametro.
     * 
     * @param evaluacion Indice de una evaluacion en el array de evaluaciones.
     * 
     * @return tipo         El tipo de nota que ha sacado el alumno.
     * @return calificacion La calificacion que ha sacado el alumno.
     */ 
    function miNota(uint evaluacion) public soloMatriculados view returns (TipoNota tipo, uint calificacion) {
        require(evaluacion < evaluaciones.length, "El indice de la evaluacion no existe.");
        
        Nota memory nota = calificaciones[msg.sender][evaluacion];
        
        tipo = nota.tipo;
        calificacion = nota.calificacion;
    }
    // Método para que un alumno consulte su nota final
function miNotaFinal() public soloMatriculados view returns (TipoNota, uint calificacionFinal) {
    TipoNota tipoFinal = TipoNota.Empty;
    calificacionFinal = 0;
    bool hasNP = false;
    uint notacont = 0; // Mover notacont fuera del bucle para contar notas NP

    for (uint i = 0; i < evaluaciones.length; i++) {
        Nota memory nota = calificaciones[msg.sender][i];

        if (nota.tipo == TipoNota.Empty) {
            return (TipoNota.Empty, 0);
        } else if (nota.tipo == TipoNota.Normal) {
            calificacionFinal += (nota.calificacion * evaluaciones[i].porcentaje) / 100;
            tipoFinal = TipoNota.Normal;
        } else if (nota.tipo == TipoNota.NP) {
            notacont += 1;
            hasNP = true;
            tipoFinal = TipoNota.NP;
        }
    }

    // Verifica si todas las notas son NP, en ese caso, la nota final es NP
    if (notacont == evaluaciones.length) {
        return (TipoNota.NP, 0);
    }

    // Limita la calificación final a 499 si hay alguna NP
    if (calificacionFinal > 499 && hasNP) {
        calificacionFinal = 499;
        tipoFinal = TipoNota.Normal;
    }

    return (tipoFinal, calificacionFinal);
}

    /**
 * Calcula la nota final de un alumno en función de las calificaciones obtenidas en diferentes evaluaciones.
 * 
 * @param alumno La dirección del alumno para el cual se calculará la nota final.
 * @return tipoFinal El tipo de nota final (Normal, NP o Empty).
 * @return calificacionFinal La calificación final del alumno.
 */
function notaFinal(address alumno) public soloCoordinador view returns (TipoNota tipoFinal, uint calificacionFinal) {
    tipoFinal = TipoNota.Empty;
    calificacionFinal = 0;
    bool hasNP= false;
    uint notacont = 0; // Mover notacont fuera del bucle para contar notas NP

    for (uint i = 0; i < evaluaciones.length; i++) {
        Nota memory nota = calificaciones[alumno][i];

        if (nota.tipo == TipoNota.Empty) {
            return (TipoNota.Empty, 0);
        } else if (nota.tipo == TipoNota.Normal) {
            calificacionFinal += (nota.calificacion * evaluaciones[i].porcentaje) / 100;
            tipoFinal = TipoNota.Normal;
        } else if (nota.tipo == TipoNota.NP) {
            notacont += 1;
            hasNP = true;
            tipoFinal = TipoNota.NP;
        }
    }

    // Verifica si todas las notas son NP, en ese caso, la nota final es NP
    if (notacont == evaluaciones.length) {
        return (TipoNota.NP, 0);
    }

    // Limita la calificación final a 499 si hay alguna NP
    if (calificacionFinal > 499 && hasNP) {
        calificacionFinal = 499;
        tipoFinal = TipoNota.Normal;
    }

    return (tipoFinal, calificacionFinal);
}

   /**
     * Consulta si una direccion pertenece a un alumno matriculado.
     * 
     * @param alumno La direccion de un alumno.
     * 
     * @return true si es una alumno matriculado.
     */
    function estaMatriculado(address alumno) private view returns (bool) {
        string memory _nombre = datosAlumno[alumno].nombre;
        
        return bytes(_nombre).length != 0;
    } 
    function getProfesores() public view returns (address[] memory) {
        return profesores;
    }
    
    /**
     * Modificador para que una funcion solo la pueda ejecutar el profesor.
     * 
     * Se usa en creaEvaluacion y en califica.
     */
    modifier soloProfesor() {
    bool esProfesor = false;
    for (uint i = 0; i < profesores.length; i++) {
        if (profesores[i] == msg.sender) {
            esProfesor = true;
            break;
        }
    }
    require(esProfesor, "Solo permitido al profesor");
    _;
}
    
    /**
     * Modificador para que una funcion solo la pueda ejecutar un alumno matriculado.
     */
    modifier soloMatriculados() {
        require(estaMatriculado(msg.sender), "Solo permitido a alumnos matriculados");
        _;
    }
    modifier soloCoordinador() {
        require(msg.sender == coordinador, "Solo permitido al coordinador");
        _;
    }
    
    /**
     * Modificador para que una funcion solo la pueda ejecutar un alumno no matriculado aun.
     */
    modifier soloNoMatriculados() {
        require(!estaMatriculado(msg.sender), "Solo permitido a alumnos no matriculados");
        _;
    }
     modifier soloOwner() {
        require(msg.sender == owner, "Solo permitido al owner del contrato");
        _;
    }
    modifier soloAbierta() {
        require(!cerrada, "No se pueden realizar cambios en una asignatura cerrada");
        _;
    }
    error DNIAlreadyInUse();

    /**
     * No se permite la recepcion de dinero.
     */
    receive() external payable {
        revert("No se permite la recepcion de dinero.");
    }
 }