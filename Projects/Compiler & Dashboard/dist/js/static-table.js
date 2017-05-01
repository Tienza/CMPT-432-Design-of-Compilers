// Creates Variable for Static Table
class tempVarElem {
	constructor(tempLoc,varKey,address) {
		this.tempLoc = tempLoc;
		this.varKey = varKey;
		this.address = address;
	}

	getTempLoc() {
		return this.tempLoc;
	}

	getVarKey() {
		return this.varKey;
	}

	getAddress() {
		return this.address;
	}
}