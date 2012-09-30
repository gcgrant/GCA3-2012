#pragma strict

var animationManager : AnimationManager;

var whackAMolePuzzle : WhackAMolePuzzle;

private var currentPuzzle : GameObject;

function Start() {
	//pick a puzzle...
	currentPuzzle = whackAMolePuzzle.gameObject;
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