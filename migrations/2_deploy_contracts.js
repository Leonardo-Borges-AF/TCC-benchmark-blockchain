const TPCEBlockchain = artifacts.require("TPCEBlockchain");

module.exports = function (deployer) {
    deployer.deploy(TPCEBlockchain);
};
