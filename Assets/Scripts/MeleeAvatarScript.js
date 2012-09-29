#pragma strict

//Animations
public var runAnimation : AnimationClip;
public var idleAnimation : AnimationClip;
public var walkAnimation: AnimationClip;
public var jumpAnimation : AnimationClip;
public var smackAnimation : AnimationClip;

private var _animation : Animation;

function Start () {
	_animation = this.GetComponent(Animation);
	Idle();
}

function Update () {

	this.transform.localPosition.x += 0.01;
	if (this.transform.position.x >= Screen.width) {
		this.transform.localPosition.x = 1;
	}
	
#if UNITY_EDITOR
	if (Input.GetMouseButtonDown(0)) {
		Run();
	}
#endif
	
	for (var touch : Touch in Input.touches) {
		if (touch.phase == TouchPhase.Began) {
			Run();
		}
	}
}

public function Run() {
	_animation.CrossFade(runAnimation.name);
}

public function Walk() {
	_animation.CrossFade(walkAnimation.name);
}

public function Jump() {
	_animation.CrossFade(jumpAnimation.name);
}

public function Smack() {
	_animation.CrossFade(smackAnimation.name);
}

public function Idle() {
	_animation.CrossFade(idleAnimation.name);
}
