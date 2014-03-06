/*
	O nome deste módulo veio da sua utilização inicial, explosões
*/

// Cria uma partícula
function Particle (x, y, color) {
	this.x = x;
	this.y = y;
	this.color = color;

	this.step = function () {
		this.x += this.vx*jsEngine.dt;
		this.y += this.vy*jsEngine.dt;

		this.vx *= 0.99;
		this.vy *= 0.99;

		this.life -= jsEngine.dt;
	}

	this.render = function () {
		this.step();

		html5.context.fillStyle = color;
		html5.context.fillRect (this.x-2,this.y-2,4,4);
	}

	//@construct
	this.vx = (Math.random()-0.5)*400;
	this.vy = (Math.random()-0.5)*400;

	this.life = Math.random();
}

function Explosion (x, y, color, number) {
	this.x = x;
	this.y = y;
	this.color = color;

	this.particles = [];

	this.render = function () {
		for (var p=0;p<this.particles.length;p++) {
			if (this.particles[p].life > 0)
				this.particles[p].render();
			else {
				this.particles.splice(p,1);
				p--;
			}
		}
	}

	this.isAlive = function () {
		return this.particles.length;
	}

	//@contruct
	for (var i=0;i<number;i++)
		this.particles.push(new Particle(this.x,this.y,this.color));
}

function ParticleManager () {
	this.info = new JSInfo ("Explode!",
							0.1,
							"Particle Engine",
							"Control systems of particles");
	this.depends = ["math"];

	this.systems = [];

	this.lastAddTime = jsEngine.pt;

	this.addSystem = function (particleSystem) {
		this.systems.push(particleSystem);
		this.lastAddTime = jsEngine.pt;
	}

	this.render = function () {
		for (var s=0;s<this.systems.length;s++) {
			if (this.systems[s].isAlive())
				this.systems[s].render();
			else {
				this.systems.splice(s, 1);
				s--;
			}
		}
	}

	this.moveMap = function () {
		var x=0,y=0;

		if (jsEngine.pt-this.lastAddTime < 0.2) {
			x = Math.random()*20-10;
			y = Math.random()*20-10;
		}

		return {
			"x": x,
			"y": y
		}
	}
}