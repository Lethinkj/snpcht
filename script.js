// Set up the camera stream
const video = document.getElementById("video");
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const heartImage = document.createElement("img");
heartImage.src = "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4b/Red_Heart_Emoji.png/500px-Red_Heart_Emoji.png"; // Heart emoji image

const dogImage = document.createElement("img");
dogImage.src = "https://upload.wikimedia.org/wikipedia/commons/1/1f/2016_Dog_Face_Emoji.png"; // Dog face emoji

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

// Function to draw the video frame on the canvas
function drawFrame() {
  ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas before redrawing
  applyFilters(); // Apply the selected filter to the canvas

  // Draw video frame
  ctx.drawImage(video, 0, 0, canvas.width, canvas.height); // Draw video on canvas
  
  // Draw heart if effect is active
  if (isFlyingHeart) {
    drawFlyingHeart();
  }
  
  // Draw dog face if effect is active
  if (isDogFace) {
    applyDogFaceFilter();
  }

  requestAnimationFrame(drawFrame);  // Keep drawing the next frame
}

// Lens functionality
const lens1 = document.getElementById("lens1");
const lens2 = document.getElementById("lens2");
const flyingHeartButton = document.getElementById("flyingHeart");
const dogFaceButton = document.getElementById("dogFace");

let currentLens = null;
let isFlyingHeart = false;
let heartPosition = { x: 150, y: 50 };  // Starting position of the heart
let isDogFace = false;

// Lens filters (grayscale, sepia)
lens1.addEventListener("click", () => applyLens(1));
lens2.addEventListener("click", () => applyLens(2));

// Flying Heart effect
flyingHeartButton.addEventListener("click", () => {
  isFlyingHeart = !isFlyingHeart;
  if (isFlyingHeart) {
    animateHeart();
  }
});

// Dog Face effect
dogFaceButton.addEventListener("click", () => {
  isDogFace = !isDogFace;
  if (isDogFace) {
    applyDogFaceFilter();
  }
});

function applyLens(lensId) {
  currentLens = lensId;
}

function applyFilters() {
  if (currentLens === 1) {
    // Apply Lens 1 filter (e.g., grayscale)
    ctx.filter = "grayscale(100%)";
  } else if (currentLens === 2) {
    // Apply Lens 2 filter (e.g., sepia)
    ctx.filter = "sepia(100%)";
  } else {
    ctx.filter = "none"; // No filter
  }
}

// Flying Heart Animation (Random movement)
function animateHeart() {
  if (!isFlyingHeart) return; // Stop if flying heart effect is turned off
  
  // Random movement of the heart
  heartPosition.x = Math.random() * canvas.width;
  heartPosition.y = Math.random() * (canvas.height / 2); // Keep heart in the upper half of the screen
  
  // Keep updating position of the heart
  setTimeout(animateHeart, 1000); // Update heart every second
}

// Draw the heart on the canvas
function drawFlyingHeart() {
  ctx.drawImage(heartImage, heartPosition.x, heartPosition.y, 50, 50); // Draw heart image on canvas
}

// Dog Face Filter (Positioned on top of the user's face)
function applyDogFaceFilter() {
  ctx.filter = "none"; // Remove any previous filters
  ctx.drawImage(dogImage, 100, 100, 100, 100); // Draw dog face at fixed position (for simplicity)
}

// Capture functionality
const captureButton = document.getElementById("capture");

captureButton.addEventListener("click", () => {
  // Convert canvas to an image (base64 string)
  const imageData = canvas.toDataURL("image/png");
  downloadImage(imageData, 'snapshot.png'); // Trigger download
});

// Download captured image
function downloadImage(data, filename) {
  const a = document.createElement('a');
  a.href = data;
  a.download = filename;
  a.click();
}

// Continuously draw heart while effect is on
setInterval(() => {
  if (isFlyingHeart) {
    drawFlyingHeart();
  }
}, 30); // Update heart position every 30ms
