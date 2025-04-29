// Set up the camera stream
const video = document.getElementById("video");
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const heartImage = new Image();
heartImage.src = "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4b/Red_Heart_Emoji.png/500px-Red_Heart_Emoji.png"; // Heart emoji image

const dogImage = new Image();
dogImage.src = "https://upload.wikimedia.org/wikipedia/commons/1/1f/2016_Dog_Face_Emoji.png"; // Dog face emoji

navigator.mediaDevices.getUserMedia({ video: true })
  .then(stream => {
    video.srcObject = stream;
    video.play();
  })
  .catch(err => {
    console.log("Error accessing camera: ", err);
  });

let currentLens = null;
let isFlyingHeart = false;
let heartPosition = { x: 150, y: 50 };  // Initial position of the heart
let isDogFace = false;

const lens1 = document.getElementById("lens1");
const lens2 = document.getElementById("lens2");
const flyingHeartButton = document.getElementById("flyingHeart");
const dogFaceButton = document.getElementById("dogFace");

lens1.addEventListener("click", () => applyLens(1));
lens2.addEventListener("click", () => applyLens(2));

flyingHeartButton.addEventListener("click", () => {
  isFlyingHeart = !isFlyingHeart;
  if (isFlyingHeart) {
    animateHeart();
  }
});

dogFaceButton.addEventListener("click", () => {
  isDogFace = !isDogFace;
  if (isDogFace) {
    applyDogFaceFilter();
  }
});

const captureButton = document.getElementById("capture");
captureButton.addEventListener("click", () => {
  const imageData = canvas.toDataURL("image/png");
  downloadImage(imageData, 'snapshot.png');
});

function downloadImage(data, filename) {
  const a = document.createElement('a');
  a.href = data;
  a.download = filename;
  a.click();
}

video.addEventListener('play', () => {
  canvas.width = 300;  // Fixed size
  canvas.height = 300; // Fixed size
  drawFrame();
});

function applyLens(lensId) {
  currentLens = lensId;
}

function applyFilters() {
  if (currentLens === 1) {
    ctx.filter = "grayscale(100%)";
  } else if (currentLens === 2) {
    ctx.filter = "sepia(100%)";
  } else {
    ctx.filter = "none";
  }
}

function drawFrame() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);  // Clear canvas

  applyFilters();  // Apply any active lens filter

  ctx.drawImage(video, 0, 0, canvas.width, canvas.height);  // Draw the video on the canvas

  if (isFlyingHeart) {
    drawFlyingHeart();
  }

  if (isDogFace) {
    applyDogFaceFilter();
  }

  requestAnimationFrame(drawFrame);  // Continuously update the frame
}

function animateHeart() {
  if (!isFlyingHeart) return;
  heartPosition.x = Math.random() * canvas.width;
  heartPosition.y = Math.random() * (canvas.height / 2);  // Move heart in the top half
  setTimeout(animateHeart, 1000);  // Move the heart every second
}

function drawFlyingHeart() {
  ctx.drawImage(heartImage, heartPosition.x, heartPosition.y, 50, 50);
}

function applyDogFaceFilter() {
  ctx.drawImage(dogImage, 100, 100, 100, 100);  // Draw dog face filter
}
