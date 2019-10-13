$("#wait").css("display", "none");

function loadHomeTabComponents() {
	//Get Templates
	var routeTemplate = $('script[data-template="participatingRouteItem"]').text().split(/\$\{(.+?)\}/g);
	var welcomeTemplate = $('script[data-template="welcomeToArcab"]').text().split(/\$\{(.+?)\}/g);
	var emiratesIDTemplate = $('script[data-template="emiratesID"]').text().split(/\$\{(.+?)\}/g);
	var upcomingTripTemplate = $('script[data-template="upcomingTrip"]').text().split(/\$\{(.+?)\}/g);
	var cancelledTripTemplate = $('script[data-template="cancelledTrip"]').text().split(/\$\{(.+?)\}/g);

	//Render Templates
	function render(props) {
		return function(tok, i) {
			return i % 2 ? props[tok] : tok;
		};
	}

	//render Emirates Tile
	let emiratesIDVerified = currentUser.dbData.emiratesIDVerified;
	let dismissedEmiratesIDVerify = currentUser.dbData.dismissedEmiratesIDVerify;
	if (dismissedEmiratesIDVerify == undefined && (!emiratesIDVerified || emiratesIDVerified === undefined))
		$('#home-content').append(
			emiratesIDTemplate.map(render({ dismiss: currentUser.dbData.emiratesIDURL1 ? 'grid' : 'None' })).join('')
		);

	//render Welcome Tile
	let dismissedWelcomeToArcab = currentUser.dbData.dismissedWelcomeToArcab;
	if (!dismissedWelcomeToArcab || dismissedWelcomeToArcab === undefined)
		$('#home-content').append(welcomeTemplate.map(render()).join(''));

	//When dissmiss clicked on WelcomeToArcab tile, it removes itself
	$('#dimissWelcomeToArcab').on('click', function() {
		dismissWelcomeToArcab(function() {
			console.log('done');
			$('#welcomeToArcab').remove();
		});
	});

	//When dissmiss clicked on EmiratesID tile, it removes itself
	$('#dismiss-emirates-id').on('click', function() {
		dismissEmiratesIDVerify(function() {
			$('#emiratesIDTile').remove();
		});
	});

	//Prompt for file
	// $('#take-photo').on('click', function() {
	// 	$('#file-input1').click();
	// 	$('#file-input2').click();
	// });

	$('#take-front').on('click', function() {
		$('#file-input1').click();
	});

	$('#take-back').on('click', function() {
		$('#file-input2').click();
	});

	var picture1URL = '';
	var picture2URL = '';

	//upload file #1 once selected or captured
	$('#file-input1').change(function(e) {
		var selectedFile = e.target.files[0];
		var emiratesID = storage.child('ID_Images/' + currentUser.uid + '1.jpg');
		const uploadTask = emiratesID.put(selectedFile);
		uploadTask.on(
			'state_changed',
			(snapshot) => {
				// Observe state change events such as progress, pause, and resume
			},
			(error) => {
				// Handle unsuccessful uploads
				console.log(error);
			},
			() => {
				// Do something once upload is complete
				console.log('success');
				uploadTask.snapshot.ref.getDownloadURL().then(function(downloadURL) {
					// saveUploadedIDURL(downloadURL,function(){
					//     alert('File Uploaded');
					// });
					picture1URL = downloadURL;
					
				});
				$('#take-front').remove();
			}
		);
	});

	//upload file #1 once selected or captured
	$('#file-input2').change(function(e) {
		var selectedFile = e.target.files[0];
		var emiratesID = storage.child('ID_Images/' + currentUser.uid + '2.jpg');
		const uploadTask = emiratesID.put(selectedFile);
		uploadTask.on(
			'state_changed',
			(snapshot) => {
				// Observe state change events such as progress, pause, and resume
			},
			(error) => {
				// Handle unsuccessful uploads
				console.log(error);
			},
			() => {
				// Do something once upload is complete
				console.log('success');
				uploadTask.snapshot.ref.getDownloadURL().then(function(downloadURL) {
					picture2URL = downloadURL;
					saveUploadedIDURL(picture1URL, picture2URL, function() {
						$('#take-back').remove();

						dismissEmiratesIDVerify(function() {
						$('#emiratesIDTile').remove();
						
	});						
						alert('File Uploaded');
					});
				});
			}
		);
	});

	//This method takes a military time (0830) and converts into 12 hour 8:30AM
	function convertMilitaryToTwelveHour(military) {
		if (military.length == 3) military = '0' + military;
		let twelveHour = military.substring(0, 2) + ':' + military.substring(2);
		var date = new Date('February 04, 2011 ' + twelveHour);
		var options = { hour: 'numeric', minute: 'numeric', hour12: true };
		return date.toLocaleString('en-US', options);
	}
	
	function addhtmlcheckride(id,route,trip){

		$('#checktrip').append(
			upcomingTripTemplate
				.map(
					render({
						id: "upcoming-"+id,
						routeName: route,
						trip: trip
					})
				)
				.join('')					
		);
		$('#checktrip').append(
			cancelledTripTemplate
				.map(
					render({
						id: "cancelledTrip-"+id,
						routeName: route,
						trip: trip
					})
				)
				.join('')					
		);

	}
	
	function addhtmlhomecontent(id,route,trip){

		$('#home-content').append(
			upcomingTripTemplate
				.map(
					render({
						id: "upcoming-"+id,
						routeName: route,
						trip: trip
					})
				)
				.join('')					
		);
		$('#home-content').append(
			cancelledTripTemplate
				.map(
					render({
						id: "cancelledTrip-"+id,
						routeName: route,
						trip: trip
					})
				)
				.join('')					
		);
	}

	//Calls the getRoutesForUser from FirebaseUser.js
	//Gets all the routes the user has joined
	getRoutesForUser(
		function(routes) {
			routes.forEach(function(doc) {
				let current = doc.data();

				//Get the timeSlots of all trips for today in a sorted order
				var days = [ 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday' ];
				let timeSlots = doc.data()['timeSlotsFor' + days[new Date().getDay()]].sort(function(a, b) {
					return a - b;
				});

				//get current hour in military time
				currentHour = new Date().getHours() * 100;

				//all valid trip times append to this variable
				let trips = '';

				//number of valid trips
				let validTripsToShow = 0;
				let status = '';
				
				status = managecsv(current.id,current.name,null,null,0);
				if(status != ''){
					var str = status.split(',');
					addhtmlcheckride(current.id,current.name,str[1]);
					//$('#route-schedule-pick').css('display','none');
					$('#checktrip').css('display','block');
					$('#'+str[0] + current.id).css('display','block');
				}
				
				if(status == ''){
				//iterate through all the timeslots for today
					for (i = 0; i < timeSlots.length; i++) {
						//Only add the trips that are yet to happen
						//AND
						//Only add the next 5 trips
						if (timeSlots[i] > currentHour && validTripsToShow < 5) {
							let nextTrip = convertMilitaryToTwelveHour(timeSlots[i] + '');
							trips += "<span id = '"+current.id+","+current.name +","+ nextTrip + "'>" + nextTrip + "</span>";
							validTripsToShow++;
						}
					}

					console.log(doc);

					$('#route-schedule-pick').append(
						routeTemplate
							.map(
								render({
									routeName: current.name,
									trips: trips
								})
							)
							.join('')
					);
				}

				$(".route-schedule span").click(function(){

					alert('jjj');
					var str = $(this).attr('id').split(",");
					var timeslot_id = $(this).parent().parent().attr('id');
					status = managecsv(str[0],str[1],str[2],"upcoming-",1);
					// Success Card ----
					$('.alert-box').css('top', '10%');
					setTimeout(()=>{
						$('.alert-box').css('top', '-400px');
					}, 5000);
	
					$('#route-schedule-pick').css('display','none');
					$('#checktrip').css('display','none');
					addhtmlhomecontent(str[0],str[1],str[2]);
					
					$('#upcoming-'+str[0]).css('display','block');
	
					$('.route-schedule #cancelride').click(function(){
						//alert('in-cancel');
						var cancelledTrip_id = $(this).parent().parent().attr('id').split("-");
						$('#upcoming-'+cancelledTrip_id[1]).css('display','none');
						$('#cancelledTrip-'+ cancelledTrip_id[1]).css('display','block');
						status = managecsv(cancelledTrip_id[1],null,null,"cancelledTrip-",1);
					});
					$('.route-schedule #undo').click(function(){
						//alert('in-undo');
						var cancelledTrip_id = $(this).parent().parent().attr('id').split("-");
						$('#upcoming-'+cancelledTrip_id[1]).css('display','block');
						$('#cancelledTrip-'+ cancelledTrip_id[1]).css('display','none');
						status = managecsv(cancelledTrip_id[1],null,null,"upcoming-",1);
					});
				});
	
				$('.route-schedule #cancelride').click(function(){
					//alert('out-cancel');
					var cancelledTrip_id = $(this).parent().parent().attr('id').split("-");
					$('#upcoming-'+cancelledTrip_id[1]).css('display','none');
					$('#cancelledTrip-'+ cancelledTrip_id[1]).css('display','block');
					status = managecsv(cancelledTrip_id[1],null,null,"cancelledTrip-",1);
				});
				$('.route-schedule #undo').click(function(){
					//alert('out-undo');
					var cancelledTrip_id = $(this).parent().parent().attr('id').split("-");
					$('#upcoming-'+cancelledTrip_id[1]).css('display','block');
					$('#cancelledTrip-'+ cancelledTrip_id[1]).css('display','none');
					status = managecsv(cancelledTrip_id[1],null,null,"upcoming-",1);
				});
				
			});
		},
		function(error) {}
	);
}
