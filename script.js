// Set up the camera stream
const video = document.getElementById("video");
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

navigator.mediaDevices.getUserMedia({ video: true })
  .then(stream => {
    video.srcObject = stream;
    video.play();
  })
  .catch(err => {
    console.log("Error accessing camera: ", err);
  });

// Adjust canvas size to match video
video.addEventListener('play', () => {
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
  drawFrame();
});

// Function to draw the video frame on canvas
function drawFrame() {
  ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
  requestAnimationFrame(drawFrame);  // Keep the frame drawing loop
}

// Lens functionality
const lens1 = document.getElementById("lens1");
const lens2 = document.getElementById("lens2");

let currentLens = null;

lens1.addEventListener("click", () => applyLens(1));
lens2.addEventListener("click", () => applyLens(2));

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
  drawFrame(); // Re-render frame with applied filter
}

// Keep applying filter while video is playing
setInterval(applyFilters, 100);

// Capture functionality
const captureButton = document.getElementById("capture");

captureButton.addEventListener("click", () => {
  const imageData = canvas.toDataURL("image/png");
  downloadImage(imageData, 'snapshot.png');
});

// Download captured image
function downloadImage(data, filename) {
  const a = document.createElement('a');
  a.href = data;
  a.download = filename;
  a.click();
}
