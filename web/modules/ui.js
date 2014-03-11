/*
	Copyright (C) 2012,2013 by Calango Rei Games, wich is:
	Felipe Tavares, Brenno Arruda, Vinicius Abdias, Mateus Medeiros and Giovanna Gorgônio
*/

function UIListView (title) {
	this.title = title;
	this.list = null;
	this.panel = null;
	this.html = null;
	this.op = [];

	this.selectedOption = 0;

	this.hidden = true;

	this.constructor = function () {

	}

	this.addOption = function (op, onActivate, onSelect) {
		var html = $("<div>");
		html.attr ("class", "UIOption");
		html.text (op);

		if (onActivate) {
			html.click (onActivate);
		}

		this.op[op] = html;
		this.html.append (html);
	}

	this.hide = function () {
		this.hidden = true;
		window.removeEventListener('keydown',this.listener);
	}

	this.show = function () {
		this.hidden = false;

		this.html = $("<div>");
		this.html.attr ("class", "UIListView");

		var title = $("<div>");
		title.attr ("class", "UITitle");
		title.text (this.title);
		
		this.html.append (title);

		var op;
		for (op in this.list)
			this.addOption (this.list[op].content,
							html5.hitch(this.list[op].onActivate,this),
							html5.hitch(this.list[op].onSelect,this));
	
		this.select();

		this.listener = html5.hitch(this.onKeyDown,this);
	    window.addEventListener('keydown',this.listener);
	}

	this.unselect = function () {
		this.html.children().eq(1+this.selectedOption).attr ("class", "UIOption");
	}

	this.select = function () {
		this.html.children().eq(1+this.selectedOption).attr ("class", "UIOption-hover");
	}

	this.down = function () {
		this.unselect();
		if (this.selectedOption < this.list.length-1)
			this.selectedOption++;
		this.select();
	}

	this.up = function () {
		this.unselect();
		if (this.selectedOption > 0)
			this.selectedOption--;
		this.select();
	}

	this.onKeyDown = function (evt) {
		evt.preventDefault();

		if (this.hidden)
			return;

		if (evt.keyCode == html5.keyUp)
			this.up();
		if (evt.keyCode == html5.keyDown)
			this.down();
		if (evt.keyCode == html5.keyEnter)
			this.html.children().eq(1+this.selectedOption).click();
	}
}

function UIPanel () {
	this.border = 0.1;
	this.backgroundColor = "rgba(0,0,0,1)";
	this.color = "rgba(0,255,255,1)";

	this.currentView = null;
	this.views = [];

	this.html = null;

	this.addView = function (view) {
		this.currentView = 0;
		view.panel = this;
		this.views.push (view);
	}

	this.open = function () {
		this.html = $("<div>");
		this.html.attr ("class", "UIPanel");
		$("body").append(this.html);
		this.html.css ("display", "none");
	}

	this.show = function () {
		var child = this.html.children().first();
		if (child.length == 0)
			child = this.html;

		this.views[this.currentView].constructor();
		this.views[this.currentView].show();		

		child.animate ({
			"left": 0
		},25,"swing", html5.hitch(function () {
		
		this.html.html("");
	
		this.html.append (this.views[this.currentView].html);
	
		var vw = this.html.width();
		var vh = this.html.height();

		this.html.css("left", ($(window).width()-vw)/2)
		this.html.css("top", ($(window).height()-vh)/2)
		this.html.css ("display", "block");
		},this));
	}

	this.switchTo = function (n) {
		if (n >= 0 &&
			n < this.views.length) {
			this.views[this.currentView].hide();
			this.currentView = n;
			this.show();
		}
	}

	this.hide = function () {
		this.views[this.currentView].hide();
		this.html.css ("display", "none");
		html5.enableInput();
	}
}

function UIManager () {
	this.info = new JSInfo ("Cick son, click",
							1.0,
							"UI Manager",
							"Draws and animates all GUI elements");
	this.depends = ["math"];

	this.panels = [];

	this.currentPanel = null;

	this.y = 0;

	this.start = function () {
	}

	this.show = function (panel) {
		this.currentPanel = panel;
		panel.show();
		html5.disableInput();
	}

	this.update = function () {
	}
}