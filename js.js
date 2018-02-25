

var transactions = []

function get_price(name){
    if (name == "BTC") return 9000;
    else return 1000;
}


function calculate_profit(transaction){
    var profit = {absolute:0,relative:0}
    var nowA = get_price(transaction.cryptoA)
    var nowB = get_price(transaction.cryptoB)
    profit.relative = (((transaction.amount_received * nowB) / (transaction.amount_sent * nowA)) - 1) * 100;
    profit.absolute = (((transaction.amount_received * nowB) / transaction.USD_received) - 1) * 100;
    return profit;
}


function make_transaction(cryptoA,cryptoB,USD_sent,USD_received,amount_sent,amount_received){
    transactions[transactions.length]=
    {cryptoA:cryptoA,cryptoB:cryptoB,USD_sent:USD_sent,USD_received:USD_received,
    amount_sent:amount_sent,amount_received:amount_received}
}

make_transaction("BTC","ETH",1000,990,1,5.9);
make_transaction("bitcoin","etherum",1000,990,1,5.9);
make_transaction("bitcoin","etherum",1000,990,1,5.9);
make_transaction("bitcoin","etherum",1000,990,1,5.9);
make_transaction("bitcoin","etherum",1000,990,1,5.9);

console.log(transactions.length);
console.log(calculate_profit(transactions[0]).absolute + "%")
console.log(calculate_profit(transactions[0]).relative + "%")