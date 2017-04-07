// Creates Symbol class for Symbol Table
class Symbol {
	constructor(key, type, initialized, utilized) {
		this.key = key;
		this.type = type;
		this.initialized = initialized;
		this.utilized = utilized;
	}

	getKey() {
		return this.key;
	}

	getDetails() {
		var details = {
			type: this.type,
			initialized: this.initialized,
			utilized: this.utilized
		};
		return details;
	}
}