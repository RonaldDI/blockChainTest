
/*
 * GET home page.
 */

var commands = require("../lib/commands");
var client = require("../lib/testclient");
var Jobpost = require('../models/jobpost');

var connection = {
	    port: 4784,
	    host: '127.0.0.1',
	    user: "test",
	    pass: "test"
	};

exports.buyjob = function(req, res){
	var username = req.user.local.username;
//	var title = req.body.title;
//	var description = req.body.description;
//	var price = parseInt(req.body.price);
	
	
	var postId = req.param('id')
	var sellerAddress = req.param('seller')
	
	console.log("buyjob User:"+username);
	console.log("buyjob req id:"+postId);
	console.log("buyjob buyer address:"+req.user.local.address);
	console.log("buyjob seller address:"+sellerAddress);
	var currentAddress = req.user.local.address;
	
//    currentAddress = "571174aa1063daf330fb4c3d";
//    sellerAddress = "571174aa1063daf330fb4c3c";
	
	if(sellerAddress == currentAddress) {
		console.log('buyjob..Buyer and seller address is same');            	
    	Jobpost.find({},function(err, posts) {
			if(err) {
				res.render( 'joblistings', {
					messageType: 1,
					message: 'Internal error in showing current job listings. Please try after some time.' 			 
			    });
			} else {
				console.log('Job posts: '+JSON.stringify(posts));  
				res.render( 'joblistings', 
				{
			      title : 'Jobs listings',
			      posts : posts,
			      messageType: 1,
			      message:'You cannot buy something which you posted yourself.'
			    });
			}
		});
	} else {
		Jobpost.findById(postId, function (err, post){
			if(err) {
				console.log("buyjob..Job post doesn't exist with the given Id");
				//No post id exists
				Jobpost.find({},function(err, posts) {
					if(err) {
						res.render( 'joblistings', {
							messageType: 1,
							message: 'Internal error in showing current job listings. Please try after some time.' 			 
					    });
					} else {
						console.log('Job posts: '+JSON.stringify(posts));  
						res.render( 'joblistings', 
						{
					      title : 'Jobs listings',
					      posts : posts,
					      messageType: 1,
					      message:'Test buy listings.'
					    });
					}
				});
			} else {
				//Valid post, we will do the processing here
				console.log("buyjob..Valid post:"+JSON.stringify(post));	
				//Get current users balance to check if he has enough balance to buy the job
				var client = require("../lib/getaddressbalance");
	            if(currentAddress) {
	            	console.log('buyjob..Valid address Extracting balance');
			        client.getaddressbalance(currentAddress, function (err, balance) {
			        	err = "";
			        	if(err) {
			        		Jobpost.find({},function(err, posts) {
	    						if(err) {
	    							res.render( 'joblistings', {
	    								messageType: 1,
	    								message: 'Internal error in showing current job listings. Please try after some time.' 			 
	    						    });
	    						} else {
	    							console.log('Job posts: '+JSON.stringify(posts));  
	    							res.render( 'joblistings', 
	    							{
	    						      title : 'Jobs listings',
	    						      posts : posts,
	    						      messageType: 1,
	    						      message:'Internal error. Balance not available for current account to purchase the job.'
	    						    });
	    						}
	    					});
			        	} else if(balance.length > 0) {	        				        			
				    		//Check balance
			        		
			        		
		            			
	            			console.log('Valid address Extracting balance:'+balance[0].qty);
	            			if(balance[0].qty >= post.price) {
	            				//Current user has enough money to order this job
	            				/*
	            				 * Following actions take palce here:
	            				 * 1. Transfer the amount from buyer to seller (Accounts get updated in the multichain)
	            				 * 2. Update buyer account (Balance updated to the db)
	            				 * 3. Update seller account (Balance updated to the db)
	            				 */
	            				
	            				var transferClient = require("../lib/transferasset");
	            				
	            				transferClient.transferInternal(currentAddress, sellerAddress, post.price, function (err) {
	            					if(err) {
	            						//Error in transferring dicoins for purchasing job
	            						Jobpost.find({},function(err, posts) {
			        						if(err) {
			        							res.render( 'joblistings', {
			        								messageType: 1,
			        								message: 'Internal error in showing current job listings. Please try after some time.' 			 
			        						    });
			        						} else {
			        							console.log('Job posts: '+JSON.stringify(posts));  
			        							res.render( 'joblistings', 
			        							{
			        						      title : 'Jobs listings',
			        						      posts : posts,
			        						      messageType: 1,
			        						      message:'Error in transferring funds to purchase the job. Please try after some time.'
			        						    });
			        						}
			        					});
	            						
	            					} else {
	            						Jobpost.find({},function(err, posts) {
			        						if(err) {
			        							res.render( 'joblistings', {
			        								messageType: 1,
			        								message: 'Internal error in showing current job listings. Please try after some time.' 			 
			        						    });
			        						} else {
			        							console.log('Job posts: '+JSON.stringify(posts));  
			        							res.render( 'joblistings', 
			        							{
			        						      title : 'Jobs listings',
			        						      posts : posts,
			        						      messageType: 0,
			        						      message:'You bought the job successfully.'
			        						    });
			        						}
			        					});		            						
	            					}
	            					
	            				});		            					            					            				
	            			} else {
	            				Jobpost.find({},function(err, posts) {
	        						if(err) {
	        							res.render( 'joblistings', {
	        								messageType: 1,
	        								message: 'Internal error in showing current job listings. Please try after some time.' 			 
	        						    });
	        						} else {
	        							console.log('Job posts: '+JSON.stringify(posts));  
	        							res.render( 'joblistings', 
	        							{
	        						      title : 'Jobs listings',
	        						      posts : posts,
	        						      messageType: 1,
	        						      message:'Not enough balance to purchase the job.'
	        						    });
	        						}
	        					});
	            			}	            			
			        	} else {
			        		//No balance available
			        		Jobpost.find({},function(err, posts) {
        						if(err) {
        							res.render( 'joblistings', {
        								messageType: 1,
        								message: 'Internal error in showing current job listings. Please try after some time.' 			 
        						    });
        						} else {
        							console.log('Job posts: '+JSON.stringify(posts));  
        							res.render( 'joblistings', 
        							{
        						      title : 'Jobs listings',
        						      posts : posts,
        						      messageType: 1,
        						      message:'You have zero balance in your account. You need enough balance to purchase the job.'
        						    });
        						}
        					});
			        	}		       				       	
			    	});
	            } else {
	            	console.log('buyjob..Address not present');            	
	            	Jobpost.find({},function(err, posts) {
	    				if(err) {
	    					res.render( 'joblistings', {
	    						messageType: 1,
	    						message: 'Internal error in showing current job listings. Please try after some time.' 			 
	    				    });
	    				} else {
	    					console.log('Job posts: '+JSON.stringify(posts));  
	    					res.render( 'joblistings', 
	    					{
	    				      title : 'Jobs listings',
	    				      posts : posts,
	    				      messageType: 1,
	    				      message:'Invalid current address.'
	    				    });
	    				}
	    			});
	            }
			}
			
		});
	}			
};