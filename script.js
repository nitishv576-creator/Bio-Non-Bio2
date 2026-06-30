const URL = "./model/";

let model;
let webcam;
let maxPredictions;

document.getElementById("startBtn").addEventListener("click", init);

async function init() {

    const modelURL = URL + "model.json";
    const metadataURL = URL + "metadata.json";

    model = await tmImage.load(modelURL, metadataURL);

    maxPredictions = model.getTotalClasses();

    webcam = new tmImage.Webcam(300,300,true);

    await webcam.setup();

    await webcam.play();

    document.getElementById("webcam-container").innerHTML = "";

    document
        .getElementById("webcam-container")
        .appendChild(webcam.canvas);

    window.requestAnimationFrame(loop);
}

async function loop(){

    webcam.update();

    await predict();

    window.requestAnimationFrame(loop);
}

async function predict(){

    const prediction = await model.predict(webcam.canvas);

    let bestPrediction = prediction[0];

    for(let i=1;i<prediction.length;i++){

        if(prediction[i].probability > bestPrediction.probability){
            bestPrediction = prediction[i];
        }

    }

    document.getElementById("prediction").innerHTML =
        `
        <h2>${bestPrediction.className}</h2>
        <p>Confidence : ${(bestPrediction.probability*100).toFixed(2)}%</p>
        `;
}