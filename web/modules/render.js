/*
	Copyright (C) 2012,2013 by Calango Rei Games, wich is:
	Felipe Tavares, Brenno Arruda, Vinicius Abdias, Mateus Medeiros and Giovanna Gorgônio
*/

var scnLogo = {
	"scene": function () {
		this.backgroundColor = "white";
		this.textColor = "black";
	},

	"renderer": function () {
		this.scene = null;
		this.s = 4;
		this.a = 4;

		this.startt = jsEngine.pt;

		this.render = function () {
			jsEngine.smoothImage();

			html5.context.fillStyle = this.scene.backgroundColor;
			html5.context.fillRect (0,0,html5.canvas.width,html5.canvas.height);

			var img = html5.image("assets/images/bazinga.logo.png");

			if (this.a*4*img.height > html5.canvas.height/2) {
				this.a -= jsEngine.dt;
				this.s = this.a;
			} else {
				var time = jsEngine.pt-this.startt;
				if (time > 5) {// Cinco segundos 
					var nextRenderer = new scnIntro.renderer();
					nextRenderer.scene = new scnIntro.scene();
					jsEngine.modules.render.renderer = nextRenderer;
				}
			}

			html5.context.save();
				html5.context.translate (html5.canvas.width/2,html5.canvas.height/2);
				html5.context.scale (4*this.s,4*this.s);

				html5.context.drawImage (img,
										 -img.width/2,-img.height/2);
			html5.context.restore();
		}
	}
}

var scnIntro = {
	"scene": function () {
		this.background = html5.image("assets/images/cutscene/background.png");
		this.backgroundColor = "white";
		this.textColor = [0,0,0];
		this.textTime = 5;
		this.texts = [
			"Felipe Tavares",
			"Gabriel Araújo",
			"Camila Medeiros",
			"Cíntia Alves",
			"Ana Cecília",
			"apresentam",
			"El Aluno",
			"um jogo de Rayslla Almeida",
		];
	},

	"renderer": function () {
		this.scene = null;
		this.fontSize = 60;

		this.startTime = jsEngine.pt;

		this.calcFontSize = function (text, desired) {
			html5.context.font = Math.floor(this.fontSize)+"px sans-serif";
			// Tamanho com a fonte atual
			var current = html5.context.measureText(text).width;

			// Calcula o tamanho para a font que queremos (regra de 3)
			this.fontSize = Math.floor(this.fontSize)*desired/current;
		}

		this.renderText = function (text) {
			var time = (jsEngine.pt-this.startTime)/2;

			this.calcFontSize(text,html5.canvas.width/2);

			html5.context.textAlign = "center";
			html5.context.textBaseline = "middle";
			html5.context.font = this.fontSize+"px sans-serif";
			html5.context.fillText (text, html5.canvas.width/2,
										  html5.canvas.height/2);
		}

		this.render = function () {
			var s = html5.canvas.width/this.scene.background.width;
			html5.context.fillStyle = this.scene.backgroundColor;
			html5.context.fillRect (0,0,html5.canvas.width,html5.canvas.height);

			var time = jsEngine.pt-this.startTime;
			var index = parseInt(time/this.scene.textTime);

			html5.context.save();
				html5.context.translate(0,-time*s*this.scene.background.height/
										  ((this.scene.texts.length+2)*this.scene.textTime));
				html5.context.scale(s,s)
				html5.context.drawImage (this.scene.background,0,0)
			html5.context.restore();

			if (index < this.scene.texts.length) {
				var text = this.scene.texts[index];
				time = time%this.scene.textTime/this.scene.textTime*Math.PI*2;

				html5.context.fillStyle = "rgba("+	this.scene.textColor[0]+","+
													this.scene.textColor[1]+","+
													this.scene.textColor[2]+","+
													(-Math.cos(time))+")";
				this.renderText (text);
			} else {
				var nextRenderer = new scnCutscene.renderer();
				nextRenderer.scene = new scnCutscene.scene();
				jsEngine.modules.render.renderer = nextRenderer;
			}
		}
	}
}

var scnCutscene = {
	"scene": function () {
		this.backgroundColor = "black";
		this.textColor = "white";
		this.textTime = 5;
		this.dialog = [
			"Porra bixo!/ Roubaram minha calça!/ Agora aquele /-ogro-/",
			" /o Tales/ vai querer me prender por causa disso./ Vou de fininho para ele não me ver./",
			"#",
			"Ei!/ Pequena criatura, porquê não estás com",
			"as vestimentas de acordo com os padrões exigidos",
			"pelo colégio?/",
			"Esta é uma instituição de respeito!/",
			"#",
			"Roubaram minhas calças, Tales!/",
			"#",
			"Nossa!/",
			"Vai dizer agora que um animal quadrúpede por nome de cão../",
			".. alimentou-se do teu trabalho de casa?/",
			"Que desculpa mais anciã!/",
			"Vou te levar para a diretoria!/",
			"#",
			"Não!/ Eu vim de landres!/ Se mexer comigo, o bixo pega!/",
			"Tenho um carregamento explosivo aqui!/",
			"#",
			"Jovem aluno n00b.../ tenho em minhas mãos um carregamento novo de/",
			"- projetos de príncipe explosivos -/",
			"Vamos para a diretoria!/",
			"#",
			"Venha me pegar se for capaz!/",
			"#",
			"Muahaha!/ Não se preucupe quanto a isso!/ Irei!/",
		];
		this.facesA = [
			html5.image("assets/images/cutscene/boy0.png"),
			html5.image("assets/images/cutscene/boy1.png"),
		];
		this.facesB = [
			html5.image("assets/images/cutscene/tales0.png"),
			html5.image("assets/images/cutscene/tales1.png"),
		];
	},

	"renderer": function () {
		this.A = 0;
		this.B = 0;
		this.text = ["",""];
		this.scene = null;
		this.fontSize = 60;

		this.startTime = jsEngine.pt;

		this.calcFontSize = function (text, desired) {
			html5.context.font = Math.floor(this.fontSize)+"px sans-serif";
			// Tamanho com a fonte atual
			var current = html5.context.measureText(text).width;

			// Calcula o tamanho para a font que queremos (regra de 3)
			this.fontSize = Math.floor(this.fontSize)*desired/current;
		}

		this.renderText = function (text) {
			var time = (jsEngine.pt-this.startTime)/2-20;

			this.calcFontSize(text,html5.canvas.width/2);

			html5.context.textAlign = "center";
			html5.context.textBaseline = "middle";
			html5.context.font = this.fontSize+"px sans-serif";
			html5.context.fillText (text, html5.canvas.width/2,
										  html5.canvas.height/2+Math.sin(time)*html5.canvas.height/4);
		}

		this.positionAtDialog = 0;
		this.dialogNumber = 0;
		this.target = 0;
		this.addChar = function () {
			if (this.target == 1) {
				if (this.text[this.target].length%2 == 0) {
					this.B = (this.B+1)%2;
				}
			} else {
				if (this.text[this.target].length%2 == 0) {
					this.A = (this.A+1)%2;
				}
			}

			if (this.scene.dialog[this.dialogNumber].charAt(this.positionAtDialog-1) == '/')
				this.text[this.target] = "";
			
			if (this.positionAtDialog > this.scene.dialog[this.dialogNumber].length) {
				this.positionAtDialog = 0;
				this.dialogNumber++;
			}

			if (this.dialogNumber >= this.scene.dialog.length) {
				var nextRenderer = new scnBomberman.renderer();
				nextRenderer.scene = new scnBomberman.scene();
				jsEngine.modules.render.renderer = nextRenderer;
				jsEngine.modules.ui.show(GameMenu);
				return;
			}

			if (this.text[this.target].length > 15 &&
				this.text[this.target][this.text[this.target].length-1] == ' ')
				this.text[this.target] = "";

			var c = this.scene.dialog[this.dialogNumber].charAt(this.positionAtDialog++);

			if (c == '/') {
				setTimeout (html5.hitch(this.addChar,this), 500);
			} else if (c == '#') {
				if (this.target == 0)
					this.target = 1;
				else
					this.target = 0;
				setTimeout (html5.hitch(this.addChar,this), 80);
			}
			else {
				this.text[this.target] += c;
				setTimeout (html5.hitch(this.addChar,this), 80);
			}
		}

		this.render = function () {
			html5.context.fillStyle = this.scene.backgroundColor;
			html5.context.fillRect (0,0,html5.canvas.width,html5.canvas.height);

			var time = jsEngine.pt-this.startTime;
			
			html5.context.fillStyle = this.scene.textColor;
			html5.context.textAlign = "center";
			html5.context.textBaseline = "middle";
			html5.context.font = 16+"px sans-serif";
			html5.context.fillText (this.text[1], 	3*html5.canvas.width/4,
										  			(html5.canvas.height-this.scene.facesB[0].height*2)/2+
										  			this.scene.facesB[0].height*4+16);

			html5.context.fillText (this.text[0], 	1*html5.canvas.width/4,
										  			(html5.canvas.height-this.scene.facesA[0].height*2)/2+
										  			this.scene.facesA[0].height*4+16);

			if (this.target == 0) {
				html5.context.save();
					html5.context.translate(1*html5.canvas.width/4-this.scene.facesA[this.A].width*2,
											(html5.canvas.height-this.scene.facesA[this.A].height*2)/2);
					html5.context.scale(4,4);
					html5.context.drawImage (this.scene.facesA[this.A],
											 0,0);
				html5.context.restore();
			} else {
				html5.context.save();
					html5.context.translate(3*html5.canvas.width/4-this.scene.facesB[this.B].width*2,
											(html5.canvas.height-this.scene.facesB[this.B].height*2)/2);
					html5.context.scale(4,4);
					html5.context.drawImage (this.scene.facesB[this.B],
											 0,0);
				html5.context.restore();
			}
		}

		setTimeout (html5.hitch(this.addChar,this), 0);
	}
}


function Cloud () {
	this.vx = Math.random()*100+100;
	this.x = html5.canvas.width;
	this.y = html5.canvas.height*Math.random();
	this.cloud = html5.image("assets/images/cloud/cloud.png");

	this.render = function () {
		this.x -= jsEngine.dt*this.vx;

		html5.context.save();
			html5.context.translate (this.x, this.y);
			html5.context.scale (8,8);
			html5.context.drawImage (this.cloud, 0, 0);
		html5.context.restore();
	}
}

scnBomberman = {
	"scene": function () {
		this.backgroundColor = "ligthblue";
		this.textColor = [255,128,0];
	},

	"renderer": function () {
		this.scene = null;
		this.x = html5.canvas.width;
		this.clouds = [];

		this.renderClouds = function () {
			//this.clouds.push(new Cloud());

			if (Math.random() > 0.99)
				this.clouds.push(new Cloud());

			for (var c=0;c<this.clouds.length;c++) {
				this.clouds[c].render();
				if (this.clouds[c].y < -256) {
					this.clouds.splice (c, 1);
					c--;
				}
			}
		}

		this.render = function () {
			$("#html_canvas").css("background","blue");
			html5.context.clearRect (0,0,html5.canvas.width,html5.canvas.height);

			this.renderClouds();

			jsEngine.modules.map.render();
		}
	}
}

function GameRender () {
	this.info = JSInfo ("Matrix",
						1.0,
						"Game Render",
						"Render the game, based in objects");
	this.depends = [];

	this.renderer = null;

	this.render = function () {
		this.renderer.render();
	}
}
