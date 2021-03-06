
/*
 * GET home page.
 */

var commands = require("../lib/commands");
var User   = require('../models/user');
var connection = {
	    port: 4784,
	    host: '127.0.0.1',
	    user: "test",
	    pass: "test"
	};

module.exports = {
		getaccountinfo : function(req, res) { 
			var username = req.user.local.username;
			User.findOne({ 'local.username' :  username }, 
	          function(err, user) {			            			            
	            var client = require("../lib/getaddressbalance");
	            
	            if(user.local.address) {
	            	console.log('Valid address Extracting balance');
	            	client.getaddressbalance(user.local.address, function (err, balance) {
			        	if(err) {
			        		res.render('accounts.ejs', {
				            	message: '',
				                user : req.user // get the user out of session and pass to template            
				            });
			        	} else {	        				        			
				    		//Update balance				    	    
				    	    user.local.balance = balance;	            								    	    					    	  
	            			console.log('Valid address Extracting balance:'+balance);
	            			user.save(function(err) {
	    	            		if (err)
	    	            			console.log('error')
	    	        			else
	    	            	        console.log('success')
	    	        	    });
			       			res.render('accounts.ejs', {
				            	message: '',
				                user : req.user // get the user out of session and pass to template            
				            });
			       			
			        	}			       		
			       		
			    	});
	            } else {
	            	console.log('Address not present');
	            	res.render('accounts.ejs', {
		            	message: 'Balance not available.',
		                user : req.user // get the user out of session and pass to template            
		            });
	            }
	          });
		}
	};
