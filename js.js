

var transactions = []
var prices

// fonction pour faire des assync call pour les api 
function httpGetAsync(theUrl, callback)
{
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function() { 
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
            callback(xmlHttp.responseText);
    }
    xmlHttp.open("GET", theUrl, true); // true for asynchronous 
    xmlHttp.send(null);
}

function price_updater(prices){
    prices = JSON.parse(prices);
    console.log(prices.length);

    for (var i = 0; i < transactions.length; i++){
        console.log(calculate_profit(transactions[i]).absolute,calculate_profit(transactions[i]).absolute)
    }

}

function get_price(name){
    console.log(prices);

    for (var i=0; i < prices.length; i++){
        switch (name){
            case prices[i].id:
                return price[i].price_usd;
                break;
            case prices[i].name:
                return price[i].price_usd;
                break;
            case price[i].symbol:
                return price[i].price_usd;
                break;
            default:
            return NaN;
        }
    }
}


function calculate_profit(transaction){

    var profit = {absolute:0,relative:0}
    var nowA = get_price(transaction.cryptoA)
    var nowB = get_price(transaction.cryptoB)

    console.log(nowA,nowB);

    profit.relative = (((transaction.amount_received * nowB) / (transaction.amount_sent * nowA)) - 1) * 100;
    profit.absolute = (((transaction.amount_received * nowB) / transaction.USD_received) - 1) * 100;
    return profit;
}


function make_transaction(cryptoA,cryptoB,USD_sent,USD_received,amount_sent,amount_received){
    transactions[transactions.length]=
    {cryptoA:cryptoA,cryptoB:cryptoB,USD_sent:USD_sent,USD_received:USD_received,
    amount_sent:amount_sent,amount_received:amount_received}
}

make_transaction("BTC","ETH",1000,990,1,9.9);

httpGetAsync("https://api.coinmarketcap.com/v1/ticker/",price_updater);

