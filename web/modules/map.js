/*
	Copyright (C) 2012,2013 by Calango Rei Games, wich is:
	Felipe Tavares, Brenno Arruda, Vinicius Abdias, Mateus Medeiros and Giovanna Gorgônio
*/

/*
	Esse módulo impĺementa um gerenciador de mapas.
*/

function DefaultObject () {
	this.move = function (map, x, y) {
		if (map.isInside(x,y)) {
			for (var i=0;i<map.data[this.y][this.x].length;i++)
				if (map.data[this.y][this.x][i] == this) {
					map.data[this.y][this.x].splice(i,1);
					break;
				}

			this.x = x;
			this.y = y;

			map.data[y][x].push(this);
		}
	}
}

// Tales
function Tales (x, y) {
	this.x = x;
	this.y = y;
	this.type = "tales";
	this.images = [
					html5.image("assets/images/tales/front.png"),
					html5.image("assets/images/tales/back.png"),
					html5.image("assets/images/tales/left.png"),
					html5.image("assets/images/tales/right.png"),
	];
	this.image = 0;

	// Just javascript, my dear..
	this.canMoveTo = new Player().canMoveTo;
	this.move = new Player().move;

	this.lastUpdate = jsEngine.pt;

	this.bombIn = function (map, x, y) {
		if (map.isInside(x,y)) {
			for (var i=0;i<map.data[y][x].length;i++)
				if (map.data[y][x][i].type == "bomb")
					return true;
		}
		return false;
	}

	// Um pouco de inteligência para o nosso tales..
	this.bombNear = function (map, x, y) {
		return this.bombIn(map, x, y) 	||
			   this.bombIn(map, x+1, y) ||
			   this.bombIn(map, x-1, y)	||
			   this.bombIn(map, x, y+1)	||
			   this.bombIn(map, x, y-1);
	}

	this.calcNext = function (nextX,nextY) {
		var random = Math.random();

		if (random < 0.25) {
			nextY = nextY+1;
			this.image = 0;
		} else
		if (random < 0.50) {
			nextX = nextX+1;
			this.image = 3;
		} else
		if (random < 0.75) {
			nextY = nextY-1;
			this.image = 1;
		} else {
			nextX = nextX-1;
			this.image = 2;
		}
	
		return [nextX,nextY];
	}

	this.update = function (map) {
		if (jsEngine.pt-this.lastUpdate > 0.3) {
			var nextX=this.x,nextY=this.y;

			var ret = this.calcNext(nextX,nextY);
			nextX = ret[0];
			nextY = ret[1];

			if (this.bombNear(map, nextX, nextY)) {
				nextX=this.x;
				nextY=this.y;
				var ret = this.calcNext(nextX,nextY);
				nextX = ret[0];
				nextY = ret[1];
			}

			this.move (map, nextX, nextY);

			this.lastUpdate = jsEngine.pt;
		}
	}

	this.render = function (map) {
		html5.context.drawImage (this.images[this.image],
								map.sx+this.x*map.ts,
								map.sy+this.y*map.ts);
	}
}

// Tile de parede
function Wall (x, y) {
	this.x = x;
	this.y = y;
	this.type = "wall";
	this.image = html5.image("assets/images/wall/wall.png");

	// Polimorfismo
	this.move = new DefaultObject().move;

	this.update = function (map) {

	} 

	this.render = function (map) {
		html5.context.drawImage (this.image,
								map.sx+this.x*map.ts,
								map.sy+this.y*map.ts);
	}
}

// Tile de piso
function Floor (x, y) {
	this.x = x;
	this.y = y;
	this.type = "flooar";
	this.image = html5.image("assets/images/floor/floor.png");

	// Polimorfismo
	this.move = new DefaultObject().move;

	this.update = function (map) {

	} 

	this.render = function (map) {
		html5.context.drawImage (this.image,
								map.sx+this.x*map.ts,
								map.sy+this.y*map.ts);
	}
}

// Bomba
function Bomb (x, y) {
	this.x = x;
	this.y = y;
	this.type = "bomb";
	this.image = html5.image("assets/images/bomb/bomb.png");

	// Polimorfismo
	this.move = new DefaultObject().move;

	this.startTime = jsEngine.pt;

	this.update = function (map) {
		if (jsEngine.pt-this.startTime > 2) {
			this.explode(map);
		}
	}

	this.explode = function (map) {
		this.explodeTile(map,this.x,this.y);
		this.explodeTile(map,this.x+1,this.y);
		this.explodeTile(map,this.x-1,this.y);
		this.explodeTile(map,this.x,this.y+1);
		this.explodeTile(map,this.x,this.y-1);
	}

	this.explodeTile = function (map, x, y) {
		if (map.isInside(x,y)) {
			for (var i=0;i<map.data[y][x].length;i++) {
				if (map.data[y][x][i].type == "player") {
					map.data[y][x][i].die();
				} else
				if (map.data[y][x][i] == this ||
					map.data[y][x][i].type == "wall" ||
					map.data[y][x][i].type == "tales" ) {
					if (map.data[y][x][i] != this)
						jsEngine.modules.combo.hit();
					map.data[y][x].splice(i,1);
					i--;
				}
				else
				if (map.data[y][x][i].type == "bomb") {
					map.data[y][x][i].explode(map);
				}
			}

			jsEngine.modules.particles.addSystem(new Explosion(map.sx+x*map.ts+map.ts/2,
														   map.sy+y*map.ts+map.ts/2,
														   "orange",20));
		}
	}

	this.render = function (map) {
		html5.context.drawImage (this.image,map.sx+this.x*map.ts,
											map.sy+this.y*map.ts);
	}
}

// Tile de jogador
function Player (x, y) {
	this.images = [
					html5.image("assets/images/player/front.png"),
					html5.image("assets/images/player/back.png"),
					html5.image("assets/images/player/left.png"),
					html5.image("assets/images/player/right.png"),
					html5.image("assets/images/player/life.png")
	];
	this.image = 0;

	this.type = "player";
	this.x = x;
	this.y = y;
	this.lives = 3;

	this.die = function () {
		this.lives --;
		if (this.lives == 0) { // Aqui morre mesmo
			jsEngine.modules.ui.show(GameMenu);
			if (localStorage.ha) {
				var myScore = parseInt(jsEngine.modules.hud.getText("score"));
				if (myScore > localStorage.ha)
					localStorage.ha = myScore;
				else
				if (myScore > localStorage.hb)
					localStorage.hb = myScore;
				else
				if (myScore > localStorage.hc)
					localStorage.hc = myScore;

			} else {
				localStorage.ha = 0;
				localStorage.hb = 0;
				localStorage.hc = 0;
			}
		}
	}

	this.canMoveTo = function (map, x, y) {
		for (var i=0;i<map.data[y][x].length;i++)
			if (map.data[y][x][i].type == "wall" ||
				map.data[y][x][i].type == "bomb")
				return false;
		return true;
	}

	this.move = function (map, x, y) {
		if (map.isInside(x,y)) {
			if (this.canMoveTo(map, x, y)) {
				for (var i=0;i<map.data[this.y][this.x].length;i++)
					if (map.data[this.y][this.x][i] == this) {
						map.data[this.y][this.x].splice(i,1);
						break;
					}

				this.x = x;
				this.y = y;

				map.data[y][x].push(this);
			}
		}
	}

	this.lastUpdate = jsEngine.pt;
	this.lastBombUpdate = jsEngine.pt;

	this.update = function (map) {
		if (jsEngine.pt-this.lastUpdate > 0.1) {
			if (html5.keyboard[html5.keyUp]) {
				this.move(map,this.x,this.y-1);
				this.image = 1;
			}
			if (html5.keyboard[html5.keyDown]) {
				this.move(map,this.x,this.y+1);
				this.image = 0;
			}
			if (html5.keyboard[html5.keyLeft]) {
				this.move(map,this.x-1,this.y);
				this.image = 2;
			}
			if (html5.keyboard[html5.keyRight]) {
				this.move(map,this.x+1,this.y);
				this.image = 3;
			}

			this.lastUpdate = jsEngine.pt;
		}

		if (html5.keyboard[html5.keySpace])
			if (jsEngine.pt-this.lastBombUpdate > 0.2) {
				map.data[this.y][this.x].push(new Bomb(this.x, this.y));
				this.lastBombUpdate = jsEngine.pt;
			}
	} 

	this.render = function (map) {
		html5.context.drawImage (this.images[this.image],map.sx+this.x*map.ts,
														 map.sy+this.y*map.ts);

		for (var l=0;l<this.lives;l++) {
			html5.context.fillStyle = "blue";
			html5.context.drawImage (this.images[4],html5.canvas.width-(l+1)*40,
												    html5.canvas.height-40);
		}
	}
}

// Comprimento, altura, tamanho dos tiles, descrição em uma array
function TileMap (w,h,ts, mapData) {
	this.sx = 0;
	this.sy = 0;

	this.w = w;
	this.h = h;
	this.ts = ts;
	this.data = [];

	this.player = null;
	this.tales = null;

	this.render = function () {
		this.sx = (html5.canvas.width-this.w*this.ts)/2;
		this.sy = (html5.canvas.height-this.h*this.ts)/2;

		html5.context.fillStyle = "blue";
		html5.context.fillRect (this.sx,
								this.sy,
								this.w*this.ts,this.h*this.ts);
		for (var y=0;y<h;y++) {
			for (var x=0;x<w;x++) {
				for (var z=0;z<this.data[y][x].length;z++) {
					this.data[y][x][z].updated = false;
				}
			}
		}

		for (var y=0;y<h;y++) {
			for (var x=0;x<w;x++) {
				for (var z=0;z<this.data[y][x].length;z++) {
					if (!this.data[y][x][z].updated) {
						this.data[y][x][z].updated = true;
						this.data[y][x][z].update(this);
					}
				}
			}
		}

		for (var y=0;y<h;y++) {
			for (var x=0;x<w;x++) {
				for (var z=0;z<this.data[y][x].length;z++)
					if (this.data[y][x].type != "player")
						this.data[y][x][z].render(this);
			}
		}

		this.player.render(this);
	}

	this.isInside = function (x, y) {
		if (x >= 0 && x < w &&
			y >= 0 && y < h)
			return true;
		return false;
	}

	//@construct
	for (var y=0;y<h;y++) {
		this.data[y] = [];
		for (var x=0;x<w;x++) {
			this.data[y][x] = [];
		}
	}

	for (var y=0;y<h;y++) {
		for (var x=0;x<w;x++) {
			this.data[y][x].push(new Floor(x,y));

			switch (mapData[y][x]) {
				case 'X':
					this.data[y][x].push(new Wall(x,y));
				break;
				case '@':
					this.player = new Player(x,y);
					this.data[y][x].push(this.player);
				break;
				case 'T':
					this.tales = new Tales(x,y);
					this.data[y][x].push(this.tales);
				break;
			}
		}
	}
}

function MapManager () {
	this.info = new JSInfo ("Arenas",
							0.1,
							"Tile Map",
							"Creates a map where objects can move freely");
	this.depends = ["math"];

	this.currentMapName = null;
	this.maps = [];

	this.addMap = function (name, map) {
		this.maps[name] = map;
		if (!this.currentMapName)
			this.currentMapName = name;
	}

	this.setCurrentMap = function (name) {
		this.currentMapName = name;
	}

	this.render = function () {
		if (this.maps[this.currentMapName])
			this.maps[this.currentMapName].render();
	}

	this.reset = function () {
		this.maps = [];
		this.currentMapName = null;
	}
}