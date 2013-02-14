
core.setupFeatureDisplay = function() {
	YUI().use('node', function(Y) {
		if(Y.one('.list-features-content') != null) {
			Y.all('.list-features-content li').setStyle('display','none');
			Y.one('#list-feature-saas').setStyle('display','block');
			Y.all('.nav-list-features li').each(function (node) {
				node.delegate('click', function(e){
					e.preventDefault();
		        	var clicked = this.get('text');
		        	Y.all('.nav-list-features li a').removeClass('active');
		      		this.addClass('active');
		        	var toShow = '';
		        	switch(clicked) {
		        		case 'SAAS':
		        			toShow = '#list-feature-saas';
		        		break;
		         		case 'Service orchestration':
		        			toShow = '#list-feature-orchestration';
		        		break;
		         		case 'PAAS':
		        			toShow = '#list-feature-paas';
		        		break;
		         		case 'Guest OS':
		        			toShow = '#list-feature-guest';
		        		break;
		         		case 'Public cloud':
		        			toShow = '#list-feature-public';
		        		break;
		         		case 'Private cloud':
		        			toShow = '#list-feature-private';
		        		break;
		         		case 'Virtualisation':
		        			toShow = '#list-feature-virtualisation';
		        		break;
		       		}
		       		Y.all('.list-features-content li').setStyle('display','none');
		        	Y.one(toShow).setStyle('display','block');
		        }, 'a');
		    });
	   }
	});
}


core.setupAnimations = function(){
	YUI().use('node', function(Y) {
		if(Y.one('body').hasClass('devices-phone-design')){
			var yOffset = 150;
			var edgeMagic = Y.all('.edge-magic');
			var searchScreen = {ypos: Y.one('.search-screen').getXY()[1] - yOffset, run: false};
			Y.on('scroll', function(e) {
				 edgeMagic.each(function (node) {
					if(window.scrollY > node.getXY()[1] - yOffset && window.scrollY < node.getXY()[1] && !node.run){ 
						node.run = true;
						node.one('.slider-animation').addClass('run');
						if(node.one('.slider-animation').getAttribute('class') == 'slider-animation full-swipe run'){
							setTimeout(function(){ node.one('.launcher').addClass('return') }, 2000);
						}
					}
				});
			});
			if(window.scrollY > searchScreen.ypos && window.scrollY < searchScreen.ypos + yOffset && !searchScreen.run){ 
				searchScreen.run = true;
				core.runAnimation('search-screen'); 
			}else{
				Y.on('scroll', function(e) {   
					 if(window.scrollY > searchScreen.ypos && window.scrollY < searchScreen.ypos + yOffset && !searchScreen.run){ 
					 	searchScreen.run = true;
					 	core.runAnimation('search-screen');
					 }
				});
			}
			
			Y.all('.replay').on('click', function(e){
				core.rerunAnimation(e.target.get('parentNode').one('.slider-animation').getAttribute('class').replace('slider-animation ','').replace(' run',''));
			});
			
			Y.one('.content-controls .gallery-screen').setStyle('display','block');
			var infoIndex = 0;
			setInterval(function(){
				Y.all('.infographic .main-image').addClass('hide');
				Y.one('.infographic .info-pic-'+infoIndex).removeClass('hide');
				if(++infoIndex > 4){ infoIndex = 0; }
			}, 4000);
		}
	});
}

core.runAnimation = function($anim) {
	YUI().use('node', function(Y) {
		switch($anim) {
			case 'search-screen':
				Y.one('.search-screen').addClass('run');
				setTimeout(function(){ Y.one('.search-screen').removeClass('run'); }, 2000);
			break;
			case 'go-back':
				Y.one('.go-back').addClass('run');
			break;
		}
	});
};

core.updateSlider = function( $index ) {
	if($index >= 4){ $index = 0; }
	if($index <= -1){ $index = 3; }
	YUI().use('node', function(Y) {
		Y.one('.slide-container').setStyle('left','-'+(700 * $index)+'px');
		Y.all('.slider-dots li').removeClass('active');
		Y.all('.slider-dots li.pip-'+$index).addClass('active');
		Y.all('.slider-animation').removeClass('run');
		Y.one('.full-swipe .launcher').removeClass('return');
		switch($index+''){
			case '0':
				setTimeout(function(){ Y.one('.edge-magic').addClass('run'); }, 1200);
			break;
			case '1':
				setTimeout(function(){ Y.one('.full-swipe').addClass('run');}, 1200);
				setTimeout(function(){ Y.one('.full-swipe .launcher').addClass('return') }, 2000); 
			break;
			case '2':
				setTimeout(function(){ Y.one('.go-back').addClass('run'); }, 1200);
			break;
			case '3':
				setTimeout(function(){ Y.one('.content-controls').addClass('run'); }, 1200);
			break;
		}
	});
	return $index;
}

core.rerunAnimation = function($type){
	YUI().use('node', function(Y) {
		Y.one('.'+$type).removeClass('run');
		if($type == 'full-swipe'){
			Y.one('.full-swipe .launcher').removeClass('return');
			setTimeout(function(){ Y.one('.full-swipe').addClass('run'); }, 400);
			setTimeout(function(){ Y.one('.full-swipe .launcher').addClass('return') }, 1400); 
		}else{
			Y.one('.'+$type).removeClass('run');
			setTimeout(function(){ Y.one('.'+$type).addClass('run'); }, 400);
		}
	});
}

core.flipVideo = function(){
	YUI().use('node', function(Y) {
		if(Y.one('body').hasClass('phone-home')) {
			Y.one('.show-video').on('click',function(e) {
				e.preventDefault();
				Y.one('#panel').addClass('flipped');
				setTimeout(function(){ Y.one('.the-video').set('innerHTML','<iframe width="569" height="320" src="http://www.youtube.com/embed/cpWHJDLsqTU?showinfo=0&hd=1&rel=0&modestbranding=0&autoplay=1" frameborder="0" allowfullscreen></iframe>');Y.one('#panel .back').setStyle('z-index', '50');}, 1000);
			});
			Y.one('.close-video').on('click',function(e) {
				e.preventDefault();
				Y.one('#panel .back').setStyle('z-index', '0');
				Y.one('.the-video').set('innerHTML','');
				Y.one('#panel').removeClass('flipped');
			});
		}
	});
}

core.setupFeatureDisplay();
core.setupAnimations();
core.flipVideo();