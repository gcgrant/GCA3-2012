#pragma strict

public var meleeMan : MeleeAvatarScript;
public var winLoseObject : GameObject;
public var enemies : EnemyScript[];


private var currentEnemy : int;

function Start() {
	currentEnemy = 0;
	winLoseObject.SetActiveRecursively(false);
	ActivateCurrentEnemy();
}

function ActivateCurrentEnemy() {
	enemies[currentEnemy].gameObject.SetActiveRecursively(true);
}

function PuzzleWon(puzzleManager : PuzzleManager) {
	meleeMan.Smack();
	yield enemies[currentEnemy].Die();
	yield WaitForSeconds(1.5);
	meleeMan.Run();
	enemies[currentEnemy].gameObject.SetActiveRecursively(false);
	if (currentEnemy < enemies.Length - 1) {
		currentEnemy++;
		ActivateCurrentEnemy();
	}
	else {
		winLoseObject.SetActiveRecursively(true);
		puzzleManager.destroyPuzzles();
	}
}

function PuzzleLost() {
	meleeMan.Walk();
	yield enemies[currentEnemy].Attack();
}


