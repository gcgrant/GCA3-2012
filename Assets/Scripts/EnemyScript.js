#pragma strict
@script RequireComponent(AudioSource)

var audioFX : AudioSource;

var idleFrames : Texture2D[];
var idleFPS = 10.0;

var attackLoop : int; 	//how many times to loop the attack animation
var attackFrames : Texture2D[];
var attackFPS = 10.0;

var deathFrames : Texture2D[];
var deadFrame : Texture2D;
var deathFPS = 1.0;

var SpawnSound : AudioClip;
var DeathSound : AudioClip;
var AttackSound : AudioClip;

private var idle : boolean = true;

function Start() {
	if ( SpawnSound != null ) {
		audioFX.PlayOneShot(SpawnSound);
	}
}
	
function Update () {
	
	if (idle) {
	    var index : int = Time.time * idleFPS;
	    index = index % idleFrames.Length;
	    renderer.material.mainTexture = idleFrames[index];
	}
}

function Die() {
	idle = false;
	// play death sound
	if ( DeathSound != null ) {
		//audioFX.clip = SpawnSound;
		//audioFX.Play();
		audioFX.PlayOneShot(DeathSound);
	}
	//play death animation
	for (var i = 0; i < deathFrames.length; i++) {
		renderer.material.mainTexture = deathFrames[i];
		yield WaitForSeconds( 1.0 / deathFPS );
	}
	
	renderer.material.mainTexture = deadFrame;
	return;
}

function Attack() {
	idle = false;
	// play attack sound
	if ( AttackSound != null ) {
		audioFX.PlayOneShot(AttackSound);
	}
	//play attack animation
	for (var j = 0; j < attackLoop; j++) {
		for (var i = 0; i < attackFrames.length; i++) {
			renderer.material.mainTexture = attackFrames[i];
			yield WaitForSeconds( 1.0 / attackFPS );
		}
	}
	idle = true;
	return;
}