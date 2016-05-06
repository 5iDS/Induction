/**
* Copyright (c) 1988 - Present @MaxVerified on behalf of 5ive Design Studio (Pty) Ltd. 
* 
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
**/
require.config({
	/**/
	paths: {
		"app": 						'production/app-min',
		//"app": 						'app',
		"AppConstants": 			'base-config/config',
		"md5hash": 					'utils/md5hash',
		"nodeConnection":       	'utils/NodeConnection',
		"text": 					'thirdparty/text/text',
		"i18n": 					'thirdparty/i18n/i18n',
		"window":       			'utils/window',
		"document":     			'utils/document',
		"pathUtils":				'thirdparty/path-utils/path-utils.min',
		'localforage': 				'thirdparty/localforage.min',
		"Utils": 					'thirdparty/Utils',
		//angular
		"angular": 					'thirdparty/angular.1.2.min',
		"angular-animate": 			'thirdparty/plugins/angular/angular-animate.min',
		"angular-ping": 			'thirdparty/plugins/angular/angular-ping.min',
		"angular-route": 			'thirdparty/plugins/angular/angular-route.min',
		"angular-filter": 			'thirdparty/plugins/angular/angular-filter.min',
		"angular-touch": 			'thirdparty/plugins/angular/angular-touch.min',
		"angular-gestures": 		'thirdparty/plugins/angular/gestures.min',
		"angular-tour-html":		'thirdparty/plugins/angular/angular-tour-tpls.min',
		"angular-dialog": 			'thirdparty/plugins/angular/ngDialog.min',
		"angular-progress": 		'thirdparty/plugins/angular/ngProgress.min',
		"bindonce": 				'thirdparty/plugins/angular/bindonce.min',
		//3rdParty
		"howler": 					'thirdparty/howler.min',
		"revealjs": 				'thirdparty/revealjs/reveal',
		"sjcl": 					'thirdparty/sjcl',
		"secStore": 				'thirdparty/secStore.min',
		"domReady": 				'production/domready',
		"classie": 					'thirdparty/classie',
		"humane": 					'thirdparty/humane.min',
		//"operative": 				'thirdparty/operative',
		"sweetAlert": 				'thirdparty/sweetalert.min',
		//"scrollReveal": 			'thirdparty/scrollReveal.min',
		//jQuery Plugins
		"jquery": 					'thirdparty/jquery-2.0.1.min',
		"noti5y": 					'thirdparty/noti5y'
	},
	shim: {
		'nodeConnection': {
			exports: 'NodeConnection'
		},
		'revealjs': {
			exports: 'Reveal'
		},
		'angular': {
			exports: 'angular'
		},
		'angular-touch': {
			deps: ["angular"]
        },
		'angular-route': {
			deps: ["angular"]
        },
        'angular-filter': {
			deps: ["angular"]
        },
        'angular-animate': {
			deps: ["angular"]
        },
		'angular-gestures': {
			deps: ["angular"]
		},
		'bindonce': {
			deps: ["angular"]
		},
		'angular-dialog': {
			deps: ["angular"],
		},
		'angular-tour-html': {
			deps: ["angular"],
		},
		'angular-progress': {
			deps: ["angular"]
		},
		'Utils': {
        	deps: ["sjcl"],
			exports: 'Utils'
        },
		'secStore': {
        	deps: ["sjcl"],
			exports: 'secStore'
        },
		'humane': {
			exports: 'humane'
		},
		'sweetAlert': {
			exports: 'sweetAlert'
		},
		'jquery': {
			exports: '$'
		},
		'noti5y': {
			exports: 'noti5y'
		}
	},
	/**/
	waitSeconds: 10,
	priority: [
		"jquery"
	],
	// Use custom brackets property until CEF sets the correct navigator.language
    // NOTE: When we change to navigator.language here, we also should change to
    // navigator.language in ExtensionLoader (when making require contexts for each extension).
	locale: window.localStorage.getItem("locale") || (typeof (brackets) !== "undefined" ? brackets.app.language : navigator.language)

});

/*-------------------------------------------------------------------------------------------------------------------------------*
 *
 *   ~:: BOOTSTRAP ::~
 * 
 * init is the root of the app codebase. This file pulls in all other modules as
 * dependencies (or dependencies thereof), initializes the UI, and binds global menus & keyboard
 * shortcuts to their Commands.
 *
 * 
 *-------------------------------------------------------------------------------------------------------------------------------*/
define( function ( require, exports, module ) {

	"use strict";

	// Load dependent non-module scripts
	require("app");

	// Load dependent modules
	var domReady 				= require("domReady"),
		AppInit                 = require("production/AppInit");

	function _onReady() {

    	// Prevent the browser context menu since Brackets creates a custom context menu
		window.document.body.addEventListener("contextmenu", function (e) {
			
			if( e.srcElement.className == "icon-tools" ) {} else {

				//console.log('right-click:', e);

				e.preventDefault();

			}
		
		});	
	
	}

	/**
	 * Setup event handlers prior to dispatching AppInit.HTML_READY
	 */
	function _beforeHTMLReady() {
		
		// Add the platform (mac or win) to the body tag so we can have platform-specific CSS rules
        //window.document.body.classList.add("platform-" + brackets.platform);
        
        // Browser-hosted version may also have different CSS (e.g. since '#titlebar' is shown)
        if (brackets.inBrowser) {

			window.document.body.classList.add('in-browser');

		} else {
			
			window.document.body.classList.add('in-appshell');

		}

		// Enable/Disable HTML Menus
		if (brackets.nativeMenus) {
			window.document.body.classList.add("has-appshell-menus");
		}

		// The .no-focus style is added to clickable elements that should
		// not steal focus. Calling preventDefault() on mousedown prevents
		// focus from going to the click target.
		$("html").on( "mousedown", ".no-focus", function (e) {
			// Text fields should always be focusable.
			var $target = $(e.target),
					isTextField =
						$target.is("input[type=text]") ||
						$target.is("input[type=number]") ||
						$target.is("input[type=password]") ||
						$target.is("input:not([type])") || // input with no type attribute defaults to text
						$target.is("textarea");
    
			if (!isTextField) {
				e.preventDefault();
			}
		});

		// Prevent unhandled middle button clicks from triggering native behavior
        // Example: activating AutoScroll (see #510)
        window.document.body.addEventListener("mousedown", function (e) {

        	if (e.button === 1) {
				e.preventDefault();
			}

        });
        /** /
		$("html").on( "mousedown", function (e) {
			if (e.button === 1) {
				e.preventDefault();
			}
		});/**/

	}

	// Dispatch htmlReady event
	_beforeHTMLReady();

	AppInit._dispatchReady(AppInit.HTML_READY);

	domReady( function () {

		_onReady();
	});

});
