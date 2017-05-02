// Creates Variable for Jump Table
class jumpVarElem {
	constructor(tempName,distance) {
		this.tempName = tempName;
		this.distance = distance;
	}

	getTempName() {
		return this.tempName;
	}

	getDistance() {
		return this.distance;
	}
} 