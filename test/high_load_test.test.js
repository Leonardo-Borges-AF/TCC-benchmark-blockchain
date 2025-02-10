const TPCEBlockchain = artifacts.require("TPCEBlockchain");

contract("TPCEBlockchain - Alta Carga", async (accounts) => {
  it("Deve executar 10 testes simultaneamente, medir o desempenho e calcular o custo e TPS para cada teste", async () => {
    const instance = await TPCEBlockchain.deployed();

    // Configuração inicial: adicionar uma ação no mercado
    const ticker = "TEST";
    const stockName = "Test Stock";
    const stockPrice = web3.utils.toWei("0.00000001", "ether"); // Preço por ação
    const stockSupply = 999999999999999; // Suprimento total

    await instance.addStock(ticker, stockName, stockPrice, stockSupply, {
      from: accounts[0],
    });

    console.log("Ação adicionada ao mercado!");

    const totalTransactionsTarget = 100; // 1000 transações
    const stocksPerTransaction = 1000000; // Alta carga: 1000000 ações por transação

    console.log("Iniciando 10 testes de alta carga em paralelo...");

    // Função que executa um único teste
    async function runTest(testId) {
      let totalTransactions = 0;
      let totalGasUsed = 0;
      let totalCostWei = 0;

      const executionStart = Date.now();

      while (totalTransactions < totalTransactionsTarget) {
        try {
          // Valor total a ser enviado para comprar stocksPerTransaction ações
          const totalValue = web3.utils.toBN(stockPrice).mul(
            web3.utils.toBN(stocksPerTransaction)
          );

          // Realizar uma transação de compra de ações
          const tx = await instance.buyStock(ticker, stocksPerTransaction, {
            from: accounts[testId % accounts.length], // Alterna entre contas para evitar conflitos
            value: totalValue.toString(),
          });

          // Incrementar contadores
          totalTransactions++;
          totalGasUsed += tx.receipt.gasUsed;

          const txDetails = await web3.eth.getTransaction(tx.tx);
          const gasPrice = parseInt(txDetails.gasPrice);

          totalCostWei += tx.receipt.gasUsed * gasPrice;
        } catch (error) {
          console.error(
            `Erro no Teste ${testId}, Transação ${totalTransactions + 1}:`,
            error.message
          );
          break;
        }
      }

      const executionEnd = Date.now();
      const executionTime = (executionEnd - executionStart) / 1000;

      const totalCostInGwei = web3.utils.fromWei(totalCostWei.toString(), "gwei");
      const tps = totalTransactions / executionTime;

      console.log(`Teste ${testId} concluído!`);
      console.log(`Total de transações realizadas: ${totalTransactions}`);
      console.log(`Gas utilizado: ${totalGasUsed} wei`);
      console.log(`Custo total estimado: ${totalCostInGwei} Gwei`);
      console.log(`Tempo total: ${executionTime.toFixed(2)} segundos`);
      console.log(`TPS: ${tps.toFixed(2)}`);

      return {
        testId,
        totalTransactions,
        totalGasUsed,
        totalCostInGwei,
        executionTime,
        tps,
      };
    }

    // Executar 10 testes simultaneamente
    const promises = [];
    for (let i = 1; i <= 10; i++) {
      promises.push(runTest(i));
    }

    const results = await Promise.all(promises);

    console.log("Todos os 10 testes foram concluídos!");
    console.log("Resultados:", results);
  });
});
