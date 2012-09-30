#pragma strict

var animationManager : AnimationManager;

var whackAMolePuzzle : WhackAMolePuzzle;
var tapPuzzle : TapItPuzzle;

private var currentPuzzle : GameObject;

function Start() {

	var puzzles = new Array(whackAMolePuzzle.gameObject, tapPuzzle.gameObject);
	
	//pick a puzzle...
	currentPuzzle = puzzles[0];
	currentPuzzle.gameObject.SetActiveRecursively(true);
}

//call me when the puzzle is won
function Win() {
	animationManager.PuzzleWon();
	currentPuzzle.gameObject.SetActiveRecursively(false);
}

//call me when the puzzle is lost
function Lose() {
	animationManager.PuzzleLost();
	currentPuzzle.gameObject.SetActiveRecursively(false);
}