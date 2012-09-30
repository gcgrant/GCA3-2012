#pragma strict

var animationManager : AnimationManager;

//call me when the puzzle is won
function Win() {
	animationManager.PuzzleWon();
}

//call me when the puzzle is lost
function Lose() {
	animationManager.PuzzleLost();
}