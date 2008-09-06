/*
 * This is the constructor and toString method for a cite type tag.
 */
function Cite() {
	this.name;
	this.type;
	this.toString = function() {
		var returnstring = "<ref name=\"";
		returnstring += this.name;
		returnstring += "\">{{cite ";
		returnstring += this.type;
		returnstring += " \n\r\t";
		for (var name in this) {
			if (!((name == "type") || (name == "name") || (name == "toString"))
					&& (this[name])) {
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