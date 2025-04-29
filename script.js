const video = document.getElementById('video');
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

// Flags to toggle filters
let isHeartActive = false;
let isEmojiActive = false;

// Array to store emoji coordinates
const hearts = [];
const emojis = [];

// Start the camera
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

// Function to draw emojis on the canvas
function drawEmojis() {
  ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear previous frames

  // Add new hearts and emojis if the respective filters are active
  if (isHeartActive) {
    hearts.push({
      x: Math.random() * canvas.width,  // Position the hearts randomly across the screen
      y: canvas.height,                 // Start from the bottom
      size: 30,
      speed: Math.random() * 2 + 1      // Random speed for each heart
    });
  }

  if (isEmojiActive) {
    emojis.push({
      x: Math.random() * canvas.width,  // Position the emojis randomly across the screen
      y: canvas.height,                 // Start from the bottom
      size: 30,
      speed: Math.random() * 2 + 1      // Random speed for each emoji
    });
  }

  // Draw hearts
  hearts.forEach((heart, index) => {
    ctx.font = `${heart.size}px Arial`;
    ctx.fillText('❤️', heart.x, heart.y);
    heart.y -= heart.speed;  // Move hearts upwards

    if (heart.y < 0) {
      hearts.splice(index, 1); // Remove hearts that go off-screen
    }
  });

  // Draw love emojis
  emojis.forEach((emoji, index) => {
    ctx.font = `${emoji.size}px Arial`;
    ctx.fillText('💕', emoji.x, emoji.y);
    emoji.y -= emoji.speed;  // Move emojis upwards

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

// Draw emojis when the video is playing
video.addEventListener('play', function () {
  drawEmojis();
});
