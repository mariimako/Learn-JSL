
// link to  model provided by export panel
let URL;

let model, webcam, labelContainer, maxPredictions;



// Load the image model and setup the webcam
function end() {
    // Stop the webcam
    webcam.stop();
    webcam = null;

    while (webcamContainer.firstChild) {
      webcamContainer.removeChild(webcamContainer.firstChild);
    }
}


document.addEventListener("DOMContentLoaded", function() {
    // Code to be executed after the HTML document is fully loaded
    webcamContainer = document.getElementById("webcam-container");
  });

async function init(characterSet) { 
  if (webcam) {
    end(); // end previous session if existing
  }

  document.getElementById('webcam-container').scrollIntoView();

  switch (characterSet) {
      case 1:
          URL = "https://teachablemachine.withgoogle.com/models/sbWUCvYv5/";
          break;
      case 2:
          URL = "https://teachablemachine.withgoogle.com/models/1SDmSUxO8O/";
          break;
      case 3:
          URL = "https://teachablemachine.withgoogle.com/models/U08brGajA0/";
          break;
      case 4:
          URL = "https://teachablemachine.withgoogle.com/models/NJRzKgj9U/";
          break;
      default:
          // Default URL 
          URL = "https://teachablemachine.withgoogle.com/models/default/";
          break;
  }

  const modelURL = URL + "model.json";
  const metadataURL = URL + "metadata.json";

  // load the model and metadata
  model = await tmImage.load(modelURL, metadataURL);
  maxPredictions = model.getTotalClasses();

  // function to setup a webcam
  const flip = true; // whether to flip the webcam
  webcam = new tmImage.Webcam(200, 200, flip); // width, height, flip
  await webcam.setup(); // request access to the webcam
  await webcam.play();
  window.requestAnimationFrame(loop);

  // append elements to  DOM
  webcamContainer.appendChild(webcam.canvas);

  for (let i = 0; i < maxPredictions; i++) {
    // and class labels
    let div = document.createElement("div");
    div.classList.add("output-container");
    div.classList.add("red");
    webcamContainer.appendChild(div);
  }

  const endButton = document.createElement("button");
  endButton.textContent = "End";
  endButton.classList.add("end-button");
  endButton.addEventListener("click", end); 
  webcamContainer.appendChild(endButton); 
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
  let name = prediction[0].className;
  let maxProb = prediction[0].probability.toFixed(2);
  for (let i = 1; i < maxPredictions; i++) {
    if (maxProb < prediction[i].probability.toFixed(2)) {
      maxProb = prediction[i].probability.toFixed(2);
      name = prediction[i].className;
    }
      const output = "You are showing: " +  name + ", probability " + maxProb;
      webcamContainer.childNodes[1].innerHTML = output;
  };
}