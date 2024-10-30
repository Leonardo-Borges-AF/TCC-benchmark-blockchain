// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract TPCEBlockchain {
    // Estrutura para armazenar uma ação
    struct Stock {
        string name; // Nome da ação
        uint256 price; // Preço por ação (em wei)
        uint256 totalSupply; // Total de ações disponíveis
    }

    // Mapeamento para armazenar as ações disponíveis no mercado (ticker -> Stock)
    mapping(string => Stock) public stocks;

    // Mapeamento para armazenar o saldo de ações de cada usuário (usuário -> ticker -> quantidade de ações)
    mapping(address => mapping(string => uint256)) public userStocks;

    // Evento para registrar compra e venda
    event StockPurchased(address indexed buyer, string ticker, uint256 amount);
    event StockSold(address indexed seller, string ticker, uint256 amount);

    // Adiciona uma nova ação no mercado
    function addStock(
        string memory ticker,
        string memory name,
        uint256 price,
        uint256 totalSupply
    ) public {
        stocks[ticker] = Stock(name, price, totalSupply);
    }

    // Função para comprar ações
    function buyStock(string memory ticker, uint256 amount) public payable {
        Stock storage stock = stocks[ticker];

        // Verificar se há ações suficientes disponíveis
        require(stock.totalSupply >= amount, "Not enough stock available");

        // Verificar se o comprador enviou ETH suficiente para a compra
        uint256 totalCost = stock.price * amount;
        require(msg.value >= totalCost, "Not enough ether sent");

        // Transferir as ações para o comprador
        stock.totalSupply -= amount;
        userStocks[msg.sender][ticker] += amount;

        // Registrar a compra
        emit StockPurchased(msg.sender, ticker, amount);
    }

    // Função para vender ações
    function sellStock(string memory ticker, uint256 amount) public {
        // Verificar se o usuário possui ações suficientes
        require(
            userStocks[msg.sender][ticker] >= amount,
            "Not enough stock to sell"
        );

        // Recuperar as informações da ação
        Stock storage stock = stocks[ticker];

        // Atualizar o saldo do usuário
        userStocks[msg.sender][ticker] -= amount;
        stock.totalSupply += amount;

        // Enviar o valor correspondente ao vendedor
        uint256 totalValue = stock.price * amount;
        payable(msg.sender).transfer(totalValue);

        // Registrar a venda
        emit StockSold(msg.sender, ticker, amount);
    }

    // Função para consultar o saldo de ações de um usuário
    function getUserStockBalance(
        address user,
        string memory ticker
    ) public view returns (uint256) {
        return userStocks[user][ticker];
    }

    // Função para consultar o preço de uma ação
    function getStockPrice(string memory ticker) public view returns (uint256) {
        return stocks[ticker].price;
    }
}
