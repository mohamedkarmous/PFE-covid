import random
from flask import Flask, request, jsonify, render_template, redirect
from main import CovidClassifier
from classifier import Classifier
import os
import shutil

app = Flask(__name__, static_url_path="/static")


@app.route("/predict", methods=['POST'])
def predict():
    result = {}

    image = request.files["xray_image"]
    file_name = str(random.randint(0, 100000)) + ".jpg"
    image.save(file_name)
    model = CovidClassifier()
    model_result = model.predict(file_name)
    os.remove(file_name)
    result["result"] = model_result[0]
    result["proba"] = model_result[1]

    running = False

    return jsonify(result)


@app.route("/sympt", methods=['POST'])
def predict_symp():

    result = {}

    list = [0, 0, 0, 0, 0, 0]
    symptoms = ["cough", "fever", "sore_throat",
                "shortness_of_breath", "head_ache", ]
    for i in range(len(symptoms)):
        if(request.form[symptoms[i]] == "true"):
            list[i] = 1
    if(request.form["gender"] == "Male"):
        list[-1] = 1
    model = Classifier()
    print(list)

    model_result = model.predict([list])
    print(model_result)

    result["result"] = model_result[0]

    running = False

    return jsonify(result)


@app.route("/")
def home():
    return render_template('index.html')


@app.route("/action", methods=['POST', 'GET'])
def action():
    model_result = ()
    html1 = ""
    html2 = ""
    result = {}
    if request.method == "POST":
        print("FORM DATA RECEIVED")

        if "xray_image" not in request.files:
            return redirect(request.url)

        file = request.files["xray_image"]
        if file.filename == "":
            return redirect(request.url)

        if file:
            image = request.files["xray_image"]
            file_name = str(random.randint(0, 100000)) + ".jpg"
            image.save(file_name)
            model = CovidClassifier()
            model_result = model.predict(file_name)
            os.remove(file_name)
            result["result"] = model_result[0]
            result["proba"] = model_result[1]
            html1 = model_result[0]
            html2 = model_result[1]

    return render_template('index.html', result=html1, proba=html2)


if __name__ == "__main__":

    app.run(debug=False, threaded=True)
