let model;

// Model folder
const URL = "./model/";

// HTML Elements
const imageUpload = document.getElementById("imageUpload");
const preview = document.getElementById("preview");
const predictBtn = document.getElementById("predictBtn");
const prediction = document.getElementById("prediction");
const confidenceBars = document.getElementById("confidenceBars");
const loading = document.getElementById("loading");
const resultCard = document.getElementById("resultCard");

// Load model when page opens
window.onload = async function () {

    loading.style.display = "block";
    predictBtn.disabled = true;

    try {

        model = await tmImage.load(
            URL + "model.json",
            URL + "metadata.json"
        );

        loading.style.display = "none";
        predictBtn.disabled = false;

        console.log("Model Loaded Successfully");

    } catch (err) {

        loading.innerHTML =
            "❌ Unable to load the AI model.";

        console.error(err);
    }

};


// Preview uploaded image
imageUpload.addEventListener("change", function (event) {

    const file = event.target.files[0];

    if (!file) return;

    preview.src = URL.createObjectURL(file);
    preview.style.display = "block";

    resultCard.style.display = "none";

});


// Predict Button
predictBtn.addEventListener("click", async () => {

    if (!preview.src) {

        alert("Please upload an image first.");
        return;

    }

    loading.style.display = "block";
    resultCard.style.display = "none";

    await predict();

    loading.style.display = "none";
    resultCard.style.display = "block";

});


// Prediction Function
async function predict() {

    const predictions = await model.predict(preview);

    let highest = predictions[0];

    predictions.forEach(item => {

        if (item.probability > highest.probability)
            highest = item;

    });

    prediction.innerHTML =

        "Prediction : <br><br><span style='color:green;'>"
        + highest.className +
        "</span><br><br>" +
        (highest.probability * 100).toFixed(2)
        + "% Confidence";


    confidenceBars.innerHTML = "";

    predictions.forEach(item => {

        const percent = (item.probability * 100).toFixed(2);

        confidenceBars.innerHTML += `

        <div class="bar">

            <label>${item.className}</label>

            <div class="progress">

                <div style="width:${percent}%">

                    ${percent}%

                </div>

            </div>

        </div>

        `;

    });

}