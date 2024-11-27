const TPCEBlockchain = artifacts.require("TPCEBlockchain");

contract("TPCEBlockchain", async (accounts) => {
  it("should perform maximum transactions in 1 minute", async () => {
    const instance = await TPCEBlockchain.deployed();

    // Configuração inicial: adicionar uma ação no mercado
    const ticker = "TEST";
    const stockName = "Test Stock";
    const stockPrice = web3.utils.toWei("0.01", "ether"); // Preço de 0.01 ETH por ação
    const stockSupply = 1000000; // 1 milhão de ações disponíveis

    await instance.addStock(ticker, stockName, stockPrice, stockSupply, { from: accounts[0] });

    console.log("Ação adicionada ao mercado!");

    const startTime = Date.now();
    const endTime = startTime + 60 * 1000; // 1 minuto em milissegundos
    let totalTransactions = 0;
    let totalGasUsed = 0;

    console.log("Iniciando teste de transações...");

    while (Date.now() < endTime) {
      try {
        // Simular a compra de 1 ação por transação
        const tx = await instance.buyStock(ticker, 1, {
          from: accounts[1], // Comprador
          value: stockPrice, // Enviar o valor correspondente a 1 ação
        });

        // Incrementar contadores
        totalTransactions++;
        totalGasUsed += tx.receipt.gasUsed;
      } catch (error) {
        console.error("Erro durante a transação:", error.message);
        break;
      }
    }

    console.log("Teste concluído!");
    console.log(`Total de transações realizadas: ${totalTransactions}`);
    console.log(`Gás total consumido: ${totalGasUsed}`);

    // Validações
    assert.isAbove(totalTransactions, 0, "Nenhuma transação foi realizada");
    assert.isAbove(totalGasUsed, 0, "Nenhum gás foi consumido");
  });
});
