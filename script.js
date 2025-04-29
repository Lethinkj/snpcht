const video = document.getElementById('video');
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

// Flags to toggle filters
let isHeartActive = false;
let isEmojiActive = false;

// Array to store heart coordinates
const hearts = [];
const emojis = [];

// Load face-api.js models for face detection
async function loadFaceApiModels() {
  await faceapi.nets.ssdMobilenetv1.loadFromUri('/models'); // Load the model from a specific directory (adjust path as needed)
  await faceapi.nets.faceLandmark68Net.loadFromUri('/models'); // Load face landmark model (for more detailed detection)
  await faceapi.nets.faceRecognitionNet.loadFromUri('/models'); // Load face recognition model
}

// Start the camera and set up face detection
function startCamera() {
  navigator.mediaDevices.getUserMedia({ video: true })
    .then(function (stream) {
      video.srcObject = stream;
      video.play();
    })
    .catch(function (error) {
      console.error('Error accessing the camera:', error);
    });
}

// Toggle Flying Hearts Filter
function toggleHearts() {
  isHeartActive = !isHeartActive;
  if (isHeartActive) {
    console.log("Flying Hearts Activated");
  } else {
    console.log("Flying Hearts Deactivated");
  }
}

// Toggle Love Emoji Filter
function toggleLoveEmoji() {
  isEmojiActive = !isEmojiActive;
  if (isEmojiActive) {
    console.log("Love Emoji Activated");
  } else {
    console.log("Love Emoji Deactivated");
  }
}

// Draw hearts on the canvas above the detected head
async function drawEmojis() {
  ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear previous frames

  const detections = await faceapi.detectAllFaces(video).withFaceLandmarks(); // Detect faces with landmarks

  // Add new hearts if the respective filters are active
  if (isHeartActive && detections.length > 0) {
    detections.forEach(detection => {
      // Get the position of the face (we'll use the landmark for the position of the face)
      const { x, y, width, height } = detection.detection.box;

      // Place the heart above the head (slightly offset)
      hearts.push({
        x: x + width / 2,   // Center the heart above the face
        y: y - 30,          // Position it above the head
        size: 30,
        speed: Math.random() * 2 + 1
      });
    });
  }

  // Draw flying hearts
  hearts.forEach((heart, index) => {
    ctx.font = `${heart.size}px Arial`;
    ctx.fillText('❤️', heart.x, heart.y);
    heart.y -= heart.speed;  // Move the heart upwards

    if (heart.y < 0) {
      hearts.splice(index, 1); // Remove hearts that go off-screen
    }
  });

  // Draw love emojis
  if (isEmojiActive && detections.length > 0) {
    detections.forEach(detection => {
      const { x, y, width, height } = detection.detection.box;
      
      emojis.push({
        x: x + width / 2,   // Center the emoji above the face
        y: y - 30,          // Position it above the head
        size: 30,
        speed: Math.random() * 2 + 1
      });
    });
  }

  // Draw emojis (Love Emoji)
  emojis.forEach((emoji, index) => {
    ctx.font = `${emoji.size}px Arial`;
    ctx.fillText('💕', emoji.x, emoji.y);
    emoji.y -= emoji.speed;  // Move the emoji upwards

    if (emoji.y < 0) {
      emojis.splice(index, 1); // Remove emojis that go off-screen
    }
  });

  // Continue drawing emojis
  requestAnimationFrame(drawEmojis);
}

// Capture the current frame from the video
function captureImage() {
  // Create a new canvas to capture the video frame
  const captureCanvas = document.createElement('canvas');
  const captureCtx = captureCanvas.getContext('2d');
  captureCanvas.width = video.videoWidth;
  captureCanvas.height = video.videoHeight;
  
  // Draw the video feed onto the capture canvas
  captureCtx.drawImage(video, 0, 0, captureCanvas.width, captureCanvas.height);
  
  // Convert the canvas to a data URL and open it in a new window
  const imageUrl = captureCanvas.toDataURL('image/png');
  const imgWindow = window.open();
  imgWindow.document.write(`<img src="${imageUrl}" />`);
}

// Button event listeners
document.getElementById('heartFilterBtn').addEventListener('click', toggleHearts);
document.getElementById('emojiFilterBtn').addEventListener('click', toggleLoveEmoji);
document.getElementById('captureBtn').addEventListener('click', captureImage);

// Start the camera when the page loads
startCamera();

// Load face-api models and draw emojis when the video is playing
video.addEventListener('play', async function () {
  await loadFaceApiModels(); // Load face-api.js models
  drawEmojis(); // Start drawing emojis
});
