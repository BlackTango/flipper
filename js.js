

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

function price_updater(price_list){
    prices = JSON.parse(price_list);
    console.log(prices.length);

    for (var i = 0; i < transactions.length; i++){
        console.log(calculate_profit(transactions[i]).relative +"%",calculate_profit(transactions[i]).absolute +"%")
    }
}


function get_price(name){

    for (var j=0; j < prices.length; j++){
        switch (name){
            case prices[j].id:
                return prices[j].price_usd;
                break;
            case prices[j].name:
                return prices[j].price_usd;
                break;
            case prices[j].symbol:
                return prices[j].price_usd;
                break;
        }
    }
}




function calculate_profit(transaction){

    console.log(prices);

    var profit = {absolute:0,relative:0}
    var nowA = get_price(transaction.cryptoA)
    var nowB = get_price(transaction.cryptoB)

    profit.relative = (((transaction.amount_received * nowB) / (transaction.amount_sent * nowA)) - 1) * 100;
    profit.absolute = (((transaction.amount_received * nowB) / transaction.USD_received) - 1) * 100;
    profit.relative = profit.relative.toFixed(2);
    profit.absolute = profit.absolute.toFixed(2);
    return profit;
}


function make_transaction(cryptoA,cryptoB,USD_sent,USD_received,amount_sent,amount_received){
    transactions[transactions.length]=
    {cryptoA:cryptoA,cryptoB:cryptoB,USD_sent:USD_sent,USD_received:USD_received,
    amount_sent:amount_sent,amount_received:amount_received}
}

make_transaction("BTC","ETH",900,864.6/2,0.04116530,0.5);

httpGetAsync("https://api.coinmarketcap.com/v1/ticker/",price_updater);

