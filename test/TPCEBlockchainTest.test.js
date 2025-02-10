const TPCEBlockchain = artifacts.require("TPCEBlockchain");

contract("TPCEBlockchain", async (accounts) => {
  it("should perform 1000 transactions and display gas, time, and cost for a representative transaction", async () => {
    const instance = await TPCEBlockchain.deployed();

    // Configuração inicial: adicionar uma ação no mercado
    const ticker = "TEST";
    const stockName = "Test Stock";
    const stockPrice = web3.utils.toWei("0.00001", "ether"); // Preço de 0.01 ETH por ação
    const stockSupply = 2; // 1 milhão de ações disponíveis

    await instance.addStock(ticker, stockName, stockPrice, stockSupply, { from: accounts[0] });

    console.log("Ação adicionada ao mercado!");

    const totalTransactionsTarget = 1;
    let totalTransactions = 0;
    let totalGasUsed = 0;

    console.log("Iniciando teste de transações...");

    // Obter o timestamp inicial
    const startTime = Date.now();

    // Executar as transações
    while (totalTransactions < totalTransactionsTarget) {
      try {
        // Registrar o timestamp antes de uma transação específica
        const txStartTime = Date.now();

        // Realizar uma transação de compra
        const tx = await instance.buyStock(ticker, 1, {
          from: accounts[1],
          value: stockPrice,
        });

        // Registrar o timestamp após a transação
        const txEndTime = Date.now();

        // Incrementar contadores
        totalTransactions++;
        totalGasUsed += tx.receipt.gasUsed;

        // Mostrar informações detalhadas apenas para a primeira transação
        if (totalTransactions === 1) {
          const gasUsed = tx.receipt.gasUsed;

          // Obter detalhes da transação para calcular o preço do gás
          const txDetails = await web3.eth.getTransaction(tx.tx);
          const gasPrice = parseInt(txDetails.gasPrice); // Em wei

          // Calcular o custo total em Gwei
          const totalCostGwei = web3.utils.fromWei((gasUsed * gasPrice).toString(), "gwei");

          // Calcular o tempo de execução em ms
          const executionTime = txEndTime - txStartTime;

          // Exibir os resultados da transação representativa
          console.log(`Gás consumido para a transação de compra: ${gasUsed}`);
          console.log(`Preço do gás (gasPrice): ${gasPrice} wei`);
          console.log(`Custo total da transação: ${totalCostGwei} Gwei`);
          console.log(`Tempo de execução da transação: ${executionTime} ms`);
        }
      } catch (error) {
        console.error("Erro durante a transação:", error.message);
        break;
      }
    }

    // Obter o timestamp final
    const endTime = Date.now();
    const totalTime = (endTime - startTime) / 1000; // Tempo total em segundos

    console.log("Teste concluído!");
    console.log(`Total de transações realizadas: ${totalTransactions}`);
    console.log(`Gás total consumido para ${totalTransactionsTarget} transações: ${totalGasUsed}`);
    console.log(`Tempo total para ${totalTransactionsTarget} transações: ${totalTime.toFixed(2)} segundos`);
  });
});

  
// teste de gas para apenas uma transação
// const TPCEBlockchain = artifacts.require("TPCEBlockchain");

// contract("TPCEBlockchain", async (accounts) => {
//   it("should calculate gas, time, and cost in Gwei for a single transaction", async () => {
//     const instance = await TPCEBlockchain.deployed();

//     // Configuração inicial: adicionar uma ação no mercado
//     const ticker = "TEST";
//     const stockName = "Test Stock";
//     const stockPrice = web3.utils.toWei("0.01", "ether"); // Preço de 0.01 ETH por ação
//     const stockSupply = 1000000; // 1 milhão de ações disponíveis
//     await instance.addStock(ticker, stockName, stockPrice, stockSupply, { from: accounts[0] });

//     console.log("Ação adicionada ao mercado!");

//     // Obter o timestamp antes da transação
//     const startTime = new Date().getTime();

//     // Realizar uma transação de compra
//     const tx = await instance.buyStock(ticker, 1, {
//       from: accounts[1],
//       value: stockPrice,
//     });

//     // Obter o timestamp após a transação
//     const endTime = new Date().getTime();

//     // Obter o consumo de gás
//     const gasUsed = tx.receipt.gasUsed;

//     // Obter o preço do gás atual
//     const gasPrice = await web3.eth.getGasPrice(); // Em wei

//     // Calcular o custo total em wei e converter para Gwei
//     const totalCostGwei = web3.utils.fromWei((gasUsed * gasPrice).toString(), "gwei");

//     // Calcular o tempo de execução
//     const executionTime = endTime - startTime; // Em milissegundos

//     // Exibir os resultados
//     console.log(`Gás consumido para a transação de compra: ${gasUsed}`);
//     console.log(`Preço do gás (gasPrice): ${gasPrice} wei`);
//     console.log(`Custo total da transação: ${totalCostGwei} Gwei`);
//     console.log(`Tempo de execução da transação: ${executionTime} ms`);
//   });
// });
