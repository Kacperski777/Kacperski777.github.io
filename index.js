

document.querySelector("#map").addEventListener("mouseover", ()=>{
  document.querySelector("#map-para").classList.remove("display-none")
  document.querySelector("#map").style.opacity = "0.2";
})




document.querySelector("#nutrition").addEventListener("mouseover", ()=>{
  document.querySelector("#nutrition-para").classList.remove("display-none")
  document.querySelector("#nutrition").style.opacity = "0.2";
})


document.querySelector("#birthday").addEventListener("mouseover", ()=>{
  document.querySelector("#birthday-para").classList.remove("display-none")
  document.querySelector("#birthday").style.opacity = "0.2";
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
