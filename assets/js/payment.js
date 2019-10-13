function OnCurrentUserLoadComplete(){

    //Back button Navigation
    $('.back-button').click(function() {
        window.location.href = '/recharge';
    });

    //Get Route Template
    var savedCardTemplate = $('script[data-template="savedCard"]').text().split(/\$\{(.+?)\}/g);
    
    //Render Templates
    function render(props) {
        return function(tok, i) { return (i % 2) ? props[tok] : tok; };
    }

    //On clicking one of the displayed payment options
    function listenForOnClicks(){
        $('.card').click(function() {
            let method = $(this).attr('data-pay-method');
            let amount = (window.location.search.substr(1).split('=')[1]);
            console.log(method);
            //Need to clean up here
            switch(method) {
            case "saved-card":
                let stripeID = $(this).attr('data-stripe-id');
                console.log(stripeID);
                var addFunds = functions.httpsCallable('addFunds');
                $('.loading').css("display","block")
                addFunds({amount: amount, source: stripeID}).then(function(result) {
                    $('.loading').css("display","none")
                    console.log(result);
                    console.log(result.data.error);
                    if(!result.data.error){
                        alert('Funds loaded');
                        window.location.href = '/card';
                    }
                });
                break;
            case "new-card":
                window.location.href = '/addCard?amount='+amount;
                break;
            case "voucher":
                window.location.href = '/voucher';
                break;
            case "Apple":
                text = "How you like them apples?";
                break;
            }
        });
    }


    //This code will show all the cards the user has already saved
    getUserSavedCards((savedCards)=>{
        var camalize = function camalize(str) {
            return str.toLowerCase().replace(/[^a-zA-Z0-9]+(.)/g, (m, chr) => chr.toUpperCase());
        }

        //add all cards to templates and render
        for(var i = 0; i < savedCards.length; i++){
            $('#saved-cards').append(savedCardTemplate.map(render({ 
                type: savedCards[i].type,
                last4: savedCards[i].last4,
                image: camalize(savedCards[i].type),
                stripeID: savedCards[i].stripeID,
            })).join(''));
        }

        listenForOnClicks();
    });
    
}