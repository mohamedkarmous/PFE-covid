import requests
URL = "https://covid-xray-detector-api.herokuapp.com/predict"
URL_LOCAL="http://127.0.0.1:5000/predict"
FILE_PATH = "test2.jpeg"

if __name__ == "__main__":

    file = open(FILE_PATH, "rb")
    values = {"xray_image": (FILE_PATH, file, "image/jpg")}
    response = requests.post(URL, files=values)
    data = response.json()
    print(data)