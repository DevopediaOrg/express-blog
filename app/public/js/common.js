$.fn.firstWord = function() {
  str = this.html().replace(/<p>(\S+)/, "<span class='firstWord'>$1</span>");
  this.html(str);
};

$( window ).load(function() {
    if (document.getElementById("firstWord")) {
        $("#firstWord").firstWord();
    }
});
