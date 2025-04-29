// Set up the camera stream
const video = document.getElementById("video");
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const heartImage = document.createElement("img");
heartImage.src = "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4b/Red_Heart_Emoji.png/500px-Red_Heart_Emoji.png"; // Heart emoji image

const dogImage = document.createElement("img");
dogImage.src = "https://upload.wikimedia.org/wikipedia/commons/1/1f/2016_Dog_Face_Emoji.png"; // Dog face emoji

// Get the video stream
navigator.mediaDevices.getUserMedia({ video: true })
  .then(stream => {
    video.srcObject = stream;
    video.play();
  })
  .catch(err => {
    console.log("Error accessing camera: ", err);
  });

// Adjust canvas size to match the fixed square size
video.addEventListener('play', () => {
  canvas.width = 300;  // Fixed width for square canvas
  canvas.height = 300; // Fixed height for square canvas
  drawFrame();
});

// Variables for effect states
let currentLens = null;
let isFlyingHeart = false;
let isDogFace = false;
let heartPosition = { x: 150, y: 50 };  // Starting position of the heart

// Lens functionality
const lens1 = document.getElementById("lens1");
const lens2 = document.getElementById("lens2");
const flyingHeartButton = document.getElementById("flyingHeart");
const dogFaceButton = document.getElementById("dogFace");

lens1.addEventListener("click", () => applyLens(1));
lens2.addEventListener("click", () => applyLens(2));

flyingHeartButton.addEventListener("click", () => {
  isFlyingHeart = !isFlyingHeart; // Toggle flying heart
  if (isFlyingHeart) {
    animateHeart();
  }
});

dogFaceButton.addEventListener("click", () => {
  isDogFace = !isDogFace; // Toggle dog face
  if (isDogFace) {
    applyDogFaceFilter();
  }
});

// Lens filter function
function applyLens(lensId) {
  currentLens = lensId;
}

function applyFilters() {
  if (currentLens === 1) {
    ctx.filter = "grayscale(100%)";  // Grayscale lens
  } else if (currentLens === 2) {
    ctx.filter = "sepia(100%)";  // Sepia lens
  } else {
    ctx.filter = "none";  // No filter
  }
}

// Function to draw the video feed on the canvas
function drawFrame() {
  ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas

  // Apply any selected filter
  applyFilters();

  // Draw the video frame on the canvas
  ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

  // Draw additional effects (heart and dog face)
  if (isFlyingHeart) {
    drawFlyingHeart();
  }
  if (isDogFace) {
    applyDogFaceFilter();
  }

  requestAnimationFrame(drawFrame);  // Keep drawing the next frame
}

// Function to animate the flying heart
function animateHeart() {
  if (!isFlyingHeart) return; // Stop if heart animation is disabled

  heartPosition.x = Math.random() * canvas.width;
  heartPosition.y = Math.random() * (canvas.height / 2); // Keep heart in the upper half

  // Move heart every 1 second
  setTimeout(animateHeart, 1000);
}

// Function to draw the flying heart on canvas
function drawFlyingHeart() {
  ctx.drawImage(heartImage, heartPosition.x, heartPosition.y, 50, 50); // Draw heart image
}

// Function to apply dog face filter
function applyDogFaceFilter() {
  ctx.drawImage(dogImage, 100, 100, 100, 100);  // Fixed position for dog face
}

// Capture functionality
const captureButton = document.getElementById("capture");

captureButton.addEventListener("click", () => {
  // Convert the current canvas to an image and download
  const imageData = canvas.toDataURL("image/png");
  downloadImage(imageData, 'snapshot.png');
});

// Function to download captured image
function downloadImage(data, filename) {
  const a = document.createElement('a');
  a.href = data;
  a.download = filename;
  a.click();
}
