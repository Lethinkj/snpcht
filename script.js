// Access video and canvas elements
const video = document.getElementById("video");
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

// Heart Image
const heartImage = new Image();
heartImage.src = "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4b/Red_Heart_Emoji.png/500px-Red_Heart_Emoji.png"; // Heart emoji image

// Dog Face Image
const dogImage = new Image();
dogImage.src = "https://upload.wikimedia.org/wikipedia/commons/1/1f/2016_Dog_Face_Emoji.png"; // Dog face emoji

// Start video feed
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
let heartPosition = { x: 150, y: 50 }; // Initial heart position
let isDogFace = false;

// Add event listeners for buttons
document.getElementById("lens1").addEventListener("click", () => applyLens(1));
document.getElementById("lens2").addEventListener("click", () => applyLens(2));
document.getElementById("flyingHeart").addEventListener("click", toggleHeart);
document.getElementById("dogFace").addEventListener("click", toggleDogFace);
document.getElementById("capture").addEventListener("click", captureImage);

// Initialize canvas when the video starts playing
video.addEventListener('play', () => {
  canvas.width = 300;
  canvas.height = 300;
  drawFrame();
});

// Lens application (Grayscale / Sepia)
function applyLens(lensId) {
  currentLens = lensId;
}

function applyFilters() {
  if (currentLens === 1) {
    ctx.filter = "grayscale(100%)";
  } else if (currentLens === 2) {
    ctx.filter = "sepia(100%)";
  } else {
    ctx.filter = "none";  // Default - No filter
  }
}

// Draw video and effects continuously
function drawFrame() {
  ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear previous frame

  // Apply filters
  applyFilters();

  // Draw video on canvas
  ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

  // Draw heart filter if active
  if (isFlyingHeart) {
    drawFlyingHeart();
  }

  // Draw dog face filter if active
  if (isDogFace) {
    drawDogFaceFilter();
  }

  // Call drawFrame repeatedly to update the canvas
  requestAnimationFrame(drawFrame);
}

// Toggle flying heart animation
function toggleHeart() {
  isFlyingHeart = !isFlyingHeart;
  if (isFlyingHeart) {
    animateHeart();
  }
}

// Animate the heart randomly on the canvas
function animateHeart() {
  if (!isFlyingHeart) return;
  heartPosition.x = Math.random() * canvas.width;
  heartPosition.y = Math.random() * (canvas.height / 2); // Top half of the canvas
  setTimeout(animateHeart, 1000); // Move heart every second
}

// Draw the heart at its current position
function drawFlyingHeart() {
  ctx.drawImage(heartImage, heartPosition.x, heartPosition.y, 50, 50); // Size of heart
}

// Toggle dog face filter
function toggleDogFace() {
  isDogFace = !isDogFace;
  if (isDogFace) {
    drawDogFaceFilter();
  }
}

// Draw dog face filter on canvas at a fixed position
function drawDogFaceFilter() {
  ctx.drawImage(dogImage, 100, 100, 100, 100); // Fixed position for dog face filter
}

// Capture image from canvas
function captureImage() {
  const dataUrl = canvas.toDataURL("image/png"); // Capture canvas as image
  const link = document.createElement('a');
  link.href = dataUrl;
  link.download = 'snapshot.png'; // Set file name for download
  link.click(); // Trigger download
}
