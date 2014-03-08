/*
	Copyright (C) 2012,2013 by Calango Rei Games, wich is:
	Felipe Tavares, Brenno Arruda, Vinicius Abdias, Mateus Medeiros and Giovanna Gorgônio
*/

function VectorMath () {
	this.LinearInterpolator = function (x,y) {
		this.x = x;
		this.y = y;

		this.complete = function (x) {
			if (x >= this.x[1])
				return true;
			return false;
		}

		this.interpolate = function (x) {
			if (x <= this.x[0])
				return this.y[0];
			else if (x >= this.x[1])
				return this.y[1];

			return this.y[0]+(this.y[1]-this.y[0])*(x-this.x[0])/(this.x[1]-this.x[0]);
		}
	}

	this.info = new  JSInfo ("Perfect Direction",
							 2.0,
							 "Vector Math Processing Module",
							 "Controls all vector operations and vector-related things");

	// Every module have its depends, they must be loaded first
	this.depends = [];

	this.dot = function (v1,v2) {
	    var d =  v1[0]*v2[0]+v1[1]*v2[1];
		return d;
	} 

	this.cross = function (v1,v2) {
		return v1[0]*v2[1]-v1[0]*v2[1];
	}

	this.len = function (v) {
	    return Math.sqrt(v[0]*v[0]+v[1]*v[1]); 
	} 

	this.add = function (v0,v1) {
		return [v0[0]+v1[0],v0[1]+v1[1]];
	}

	this.sub = function (v0,v1) {
		return [v0[0]-v1[0],v0[1]-v1[1]];
	}

	this.mul = function (v,s) {
		return [v[0]*s,v[1]*s];
	}

	this.invert = function (v) {
		return [-v[0],-v[1]];
	}

	this.copy = function (v) {
		return [v[0],v[1]];
	}

	this.mcopy = function (v) {
		var i;
		var r = [];
		for (i in v) {
			r.push(this.copy(v[i]));
		}
		return r;
	}

	this.normal = function (v) {
		return [v[1],-v[0]];
	}

	this.inormal = function (v) {
		return [-v[1],v[0]];
	}

	this.normalize = function (v1) {
		v = [0,0];
		l = Math.sqrt(v1[0]*v1[0]+v1[1]*v1[1]);
		v[0] = v1[0]/l;
		v[1] = v1[1]/l;
		
		return v;
	}

	this.sqr = function (x) {
			return x*x;
	}

	this.madd = function (array,v) {
		var e,narray=[];
		for (e in array) {
			narray.push(this.add (array[e],v));
		}

		return narray;
	}
	
	// Pivot angle and vector
	this.rotate = function (p, a, v) {
		var c = Math.cos (a);
		var s = Math.sin (a);
		var p0 = v[0]-p[0];
		var p1 = v[1]-p[1];

		return [c*p0-s*p1 + p[0],
				s*p0+c*p1 + p[1]];
	}

	this.mrotate = function (p, a, array) {
		var e,narray = [];
		for (e in array) {
			narray.push(this.rotate (p, a, array[e]));
		}

		return narray;
	}

	this.dist2 = function (v, w) { return this.sqr(v[0]- w[0]) + this.sqr(v[1] - w[1]) }
	this.distToSegmentSquared = function (p, v, w) {
	  var l2 = this.dist2(v, w);
	  if (l2 == 0) return this.dist2(p, v);
	  var t = ((p[0] - v[0]) * (w[0] - v[0]) + (p[1] - v[1]) * (w[1] - v[1])) / l2;
	  if (t <= 0) return this.dist2(p, v);
	  if (t >= 1) return this.dist2(p, w);
	  return this.dist2(p, [ v[0] + t * (w[0] - v[0]),
	                    	v[1] + t * (w[1] - v[1]) ]);
	}

	this.closestPointLinePoint = function (p, v, w) {
	  var l2 = this.dist2(v, w);
	  if (l2 == 0) return v;
	  var t = ((p[0] - v[0]) * (w[0] - v[0]) + (p[1] - v[1]) * (w[1] - v[1])) / l2;
	  if (t <= 0) return v;
	  if (t >= 1) return w;
	  return [ v[0] + t * (w[0] - v[0]),
	           v[1] + t * (w[1] - v[1]) ];
	}

	this.lineToPoint = function (p, v, w) {
		return Math.sqrt(this.distToSegmentSquared(p, v, w));
	}
}