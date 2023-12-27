let Asignatura = artifacts.require("Asignatura");

module.exports = function(_deployer) {
    _deployer.deploy(Asignatura, "BCDA", "2023");
};