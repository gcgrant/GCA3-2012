#pragma strict

public var meleeMan : MeleeAvatarScript;

public var enemies : EnemyScript[];
private var currentEnemy : int;

function Start() {
	currentEnemy = 0;
	ActivateCurrentEnemy();
}

function ActivateCurrentEnemy() {
	enemies[currentEnemy].gameObject.SetActiveRecursively(true);
}


function PuzzleWon() {
	meleeMan.Smack();
	yield enemies[currentEnemy].Die();
	if (currentEnemy < enemies.Length - 1) {
		currentEnemy++;
		ActivateCurrentEnemy();
	}
}

function PuzzleLost() {
	meleeMan.Walk();
	enemies[currentEnemy].Attack();
}


