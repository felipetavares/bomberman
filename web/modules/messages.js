/*
	O nome deste módulo vem do estilo do texto utilizado
*/

function Message (text) {
	this.x = html5.canvas.width/2;
	this.y = html5.canvas.height/2;
	this.text = text;
	this.life = 2;

	this.startTime = jsEngine.pt;

	this.step = function () {
		this.y -= jsEngine.dt*300;

		this.life -= jsEngine.dt;
	}

	this.render = function () {
		this.step();
		var time = (jsEngine.pt-this.startTime)+0.1;
		time = time > 1?1:time;

		html5.context.save();
			html5.context.translate(this.x,this.y);
			html5.context.scale(1/time,1/time);
			html5.context.fillText (this.text,0,0);
		html5.context.restore();
	}

	this.isAlive = function () {
		return this.life > 0;
	}
}

function MessageManager () {
	this.info = new JSInfo ("Floating",
							0.1,
							"Message Manager",
							"Controls all messages displayed to the user");
	this.depends = [];

	this.messages = [];

	this.yp = 0;

	this.addMessage = function (message) {
		this.yp++;
		message.y += this.yp*36;
		this.messages.push (message);		
	}

	this.render = function () {
		if (this.yp > 0)
			this.yp -= jsEngine.dt;

		if (this.messages.length == 0)
			this.yp = 0;

		html5.context.fillStyle = "white";
		html5.context.textAlign = "center";
		html5.context.textBaseline = "middle";
		html5.context.font = 36+"px Lucida Console";

		for (var m=0;m<this.messages.length;m++) {
			if (this.messages[m].isAlive())
				this.messages[m].render();
			else {
				this.messages.splice(m,1);
				m--;
			}
		}
	}
}