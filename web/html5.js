function html5 () {
    // KEY CODES
    this.keyLeft  = 37;
    this.keyUp    = 38;
    this.keyRight = 39;
    this.keyDown  = 40;
    this.keySpace = 32;
    this.keyEnter = 13;
    this.keyW     = 87;
    this.keyTilde = 192;
    this.keyESC	  = 27;
    // IF ANYONE KNOW OTHER WAY TO GET THEM, PLEASE TELL ME <felipe.oltavares@gmail.com>

    this.mousePos = [0,0];
    this.mouseButton = false;

    this.canvas = false;
    this.context = false;
    this.images = new Object();
    this.audios = new Object();

    this.keyboard = new Object();

    this.listenerUp = null;
    this.listenerDown = null;

    this.enableInput = function () {
    	this.listenerDown = this.hitch(this.onDownEvent,this);
 	    this.listenerUp = this.hitch(this.onUpEvent,this);
 	    window.addEventListener('keydown',this.listenerDown,false);
	    window.addEventListener('keyup',this.listenerUp,false);

	    var k;
	    for (k in this.keyboard) {
	    	this.keyboard[k] = false;
	    }
    }

    this.disableInput = function () {
 	    window.removeEventListener('keydown',this.listenerDown,false);
	    window.removeEventListener('keyup',this.listenerUp,false);
    }

    this.getCanvas2dContext = function () {
	this.canvas = document.getElementById("html_canvas");
	if (this.canvas && this.canvas.getContext) {
	    this.context = this.canvas.getContext('2d');
	    this.canvas.addEventListener('mousemove', this.hitch (this.onMouseEvent,this), true);
	    this.canvas.addEventListener('mousedown', this.hitch (this.onMouseClick,this), true);
	    this.canvas.addEventListener('mouseup', this.hitch (this.onMouseRelease,this), true);
	    this.canvas.addEventListener('touchmove', this.hitch (this.onMouseEvent,this), true);
	    this.canvas.addEventListener('touchstart', this.hitch (this.onMouseClick,this), true);
	    this.canvas.addEventListener('touchend', this.hitch (this.onMouseRelease,this), true);
	    return this.context;
	}
	else
	    return false;
    }

    this.hitch = function (func,newThis,args) { // Same idea of dojo.lang.hitch
	return function () {
	    func.apply(newThis,arguments);
	}
    }

    this.hitch2 = function (func,newThis,args) { // Same idea of dojo.lang.hitch
	return function () {
	    func.apply(newThis,args);
	}
    }

    this.loadImage = function (fname,name) {
	this.images[name] = new Image();
	this.images[name].src = fname+"?"+Math.random();
	this.images[name].onload = this.hitch (this.loadedImage,html5);
    }

    this.loadAudio = function (fname,name) {
	this.audios[name] = document.createElement('audio');
	this.audios[name].src = fname;
	this.audios[name].preload = true;
	//this.audios[name].addEventListener('canplaythrough', this.hitch (this.loadedImage,html5), false);
	this.audios[name].load();
    }

    this.image = function (name) {
	return this.images[name];
    }

    this.audio = function (name) {
	return this.audios[name];
    }

    this.onDownEvent = function (evt) {
	evt.preventDefault();
    glb = evt;
	this.keyboard[evt.keyCode] = true;
    }

    this.onUpEvent = function (evt) {
	evt.preventDefault();
	this.keyboard[evt.keyCode] = false;
    }

    this.get = function (url) {
	var xmlhttp;
	if (window.XMLHttpRequest) {// code for IE7+, Firefox, Chrome, Opera, Safari
	    xmlhttp=new XMLHttpRequest();
	}
	else {// code for IE6, IE5
	    xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
	}
	xmlhttp.open("GET",url,false);
	xmlhttp.send();

	return xmlhttp.responseText;
    }

    this.onMouseEvent = function (evt) {
    	evt.preventDefault();
		this.mousePos = [evt.pageX,evt.pageY];
    }

    this.onMouseClick = function (evt) {
    	evt.preventDefault();
    	this.mouseButton = true;
		this.mousePos = [evt.pageX,evt.pageY];
    }

    this.onMouseRelease = function (evt) {
    	evt.preventDefault();
    	this.mouseButton = false;
    }

	this.imgsLoaded = 0;
	this.loadingTextSize = 0;
	this.loadedImage = function () {
		html5.context.fillStyle = "black";
		html5.context.fillRect (0,0,html5.canvas.width,html5.canvas.height);

		this.imgsLoaded ++;
		var i,s=0;
		for (i in this.images) {s++;};
		//for (i in this.audios) {s++;};

		var msg = "Loading assets...";

		html5.context.font = "normal 40px serif";
		html5.context.fillStyle = "red";
		this.loadingTextSize = html5.context.measureText(msg).width;
		html5.context.fillText (msg,html5.canvas.width/2-html5.context.measureText(msg).width/2,html5.canvas.height/2);

		msg = "" + Math.floor((this.imgsLoaded/s*100)) + "%";
		msg += " "+this.imgsLoaded+"/"+s;

		html5.context.fillStyle = "red";
		html5.context.fillRect (html5.canvas.width/2-this.loadingTextSize/2,html5.canvas.height/2+30,this.imgsLoaded/s *(this.loadingTextSize),5);
		html5.context.font = "normal 20px serif";
		html5.context.fillText (msg,html5.canvas.width/2-html5.context.measureText(msg).width/2,html5.canvas.height/2+65);

		if (this.imgsLoaded == s) {
			this.onLoad();
		}
	}

	this.onLoad = function () {
		alert ("Everything Loaded!");
	}

	this.loading = function () {
	}
}

html5 = new html5();
