function OnCurrentUserLoadComplete(){
    
    //Back button Navigation
    $('.back-button').click(function() {
        window.location.href = '/profile';
    });

    //set user data
    let firstName = currentUser.dbData.firstName; let lastName = currentUser.dbData.lastName;
    $('.title').html(firstName+" "+lastName);
    $('.initials').html("<span>"+(firstName.charAt(0)+lastName.charAt(0))+"</span>")

    //Get Transaction History template
    var txHistoryTemplate = $('script[data-template="txHistory"]').text().split(/\$\{(.+?)\}/g);
    var info_holderTemplate = $('script[data-template="info_holder"]').text().split(/\$\{(.+?)\}/g);

    //Render Templates
    function render(props) {
        return function(tok, i) { return (i % 2) ? props[tok] : tok; };
    }

    getUserBalance(function (balanceDoc){
        
        let balanceData = balanceDoc.data(); 
        // $('#userBalance').html("AED "+balanceData.balance);
        // get nextride information and show card
        var param= {
            user_id: currentUser.dbData.id,
            type: 3
        }
        jQuery.ajax({
            type: 'POST',
            url: '/profile',
            data: param,
            success: function(result) {
                // alert(balanceData.balance);
                var str = result.split('##');
                if(str[1] == "11:59 PM"){
                    str[0] = "No Selected Any Routes";
                    str[1] = "No Selected Any Times";
                }
                $('#info_holder').append(
                info_holderTemplate
                    .map(
                        render({
                            routeName: str[0],
                            time: str[1],
                            balanceData: "AED "+balanceData.balance
                        })
                    )
                    .join('')					
                );	
            }
        }).responseText;
        //Add user transaction history
        balanceData.history.forEach(function(element) {
            $('.history').append(txHistoryTemplate.map(render({ 
                amount: element.split(',')[0], 
                date: element.split(',')[1]
            })).join(''));
        });
        
    },function (error){

    });
}
