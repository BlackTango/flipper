// A $( document ).ready() block.
$(document).ready(function () {

    var transactions = []
    var prices


    // Si il existe des cookies, va les cherches 
    get_cookies();

    // fonction pour faire des assync call pour les api 
    function httpGetAsync(theUrl, callback) {
        var xmlHttp = new XMLHttpRequest();
        xmlHttp.onreadystatechange = function () {
            if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
                callback(xmlHttp.responseText);
        }
        xmlHttp.open("GET", theUrl, true); // true for asynchronous 
        xmlHttp.send(null);
    }

    //cette fonction va faire 2 choses: 1 il va aller cherches les nouveaux prix de coin market cap (il recoit en async)
    // ensuite il va aller update la valeur des profit pour tout les objet dans transactions.
    // Aussi, il va efacer tout le tableau et le regenerer avec les nouvelles valeurs.
    function price_updater(price_list) {
        prices = JSON.parse(price_list);

        //ici on update tout les profits
        for (var i = 0; i < transactions.length; i++) {
            transactions[i].relative = calculate_profit(transactions[i]).relative + "%";
            transactions[i].absolute = calculate_profit(transactions[i]).absolute + "%";
        }

        $('#table_body').empty();

        // ici on va aller creer le tableau avec les nouvelles vlauers.
        for (var i = 0; i < transactions.length; i++) {
            $('#table_body').append('<tr><td><a href="#information" class=" modal-trigger waves-effect waves-light btn-floating btn-medium light-green darken-1 center z-depth-3"><i id="' + i + '" class="material-icons">add</i></a></td><td>' + transactions[i].cryptoA + '</td><td>' + transactions[i].cryptoB + '</td><td class=' + is_positive(transactions[i].relative) + '>' + transactions[i].relative + '</td><td class=' + is_positive(transactions[i].absolute) + ' >' + transactions[i].absolute + '</td></tr>')
        }
    }


    // cette fonction sert a changer la couleur du text si le pourcentage est positif ou negatif ou neutre.
    function is_positive(percentage) {
        if (parseFloat(percentage) < 0) return "red-text";
        else if (parseFloat(percentage) == 0) return "";
        else return "green-text"
    }

    // cette fonction permet d<aller chercher le prix d<un coin directement dans la base de donne prix.
    // on peut utiliser plusieurs nomenclature genre BTC ou bitcoin ou Bitcoin
    function get_price(name) {

        for (var j = 0; j < prices.length; j++) {
            switch (name) {
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



    // c'est ici qu'on fait les calcule des pourcentage.
    function calculate_profit(transaction) {

        var profit = { absolute: 0, relative: 0 }
        var nowA = get_price(transaction.cryptoA)
        var nowB = get_price(transaction.cryptoB)

        profit.relative = (((transaction.amount_received * nowB) / (transaction.amount_sent * nowA)) - 1) * 100;
        profit.absolute = (((transaction.amount_received * nowB) / transaction.USD_received) - 1) * 100;
        profit.relative = profit.relative.toFixed(2);
        profit.absolute = profit.absolute.toFixed(2);
        return profit;
    }


    function make_transaction(cryptoA, cryptoB, USD_sent, USD_received, amount_sent, amount_received) {
        transactions[transactions.length] =
            {
                cryptoA: cryptoA, cryptoB: cryptoB, USD_sent: USD_sent, USD_received: USD_received,
                amount_sent: amount_sent, amount_received: amount_received
            }
    }

    httpGetAsync("https://api.coinmarketcap.com/v1/ticker/", price_updater);


    $('.modal').modal().init;

    $('#new').click(function a() {
        clean_input();
    });

    $('#cancel').click(function a() {
        clean_input();
    });

    $('#id_getter').click(function a() {
        $('#id_restorer_input').val('');
        console.log("is in clean ")

    });

    $('#id_generation_save').click(function a() {
        try {
            transactions = JSON.parse($('#id_restorer_input').val())
            refresh();
            M.toast({ html: 'Transactions generated!' })
        }
        catch (error) {
            console.log(error);
            M.toast({ html: 'Transactions generation failed, are you sure the id is correct?' })
        }
    });



    $('#id_generation_cancel').click(function a() {
        $('#id_restorer_input').val('');
        console.log("id out clean")

    });


    $('#make_id').click(function a() {
        console.log("id generated");
        $('#id_location').text(JSON.stringify(transactions))
    });

    $('#copy_button').click(function a() {
        copyToClipboard("#id_location")
        M.toast({ html: 'Id copied!' })
    });



    $("#table_body").on("click", function () {
        if (event.target.id != "") {


            $('#gen_footer').empty();
            $('#gen_footer').append('<a href="#!" id="cancel" type="cancel" class="modal-action modal-close waves-effect waves-green btn-flat">cancel</a>');
            $('#gen_footer').append('<a href="#!" id="' + event.target.id + "del" + '" type="delete" class="modal-action modal-close waves-effect waves-green btn-flat">delete</a>');
            $('#gen_footer').append('<a href="#!" id="' + event.target.id + '" type="save" class="modal-action modal-close waves-effect waves-green btn-flat">save</a>');

            var a = event.target.id;

            $('#cryptoA_gen').val(transactions[a].cryptoA);
            $('#amount_sent_gen').val(transactions[a].amount_sent);
            $('#USD_sent_gen').val(transactions[a].USD_sent);
            $('#cryptoB_gen').val(transactions[a].cryptoB);
            $('#amount_received_gen').val(transactions[a].amount_received);
            $('#USD_received_gen').val(transactions[a].USD_received);

            update_cookies();
        }
    });

    $('#gen_footer').on("click", function () {
        var x = event.target.id
        if (x == "cancel");
        else if (x.includes("del")) {
            transactions.splice(parseInt(x), 1)
            refresh();
        }
        else {
            transactions[parseInt(x)].cryptoA = $('#cryptoA_gen').val();
            transactions[parseInt(x)].amount_sent = $('#amount_sent_gen').val();
            transactions[parseInt(x)].USD_sent = $('#USD_sent_gen').val();
            transactions[parseInt(x)].cryptoB = $('#cryptoB_gen').val();
            transactions[parseInt(x)].amount_received = $('#amount_received_gen').val();
            transactions[parseInt(x)].USD_received = $('#USD_received_gen').val();
            refresh();
        }
    });


    $('#save').click(function new_transaction() {
        make_transaction($('#cryptoA').val(), $('#cryptoB').val(), $('#USD_sent').val(), $('#USD_received').val(), $('#amount_sent').val(), $('#amount_received').val());
        refresh();
        update_cookies();
    });

    function copyToClipboard(element) {
        var $temp = $("<input>");
        $("body").append($temp);
        $temp.val($(element).text()).select();
        document.execCommand("copy");
        $temp.remove();
    }



    function clean_input() {
        $('#cryptoA').val('');
        $('#amount_sent').val('');
        $('#USD_sent').val('');
        $('#cryptoB').val('');
        $('#amount_received').val('');
        $('#USD_received').val('');
        console.log("input clean")
    }

    function refresh() {
        httpGetAsync("https://api.coinmarketcap.com/v1/ticker/", price_updater);
        M.toast({ html: 'refreshed' })
    }

    window.setInterval(function () {
        console.log("refreshed")
        refresh()
    }, 60000);

    function update_cookies() {
        console.log(JSON.stringify(transactions))
        Cookies.set('lol', JSON.stringify(transactions));
        console.log("lol")
        
        //get_cookies();
    }

    function get_cookies() {

        try {
            console.log(Cookies.get('transactions'));
            transactions = JSON.parse(Cookies.get('transactions'))
        }
        catch (error) {
            console.log(error);
        }
    }

    // juste pour vérifier que la branche fonctionne


});


