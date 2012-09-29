#pragma strict

public var meleeMan : MeleeAvatarScript;

function Start () {
	print("My name is dr. doolittle");
	ControlDrMelee();
}

function Update () {

}

function ControlDrMelee() {
	while (true) {
		yield WaitForSeconds(3);
		meleeMan.Idle();
		yield WaitForSeconds(3);
		meleeMan.Walk();
		yield WaitForSeconds(3);
		meleeMan.Smack();
	}
}