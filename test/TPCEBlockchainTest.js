const TPCEBlockchain = artifacts.require("TPCEBlockchain");

contract("TPCEBlockchain", (accounts) => {
    const [owner, user1, user2, user3] = accounts;

    it("should deploy the contract and set initial stocks", async () => {
        const contract = await TPCEBlockchain.deployed();

        // Adiciona ações ao contrato
        await contract.addStock("AAPL", "Apple", web3.utils.toWei("0.1", "ether"), 1000);
        await contract.addStock("GOOGL", "Google", web3.utils.toWei("0.2", "ether"), 500);
        await contract.addStock("AMZN", "Amazon", web3.utils.toWei("0.3", "ether"), 300);

        // Verifica se as ações foram adicionadas corretamente
        const appleStock = await contract.stocks("AAPL");
        assert.equal(appleStock.name, "Apple", "Ação Apple não adicionada corretamente");
        assert.equal(appleStock.price, web3.utils.toWei("0.1", "ether"), "Preço incorreto");
    });

    it("should allow users to buy and sell stocks", async () => {
        const contract = await TPCEBlockchain.deployed();

        // Simula uma série de compras
        await contract.buyStock("AAPL", 5, { from: user1, value: web3.utils.toWei("0.5", "ether") });
        await contract.buyStock("GOOGL", 2, { from: user2, value: web3.utils.toWei("0.4", "ether") });
        await contract.buyStock("AMZN", 1, { from: user3, value: web3.utils.toWei("0.3", "ether") });

        // Verifica os saldos dos usuários
        const user1Balance = await contract.getUserStockBalance(user1, "AAPL");
        const user2Balance = await contract.getUserStockBalance(user2, "GOOGL");
        const user3Balance = await contract.getUserStockBalance(user3, "AMZN");

        assert.equal(user1Balance.toNumber(), 5, "Saldo incorreto para user1");
        assert.equal(user2Balance.toNumber(), 2, "Saldo incorreto para user2");
        assert.equal(user3Balance.toNumber(), 1, "Saldo incorreto para user3");

        // Simula uma série de vendas
        await contract.sellStock("AAPL", 2, { from: user1 });
        await contract.sellStock("GOOGL", 1, { from: user2 });
        await contract.sellStock("AMZN", 1, { from: user3 });

        // Verifica o saldo após venda
        const newUser1Balance = await contract.getUserStockBalance(user1, "AAPL");
        const newUser2Balance = await contract.getUserStockBalance(user2, "GOOGL");
        const newUser3Balance = await contract.getUserStockBalance(user3, "AMZN");

        assert.equal(newUser1Balance.toNumber(), 3, "Saldo incorreto após venda para user1");
        assert.equal(newUser2Balance.toNumber(), 1, "Saldo incorreto após venda para user2");
        assert.equal(newUser3Balance.toNumber(), 0, "Saldo incorreto após venda para user3");
    });
});
