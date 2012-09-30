#pragma strict

var animationManager : AnimationManager;
var heartManager : HeartManager;

var whackAMolePuzzle : WhackAMolePuzzle;
var tapPuzzle : TapItPuzzle;
var spinPuzzle: GameObject;

var difficulty  = "easy";

private var currentPuzzle : GameObject;
private var puzzles : Array;

function Start() {

	puzzles = new Array(whackAMolePuzzle.gameObject, tapPuzzle.gameObject, spinPuzzle.gameObject);
	PickNewPuzzle();
}

//call me when the puzzle is won
function Win() {
	currentPuzzle.gameObject.SetActiveRecursively(false);
	yield animationManager.PuzzleWon();
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
		//GameOver
	}	
}

function PickNewPuzzle() {
	currentPuzzle = puzzles[UnityEngine.Random.Range(0, puzzles.length)];
	currentPuzzle.gameObject.SetActiveRecursively(true);
}