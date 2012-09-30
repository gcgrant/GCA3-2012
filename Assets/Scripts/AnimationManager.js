#pragma strict


@script RequireComponent(AudioSource)
var audioFX : AudioSource;
public var audioFile : AudioClip;

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
		audioFX.clip = audioFile;
		audioFX.Play();
		winLoseObject.SetActiveRecursively(true);
		puzzleManager.destroyPuzzles();
	}
}

function PuzzleLost() {
	meleeMan.Damaged();
	yield enemies[currentEnemy].Attack();
	meleeMan.Walk();

}


