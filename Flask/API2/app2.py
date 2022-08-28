from flask import Flask, url_for, send_from_directory, request, jsonify
from connect2 import get_bbva

app = Flask(__name__)


@app.route('/local', methods = ['POST'])
def api_root():
    #app.logger.info(PROJECT_HOME)
    if request.method == 'POST' and request.values.get("latitud") :
        
        latitud = request.values.get("latitud")
        longitud = request.values.get("longitud")

        data_locales = get_bbva(latitud, longitud)


        return data_locales
        

    else:
        return "Where is the image?"
        

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8080)