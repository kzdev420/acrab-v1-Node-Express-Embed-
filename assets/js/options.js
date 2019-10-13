function OnCurrentUserLoadComplete() {

    //On content click	
    $('.content-bottom').click(function () {
        
        //On logout click
        if($(this).attr('data-link')=="logout"){
            firebase.auth().signOut();
        }else{
            window.location.href = $(this).attr('data-link');
        }
        
    });

    //Back button Navigation
    $('.back-button').click(function() {
        window.location.href = '/profile';
    });

}
