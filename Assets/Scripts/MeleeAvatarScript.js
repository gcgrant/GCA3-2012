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
