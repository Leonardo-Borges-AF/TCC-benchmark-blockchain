const TPCEBlockchain = artifacts.require("TPCEBlockchain.sol");

module.exports = function(deployer) {
  deployer.deploy(TPCEBlockchain, { gas: 5000000 });
};
