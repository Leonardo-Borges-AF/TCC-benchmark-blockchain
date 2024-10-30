const Benchmark = artifacts.require("TPCEBlockchain.sol");

module.exports = function(deployer) {
  deployer.deploy(Benchmark);
};
