$('.changeForm').click(function() {
	let formNo = $(this).attr('data-action');
	if (formNo == '1') {
		$('.loading').fadeIn();
		checkPhoneNumber();
	} else {
		$('.forms').slideUp();
		$(`.form-${formNo}`).slideDown();
	}
});

// FORM VALIDATION
// FORM #1
let fname_f = 0;
let lname_f = 0;
let fname_p = /([A-Za-z]{2,})\w+/g;
let lname_p = /([A-Za-z]{1,})\w+/g;
function AF1BTN() {
	$('#form_1_btn').prop('disabled', false);
}
function DF1BTN() {
	$('#form_1_btn').prop('disabled', true);
}
$('#fname').keyup(function(e) {
	let v = e.target.value;
	fname_f = v.match(fname_p) ? 1 : 0;
	if (fname_f && lname_f) {
		AF1BTN();
	} else {
		DF1BTN();
	}
});
$('#lname').keyup(function(e) {
	let v = e.target.value;
	lname_f = v.match(lname_p) ? 1 : 0;
	if (fname_f && lname_f) {
		AF1BTN();
	} else {
		DF1BTN();
	}
});

// FORM #2
let email_f = 0;
let email_p = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
function AF2BTN() {
	$('.login-now').prop('disabled', false);
}
function DF2BTN() {
	$('.login-now').prop('disabled', true);
}
$('#email').keyup(function(e) {
	let v = e.target.value;
	email_f = v.match(email_p) ? 1 : 0;
	if (email_f) {
		AF2BTN();
	} else {
		DF2BTN();
	}
});
$('.forms .inps .grp ul li').click(function(e) {
	let v = $('#email').val();
	$('#email').val(`${v + e.target.innerText}`);
	v = $('#email').val();
	email_f = v.match(email_p) ? 1 : 0;
	if (email_f) {
		AF2BTN();
	} else {
		DF2BTN();
	}
});

// FORM #3
let phone_f = 0;
let phone_p = /^((\+971|00971){1}(2|3|4|6|7|9|50|51|52|54|55|56|58){1}([0-9]{7}))$/;
function AF3BTN() {
	$('#form_3_btn').prop('disabled', false);
}
function DF3BTN() {
	$('#form_3_btn').prop('disabled', true);
}
$('#phone_number').keyup(function(e) {
	let v = '00971' + e.target.value;
	console.log(v);
	phone_f = v.match(phone_p) ? 1 : 0;
	console.log(phone_f);
	if (phone_f) {
		AF3BTN();
	} else {
		DF3BTN();
	}
});

//JS Control Code
$('.login-now').click(function() {
	$(this).prop('disabled', true);
	$('.loading').fadeIn();

	// COLLECT ALL DATA
	let fname = $('#fname').val().trim();
	let lname = $('#lname').val().trim();
	let email = $('#email').val().trim();
	let phone_number = $('#phone_number').val().trim();
	window.location.href =
		'/createPassword?firstName=' + fname + '&lastName=' + lname + '&email=' + email + '&phone=' + phone_number;
});

$('#back').on('click', function(e){
	window.location.href = '/login';
})

$('.sign-up').click(function() {
	$(this).prop('disabled', true);
	$('.loading').fadeIn();

	// COLLECT ALL USER DATA
	let password = $('#password').val();
	let firstName = $.urlParam('firstName');
	let lastName = $.urlParam('lastName');
	let email = $.urlParam('email');
	let phone = $.urlParam('phone');
	$('.loading').fadeIn();
	//Calling from FirebaseUser.js
	return createUser(
		email,
		password,
		firstName,
		lastName,
		phone,
		function(done) {
			window.location.href = '/okaythen';
		},
		function(error) {
			$('.loading').fadeOut();
			//error handle
			alert(error);
			console.log(error);
		}
	);
});

//Onclicj Event for accepting user policy
$('.accept-policy').click(function() {
	console.log('accepted');
	return policyAcknowledgement(
		true,
		function(done) {
			window.location.href = '/onboarding';
		},
		function(error) {}
	);
});

//Onclicj Event for password check on welcome back screen
$('.log-in-user').click(function() {
	$('.error-popup').css('opacity', 0);
	let email = $.urlParam('email');
	let password = $('#password').val();
	$('.loading').fadeIn();
	return loginUser(
		email,
		password,
		function(done) {
			window.location.href = '/profile';
		},
		function(error) {
			$('.loading').fadeOut();
			$('.error-popup').css('opacity', 1);
			console.log(error);
		}
	);
});

//change dynamic phone number on welcome back
console.log(window.location.pathname);
if (window.location.pathname == '/welcomeback') {
	let phone = window.location.search.substr(1).split('=')[2];
	$('.explain').html('<p>Enter the password for +971 ' + phone + ' to continue signing into your arcab account.</p>');
}

//function to get URL Param
$.urlParam = function(name) {
	var results = new RegExp('[?&]' + name + '=([^&#]*)').exec(window.location.href);
	return results[1] || 0;
};

function checkPhoneNumber() {
	let phone = $('#phone_number').val();

	var checkPhone = functions.httpsCallable('checkPhone');
	checkPhone({ phone: phone }).then(function(result) {
		$('.loading').fadeOut();
		if (result.data.userExists) {
			window.location.href = '/welcomeback?email=' + result.data.email + '&phone=' + phone;
		} else {
			$('.forms').slideUp();
			$(`.form-1`).slideDown();
		}
	});
}

function OnCurrentUserLoadComplete() {
	//OnUserLoad
}
