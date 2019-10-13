function OnCurrentUserLoadComplete(){
    
    //Back button Navigation
    $('.back-button').click(function() {
        let amount = (window.location.search.substr(1).split('=')[1]);
        window.location.href = '/payment?amount='+amount;
    });

    //On clicking Pay
    $('.right-box').click(function() {
        //get voucherCode
        let voucherCode = ($('#voucherCode').val());
        
        //call cloudCode
        var addVoucher = functions.httpsCallable('addVoucher');
        addVoucher({code: voucherCode}).then(function(result) {
            console.log(result);
            console.log();
            if(!result.data.error){
                alert('Funds loaded');
                window.location.href = '/card';
            }else{
                alert(result.data.error);
            }
        });
    });
    
    
}