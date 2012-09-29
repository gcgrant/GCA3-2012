#pragma strict

public var meleeMan : MeleeAvatarScript;

function Start () {

}

function Update () {

}

function PuzzleWon() {
	meleeMan.Smack();
}

function PuzzleLost() {
	meleeMan.Walk();
}


