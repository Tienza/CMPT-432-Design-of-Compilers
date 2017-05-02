// Creates Variable for Static Table
class tempVarElem {
	constructor(tempLoc,varKey,address,scope) {
		this.tempLoc = tempLoc;
		this.varKey = varKey;
		this.address = address;
		this.scope = scope;
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

	getScope() {
		return this.scope;
	}
}