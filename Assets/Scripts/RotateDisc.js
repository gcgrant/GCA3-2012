#pragma strict
var audioFX : AudioSource;

var CollideSound : AudioClip;

var targetItem : GameObject;
var puzzleRoot : GameObject;
var debugText : TextMesh;
var puzzleManager : PuzzleManager;

//private var worldPos : Vector3;
//var lastMousePosition : Vector3;

/********Rotation Variables*********/
var rotationRate : float = 2.0f;
private var wasRotating;
private var rotateAngle : float = 0f;
private var targetCenterX : float;
private var targetCenterY : float;
	
//private var originalRotation : Quaternion;

private var pointsScored : int;

/************Scrolling inertia variables************/
private var scrollPosition : Vector2 = Vector2.zero;
private var scrollVelocity : float = 0;
private var timeTouchPhaseEnded: float = 0f;
private var inertiaDuration : float = 0.5f;

private var itemInertiaDuration : float = 1.0f;
private var itemTimeTouchPhaseEnded: float;
private var rotateVelocityX : float = 0;
private var rotateVelocityY : float = 0;

/************Dropping Packets Variables************/
var packetTypes : GameObject[];
var gravity : float = -1.0f;
private var packetHolder = new Array();

var hit: RaycastHit;

private var layerMask = (1 <<  8) | (1 << 2);

function Start() {
//	targetCenterX = targetItem.transform.position.x;
//	targetCenterY = targetItem.transform.position.y;
	layerMask =~layerMask;
}

// constructor - like thing
function OnEnable () {
	pointsScored = 50;
	rotateAngle = 0f;
	wasRotating = false;
	
	
	// print( targetCenterY );
	
	//originalEuler = 
	//var myEulerZ : float = targetItem.transform.rotation.eulerAngles.z;
	//originalRotation = targetItem.transform.localRotation;
	
	//targetItem.transform.rotation.eulerAngles += Vector3(0, 0, -60);
	//targetItem.transform.Rotate( 0, 0 , 20 * rotationRate , Space.World ); 
	
	
	//var newRotation : Quaternion = targetItem.transform.localRotation;
	//var angle : float = Quaternion.Angle(originalRotation, newRotation);
	
	//var newRotation : float = targetItem.transform.rotation.eulerAngles.z; 
	
	
	//print( newRotation );
	/*var tx : float = 50 - targetCenterX;
	var ty : float = (-10) - targetCenterY;

	var t_length : float = Mathf.Sqrt(tx*tx + ty*ty);
	print( t_length );
	var a : float = Mathf.Rad2Deg * Mathf.Acos(ty / t_length);
	print( a );*/
}

function OnDisable() {
	for (var toDelete : int = 0; toDelete < packetHolder.length; toDelete += 1 ) {
		var deadGB : GameObject = packetHolder[toDelete];
		packetHolder.RemoveAt(toDelete);
		Destroy(deadGB);
	}	
}

function Update () {
	handleTouch();
	//targetItem.transform.localRotation.z += 0.1*Time.deltaTime;
	generateAndHandlePackets();
	handlePacketCollision();
	
	if (pointsScored <= 0) {
		puzzleManager.Lose();
	}
	else if (pointsScored >= 100) {
		puzzleManager.Win();
	}

} // update

function generateAndHandlePackets() {
	
	// generate packets if last set are gone
	if ( packetHolder.length <= 0 ) {  // make sure last packet set has dropped
		var clone : GameObject; 
		var numPackets : int = Random.Range(0,4) + 2; // how many packets to generate this round
		
		var lastPacketOffset : int = -50;
		
		for (var curPacket : int = 0; curPacket < numPackets ; curPacket += 1) {
			// ptr* to newly cloned instance
			clone = Instantiate (packetTypes[Random.Range(0, packetTypes.Length)], Vector3.zero, Quaternion.identity);
			clone.transform.parent = puzzleRoot.transform;
			clone.transform.localRotation.eulerAngles += Vector3(0, 0, -180);
			lastPacketOffset += 50 + Random.Range(1,5)*10;
			clone.transform.localPosition += new Vector3(0, lastPacketOffset + this.transform.localPosition.y + 150 ,0);
			// add it to the list
			packetHolder.Push( clone );
		} // for
	} else { // Drop them like its hot
		for (var Packet : GameObject in packetHolder ) {
			Packet.transform.position += new Vector3(0,-gravity*Time.deltaTime,0);
		}
	}
} // generateAndHandlePackets

function handlePacketCollision() {
	// called if packets are dropped off the stack
	// check the location of the packets, if they are at the lowest point 
	
	// compare with Original Rotation
	// originalRotation;
	var lastHit : int = 0;
	//var newRotation : Quaternion = targetItem.transform.localRotation;
	//var angle : float = Quaternion.Angle(originalRotation, newRotation);
	
	var angle : float = targetItem.transform.rotation.eulerAngles.z; 
	var pType : String = "somethingBAD";

	// give that we have the angle diff, should be able to which space the shape is pointing at
	if ( ( (angle >= 0 ) && ( angle < 60 ) ) || ( ( angle > 300 ) && ( angle < 360 ) ) ) {
		pType = "Packet_Boot";
	} 
	
	if ( ( angle >= 60 ) && ( angle < 180 ) ) {
		pType = "Packet_Def";
	}
	
	if ( ( angle >= 180 ) && ( angle < 300 ) ) {
		pType = "Packet_Atk";
	}
	

	
	for (var Packet : GameObject in packetHolder ) {
		if ( this.transform.localPosition.y - Packet.transform.localPosition.y >= -60 ) {
			lastHit += 1;
			
			//pointsScored += 10;
			
			if ( pType == Packet.GetComponent(PacketScript).pType) {
				pointsScored += 10;
			} else {
				pointsScored -= 20;
			}
			break;
		}
	}
	
		debugText.text = pointsScored.ToString();
	
	// delete dead objects
	for (var toDelete : int = 0; toDelete < lastHit; toDelete += 1 ) {
		var deadGB : GameObject = packetHolder[toDelete];
		packetHolder.RemoveAt(toDelete);
		Destroy(deadGB);
		if ( CollideSound != null ) {
			audioFX.PlayOneShot(CollideSound);
		}
	}
}

function handleTouch() {
	if ( Input.touchCount > 0 )
    {
    	print ( "touch me" );
    	// Get touch
		var theTouch : Touch = Input.GetTouch(0);
		
        // Something unity ray thingy
        var ray = Camera.main.ScreenPointToRay( theTouch.position );
        
		if ( Physics.Raycast( ray, hit, 50, layerMask ) )
        {
        	if ( Input.touchCount == 1 )
			{
				switch ( theTouch.phase ) {
					case TouchPhase.Began : 
						wasRotating = false;
						break;
					
					case TouchPhase.Moved : 
						//targetItem.transform.Rotate(theTouch.deltaPosition.y * rotationRate, -theTouch.deltaPosition.x * rotationRate,0,Space.World);
         				// rotation on Y axis
						targetItem.transform.Rotate( 0, 0 , -theTouch.deltaPosition.x * rotationRate , Space.World ); 
         				// rotateAngle = rotateTransform( theTouch.deltaPosition.x , theTouch.deltaPosition.y );
						//targetItem.transform.Rotate( 0, 0 , ro	tateAngle , Space.World ); 
         				
         				//targetItem.transform.eulerAngles = Vector3( 0, 0, rotateAngle );
         				//rotateAngle - targetItem.transform.rotation.z
         				// targetItem.transform.RotateAround( targetItem.transform.position, Vector3.forward, rotateAngle );
         				//var target = Quaternion.Euler (0, 0, rotateAngle);
         				//targetItem.transform.rotation = Quaternion.Slerp ( targetItem.transform.rotation, target, Time.deltaTime );
         				// Quaternion.AngleAxis(rotateAngle, Vector3.forward); // Sets the transforms rotation to rotate x degrees around the y-axis
         				wasRotating = true;
         				break;
					
					case TouchPhase.Ended : 
						// FALLTHROUGH
					
					case TouchPhase.Canceled : 
						if ( wasRotating == true )
	         			{
	         				if(Mathf.Abs(theTouch.deltaPosition.x) >=10)
	         				{
	         					rotateVelocityX = theTouch.deltaPosition.x / theTouch.deltaTime;
	           				}
	           				if(Mathf.Abs(theTouch.deltaPosition.y) >=10)
	         				{
	         					rotateVelocityY = theTouch.deltaPosition.y / theTouch.deltaTime;
	           				}
	         				itemTimeTouchPhaseEnded = Time.time;
	         			}
	         			// FALLTHROUGH
					
					default: break;
				} // switch
			} // if 
        } // if
        
        // add some inertia
    if( Input.touchCount == 0 )
    {
            if(scrollVelocity != 0.0)
         	{
         		//slowing down
         		var t : float = (Time.time - timeTouchPhaseEnded) / inertiaDuration;
         		var frameVelocity : float = Mathf.Lerp(scrollVelocity, 0 , t);
         				
         		scrollPosition.x -= frameVelocity * Time.deltaTime;
         				
         		if(t >= inertiaDuration)
         			scrollVelocity = 0.0f;
         				
         	}	
         
            if(rotateVelocityX != 0.0f || rotateVelocityY != 0.0f)
         	{
         		//slowing down
         		var ty : float = (Time.time - itemTimeTouchPhaseEnded) / itemInertiaDuration;
         		var XVelocity : float = Mathf.Lerp(rotateVelocityX, 0 , ty);
         		var YVelocity : float = Mathf.Lerp(rotateVelocityY, 0 , ty); 	
         		
         		if(ty >= inertiaDuration)
         		{
         			rotateVelocityX = 0.0f;
         			rotateVelocityY = 0.0f;
         		}	
         		//targetItem.transform.Rotate(YVelocity*Time.deltaTime * rotationRate, -XVelocity * Time.deltaTime * rotationRate,0,Space.World);		
         		//rotateAngle = rotateTransform( XVelocity , YVelocity );
         		//targetItem.transform.rotation = Quaternion.AngleAxis(rotateAngle /** Time.deltaTime * rotationRate*/, Vector3.forward);
         		//targetItem.transform.Rotate( 0, 0 , rotateAngle * Time.deltaTime * rotationRate , Space.World ); 	
         		targetItem.transform.Rotate( 0, 0 , rotateAngle * Time.deltaTime * rotationRate , Space.World ); 	
		
         	}	
        
        
      }	// if
       
    } // if  
    
    	// SOME TEST CO2DE FOR SIMPLE ROTATION
    /*if(Input.GetMouseButton(0)){
    	if(Input.GetMouseButtonDown(0)){
    		//reset
    		lastMousePosition = Input.mousePosition;	
    	}
    	else if(Input.mousePosition.y < lastMousePosition.y){
    		plane.Rotate(
              Vector3.up*(Input.mousePosition.y - lastMousePosition.y));
    	}
    	lastMousePosition = Input.mousePosition;
    }*/
}