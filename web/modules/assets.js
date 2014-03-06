/*
	Copyright (C) 2012,2013 by Calango Rei Games, wich is:
	Felipe Tavares, Brenno Arruda, Vinicius Abdias, Mateus Medeiros and Giovanna Gorgônio
*/

function AssetManager () {
	this.info = new JSInfo ("External Relations",
							1.0,
							"Assets Manager",
							"Controls external game assets");
	this.depends = ["animation"];

	this.animationConversionTable = [];

	this.loadAnimation = function (asset) {
		var frame;
		var animation = new Animation();

		for (frame=0;frame < asset.info.framecount;frame++) {
			var filename = asset.path + frame + ".png";
			jsEngine.log ("--> Loading frame: "+ filename +"<br/>");
			html5.loadImage (filename, filename);
			
			var aFrame = new Frame();
			aFrame.time = 0.2;
			aFrame.imageName = filename;
			animation.frames.push (aFrame);
		}

		var aID = jsEngine.modules.animation.registerAnimation (animation);
		this.animationConversionTable[asset.path] = aID;
	}

	this.loadImage = function (asset) {
		html5.loadImage (asset.path,asset.path);
	}

	this.getAnimationID = function (animname) {
		return this.animationConversionTable[animname];
	}

	this.loadAssets = function () {
		var asset;
		for (asset in jsEngine.assetList) {
			jsEngine.log ("Loading asset: " + jsEngine.assetList[asset].path + "<br/>");
			switch (jsEngine.assetList[asset].type) {
				case AssetImage:
					this.loadImage(jsEngine.assetList[asset]);
				break;
				case AssetAnimation:
					this.loadAnimation (jsEngine.assetList[asset]);
				break;
				default:
			}
		}
	}

	this.start = function () {
		this.loadAssets();
	}
}