const video = document.getElementById("video");
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const heartFilter = document.getElementById("heartFilter");
const loveEmojiFilter = document.getElementById("loveEmojiFilter");

let hearts = [];
let isFlyingHeart = false;
let isLoveEmoji = false;
let detectedFace = null;

// Load face-api.js models
Promise.all([
  faceapi.nets.ssdMobilenetv1.loadFromUri('/models'),
  faceapi.nets.faceLandmark68Net.loadFromUri('/models'),
  faceapi.nets.faceRecognitionNet.loadFromUri('/models')
]).then(startVideo);

// Start video stream
function startVideo() {
  navigator.mediaDevices.getUserMedia({ video: true })
    .then(stream => {
      video.srcObject = stream;
      video.play();
    })
    .catch(err => {
      console.log("Error accessing camera: ", err);
    });
}

video.addEventListener("play", () => {
  canvas.width = video.width;
  canvas.height = video.height;
  detectFace();
});

// Detect face using face-api.js
async function detectFace() {
  const detections = await faceapi.detectAllFaces(video).withFaceLandmarks();
  
  if (detections.length > 0) {
    detectedFace = detections[0].detection;
  } else {
    detectedFace = null;
  }

  requestAnimationFrame(detectFace);
  drawFrame();
}

// Draw video and filter effects continuously
function drawFrame() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw video on canvas
  ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

  // Update hearts positions if flying
  if (isFlyingHeart && detectedFace) {
    moveHearts(detectedFace);
  }

  // Draw hearts above the head if active
  hearts.forEach(heart => {
    ctx.font = '30px Arial';
    ctx.fillText(heart.emoji, heart.x, heart.y);
  });

  // Show love emoji filter
  if (isLoveEmoji && detectedFace) {
    loveEmojiFilter.style.display = 'block';
    loveEmojiFilter.style.left = detectedFace.box.x + detectedFace.box.width / 2 - 25 + 'px';
    loveEmojiFilter.style.top = detectedFace.box.y - 40 + 'px';
  } else {
    loveEmojiFilter.style.display = 'none';
  }
}

// Toggle flying hearts
document.getElementById("flyingHeart").addEventListener("click", toggleHearts);

// Toggle love emoji filter
document.getElementById("heartWithLove").addEventListener("click", toggleLoveEmoji);

// Capture image and download
document.getElementById("capture").addEventListener("click", captureImage);

// Toggle the heart filter on and off
function toggleHearts() {
  isFlyingHeart = !isFlyingHeart;
  if (isFlyingHeart) {
    createHearts();
  } else {
    hearts = [];  // Stop flying hearts when toggled off
  }
}

// Create multiple hearts above the head
function createHearts() {
  if (!detectedFace) return;
  // Create a set of hearts floating above the face
  for (let i = 0; i < 5; i++) { // 5 hearts
    hearts.push({
      x: detectedFace.box.x + Math.random() * detectedFace.box.width,
      y: detectedFace.box.y - 50 - Math.random() * 30,  // Above the head
      speedX: (Math.random() - 0.5) * 3,
      speedY: (Math.random() - 0.5) * 3,
      emoji: '❤️'
    });
  }
}

// Move hearts randomly above the head
function moveHearts(face) {
  hearts.forEach(heart => {
    heart.x += heart.speedX;
    heart.y += heart.speedY;

    // Bounce hearts off the canvas edges
    if (heart.x <= face.box.x || heart.x >= face.box.x + face.box.width) {
      heart.speedX *= -1;
    }
    if (heart.y <= face.box.y || heart.y >= face.box.y - 40) { // Prevent hearts going too far down
      heart.speedY *= -1;
    }
  });
}

// Toggle love emoji filter
function toggleLoveEmoji() {
  isLoveEmoji = !isLoveEmoji;
}

// Capture image and download
function captureImage() {
  const dataUrl = canvas.toDataURL("image/png"); // Capture canvas as image
  const link = document.createElement('a');
  link.href = dataUrl;
  link.download = 'snapshot.png'; // Set file name for download
  link.click(); // Trigger download
}
