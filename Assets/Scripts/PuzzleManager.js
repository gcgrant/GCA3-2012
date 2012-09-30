#pragma strict

var animationManager : AnimationManager;
var heartManager : HeartManager;
var winLoseScreen : GameObject;
var loseMaterial : UnityEngine.Material;
var whackAMolePuzzle : WhackAMolePuzzle;
var tapPuzzle : TapItPuzzle;
var spinPuzzle: GameObject;

var difficulty  = "easy";

private var currentPuzzle : GameObject;
private var puzzles : Array;

function Start() {
	winLoseScreen.SetActiveRecursively(false);
	puzzles = new Array(whackAMolePuzzle.gameObject, tapPuzzle.gameObject, spinPuzzle.gameObject);
	PickNewPuzzle();
}

//call me when the puzzle is won
function Win() {
	currentPuzzle.gameObject.SetActiveRecursively(false);
	yield animationManager.PuzzleWon(this);
	PickNewPuzzle();
}

//call me when the puzzle is lost
function Lose() {
	currentPuzzle.gameObject.SetActiveRecursively(false);
	yield animationManager.PuzzleLost();
	var heartsLeft = heartManager.TakeHeart();
	if (heartsLeft) { 
		PickNewPuzzle();
	}
	else {
		winLoseScreen.renderer.material = loseMaterial;
		winLoseScreen.SetActiveRecursively(true);
		destroyPuzzles();
	}	
}
function destroyPuzzles()
{
	for (var i = 0; i < puzzles.length; i++)
	{
		Destroy(puzzles[i]);
	}
}
function PickNewPuzzle() {
	var previousPuzzle = currentPuzzle;
	while (currentPuzzle == previousPuzzle) {
		currentPuzzle = puzzles[UnityEngine.Random.Range(0, puzzles.length)];
	}
	currentPuzzle.gameObject.SetActiveRecursively(true);
}