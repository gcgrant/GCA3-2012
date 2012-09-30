#pragma strict

var animationManager : AnimationManager;

function Start () {

}

function Update () {

}

//call me when the puzzle is won
function Win() {
	Debug.Log("puzzle won");
	animationManager.PuzzleWon();
}

//call me when the puzzle is lost
function Lose() {
	Debug.Log("puzzle lost");
	animationManager.PuzzleLost();
}