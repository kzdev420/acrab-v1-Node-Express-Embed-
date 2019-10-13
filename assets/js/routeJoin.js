$("#wait").css("display", "block");
function OnCurrentUserLoadComplete(){

    //Get Route Template
    var routeTemplate = $('script[data-template="routeDetails"]').text().split(/\$\{(.+?)\}/g);
    var scheduleTemplate = $('script[data-template="schedule"]').text().split(/\$\{(.+?)\}/g);
    var locationNames = $('script[data-template="locationNames"]').text().split(/\$\{(.+?)\}/g);
        
    //Render Templates
    function render(props) {
        return function(tok, i) { return (i % 2) ? props[tok] : tok; };
    }

    //Get route ID from URL
    let routeID = (window.location.search.substr(1).split('=')[1]);
    
    function initializeOnClicks(){
        $('.right-box').on('click',function(){
            if(currentUser.dbData.emiratesIDVerified){
                var joinRoute = functions.httpsCallable('joinRoute');
                joinRoute({routeID: routeID,userID: currentUser.uid}).then(function(result) {
                    console.log(result);
                    window.location.href = '/profile'
                    
                });
            }else{
                alert('You have to first pass verification process');
            }
            
        });
    }

    //Call method from FirebaseRoute.js
    getRoute(routeID,function(route){
        //Add route body information
        $('.arc-profile-header').append(locationNames.map(render({
            startLocationName: route.data().startLocationName,
            endLocationName: route.data().endLocationName,     
        })).join(''));

        //Add route schedule info
        let ftime=2400,ltime=0;
               
        Object.keys(route.data()).forEach(function (item) {
            if(item.includes("timeSlotsFor")){
                var timeSlots = "";
                for(var i =0; i < route.data()[item].length; i++){    
                    timeSlots+= "<p class='t'>"+(convertMilitaryToTwelveHour(route.data()[item][i]+""))+"</p>";
                    if(route.data()[item][i]>ltime) ltime = route.data()[item][i];
                    if(route.data()[item][i]<ftime) ftime = route.data()[item][i];
                }
                $('.available-timings').append(scheduleTemplate.map(render({
                    dayOfWeek: item.split("timeSlotsFor")[1],
                    timeSlots: timeSlots
                })).join(''));
                console.log(timeSlots);
            }
        });

        $('.abt-route').append(routeTemplate.map(render({
            about: route.data().about,
            trips: route.data().trips,
            membersTotal: route.data().membersTotal,
            ftime: convertMilitaryToTwelveHour(ftime+""),
            ltime: convertMilitaryToTwelveHour(ltime+""),
            duration: route.data().duration,
            routeInfo: route.data().routeInfo,
        })).join(''));
        
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
