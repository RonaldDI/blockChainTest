
/*
 * GET job ppurchase history
 */

var commands = require("../lib/commands");
var client = require("../lib/testclient");
var Jobpost = require('../models/jobpost');
var JobTransaction = require('../models/jobpurchasehistory');

var connection = {
	    port: 4784,
	    host: '127.0.0.1',
	    user: "test",
	    pass: "test"
	};

exports.jobPurchaselists = function(req, res){
	var useraddress = req.user.local.address;
	console.log('jobPurchaselists: '+useraddress);  
	JobTransaction.find({"buyer":useraddress},function(err, posts) {
		if(err) {
			res.render( 'purchaselistings', {
				message: 'Internal error in showing job purchase listings. Please try after some time.' 			 
		    });
		} else {
			console.log('Job posts: '+JSON.stringify(posts));  
			res.render( 'purchaselistings', 
			{
		      title : 'Jobs listings',
		      posts : posts,
		      message:""
		    });
		}
	});
    
};