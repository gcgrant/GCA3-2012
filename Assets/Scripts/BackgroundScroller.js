#pragma strict

function Start () {

}

function Update () {
	this.transform.Rotate(Vector3.up * Time.deltaTime * 10);
}