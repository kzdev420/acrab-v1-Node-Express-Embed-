function loadExploreTabComponents(){


    //Get Route Template
    var routeTemplate = $('script[data-template="routeItem"]').text().split(/\$\{(.+?)\}/g);
        
    //Render Templates
    function render(props) {
        return function(tok, i) { return (i % 2) ? props[tok] : tok; };
    }

    //This method gets all available routes for Explore
    getAllAvailableRoutes(onGetAllRoutesSuccess, function (error){});

    function onGetAllRoutesSuccess(allRoutes){
        $('#explore-content').html('');
        allRoutes.forEach(function (doc) {
            
            let currentRoute = doc.data();
            let buttonText = "Join";
            let description = "";

            //If the route is NOT active, set attributes to 'vote'
            if(!currentRoute.active){
                buttonText = "Vote";
                description = "Get this route live";
                if(currentRoute.votes.includes(currentUser.uid)) {
                    buttonText = currentRoute.votesTotal+"/"+currentRoute.votesRequired;
                    description = "You voted for this route";
                }
            } 
            //If the route has current user as a member, set attributes to 'View'
            if(currentRoute.members.includes(currentUser.uid)){
                buttonText = "Quit";
                
                //When a user is already a member the description should show the next time slot that arcab will leave
                var days = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
                let timeSlots = doc.data()['timeSlotsFor'+days[new Date().getDay()]].sort();
                currentHour = new Date().getHours()*100;
                description = "Next arcab at "+convertMilitaryToTwelveHour(Math.min(...timeSlots)+"");
                for (i = 0; i < timeSlots.length; i++) { 
                    if(timeSlots[i]>currentHour){
                        description = "Next arcab at "+convertMilitaryToTwelveHour(timeSlots[i]+"");
                        break;
                    }
                }
            } 
            
            
            //add route data to template and append to explore content
            $('#explore-content').append(routeTemplate.map(render({ 
                routeName: currentRoute.name, 
                membersTotal: currentRoute.membersTotal,
                trips: currentRoute.trips,
                duration: currentRoute.duration,
                buttonText: buttonText,
                description: description,
                id: currentRoute.id
            })).join(''));
            
            //Clicking on a route
            $('#'+currentRoute.id).on('click',function(e){
                let routeID = $(this).attr('data-id');

                //When clicked on the button action
                if($(e.target).attr('class')==='explore-item-action'){

                    let action = $(e.target).attr('data-action');
                    console.log(routeID);
                    //check if user is verified
                    if(currentUser.dbData.emiratesIDVerified){
                        executeExploreItemAction(routeID,action);
                    }else{
                        alert('You have to first pass verification process');
                    }



                }else{
                    //when clicked on the entire route
                    let action = $(this).attr('data-action');
                    if(action=="Join"){
                        window.location.href = '/routeJoin?routeId='+routeID;
                    }else{
                        window.location.href = '/routeView?routeId='+routeID;
                    }

                }

            })
            
            $("#wait").css("display", "none");

        });
    };

    /**
     * 
     * @param {*} routeID - takes the route ID 
     * @param {*} action  - takes one of three actions Vote, Join and View
     *  Executes the action 
     */
    function executeExploreItemAction(routeID,action){
        
        $("#wait").css("display", "block");
        console.log(routeID+action);
        
        switch(action) {
        case "Vote":
            var voteForRoute = functions.httpsCallable('voteForRoute');
            voteForRoute({routeID: routeID,userID: currentUser.uid}).then(function(result) {
                console.log(result);
                getAllAvailableRoutes(onGetAllRoutesSuccess, function (error){});
                
            });
            break;
        case "Join":
            var joinRoute = functions.httpsCallable('joinRoute');
            joinRoute({routeID: routeID,userID: currentUser.uid}).then(function(result) {
                console.log(result);
                getAllAvailableRoutes(onGetAllRoutesSuccess, function (error){});
                
            });
            break;
        case "Quit":
            var leaveRoute = functions.httpsCallable('leaveRoute');
            leaveRoute({routeID: routeID,userID: currentUser.uid}).then(function(result) {
                getAllAvailableRoutes(onGetAllRoutesSuccess, function (error){});
                
            });
            managecsv(routeID,null,null,null,2);
            // $('#upcoming-'+routeID).remove();
            // $('#cancelledTrip-'+ routeID).remove();
            $('#checktrip').css('display','none');
            $('#route-schedule-pick').css('display','block');
            break;
        }
    }

    //This method takes a military time (0830) and converts into 12 hour 8:30AM
    function convertMilitaryToTwelveHour(military){
        if(military.length==3) military = " "+military;
        let twelveHour = (military.substring(0, 2)+":"+military.substring(2));
        var date = new Date("February 04, 2011 "+twelveHour);
        var options = {hour: 'numeric', minute: 'numeric', hour12: true};
        return date.toLocaleString('en-US', options);
    }

}
