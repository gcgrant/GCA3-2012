#pragma strict

var inMaterial : Material;
var outMaterial : Material;
var smashMaterial : Material;

private var state;

private var delayAfterSmashRangeLow = 1;
private var delayAfterSmashRangeHigh = 3;

function Start () {
	PopIn();
}

public function GetState() {
	return state;
}

private function PopIn() {
	if (state == "in") {
		return;
	}
	//Debug.Log("Popping in" + this.name);
	renderer.material = inMaterial;
	state = "in";
}

function PopOut(delayLowerRange : float, delayUpperRange : float) {
	if (state == "out") {
		return;
	}
	//Debug.Log("popping out" + this.name);
	renderer.material = outMaterial;
	state = "out";
	yield WaitForSeconds(UnityEngine.Random.Range(delayLowerRange, delayUpperRange));
	if (state == "out") {
		PopIn();
	}
}

function Smashed(delayLowerRange : float, delayUpperRange : float) {
	if (state != "out") {
		return;
	}
	//Debug.Log("smashed" + this.name);
	renderer.material = smashMaterial;
	state = "smashed";
	yield WaitForSeconds(UnityEngine.Random.Range(delayLowerRange, delayUpperRange));
	if (state == "smashed") {
		PopIn();
	}
}