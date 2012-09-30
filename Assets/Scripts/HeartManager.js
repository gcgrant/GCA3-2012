#pragma strict

var hearts : HeartScript[];

private var numHearts : int;

function Start() {
	numHearts = hearts.length;
}

//takes a heart, returns true if hearts are left, false otherwise
function TakeHeart() {
	numHearts--;
	hearts[numHearts].ConsumeHeart();
	if (numHearts == 0) {
		//game over man
		return false;
	}
	
	return true;
}

