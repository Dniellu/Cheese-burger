// emergency.js

let isEmergency = false;
let slideshowInterval;
let slideIndex = 0;

function emergency() {
  isEmergency = true;
  stopSlideshow(); // 停止待機播放
  document.getElementById("screensaver").style.display = "none";
  document.getElementById("emergencyScreen").style.display = "flex";
  startSlideshow("#emergencyScreen .slide");
}

function exitEmergencyMode() {
  isEmergency = false;
  document.getElementById("emergencyScreen").style.display = "none";
  stopSlideshow();
}

function startSlideshow(selector) {
  const slides = document.querySelectorAll(selector);
  if (slides.length === 0) return;

  slideIndex = 0;
  slides.forEach((slide) => (slide.style.display = "none"));
  slides[slideIndex].style.display = "block";

  slideshowInterval = setInterval(() => {
    slides[slideIndex].style.display = "none";
    slideIndex = (slideIndex + 1) % slides.length;
    slides[slideIndex].style.display = "block";
  }, 3000);
}

function stopSlideshow() {
  clearInterval(slideshowInterval);
}
