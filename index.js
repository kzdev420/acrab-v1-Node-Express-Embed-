let express = require('express');
let bodyParser = require('body-parser');
let passport = require('passport');
let cookieSession = require('cookie-session');
let User = require('./models/User');

let app = express();

passport.serializeUser(function(user, done) {
	console.log('serializeUser ==> ' + user);
	done(null, user.id);
});

passport.deserializeUser(function(id, done) {
	console.log('DEserializeUser ==> ' + id);
	User.findById(id, function(err, user) {
		done(err, user);
	});
});

// Express Session
app.use(
	cookieSession({
		name: 'session',
		keys: [ 'key1', 'key2' ]
	})
);
// Passport init
app.use(passport.initialize());
app.use(passport.session());

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('assets'));
app.set('view engine', 'ejs');

const PORT = process.env.PORT || 3000;

app.get('/', function(req, res) {
	console.log('====>' + req.user);
	res.render('index');
});
app.get('/login', function(req, res) {
	if (req.user) {
		res.redirect('/profile');
	} else {
		res.render('login');
	}
});

/**
app.post('/login', function (req, res) {
	console.log('Login function running');
	req.body.date = new Date().getTime().toString();
	console.log(req.body);
	User.create(req.body, function (err, data) {
		if (!err) {
			req.login(data, function (error) {
				if (!error) {
					res.send('/profile');
				} else {
					res.json(error);
				}
			});
		} else {
			res.json(err);
		}
	});
});
 */

app.get('/okaythen', function(req, res) {
	if (1) {
		res.render('okaythen');
	} else {
		res.redirect('/');
	}
});

app.get('/onboarding', function(req, res) {
	res.render('onboarding');
});

app.get('/profile', function(req, res) {
	if (1) {
		res.render('profile');
	} else {
		res.redirect('/');
	}
});

app.get('/createPassword', function(req, res) {
	if (1) {
		res.render('createpass');
	} else {
		res.redirect('/');
	}
});

app.get('/routeJoin', function(req, res) {
	if (1) {
		res.render('routeJoin');
	} else {
		res.redirect('/');
	}
});

app.get('/routeView', function(req, res) {
	if (1) {
		res.render('routeView');
	} else {
		res.redirect('/');
	}
});

app.get('/options', function(req, res) {
	if (1) {
		res.render('options');
	} else {
		res.redirect('/');
	}
});

// ------ OPTION PAGE LINKS ARE BELOW
app.get('/options/:page', function(req, res) {
	console.log(req.params.page);
	res.render(req.params.page);
});
// ------------------------------------

// ------- added code here as option page links werent going through

app.get('/legal', function(req, res) {
	if (1) {
		res.render('legal');
	} else {
		res.redirect('/');
	}
});

app.get('/report', function(req, res) {
	if (1) {
		res.render('report');
	} else {
		res.redirect('/');
	}
});

app.get('/chat', function(req, res) {
	if (1) {
		res.render('chat');
	} else {
		res.redirect('/');
	}
});
// -------------------------------

app.get('/card', function(req, res) {
	if (1) {
		res.render('card');
	} else {
		res.redirect('/');
	}
});

app.get('/recharge', function(req, res) {
	if (1) {
		res.render('recharge');
	} else {
		res.redirect('/');
	}
});

app.get('/payment', function(req, res) {
	if (1) {
		res.render('payment');
	} else {
		res.redirect('/');
	}
});

app.get('/privacy', function(req, res){
	if (1) {
		res.render('privacy');
	} else {
		res.redirect('/');
	}
});

app.get('/topay', function(req, res){
	if (1) {
		res.render('topay');
	} else {
		res.redirect('/');
	}
});

app.get('/terms', function(req, res){
	if (1) {
		res.render('terms');
	} else {
		res.redirect('/');
	}
});

app.get('/addCard', function(req, res) {
	res.render('addCard');
});

app.get('/welcomeback', function(req, res) {
	if (1) {
		res.render('welcomeback');
	} else {
		res.redirect('/');
	}
});

app.get('/voucher', function(req, res) {
	if (1) {
		res.render('voucher');
	} else {
		res.redirect('/');
	}
});

app.get('/logout', function(req, res) {
	req.logout();
	res.redirect('/login');
});

app.listen(PORT, function() {
	console.log(`Server Started at PORT ${PORT}`);
	console.log(`http://localhost:${PORT}`);
});


app.post('/profile', function(req,res){
	//console.log(req.body.type);
	var flag = 0,status = req.body.status;
	var today = new Date();
	var today_date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
	var current_time = today.toLocaleTimeString();
	prefix = current_time.split(':');
	if(Number(prefix[0])<10) current_time = "0" + current_time;
	today.setHours(23);
	today.setMinutes(59);
	var maxtime = today.toLocaleTimeString();
	var mintime = today.toLocaleTimeString();
	var dif_min = maxtime;
	var dif_route=null, min_route=null;

	//console.log("current time = " + current_time);
	//console.log("maxtime = " + maxtime);
	//console.log("mintime = " + mintime);
	//console.log("dif time = " + dif_min);

	var GoogleSpreadsheet = require('google-spreadsheet');
	var creds = require('./client.json');

	// Create a document object using the ID of the spreadsheet - obtained from its URL.
	var doc = new GoogleSpreadsheet('1eQBx3qVcwnHaDEB6Zvcclx4E22bEbcfLTKAHixsmERU');
	// Authenticate with the Google Spreadsheets API.
	doc.useServiceAccountAuth(creds, function (err) {
		console.log(err);
	// Get all of the rows from the spreadsheet.
		doc.getRows(1, function (err, rows) {

			
			
			for(let index = rows.length-1;index>=0;index--){
				//console.log(req.body.user_id);
				if(req.body.type == 3){
					
					if(req.body.user_id == rows[index]['userid']){
						savetime = rows[index]['time'].split(" ")[0]+ ":00" + " " +rows[index]['time'].split(" ")[1].toUpperCase();
						//console.log("savetime = "+ savetime);
						if(current_time < savetime && dif_min > savetime) {
							dif_min = savetime; 
							dif_route = rows[index]['routename'];
						}
						if(mintime > savetime){
							mintime = savetime;
							min_route = rows[index]['routename'];
						}
						continue;
					}
					continue;
				}

				if(req.body.user_id == rows[index]['userid'] && req.body.route_id == rows[index]['routeid']) {
					flag = 1;
					if(req.body.type == 0) {
						if(today_date > rows[index]['date']){
							rows[index]['status'] = 'upcoming-';
							rows[index].save();
						}
						status = rows[index]['status'] + "," + rows[index]['time'].toUpperCase();
						break;
					}
					if(req.body.type == 1){
						rows[index]['status'] = status;
						rows[index].save();
						break;
					}
					if(req.body.type == 2){
						console.log('dkdkd');
						rows[index].del();
						break;
					}
				}
			}

			if(req.body.type == 1 && flag==0){ 
				doc.addRow(1, {
					date: today_date,
					userid: req.body.user_id,
					username: req.body.user_name,
					useremail: req.body.user_email,
					routeid: req.body.route_id,
					routename: req.body.location,
					phonenumber: req.body.phonenumber,
					time: req.body.time,
					status: status
				}, function(err) {
					if(err) {
						console.log(err);
					}
				});
			}

			if(req.body.type == 3){
				var time;
				if(dif_min == maxtime) {
					time = mintime.split(" ")
					status =min_route + "##"+  time[0].split(":")[0] + ":" + time[0].split(":")[1] + " " + time[1];
				}
				else {
					time = dif_min.split(" ")
					status =dif_route + "##"+ time[0].split(":")[0] + ":" + time[0].split(":")[1] + " " + time[1];
				}
			}
			
			res.send(status);
		});
	});			
});
