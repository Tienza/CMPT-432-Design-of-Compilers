// Creates Symbol class for Symbol Table
class Symbol {
	constructor(key, type, line, scope, scopeLevel, initialized, utilized) {
		this.key = key;
		this.type = type;
		this.line = line;
		this.scope = scope;
		this.scopeLevel = scopeLevel;
		this.initialized = initialized;
		this.utilized = utilized;
	}

	getKey() {
		return this.key;
	}
	
	getType() {
		return this.type;
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