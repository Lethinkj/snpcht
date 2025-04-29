const video = document.getElementById('video');

// Function to start the camera
function startCamera() {
  navigator.mediaDevices.getUserMedia({ video: true })
    .then(function(stream) {
      video.srcObject = stream;
      video.play();
      console.log("Camera is now on.");
    })
    .catch(function(error) {
      console.error('Error accessing the camera: ', error);
      alert('Unable to access the camera. Please check your camera permissions.');
    });
}

// Start the camera when the page loads
startCamera();

// Adding filter logic
let isHeartActive = false;
let isEmojiActive = false;

// Create hearts flying above the head (basic emoji flying hearts filter)
const hearts = [];
const heartSize = 40;

// Add flying heart emojis
function toggleHearts() {
  isHeartActive = !isHeartActive;
  if (isHeartActive) {
    console.log("Flying Hearts Activated");
  } else {
    console.log("Flying Hearts Deactivated");
  }
}

// Add love emojis flying above the head
function toggleLoveEmoji() {
  isEmojiActive = !isEmojiActive;
  if (isEmojiActive) {
    console.log("Love Emoji Activated");
  } else {
    console.log("Love Emoji Deactivated");
  }
}

// Draw hearts and love emoji over the video feed
function drawFilters() {
  const ctx = video.getContext('2d');
  if (isHeartActive) {
    hearts.push({
      x: Math.random() * video.width,
      y: Math.random() * video.height,
      size: heartSize,
      speed: Math.random() * 2 + 1
    });
  }

  if (isEmojiActive) {
    hearts.push({
      x: Math.random() * video.width,
      y: Math.random() * video.height,
      size: heartSize,
      speed: Math.random() * 2 + 1
    });
  }

  // Clear previous frame and draw new emojis
  ctx.clearRect(0, 0, video.width, video.height);

  // Draw hearts
  hearts.forEach((heart, index) => {
    ctx.font = `${heart.size}px Arial`;
    ctx.fillText('❤️', heart.x, heart.y);
    heart.y += heart.speed;

    if (heart.y > video.height) {
      hearts.splice(index, 1);
    }
  });

  // Draw love emojis
  hearts.forEach((emoji, index) => {
    ctx.font = `${emoji.size}px Arial`;
    ctx.fillText('💕', emoji.x, emoji.y);
    emoji.y += emoji.speed;

    if (emoji.y > video.height) {
      hearts.splice(index, 1);
    }
  });

  requestAnimationFrame(drawFilters);
}

// Button event listeners
document.getElementById('heartFilterBtn').addEventListener('click', toggleHearts);
document.getElementById('emojiFilterBtn').addEventListener('click', toggleLoveEmoji);

// Start drawing the filters after the video is loaded
video.addEventListener('play', function() {
  drawFilters();
});

