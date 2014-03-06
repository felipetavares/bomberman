/*
	Copyright (C) 2012,2013 by Calango Rei Games, wich is:
	Felipe Tavares, Brenno Arruda, Vinicius Abdias, Mateus Medeiros and Giovanna Gorgônio
*/

function Physics () {
	this.info = new  JSInfo ("Solid Paper",
							 2.0,
							 "Physics Engine",
							 "Controls all physics calculations in the engine");

	// Every module have its depends, they must be loaded first
	this.depends = ["collision","math"];

    this.s_objects = []; /* Static objects */
    this.d_objects = []; /* Dynamic ones   */

	this.collisionCallback = false;
	this.vcollision = false;
	
	this.interactions = 10;
	this.e = 0;

    this.step = function () {
		var n;
		for (d=0;d<this.d_objects.length;d++) {
			this.d_objects[d].v[0] += this.d_objects[d].a[0]*jsEngine.dt;
			this.d_objects[d].v[1] += this.d_objects[d].a[1]*jsEngine.dt;

			if (this.d_objects[d]._onFloor) {
				this.d_objects[d]._onFloor = false;
				this.d_objects[d].onFloor = true;
			}
			else if (this.d_objects[d].onFloor) {
				this.d_objects[d].onFloor = false;
			}

			if (this.vcollision) {
				if (this.collisionCallback) {
					this.collisionCallback(this.vcollision[0],this.vcollision[1]);
				}
				this.vcollision = false;
			}



			for (n=0;n<this.interactions;n++) {
		    for (s=0;s<this.s_objects.length;s++) {
			var rotatedHull = this.math.mrotate ([0,0], this.d_objects[d].w,
												 this.d_objects[d].hull);
			rotatedHull = this.math.madd(rotatedHull,this.d_objects[d].p);
			if (cf = this.collision.GJK(rotatedHull,
										this.math.madd(this.s_objects[s].hull,this.s_objects[s].p))) {

			    d_real = cf.l;
			    d_run = -this.math.dot(this.d_objects[d].v,this.math.invert(this.math.normalize(cf.n)));
				d_run_old = this.math.len(this.d_objects[d].v);
				
				//if (d_real < 20)
				//	alert (d_run + ":" + d_real);

			    if (d_real <= d_run_old*jsEngine.dt) {
					if (this.s_objects[s].r) {
						var j = this.math.dot(this.math.mul(this.d_objects[d].v,-(1+this.e)),this.math.normalize(cf.n))/
								(1/1+Math.pow(this.math.cross(cf.d,this.math.normalize(cf.n)),2) /1);

						this.d_objects[d].v[0] -= this.math.mul(this.math.mul(this.math.normalize(cf.n),-j),1/1)[0];
						this.d_objects[d].v[1] -= this.math.mul(this.math.mul(this.math.normalize(cf.n),-j),1/1)[1];

						if (this.math.dot(this.math.normalize(cf.d),this.d_objects[d].floor) == 1.0)
							this.d_objects[d]._onFloor = true;
					
						if (this.d_objects[d].v[0] != 0) {
							this.d_objects[d].v[0] *= this.d_objects[d].f * this.s_objects[s].f;
						}
						if (this.d_objects[d].v[1] != 0) {
							this.d_objects[d].v[1] *= this.d_objects[d].f * this.s_objects[s].f;
						}
					}
					if (!this.vcollision) {
						this.vcollision = [0,0];
						this.vcollision[0] = this.s_objects[s];
						this.vcollision[1] = this.d_objects[d];
					}
					//break;
				}
			}
		    }
		}
		if (Math.abs(this.d_objects[d].v[0]) < jsEngine.dt)
			this.d_objects[d].v[0] = 0;
		if (Math.abs(this.d_objects[d].v[1]) < jsEngine.dt)
			this.d_objects[d].v[1] = 0;
	    this.d_objects[d].step();
		}   
    }

	this.DynamicObject = function () {
	    this.hull = [[0,0],[16,0],[16,16],[0,16]];

		this.f = 1.0;

	    this.p = [0,0];
	    this.v = [0,0];
	    this.a = [0,0];

	    this.w = 0;
	    this.vw = 0;

		this.onFloor = false;
		this._onFloor = false; /* Player *will* be on floor, next frame */
		this.floor = [0,-1];
		
		this.cg = 1;
		
	    this.step = function () {	
		this.p[0] += this.v[0]*jsEngine.dt;
		this.p[1] += this.v[1]*jsEngine.dt;
	    this.w += this.vw*jsEngine.dt;
	    }
	}

	this.StaticObject = function () {
	    this.hull = [[0,0],[16,0],[16,16],[0,16]];

	    this.p = [0,0];
	    this.f = 1.0;
		this.cg = 1;
		
		this.r = true; /* Collision response? */
	}
}