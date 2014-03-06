/*
	Copyright (C) 2012,2013 by Calango Rei Games, wich is:
	Felipe Tavares, Brenno Arruda, Vinicius Abdias, Mateus Medeiros and Giovanna Gorgônio
*/

var AnimationPlaying = 1;
var AnimationStopped = 0;

function Frame () {
	this.time = 0.1; // How much time this frame stay in the screen
	this.imageName = ""; // html5.js image id
}

function Animation () {
	this.frames = []; // This is a list of frames
}

function AnimationInfo () {
	this.currentFrame   = null;
	this.currentFrameN  = 0;
	this.currentFrameT  = 0;
	this.aID = 0;

	this.state = AnimationPlaying;

	this.timeout = false;
}

function BitmapAnimation () {
	this.info = new JSInfo ("Moving Pixel",
							1.0,
							"Bitmap Animation Engine",
							"Controls all bitmap-based animations in the game");

	this.depends = [];

	this.animations = []; // List of all bitmap animations in the game,
						  // Animations can be inserted with 'registerAnimation'
	this.animInfo   = [];

	/*
		Returns a new 'AnimationInfo' structure containing
		the initial state of the animation anim, and with the
		animation ID 'aID'
	*/
	this.initializeInfo = function (anim,aID) {
		var ainfo = new AnimationInfo();

		if (anim.frames.length > 0) {
			ainfo.currentFrame = html5.image(anim.frames[0].imageName);
			ainfo.currentFrameN = 0;
			ainfo.currentFrameT = anim.frames[0].time;
			ainfo.timeout = setTimeout (html5.hitch2 (this.changeAnimationImage,this, [aID]), ainfo.currentFrameT*1000);
		}

		ainfo.aID = aID;

		return ainfo;
	}

	/*
		This function inserts a new animation in a vector of animations that are
		controlled by this class.
		It returns a animation ID that can be used in the future when acessing this
		particular animation.
	*/
	this.registerAnimation = function (anim) { // anim is of the type 'Animation'
		var aID = this.animations.length;

		ainfo = this.initializeInfo (anim,aID);
		
		this.animations.push(anim);
		this.animInfo.push (ainfo);

		return aID;
	}

	/*
		Returns the current image for a animation, needs a
		animation ID.
		It is important to note that this image changes over time.
	*/
	this.getAnimationImage = function (aID) { // aID is an animation id
		return this.animInfo[aID].currentFrame;
	}


	/*
		Stop an animation that is playing
	*/
	this.stopAnimation = function (aID) {
		this.animInfo[aID].state = AnimationStopped;
	}

	/*
		Starts an animation that is stopped
	*/
	this.playAnimation = function (aID) {
		if (this.animInfo[aID].state != AnimationPlaying) {
			this.animInfo[aID].state = AnimationPlaying;
			this.changeAnimationImage (aID);
		}
	}

	/*
		This is an internal function that is used to change the current image
		for an animation. Needs an animation ID.
	*/
	this.changeAnimationImage = function (aID) {
		var anim = this.animations[aID];
		var ainfo = this.animInfo[aID];

		if (ainfo.state == AnimationStopped)
			return;

		ainfo.currentFrameN++;
		if (ainfo.currentFrameN > anim.frames.length-1)
			ainfo.currentFrameN = 0;

		if (anim.frames.length > 0) {
			ainfo.currentFrame = html5.image(anim.frames[ainfo.currentFrameN].imageName);
			ainfo.currentFrameT = anim.frames[ainfo.currentFrameN].time;
			ainfo.timeout = setTimeout (html5.hitch2 (this.changeAnimationImage,this, [aID]), ainfo.currentFrameT*1000);
		}
	}
}