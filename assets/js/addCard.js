function OnCurrentUserLoadComplete(){

    //Back button Navigation
    $('.back-button').click(function() {
        let amount = (window.location.search.substr(1).split('=')[1]);
        window.location.href = '/payment?amount='+amount;
    });

    var stripe = Stripe('pk_test_dVgRM48trg7arnr4tBlOt0sF');
    var elements = stripe.elements();

    //amount to add
    let amount = (window.location.search.substr(1).split('=')[1]);


    // Custom styling can be passed to options when creating an Element.
    var style = {
        base: {
          color: '#32325d',
          fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
          fontSmoothing: 'antialiased',
          fontSize: '16px',
          '::placeholder': {
            color: '#aab7c4'
          }
        },
        invalid: {
          color: '#fa755a',
          iconColor: '#fa755a'
        }
      };

    // Create an instance of the card Element.
    var card = elements.create('card', {style: style});

    // Add an instance of the card Element into the `card-element` <div>.
    card.mount('#card-element');

    //On cc form submit Stripe will tokenize the card. 
    $( "#payment-form" ).submit(function( event ) {
        event.preventDefault();
        stripe.createToken(card).then(function(result) {
            if (result.error) {
                // Inform the customer that there was an error.
                var errorElement = document.getElementById('card-errors');
                errorElement.textContent = result.error.message;
            } else {
                // Send the token to firebase server.
                addCard(result.token);
            }
        });
    });

    // Send the token to firebase server. and add the card information to stripe. Stripe will save 
    // card info along with user information. The stripe customer id is then saved in firebase for future use
    function addCard(token){
        //addFunds();
        var addCardToUser = functions.httpsCallable('addCardToUser');
        addCardToUser({token: token}).then(function(result) {
            console.log(result);
            console.log(result.data.error);
            if(!result.data.error){
                alert('Card Added');
                window.location.href = '/recharge'
            }
        });
    }

    //On clicking pay, the form is submitted
    $('#pay').click(function() {
        $( "#payment-form" ).submit();
    });

}