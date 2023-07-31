// More API functions here:
// https://github.com/googlecreativelab/teachablemachine-community/tree/master/libraries/image

// the link to your model provided by Teachable Machine export panel
const URL = "https://teachablemachine.withgoogle.com/models/JlNgne5qd/";

let model, webcam, labelContainer, maxPredictions;

// Load the image model and setup the webcam
function end() {
  // Stop the webcam
  if (webcam) {
    webcam.stop();
    webcam = null;
  }

  // Clear model references
  model = null;

  // Clean up DOM elements
  const webcamContainer = document.getElementById("webcam-container");
  const labelContainer = document.getElementById("label-container");
  webcamContainer.parentNode.removeChild(webcamContainer);
  labelContainer.parentNode.removeChild(labelContainer);
}


document.addEventListener("DOMContentLoaded", function() {
    // Code to be executed after the HTML document is fully loaded
    webcamContainer = document.getElementById("webcam-container");
    labelContainer = document.getElementById("label-container");
  });

async function init() {
  const modelURL = URL + "model.json";
  const metadataURL = URL + "metadata.json";

  // load the model and metadata
  // Refer to tmImage.loadFromFiles() in the API to support files from a file picker
  // or files from your local hard drive
  // Note: the pose library adds "tmImage" object to your window (window.tmImage)
  model = await tmImage.load(modelURL, metadataURL);
  maxPredictions = model.getTotalClasses();

  // Convenience function to setup a webcam
  const flip = true; // whether to flip the webcam
  webcam = new tmImage.Webcam(200, 200, flip); // width, height, flip
  await webcam.setup(); // request access to the webcam
  await webcam.play();
  window.requestAnimationFrame(loop);

  // append elements to the DOM
  webcamContainer.appendChild(webcam.canvas);
  for (let i = 0; i < maxPredictions; i++) {
    // and class labels
    labelContainer.appendChild(document.createElement("div"));
  }
}

async function loop() {
  webcam.update(); // update the webcam frame
  await predict();
  window.requestAnimationFrame(loop);
}

// run the webcam image through the image model
async function predict() {
  // predict can take in an image, video, or canvas HTML element
  const prediction = await model.predict(webcam.canvas);
  for (let i = 0; i < maxPredictions; i++) {
    const classPrediction =
      prediction[i].className + ": " + prediction[i].probability.toFixed(2);
    labelContainer.childNodes[i].innerHTML = classPrediction;
  }
}