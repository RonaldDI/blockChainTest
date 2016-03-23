/**
 * http://usejsdoc.org/
 */


module.exports = function(app, passport) {
	
	
	// =====================================
    // ACCOUNT SECTION =====================
    // =====================================
    // we will want this protected so you have to be logged in to visit
    // we will use route middleware to verify this (the isLoggedIn function)
    app.get('/accounts', isLoggedIn, function(req, res) {
        res.render('accounts.ejs', {
            user : req.user // get the user out of session and pass to template
        });
    });

    // =====================================
    // HOME PAGE (with login links) ========
    // =====================================
    app.get('/', function(req, res) {
    	res.render('index', { message: req.flash('message') });
//    	res.send('Hello World\n');
    });
    
    app.get('/failure', function(req, res) {
//    	res.render('index', { message: req.flash('message') });
    	res.send('Bad Login\n');
    });

    // =====================================
    // LOGIN ===============================
    // =====================================
    // show the login form
    // process the login form
    app.post('/login', passport.authenticate('local-login', {
    	successRedirect: '/accounts',
        failureRedirect: '/login',
        failureFlash : true 
    }));
    
//    app.post('/login', function(req, res) {
////    	req.message("Hello");
////    	res.render('index', { message: req.flash('message') });
//    	 res.send("Login Post\n");
//    });
    
    // show the login form
    app.get('/login', function(req, res) {
        // render the page and pass in any flash data if it exists
        res.render('login', { message: req.flash('loginMessage') }); 
    });
    
    // show the login form
    app.get('/signup', function(req, res) {
        // render the page and pass in any flash data if it exists
        res.render('signup', { message: req.flash('signupMessage') }); 
    });


    // process the login form
    // app.post('/login', do all our passport stuff here);
    
//    app.get('/signup', function(req, res){
//        res.render('register',{message: req.flash('message')});
//    });

    // =====================================
    // SIGNUP ==============================
    // =====================================
    // show the signup form
    
    app.post('/signup', passport.authenticate('local-signup', {
        successRedirect : '/accounts', // redirect to the secure profile section
        failureRedirect : '/signup', // redirect back to the signup page if there is an error
        failureFlash : true // allow flash messages
    }));
//    app.post('/signup', passport.authenticate('local-signup'), function(req, res) {
//        res.redirect('/');
//    });
        
    // process the signup form
    // app.post('/signup', do all our passport stuff here);

    // =====================================
    // PROFILE SECTION =====================
    // =====================================
    // we will want this protected so you have to be logged in to visit
    // we will use route middleware to verify this (the isLoggedIn function)
//    app.get('/profile', isLoggedIn, function(req, res) {
//        res.render('profile.ejs', {
//            user : req.user // get the user out of session and pass to template
//        });
//    });

    // =====================================
    // LOGOUT ==============================
    // =====================================
    app.get('/logout', function(req, res) {
        req.logout();
        res.redirect('/');
    });
};

// route middleware to make sure a user is logged in
function isLoggedIn(req, res, next) {

    // if user is authenticated in the session, carry on 
    if (req.isAuthenticated())
        return next();

    // if they aren't redirect them to the home page
    res.redirect('/');
}