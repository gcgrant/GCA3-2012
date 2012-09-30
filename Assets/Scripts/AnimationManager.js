#pragma strict

public var meleeMan : MeleeAvatarScript;

public var enemies : EnemyScript[];
private var currentEnemy : int;

function Start() {
	currentEnemy = 0;
	enemies[currentEnemy].gameObject.SetActiveRecursively(true);
}


function PuzzleWon() {
	meleeMan.Smack();
	enemies[currentEnemy].Die();
}

function PuzzleLost() {
	meleeMan.Walk();
}


