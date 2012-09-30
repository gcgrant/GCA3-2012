#pragma strict

var frames : Texture2D[];
var framesPerSecond = 10.0;

var deathFrames : Texture2D[];
var deadFrame : Texture2D;
var deathFPS : float;

private var alive : boolean = true;
	
function Update () {
	
	if (alive) {
	    var index : int = Time.time * framesPerSecond;
	    index = index % frames.Length;
	    renderer.material.mainTexture = frames[index];
	}
}

function Die() {

	alive = false;
	//play death animation
	for (var i = 0; i < deathFrames.length; i++) {
		renderer.material.mainTexture = deathFrames[i];
		yield WaitForSeconds( 1 / deathFPS );
	}
	
	renderer.material.mainTexture = deadFrame;

}