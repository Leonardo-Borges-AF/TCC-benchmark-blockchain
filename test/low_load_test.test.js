//Low
const TPC = artifacts.require("test");

contract("TPCEBlockchain - Baixa Carga", async (accounts) => {
  it("Deve executar 100 transações com baixa carga, medir o desempenho e calcular o custo e TPS", async () => {
    const instance = await TPC.deployed();

    const ticker = "test";
    const stockName = "test Stock";
    const stockPrice = web3.utils.toWei("0.00000001", "ether");
    const stockSupply = 10;

    await instance.addStock(ticker, stockName, stockPrice, stockSupply, {
      from: accounts[0],
    });

    console.log("Ação adicionada ao mercado!");

    const totalTransactionsTarget = 100;
    const stocksPerTransaction = 1;
    let totalTransactions = 0;
    let totalGasUsed = 0;
    let totalCostWei = 0;

    console.log("Iniciando 10 testes de baixa carga...");

    const executionStart = Date.now();

    while (totalTransactions < totalTransactionsTarget) {
      try {
        const totalValue = web3.utils.toBN(stockPrice).mul(
          web3.utils.toBN(stocksPerTransaction)
        );
        const tx = await instance.buyStock(ticker, 1, {
          from: accounts[1],
          value: totalValue.toString(),
        });

        totalTransactions++;
        totalGasUsed += tx.receipt.gasUsed;

        const txDetails = await web3.eth.getTransaction(tx.tx);
        const gasPrice = parseInt(txDetails.gasPrice);

        totalCostWei += tx.receipt.gasUsed * gasPrice;

        
      } catch (error) {
        console.error(`Erro na transação ${totalTransactions + 1}:`, error.message);
        break;
      }
      
    }

    const executionEnd = Date.now();
    const executionTime = (executionEnd - executionStart) / 1000;

    const totalCostInGwei = web3.utils.fromWei(totalCostWei.toString(), "gwei");
    const tps = totalTransactions / executionTime;

    console.log("Teste concluído!");
    console.log(`Total de transações realizadas: ${totalTransactions}`);
    console.log(`Gás total consumido: ${totalGasUsed}`);
    console.log(`Custo total estimado: ${totalCostInGwei} Gwei`);
    console.log(`Tempo total: ${executionTime.toFixed(2)} segundos`);
    console.log(`TPS: ${tps.toFixed(2)}`);
  });
});
