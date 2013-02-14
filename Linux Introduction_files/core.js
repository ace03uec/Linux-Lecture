/**
 * Ubuntu Core Front-End Framework
 *
 * Core javascript file part of Ubuntu Core Front-End Framework
 * 
 * This file containes the classes required by ubuntu.com to interact. 
 * 
 * @project		Ubuntu Core Front-End Framework
 * @author		Web Team at Canonical Ltd
 * @copyright	2012 Canonical Ltd
 *
 */

/**
 * Table of contents
 *
 * Core
 * - setEqualHeight
 * - getPullQuotes
 * - searchInteraction
 * - hashBang
 *  -- qualifyURL
 *  -- checkForSession
 *  -- slideToAnchor
 *  -- jumpToAnchor
 * - setupTooltips
 * - setupCookie
 * - setupTabs
 * 
 */

core = {};

core.setEqualHeight = function($className) {
   YUI().use('node', function (Y) {
	    var maxHeight = 0;
	    var heightArray = Array();
	    var collection = Y.all('.'+$className);
	    collection.each(function(node) {
	    	node.all(' > div, > ul li').each(function(node) {
		    	if(node.get('clientHeight') > maxHeight){
		    		maxHeight = node.get('clientHeight');
		    	}
	    	});
	    	node.all('> div, > ul li').setStyle('height', maxHeight);
	    	maxHeight = 0;
	    });
	});
}

core.getPullQuotes = function() {
	YUI().use('node', function(Y) {
	    Y.all('span.pull-quote').each(function (node) {
	       var item = Y.Node.create('<div class="pull-quote">&quot;'+node.getContent()+'&quot;</div>');
	       node.get('parentNode').get('parentNode').get('parentNode').append(item);
	    });
	});
}

core.searchInteraction = function() {
   YUI().use('event', function (Y) {
   		var searchBox = Y.one('#edit-keys');
   		searchBox.set("value","Type to search");
	    searchBox.on('blur', function(e) {
	    	if(searchBox.get('value') == ""){
	    		searchBox.set("value","Type to search");
	    	}
	    });
	    searchBox.on('focus', function(e) {
	    	if(searchBox.get('value') == "Type to search"){
	    		searchBox.set("value","");
	    	}
	    });
	});
}

core.hashBang = function() {
	YUI().use('node', function(Y) {
		Y.all('a').each(function (node) {
			var hrefValue = node.get('href');
			if( hrefValue.indexOf("#") != -1 ){
				var cleanTarget = core.qualifyURL(hrefValue.substr(0,hrefValue.indexOf('#')));
				var hashValue = hrefValue.substr(hrefValue.indexOf('#')+1);
				var cleanURL = window.location.href;
				node.setAttribute('data-hash',hashValue);
				node.set('href',hrefValue.substr(0,hrefValue.indexOf('#')));
				if(cleanURL == cleanTarget){
					node.on("click", function (e) {
						e.preventDefault();
						window.name = null;
						if(!this.hasClass('slideless')){
							core.slideToAnchor(this.getAttribute('data-hash'));
						}
					});
				}else{
					node.on("click", function (e) {
						window.name = '¬'+node.getAttribute('data-hash');
					});
				}
			}else{
				node.on("click", function (e) {
					window.name = null;
				});
			}
		});
	});
	core.checkForSession();
}

core.qualifyURL = function($url) {
    var img = document.createElement('img');
    img.src = $url;
    $url = img.src;
    img.src = null;
    img = null;
    return $url;
}

core.checkForSession = function() {
	var session = window.name;
	if(session.charAt(0) == '¬'){
		core.jumpToAnchor(session.substring(1));
	}
}

core.slideToAnchor = function($name) {
	var target;
	YUI().use('anim', function (Y) {
		if($name == ''){
			target = Y.one('#main-content');
		}else{
			target = Y.one('#'+$name);
		}
		var destination = target.getXY()[1] - 40;
		var webkitAnim = new Y.Anim({
		    node: Y.one('html'),
		    to: { scroll: [0, destination]},
		    easing: 'easeOut',
		    duration: 2,
		});
		var ffAnim = new Y.Anim({
		    node: Y.one('body'),
		    to: { scroll: [0, destination]},
		    easing: 'easeOut',
		    duration: 2,
		});
		webkitAnim.run(2000);
		ffAnim.run(2000);
		
	});
}

core.jumpToAnchor = function($name) {
	if(document.getElementById($name)){
		document.getElementById($name).scrollIntoView();
	}else{
		window.name = null;
	}
}

core.setupTooltips = function() {
	YUI().use('node', function(Y) {
		if(Y.one('.tooltip') != null) {
			Y.all('.tooltip').each(function (node) {
				node.get('parentNode').prepend('<p class="tooltip-label">'+node.get('title')+'</p>');
				var title = this.get('title');
				node.on('mouseover', function(e){
					this.set('title','');
					this.get('parentNode').one('.tooltip-label').setStyle('display', 'inline');
				});
				node.on('mouseout', function(e){
					this.set('title',title);
					this.get('parentNode').one('.tooltip-label').setStyle('display', 'none');
				});
			});
		}
	});
}

core.cookiePolicy = function() {
	
	YUI().use('cookie', function (Y) {
		if(Y.Cookie.get("_cookies_accepted") != 'true'){
			open();
		}
	});
	
	function open() {
		YUI().use('node', function(Y) {
			Y.one('.cookie-policy').setStyle('display', 'block');
			Y.one('.cookie-policy .link-cta').on('click',function(e){
				e.preventDefault();
				close();
			});
		});
	}
	function close() {
		YUI().use('node', function(Y) {
			//Y.one('.cookie-policy').setStyle('display', 'none');
			animate();
			setCookie();
		});
	}
	function animate() {
		YUI().use('anim', function(Y) {
			var myAnim = new Y.Anim({
			    node: '.cookie-policy',
			    to: { marginTop: -115 }
			});
			myAnim.run();
			myAnim.on('end', function() {
		        var node = this.get('node');
		        node.get('parentNode').removeChild(node);
		    });
		});
	}
	function setCookie() {
		YUI().use('cookie', function (Y) {
			Y.Cookie.set("_cookies_accepted", "true");
		});
	}
}

core.sectionTabs = function() {
	YUI().use('anim', function (Y) {
		if(Y.one('.tabbed-content')) {
			var p = Y.one('.tabbed-menu a.active');
			var s = p.get('href').split('#')[1];
			var a = Y.one('.arrow');
			var w = (p.get('clientWidth') / 2) - 7;
			var x = (p.get('parentNode').getXY()[0] - p.get('parentNode').get('parentNode').getXY()[0]) + w;
			Y.all('.tabbed-content').each(function() {
			  	if(this.get('id') != s){
			  		this.setStyle('opacity', '0');
			  	}
			  }
			);
			a.setStyle('left',x+'px').setStyle('display', 'inline');
			Y.all('.tabbed-menu a').on('click',function(e) {
				e.preventDefault();
				Y.all('.tabbed-menu a').removeClass('active');
				e.currentTarget.addClass('active');
				Y.all('.tabbed-content').addClass('hide').setStyle('opacity','0');
				s = e.currentTarget.getAttribute('data-hash');
				Y.one('#'+s).removeClass('hide');
				new Y.Anim({ node: '#'+s, to: { opacity: 1 } }).run();
				x = (e.currentTarget.get('parentNode').getXY()[0] - e.currentTarget.get('parentNode').get('parentNode').getXY()[0]) + w;
				new Y.Anim({ node: a, to: { left: x+'px' } }).run();
			});
		}
	});
}


core.sectionTabs();
core.setEqualHeight('equal-height');
core.searchInteraction();
core.hashBang();
core.setupTooltips();
core.cookiePolicy();
