/*!
 * whitespaceManager
 *
 * This object is a set of function that manage whitespace after rules being applied
 *
 * @param {String} beforeString
 * @param {String} replacerString
 * @param {String} afterString
 *
 * Copyright(c) 20017 Jean-Luc Ranaivoarivao <ranaivoarivaojl@me.com>
 * MIT Licensed
 */

var Remarkable = require('remarkable');
var Tools = require("./tools");

var tools = new Tools();
var md = new Remarkable();

function whitespaceManager(beforeString, replacerString, afterString) {
  this.beforeString = beforeString;
  this.replacerString = replacerString;
  this.afterString = afterString;

  if (this.replacerString == null) {
    this.replacerString = "";
  }

  if (tools.isBlank(this.replacerString)) {
    this.removeSimpleWhitespace();
    this.removeMarkdownWhitespace();
  }
}

whitespaceManager.prototype = {

  /**
   * removeSimpleWhitespace()
   * Remove one of the before or after whitepace if replacer string is empty
   *
   */
  removeSimpleWhitespace: function() {

    var previousChar = this.beforeString.slice(-1);
    var nextChar = this.afterString.charAt(0);

    if ((previousChar == " " && nextChar == " ") ||
      (previousChar == " " && (nextChar == undefined || nextChar == "" || nextChar == "\n"))) {
      this.beforeString = this.beforeString.substring(0, this.beforeString.length - 1);
    } else if ((previousChar == "" || previousChar == "\n") && nextChar == " ") {
      this.afterString = this.afterString.substr(1);
    }
  },

  /**
   * removeMarkdownWhitespace()
   *
   */
  removeMarkdownWhitespace: function() {
    var randomString = tools.generateRandomString(50);

    var tempString = this.beforeString + randomString + this.afterString;

    var renderedTempString = md.render(tempString);
    renderedTempString = renderedTempString.replace(/<(?:.|\n)*?>/gm, '');
    var splitedRenderedTempString = renderedTempString.split(randomString);

    if (splitedRenderedTempString[1]) {

      var leftRenderedTempString = splitedRenderedTempString[0];
      var rightRenderedTempString = splitedRenderedTempString[1];

      var previousChar = leftRenderedTempString.slice(-1);
      var nextChar = rightRenderedTempString.charAt(0);

      var beforeStringSplitted;
      var i;

      if ((previousChar == " " && nextChar == " ") ||
        (previousChar == " " && (nextChar == undefined || nextChar == "" || nextChar == "\n"))) {
        //In beforeString, this code will remove character by character backstep until the next after a space
        beforeStringSplitted = this.beforeString.split("");

        i = this.beforeString.length - 1;
        while (beforeStringSplitted[i] !== " " &&  i > 0) {
          this.beforeString = this.beforeString.substring(0, this.beforeString.length - 1);
          i--;
        }
        if (this.beforeString.charAt(this.beforeString.length - 1) == " ") {
          this.beforeString = this.beforeString.substring(0, this.beforeString.length - 1);
        }

        //In afterString, this code will remove character by character until a space
        var afterStringSplitted = this.afterString.split("");

        i = 0;
        while (afterStringSplitted[i] !== " " &&  i <= this.afterString.length) {
          this.afterString = this.afterString.substr(1);
          i++;
        }
      } else if ((previousChar == "" || previousChar == "\n") && nextChar == " ") {
        beforeStringSplitted = this.beforeString.split("");

        i = this.beforeString.length - 1;
        while (beforeStringSplitted[i] !== " " &&  i >= 0) {
          this.beforeString = this.beforeString.substring(0, this.beforeString.length - 1);
          i--;
        }

        var afterStringSplitted = this.afterString.split("");

        i = 0;
        while (afterStringSplitted[i] !== " " &&  i <= this.afterString.length) {
          this.afterString = this.afterString.substr(1);
          i++;
        }

        this.afterString = this.afterString.substr(1);

      }
    }
  },

  /**
   * get()
   *
   * Return processed result
   *
   * @return {String} this.stringToReturn
   */
  get: function() {
    return this.beforeString + this.replacerString;
  },

  /**
   * getAfterString()
   *
   * Return the after string
   *
   * @return {String} this.stringToReturn
   */
  getAfterString: function() {
    return this.afterString;
  }

};

module.exports = whitespaceManager;