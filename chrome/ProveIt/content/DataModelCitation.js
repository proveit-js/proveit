/*
 * This is the constructor and tostring method for a Citation type tag.
 */
function Citation() {
	this.name;
	this.add = function(a, b) {
		this[a] = b;
	}
	this.toString = function() {
		var returnstring = "<ref name=\"";
		returnstring += Citation.prototype.name;
		returnstring += "\">{{Citation\n\r\t";
		var returnstring = "<ref name=\"";
		for (var name in this) {
			if (!((name == "name") || (name == "toString"))
					&& (this[name] != "")) {
				returnstring += "|";
				returnstring += name;
				returnstring += "=";
				returnstring += this[name];
				returnstring += "\n\r\t";
			}
		}
		returnstring += "}}</ref>";
		return returnstring;
	}
}