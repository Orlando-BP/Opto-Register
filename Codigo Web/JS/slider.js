let currentSlide = 0;
const slides = document.querySelectorAll(".slide");

function showSlide(index) {
    if (index >= slides.length) {
        currentSlide = 0;
    } else if (index < 0) {
        currentSlide = slides.length - 1;
    } else {
        currentSlide = index;
    }
    
    slides.forEach((slide, i) => {
        slide.style.display = i === currentSlide ? "block" : "none";
    });
}

function moveSlide(step) {
    showSlide(currentSlide + step);
}

document.addEventListener("DOMContentLoaded", () => {
    showSlide(currentSlide);
});
