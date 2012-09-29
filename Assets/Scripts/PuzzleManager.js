#pragma strict

var animationManager : AnimationManager;

function Start () {

}

function Update () {

}

//call me when the puzzle is won
function Win() {
	animationManager.PuzzleWon();
}

//call me when the puzzle is lost
function Lose() {
	animationManager.PuzzleLost();
}