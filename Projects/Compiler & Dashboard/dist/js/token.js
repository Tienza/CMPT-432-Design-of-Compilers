// Creates the Token Class to store token information 
class Token {
    constructor(tokenKind, tokenValue, tokenLine) {
        this.kind = tokenKind;
        this.value = tokenValue;
        this.line = tokenLine;
    }
}