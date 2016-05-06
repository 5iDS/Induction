/*
 * Copyright (c) 1988 - Present @MaxVerified on behalf of 5ive Design Studio (Pty) Ltd. 
 *  
 * Permission is hereby granted, free of charge, to any person obtaining a
 * copy of this software and associated documentation files (the "Software"), 
 * to deal in the Software without restriction, including without limitation 
 * the rights to use, copy, modify, merge, publish, distribute, sublicense, 
 * and/or sell copies of the Software, and to permit persons to whom the 
 * Software is furnished to do so, subject to the following conditions:
 *  
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *  
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, 
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER 
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING 
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER 
 * DEALINGS IN THE SOFTWARE.
 * 
 */

(function () {
    
	"use strict";

	var os 					= require("os"),
		GetMac				= require("./thirdparty/getmac");

	/**
     * @constructor
     * Creates a queue of async operations that will be executed sequentially. Operations can be added to the
     * queue at any time. If the queue is empty and nothing is currently executing when an operation is added, 
     * it will execute immediately. Otherwise, it will execute when the last operation currently in the queue 
     * has finished.
     */
    function Utils() {
    }

	Utils.prototype =  {

   		/**
         * Returns Boolean about date parameter
         *
         * @param String.date
         * 
         * @return Boolean
         */
        isDate: function ( date ) {

            //this._strict( [ String ], arguments );
            /** /
            var months = ['01','02','03','04','05','06','07','08','09','10','11','12'];
            
            switch( type ) {

                case 'year':

                    break;

                case 'month':

                    break;

                case 'day':

                    break;

                default:

                    return ( ( new Date(date) !== "Invalid Date" && !isNaN( new Date(date) ) ) );

                    break;
            }/**/
            return ( ( new Date(date) !== "Invalid Date" && !isNaN( new Date(date) ) ) );
        
        },

        // Source: http://stackoverflow.com/questions/497790
        convertDate: function( d ) {
            // Converts the date in d to a date-object. The input can be:
            //  a date object: returned without modification
            //  an array      : Interpreted as [year,month,day]. NOTE: month is 0-11.
            //  a number     : Interpreted as number of milliseconds since 1 Jan 1970 (a timestamp) 
            //  a string     : Any format supported by the javascript engine, like
            //                  "YYYY/MM/DD", "MM/DD/YYYY", "Jan 31 2009" etc.
            //  an object     : Interpreted as an object with year, month and date attributes.  **NOTE** month is 0-11.
            return (
                d.constructor === Date ? d :
                d.constructor === Array ? new Date(d[0],d[1],d[2]) :
                d.constructor === Number ? new Date(d) :
                d.constructor === String ? new Date(d) :
                typeof d === "object" ? new Date(d.year,d.month,d.date) :
                NaN
            );

        },

        compareDates: function( a, b ) {

            var that = this;
            // Compare two dates (could be of any type supported by the convert
            // function above) and returns:
            //  -1 : if a < b
            //   0 : if a = b
            //   1 : if a > b
            // NaN : if a or b is an illegal date
            // NOTE: The code inside isFinite does an assignment (=).
            return (
                    isFinite(a=that.convertDate(a).valueOf()) &&
                    isFinite(b=that.convertDate(b).valueOf()) ?
                    (a>b)-(a<b) :
                    NaN
            );
        
        },

        DatesInRange: function( d, start, end ) {
                // Checks if date in d is between dates in start and end.
                // Returns a boolean or NaN:
                //    true  : if d is between start and end (inclusive)
                //    false : if d is before start or after end
                //    NaN   : if one or more of the dates is illegal.
                // NOTE: The code inside isFinite does an assignment (=).
               return (
                    isFinite(d=this.convertDate(d).valueOf()) &&
                    isFinite(start=this.convertDate(start).valueOf()) &&
                    isFinite(end=this.convertDate(end).valueOf()) ?
                    start <= d && d <= end :
                    NaN
                );
        
        },

        time_diff: function (t1, t2) {

            var timeStart = new Date("01/01/2007 " + t1).getHours();
            var timeEnd = new Date("01/01/2007 " + t2).getHours();
             
            var hourDiff = timeEnd - timeStart;

            return hourDiff;
        
        },

        generateYears: function( startYear ) {

        	this._strict( [ Number ], arguments );

			var currentYear = new Date().getFullYear(), years = [];
				startYear = startYear || 1900;

			while ( startYear <= currentYear ) {
			
				years.push(startYear++);
			
			} 

        	return years;
		
		},

        date_by_subtracting_days: function(date, days) {

            this._strict( [ Date, Number ], arguments );

            return new Date(
                date.getFullYear(), 
                date.getMonth(), 
                date.getDate() - days,
                date.getHours(),
                date.getMinutes(),
                date.getSeconds(),
                date.getMilliseconds()
            );
        
        }

    };

    var util = new Utils();

	/**
     * @public
     * 
     * Authenticate user
     *      
     * @param {Mysql._mysqlServer}
     * @param {Object.credentials}
	 * @param {Function.callback}
	 * 
     * @return {Object} 
     * 
     */
	function DBAuthenticate ( _mysqlServer, credentials, callback ) {

		//var columns = [ 'ID', 'user_login', 'user_pass', 'user_email', 'display_name' ];

		// Make the database query
		var query = _mysqlServer.query( 'SELECT users.* FROM users WHERE users.idNumber = ?', [ credentials.user.idNumber ], function( err, result ) {

			if( err ) {

				callback( err );

			} else {

				//if( !angular.isDefined(result) || result.length < 1 ) {
				if( result.length < 1 ) {

					callback( 'I.D. not found.' );

				} else {

					var query2 = _mysqlServer.query( 'SELECT usersMeta.inductionTypeID, usersMeta.value AS inductionDate, inductionType.Name AS inductionName, inductionType.Length AS inductionLength FROM usersMeta INNER JOIN inductionType ON usersMeta.inductionTypeID = inductionType.ID WHERE usersMeta.userID = ?', [ result[0].ID ], function( error, dates ) {

						if( error ) {

							callback( error );

						} else {

							callback( false, {
								'user' 			: result[0],
								'inductions'	: dates
							});

						}
					});

				}

			};

		});
	
	}

    /**
     * @public
     * 
     * Get employees | equipment | operational Data
     *      
     * @param {Mysql._mysqlServer}
     * @param {Object.options}
	 * @param {Function.callback}
	 * 
     * @return {Object} 
     * 
     */
	function DBGetData ( _mysqlServer, options, callback ) {

		var query 	= null,
			result 	= [],
			data 	= {};

		switch( options.type ) {

			case 'configuration':

				var	Data_appOptions 		= [];

				var	_appOptions 		= "SELECT options.* FROM options ORDER BY ID ASC";

				query = _mysqlServer.query( _appOptions );

				query
					.on( 'error', function(err) {
						
						//result.push( err );

						callback( err.code );
						// Handle error, an 'end' event will be emitted after this as well
					})
					.on( 'fields', function(fields) {
						
						// the field packets for the rows to follow
					})
					.on( 'result', function( row, index ) {

						switch ( index ) {

							case 0:

								Data_appOptions.push( row );

								break;

						};

					})
					.on( 'end', function() {

						callback( false, {
							'appOptions'		: Data_appOptions
						});

					});

				break;

			case 'users':

				var	Data_users 				= [],
					Data_userMeta 			= [];

				var _users 				= "SELECT users.*, usersMeta.inductionTypeID, usersMeta.value AS inductionDate FROM users INNER JOIN usersMeta ON users.ID = usersMeta.userID ORDER BY users.lastName ASC";

				query = _mysqlServer.query( _users + ";" + _userMeta + ";" + _supervisors );
				query
					.on( 'error', function(err) {
						
						//result.push( err );

						callback( err.code );
						// Handle error, an 'end' event will be emitted after this as well
					})
					.on( 'fields', function(fields) {
						
						// the field packets for the rows to follow
					})
					.on( 'result', function( row, index ) {

						switch ( index ) {

							case 0:

								if( row.userOccupation == null ) {
									row.userOccupation = 'N/A';
								};
								if( row.departmentName == null ) {
									row.departmentName = 'N/A';
								};

								if( row.employeeNumber == null || row.employeeNumber == "" ) {
									row.employeeNumber = 'N/A';
								};
								if( row.idNumber == null || row.idNumber == "" ) {
									row.idNumber = 'N/A';
								};

								if( row.emailAddress == null || row.emailAddress == "" ) {
									row.emailAddress == "N/A";//row.firstName + '.' row.lastName + '@minopex.co.za';
								};

								Data_users.push( row );

								break;

							case 1:

								/** /
								switch( row.dateID ) {

									case 1:

										break;

									case 2:

										break;

									case 3:

										break;

								}/**/

								Data_userMeta.push( row );

								break;

							case 2:

								Data_supervisors.push( row );

								break;

						};

					})
					.on( 'end', function() {

						// loop thru 
						for (var i = 0; i < Data_users.length; i++) {

							if( Data_users[i] ) {

								Data_users[i].displayName = Data_users[i].firstName + ' ' + Data_users[i].lastName;

								Data_users[i].meta = [];

								for (var j = 0; j < Data_userMeta.length; j++) {

									if( Data_users[i].ID == Data_userMeta[j].userID ) {

										// go through meta now...checking for exising equipment meta data
										if( Data_users[i].meta.length > 0 ) {

											var added = false;
											
											for (var k = 0; k < Data_users[i].meta.length; k++) {

												if( Data_users[i].meta[k].equipmentID == Data_userMeta[j].equipmentID ) {

													added = true;

													switch( parseInt(Data_userMeta[j].dateID) ) {

															case 1: // PTO Date

																Data_users[i].meta[k].PTODate = Data_userMeta[j].value
																
																break;

															case 2: // Certificate Date

																Data_users[i].meta[k].certificateDate = Data_userMeta[j].value

																break;

															case 3: // Appointment Date

																Data_users[i].meta[k].appointmentDate = Data_userMeta[j].value

																break;

													}

												}

											}

											if( added === true ) {} else {

												switch( parseInt(Data_userMeta[j].dateID) ) {

														case 1: // PTO Date

																Data_users[i].meta.push({
																	'equipmentID' 	: Data_userMeta[j].equipmentID,
																	'PTODate'		: Data_userMeta[j].value
																});

																break;

														case 2: // Certificate Date

																Data_users[i].meta.push({
																	'equipmentID' 		: Data_userMeta[j].equipmentID,
																	'certificateDate'	: Data_userMeta[j].value
																});

																break;

														case 3: // Appointment Date

																Data_users[i].meta.push({
																	'equipmentID' 		: Data_userMeta[j].equipmentID,
																	'appointmentDate'	: Data_userMeta[j].value
																});

																break;

												}

											}

										} else {

											switch( parseInt(Data_userMeta[j].dateID) ) {

													case 1: // PTO Date

														Data_users[i].meta.push({
															//'dateID' 		: Data_userMeta[j].dateID,
															//'dateName'		: Data_userMeta[j].dateName,
															'equipmentID' 	: Data_userMeta[j].equipmentID,
															'PTODate'		: Data_userMeta[j].value
														});

														/** /
														Data_users[i].meta.push({
															'dateID' 		: Data_userMeta[j].dateID,
															//'dateName'		: Data_userMeta[j].dateName,
															'equipmentID' 	: Data_userMeta[j].equipmentID,
															'PTODate'		: Data_userMeta[j].value
														});/**/

														break;

													case 2: // Certificate Date

														Data_users[i].meta.push({
															//'dateID' 			: Data_userMeta[j].dateID,
															//'dateName'			: Data_userMeta[j].dateName,
															'equipmentID' 		: Data_userMeta[j].equipmentID,
															'certificateDate'	: Data_userMeta[j].value
														});

														break;

													case 3: // Appointment Date

														Data_users[i].meta.push({
															//'dateID' 			: Data_userMeta[j].dateID,
															//'dateName'			: Data_userMeta[j].dateName,
															'equipmentID' 		: Data_userMeta[j].equipmentID,
															'appointmentDate'	: Data_userMeta[j].value
														});

														break;

											}

										}

										//Data_users[i].meta.push(Data_userMeta[j]);					

									}

								}

							}

						};

						callback( false, {
							'users'			: Data_users,
							'userMeta'		: Data_userMeta,
							'supervisors'	: Data_supervisors
						});

					});

				break;

			default:

				callback( true, 'data type [' + options.type + '] not specified' );

				break;
		}

	}

	/**
	 * @public
	 * 
	 * Create employees | equipment | operational Data
	 *
	 * @param {Mysql._mysqlServer}
	 * @param {Object.options}
	 * @param {Function.callback}
	 * 
	 * @return {Object} 
	 * 
	 */
	function DBCreateData ( _mysqlServer, options, callback ) {

		var InsertData,
			InsertQuery 	= null;

		try {

			switch( options.type ) {

				case 'user':

					_mysqlServer.query( 'SELECT users.* FROM users WHERE users.idNumber = ?', [ options.data.user.idNumber ], function( error, result ) {

						if( error ) {

							callback( error );

						} else {

							// USER DOES NOT EXIST

							if( result.length < 1 ) {

								InsertData = {
									'firstName'		: options.data.user.firstName,
									'lastName'		: options.data.user.lastName,
									'idNumber'		: options.data.user.idNumber,
									'companyName'	: options.data.user.companyName
									//'emailAddress'	: options.data.emailAddress
								};

								InsertQuery = "INSERT INTO users SET ?";
																									
								_mysqlServer.query( InsertQuery, InsertData, function( err, dbb ) {

									if( err ) {

											callback( err.code );

									} else {

										_mysqlServer.query( "INSERT INTO usersMeta SET ?", {
													'userID'			: dbb.insertId,
													'inductionTypeID'	: options.data.type,
													'value'				: options.data.date
											}, function( error, results ) {

													if( error ) {

														callback( error.code );

													} else {

														callback( false, 'User Induction saved successfully.' );

													}
											}
										);

									}
								
								});

							} else {

								//CHECK USER INDUCTIONS
								_mysqlServer.query( 'SELECT usersMeta.* FROM usersMeta WHERE usersMeta.userID = ? AND usersMeta.inductionTypeID = ? ', [ result[0].ID, options.data.type ], function( e, metadata ) {

									if( e ) {

										callback( e );

									} else {

										// ADD INDUCTION DATE
										if( metadata.length < 1 ) {

											_mysqlServer.query( "INSERT INTO usersMeta SET ?", {
													'userID'			: result[0].ID,
													'inductionTypeID'	: options.data.type,
													'value'				: options.data.date
												}, function( error2, results2 ) {

													if( error2 ) {

														callback( error2.code );

													} else {

														callback( false, 'User Induction added successfully.' );

													}
												}
											);

										} else {

											// UPDATE INDUCTION DATE

											var upd8data = {
												'value'	: options.data.date
											};
											
											_mysqlServer.query( "UPDATE usersMeta SET ? WHERE ID = ?", [upd8data, metadata[0].ID], function( error3, eish ) {
							
												if ( error3 ) {

													callback( error3.code );

												} else {

													callback( false, options.data.user.firstName + ' ' + options.data.user.lastName + ' Induction updated successfully.' );

												}

											});

										}

									}

								});

							}

						}

					});

					break;

				case 'log':

					GetMac.getMac( function( err, macAddress ) {

						//
						if( err ) {

							callback( err, macAddress);

						} else {	

							InsertData = {
								'macAddress'	: macAddress,
								//'last_login'	: '',
								'hostMachine'	: os.hostName()
							};

							InsertQuery = "INSERT INTO hseClients SET ?";
										
							_mysqlServer.query( InsertQuery, InsertData, function( error, dbb ) {

									if( error ) {

										callback( error.code );

									} else {
																			
										callback( false, 'Log added successfully.' );

									}
							});
					
						}

					});

					break;

				default:

					callback( 'data type [' + options.type + '] not specified' );

					break;

			}

		} catch( e ) {

			callback( e );

		}

	}

	/**
	 * @public
	 * 
	 * Create employees | equipment | operational Data
	 *
	 * @param {Mysql._mysqlServer}
	 * @param {Object.options}
	 * @param {Function.callback}
	 * 
	 * @return {Object} 
	 * 
	 */
	function DBUpdateData ( _mysqlServer, options, callback ) {

		var query 	= null,
			data 	= {};

		switch( options.type ) {

			case 'user':

				query = "UPDATE users SET ? WHERE ID = ?";
				data = {
					'firstName'		: options.data.firstName,
					'lastName'		: options.data.lastName,
					'idNumber'		: options.data.idNumber,
					'companyName'	: options.data.companyName
					//'emailAddress'	: options.data.emailAddress
				};

				_mysqlServer.query( query, [data, options.data.ID], function( error, results ) {
							
					if ( error ) {

						callback( error.code );

					} else {

						callback( false, options.data.firstName + ' ' + options.data.lastName + ' updated successfully.' );

					}

				});

				break;

			default:

				callback( 'data type [' + options.type + '] not specified' );

				break;
				
		}

	}

	/**
	 * @public
	 * 
	 * Delete employees | equipment | operational Data
	 *
	 * @param {Mysql._mysqlServer}
	 * @param {Object.options}
	 * @param {Function.callback}
	 * 
	 * @return {Object} 
	 * 
	 */
	function DBDeleteData ( _mysqlServer, options, callback ) {

		var deleteQuery = null;

		switch( options.type ) {

			case 'user':

				deleteQuery = "DELETE FROM users WHERE ID = ?";

				_mysqlServer.query( deleteQuery, [options.data.ID], function( err, dbb ) {

						if( err ) {

							callback( err.code );

						} else {


							callback( false, 'User deleted successfully.' );

						}

				});

				break;

			default:

				callback( 'data type [' + options.type + '] not specified' );

				break;
				
		}

	}

	/**
	 *---------------------------------------------------------
	 *
     * @public
     * 
     * AUXILLARY FUNCTIONS
     *
     ----------------------------------------------------------*/

	/**
     * Iterates over all the properties in an object or elements in an array. Differs from
     * $.each in that it always iterates over the properties of an object, even if it has a length
     * property making it look like an array.
     * 
     * @param {*} object The object or array to iterate over.
     * @param {function(value, key)} callback The function that will be executed on every object.
     */
    function localForEach ( object, callback ) {

		// this._strict( [ Object, Function ], arguments );

		var keys = Object.keys(object),
			len = keys.length,
			i;
            
		for (i = 0; i < len; i++) {
			callback(object[keys[i]], keys[i]);
		}

    }

	exports.DBAuthenticate 		= DBAuthenticate;
	
	exports.DBGetData 			= DBGetData;
	exports.DBCreateData 		= DBCreateData;
	exports.DBDeleteData 		= DBDeleteData;
	exports.DBUpdateData 		= DBUpdateData;

}());