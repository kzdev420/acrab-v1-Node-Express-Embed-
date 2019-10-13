$("#wait").css("display", "block");
function OnCurrentUserLoadComplete(){

    //Get Route Template
    var routeTemplate = $('script[data-template="routeDetails"]').text().split(/\$\{(.+?)\}/g);
        
    //Render Templates
    function render(props) {
        return function(tok, i) { return (i % 2) ? props[tok] : tok; };
    }

    //Get route ID from URL
    let routeID = (window.location.search.substr(1).split('=')[1]);
    
    function initializeOnClicks(){
        
        $('.right-box').on('click',function(){
            if(currentUser.dbData.emiratesIDVerified){
                var leaveRoute = functions.httpsCallable('leaveRoute');
                leaveRoute({routeID: routeID,userID: currentUser.uid}).then(function(result) {
                    console.log(result);
                    window.location.href = '/profile'
                    
                });
            }else{
                alert('You have to first pass verification process');
            }
            console.log("Leave");
            
        });
    }

    //Call method from FirebaseRoute.js
    getRoute(routeID,function(route){
        var ftime=2400,ltime=0;
        Object.keys(route.data()).forEach(function (item) {
            if(item.includes("timeSlotsFor")){
                for(var i =0; i < route.data()[item].length; i++){    
                    if(route.data()[item][i]>ltime) ltime = route.data()[item][i];
                    if(route.data()[item][i]<ftime) ftime = route.data()[item][i];
                }
            }
        });
        var data = route.data();
        data.ftime = convertMilitaryToTwelveHour(ftime+"");
        data.ltime = convertMilitaryToTwelveHour(ltime+"");
        console.log(data);
        $('body').append(
            routeTemplate
                .map(
                    render(
                        data
                    )
                ).join('')
            );
        $("#wait").css("display", "none");


        initializeOnClicks();
        
    });

    //This method takes a military time (0830) and converts into 12 hour 8:30AM
    function convertMilitaryToTwelveHour(military){
        if(military.length==3) military = " "+military;
        let twelveHour = (military.substring(0, 2)+":"+military.substring(2));
        var date = new Date("February 04, 2011 "+twelveHour);
        var options = {hour: 'numeric', minute: 'numeric', hour12: true};
        return date.toLocaleString('en-US', options);
    }

    


}
