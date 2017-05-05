// Creates Symbol class for Symbol Table
class Symbol {
	constructor(key, type, line, scope, scopeLevel, initialized, utilized, tempLoc, stringHex, tempStore) {
		this.key = key;
		this.type = type;
		this.line = line;
		this.scope = scope;
		this.scopeLevel = scopeLevel;
		this.initialized = initialized;
		this.utilized = utilized;
		this.tempLoc = tempLoc;
		this.stringHex = stringHex;
		this.tempStore = tempStore;
	}

	getKey() {
		return this.key;
	}
	
	getType() {
		return this.type;
	}

	getLine() {
		return this.line;
	}

	getDetails() {
		var details = {
			type: this.type,
			line: this.line,
			initialized: this.initialized,
			utilized: this.utilized
		};
		return details;
	}
}