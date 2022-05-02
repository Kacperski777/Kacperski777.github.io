

document.querySelector("#map").addEventListener("mouseover", ()=>{
  document.querySelector("#map-para").classList.remove("display-none")
})


document.querySelector("#nutrition").addEventListener("mouseover", ()=>{
  document.querySelector("#nutrition-para").classList.remove("display-none")
})


document.querySelector("#birthday").addEventListener("mouseover", ()=>{
  document.querySelector("#birthday-para").classList.remove("display-none")
})


document.querySelector("#map").addEventListener("mouseout", ()=>{
  document.querySelector("#map-para").classList.add("display-none")
})


document.querySelector("#nutrition").addEventListener("mouseout", ()=>{
  document.querySelector("#nutrition-para").classList.add("display-none")
})


document.querySelector("#birthday").addEventListener("mouseout", ()=>{
  document.querySelector("#birthday-para").classList.add("display-none")
})


//Get the button:
mybutton = document.getElementById("myBtn");

// When the user scrolls down 20px from the top of the document, show the button
window.onscroll = function() {scrollFunction()};

function scrollFunction() {
  if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
    mybutton.style.display = "block";
  } else {
    mybutton.style.display = "none";
  }
}

// When the user clicks on the button, scroll to the top of the document
function topFunction() {
  document.body.scrollTop = 0; // For Safari
  document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
}
