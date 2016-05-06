({
	paths: {
		//"app": 						'production/app-min',
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
	out: 'production/app-min.js',
	name: 'app',
	/**/
	wrap: true,
	priority: [
		"jquery"
	]
})
