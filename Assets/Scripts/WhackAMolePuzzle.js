#pragma strict

var touchCamera : Camera;
private var hit : RaycastHit;

var moles : MoleScript[];
private var delayLowerRange = 2;
private var delayUpperRange = 4;
private var numMoles : int;
private var numMolesRemaining : int;
private var numMolesSmashed = 0;
private var index = -1;
private var lastIndex = -1;

var puzzleManager : PuzzleManager;

//call me to Init, difficulty should be one of "easy", "medium", or "hard"
public function Init(difficulty : String) {
	if (difficulty == "easy") {
		delayLowerRange = 2;
		delayUpperRange = 3;
		numMoles = numMolesRemaining = 12;
	}
	else if (difficulty == "medium") {
		delayLowerRange = 1;
		delayUpperRange = 2.5;
		numMoles = numMolesRemaining = 14;
	}
	else if (difficulty == "hard") {
		delayLowerRange = 0.75;
		delayUpperRange = 2;
		numMoles = numMolesRemaining = 16;
	}
	else {
		Debug.LogError("Incorrect difficulty value.");
	}
}

function Start () {
	Init("easy");
}

function HitMole(mole : MoleScript) {
 	if (mole.GetState() == "out") {
 		mole.Smashed(delayLowerRange, delayUpperRange);
 		numMolesSmashed++;
 	}
}

function Update () {
	//detect touches
#if UNITY_EDITOR
 	if (Input.GetMouseButtonDown(0)) {
        // Construct a ray from the current mouse coordinates
        var ray : Ray = touchCamera.ScreenPointToRay (Input.mousePosition);
        Debug.DrawLine(ray.origin, ray.direction, Color.yellow, 5);
 		   	 if(Physics.Raycast(ray.origin, ray.direction, hit)) {
 		   	 	HitMole(hit.collider.GetComponent(MoleScript));
    	}
    }
#else
    for (var touch: Touch in Input.touches) {
   		var ray : Ray = touchCamera.ScreenPointToRay(touch.position);
	   	 if(touch.phase == TouchPhase.Ended && Physics.Raycast(ray.origin, ray.direction, hit)) {
	   	 	HitMole(hit.collider.GetComponent(MoleScript));
		 }
    }
#endif
    
    //player loses if they miss half the moles
    if (numMolesRemaining + numMolesSmashed < numMoles / 2) {
    	puzzleManager.Lose();
    }
    
    //player wins if they get to the end
    if (numMolesRemaining == 0) {
    	puzzleManager.Win();
    }	
    
    var active = false;
    for (var i = 0; i < moles.length; i++) {
	    if (moles[i].GetState() == "out") {
			active = true;
			break;
		}
    }
    
    if (active == false) {
	    //pop out a random mole
	    while (lastIndex == index || moles[index].GetState() == "out") {
			index = Mathf.Floor( UnityEngine.Random.Range(0, moles.length) );
		}
		moles[index].PopOut(delayLowerRange, delayUpperRange);
		numMolesRemaining--;
		lastIndex = index;
	}
}

