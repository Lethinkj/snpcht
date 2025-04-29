// Access video and canvas elements
const video = document.getElementById("video");
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

// Access filter elements
const heartFilter = document.getElementById("heartFilter");
const dogFaceFilter = document.getElementById("dogFaceFilter");

// Start video stream
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
let heartPosition = { x: 150, y: 50 }; // Initial position of heart
let isDogFace = false;

// Lens Buttons
document.getElementById("lens1").addEventListener("click", () => applyLens(1));
document.getElementById("lens2").addEventListener("click", () => applyLens(2));

// Filter Buttons
document.getElementById("flyingHeart").addEventListener("click", toggleHeart);
document.getElementById("dogFace").addEventListener("click", toggleDogFace);

// Capture Button
document.getElementById("capture").addEventListener("click", captureImage);

// Set canvas size on video play
video.addEventListener('play', () => {
  canvas.width = 300;
  canvas.height = 300;
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
    ctx.filter = "none";  // Default - No filter
  }
}

// Draw the video and effects continuously
function drawFrame() {
  ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear previous frame

  // Apply the selected lens filter
  applyFilters();

  // Draw video on canvas
  ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

  // Call drawFrame repeatedly to keep the video updated
  requestAnimationFrame(drawFrame);

  // Update heart filter position if active
  if (isFlyingHeart) {
    updateHeartPosition();
  }

  // Update dog face filter visibility
  if (isDogFace) {
    dogFaceFilter.style.display = 'block';
    dogFaceFilter.style.top = "100px";
    dogFaceFilter.style.left = "100px";
  } else {
    dogFaceFilter.style.display = 'none';
  }
}

// Toggle heart animation
function toggleHeart() {
  isFlyingHeart = !isFlyingHeart;
  if (isFlyingHeart) {
    animateHeart();
  }
}

// Randomize heart position
function animateHeart() {
  if (!isFlyingHeart) return;

  // Randomize the position of the heart emoji on the screen
  heartPosition.x = Math.random() * canvas.width;
  heartPosition.y = Math.random() * (canvas.height / 2); // Random position in the top half

  heartFilter.style.left = heartPosition.x + 'px';
  heartFilter.style.top = heartPosition.y + 'px';
  heartFilter.style.display = 'block';

  setTimeout(animateHeart, 1000); // Move heart every second
}

// Update heart position
function updateHeartPosition() {
  heartFilter.style.left = heartPosition.x + 'px';
  heartFilter.style.top = heartPosition.y + 'px';
}

// Toggle dog face filter
function toggleDogFace() {
  isDogFace = !isDogFace;
  if (isDogFace) {
    dogFaceFilter.style.display = 'block';
  } else {
    dogFaceFilter.style.display = 'none';
  }
}

// Capture image and download
function captureImage() {
  const dataUrl = canvas.toDataURL("image/png"); // Capture canvas as image
  const link = document.createElement('a');
  link.href = dataUrl;
  link.download = 'snapshot.png'; // Set file name for download
  link.click(); // Trigger download
}
