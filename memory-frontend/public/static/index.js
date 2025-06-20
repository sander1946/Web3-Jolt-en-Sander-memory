// Get the popup
var popup = document.getElementById("popup");

// Get the <span> element that closes the popup
let closeButtons = document.getElementsByClassName("close");
Array.from(closeButtons).forEach(closeButton => {
  closeButton.onclick = function() {
    popup.style.display = "none";
  }
});

// When the user clicks anywhere outside of the popup, close it
window.onclick = function(event) {
  if (event.target == popup) {
    popup.style.display = "none";
  }
}