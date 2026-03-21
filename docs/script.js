// script.js
document.querySelectorAll("a").forEach((link) => {
  if (link.href === window.location.href) {
    link.style.fontWeight = "bold";
  }
});


document.querySelectorAll(".sidebar a").forEach((link) => {
  if (link.href === window.location.href) {
    link.classList.add("active");
  }
});