#pragma strict
@script RequireComponent(AudioSource)

var audioFX : AudioSource;
//public
public var audioFile : AudioClip[];
public var touchCircle : GameObject;
public var touchCircles : GameObject[];
public var shrinkCircle : AnimationClip;
public var circleMaterial : UnityEngine.Material[];
public var puzzleCamera : Camera;
public var successMaterial : UnityEngine.Material;
public var puzzleManager : PuzzleManager;
//privates
private var _animation : Animation[];
private var _numOfCirclesToGenerate : int;
private var _circleToActivateNext : int;
private var currentlyAnimating : boolean;
private var hit : RaycastHit;
private var successfullyHit : int;

function OnEnable () {
	//_animation = touchCircles[0].GetComponent(Animation);
	successfullyHit = 0;
	touchCircle.SetActiveRecursively(false);
	_numOfCirclesToGenerate = Mathf.Floor(Random.Range(3,7));
	_circleToActivateNext = 0;
	touchCircles = new GameObject[_numOfCirclesToGenerate];
	_animation = new Animation[_numOfCirclesToGenerate];
	currentlyAnimating = false;
	var pixelRect = puzzleCamera.pixelRect;
	
	var rect = puzzleCamera.rect;
//	Debug.Log( pixelRect.yMax + " " + pixelRect.yMin);
	var xDistance = pixelRect.width;
	var yPos : float;
	for (var i=0; i < _numOfCirclesToGenerate; i++)
	{
		
		var xPos = Random.Range(pixelRect.xMin, pixelRect.xMax);
	    yPos = Random.Range(pixelRect.yMin-50, pixelRect.yMax- 30);
		touchCircles[i] = Instantiate(touchCircle, Vector3(0,0,0), Quaternion.identity);
		touchCircles[i].transform.parent = this.transform;
		touchCircles[i].transform.localScale = touchCircle.transform.localScale;
		touchCircles[i].transform.localPosition = touchCircle.transform.localPosition;
		var point = puzzleCamera.ScreenToViewportPoint(Vector3(xPos,yPos,touchCircle.transform.localPosition.z));
		touchCircles[i].transform.localPosition = point;
		touchCircles[i].SetActiveRecursively(false);
		touchCircles[i].transform.localRotation = touchCircle.transform.localRotation;
		touchCircles[i].renderer.material = circleMaterial[i];
		_animation[i] = touchCircles[i].GetComponent(Animation);
		_animation[i].wrapMode = WrapMode.Once;
	} 
}


function OnDisable() {
	for (var i = 0; i <  touchCircles.length; i++) {
		Destroy(touchCircles[i]);
	}
}

function activateAnimation ()
{
	touchCircles[_circleToActivateNext].SetActiveRecursively(true);
	if (_circleToActivateNext == 0)
		WaitForSeconds(0.4);
	WaitForSeconds(0.2);
	currentlyAnimating = true;
	_animation[_circleToActivateNext].CrossFade(shrinkCircle.name);
	while (_animation[_circleToActivateNext].isPlaying)
	{
		yield;
	}
	touchCircles[_circleToActivateNext].transform.localScale = Vector3(0,0,0);
	_circleToActivateNext++;
	currentlyAnimating = false;
}

function Update () 
{
	if (!currentlyAnimating && _circleToActivateNext < _numOfCirclesToGenerate)
	{
		activateAnimation();
	}
	else
	{
		#if UNITY_EDITOR
	 	if (Input.GetMouseButtonDown(0)) {
	        // Construct a ray from the current mouse coordinates
	        var ray : Ray = puzzleCamera.ScreenPointToRay (Input.mousePosition);
	        Debug.DrawLine(ray.origin, ray.direction, Color.yellow, 5);
	 		if(Physics.Raycast(ray.origin, ray.direction, hit)) 
	 		{
					audioFX.PlayOneShot(audioFile[_circleToActivateNext]);
		   	 		touchCircles[_circleToActivateNext].renderer.material = successMaterial;
		   	 		successfullyHit++;
			}
	    }
		#else
	    for (var touch: Touch in Input.touches) 
	    {
	   		var ray : Ray = puzzleCamera.ScreenPointToRay(touch.position);
		   	 if(touch.phase == TouchPhase.Ended && Physics.Raycast(ray.origin, ray.direction, hit)) 
		   	 {
				audioFX.PlayOneShot(audioFile[_circleToActivateNext]);
		   	 	touchCircles[_circleToActivateNext].renderer.material = successMaterial;
		   	 	successfullyHit++;
			 }
	    }
		#endif
	
	}

	if (_circleToActivateNext >= _numOfCirclesToGenerate)
	{		
		if (successfullyHit == _numOfCirclesToGenerate)
		{
			puzzleManager.Win();
		}
		else
		{
			puzzleManager.Lose();
		}
	}

}