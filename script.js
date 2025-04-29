// Access video and canvas elements
const video = document.getElementById("video");
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

// Access filter elements
const heartFilter = document.getElementById("heartFilter");
const dogFaceFilter = document.getElementById("dogFaceFilter");

// Array to hold multiple hearts
let hearts = [];

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
let isDogFace = false;

// Lens Buttons
document.getElementById("lens1").addEventListener("click", () => applyLens(1));
document.getElementById("lens2").addEventListener("click", () => applyLens(2));

// Filter Buttons
document.getElementById("flyingHeart").addEventListener("click", toggleHearts);
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

  // Update hearts positions if flying
  if (isFlyingHeart) {
    moveHearts();
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

// Toggle flying hearts
function toggleHearts() {
  isFlyingHeart = !isFlyingHeart;
  if (isFlyingHeart) {
    createHearts();
  } else {
    hearts = [];  // Stop flying hearts when toggled off
  }
}

// Create multiple hearts above the heads
function createHearts() {
  // Create a set of heart emojis at random positions
  for (let i = 0; i < 10; i++) {  // Generate 10 hearts
    hearts.push({
      x: Math.random() * canvas.width, // Random x position
      y: Math.random() * 100,  // Random y position (above the head)
      speedX: (Math.random() - 0.5) * 2, // Random horizontal movement speed
      speedY: (Math.random() - 0.5) * 2, // Random vertical movement speed
      emoji: '❤️'
    });
  }
}

// Move hearts randomly
function moveHearts() {
  hearts.forEach(heart => {
    // Move the heart
    heart.x += heart.speedX;
    heart.y += heart.speedY;

    // Bounce the hearts off the edges of the canvas
    if (heart.x <= 0 || heart.x >= canvas.width) {
      heart.speedX *= -1;
    }
    if (heart.y <= 0 || heart.y >= 100) {  // Only above the head
      heart.speedY *= -1;
    }

    // Draw the heart on the canvas
    ctx.font = '30px Arial';
    ctx.fillText(heart.emoji, heart.x, heart.y);
  });
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
