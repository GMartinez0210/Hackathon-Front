from flask import Flask, url_for, send_from_directory, request, jsonify

import logging, os
from werkzeug.utils import secure_filename
import base64
# -*- coding: utf-8 -*-
import random # para números aleatorios
import os
import numpy as np
import time
import copy
import cv2
from connect import insertar_lugar

# Bibliotecas de PyTorch
import torch # operaciones sobre tensores
from torch import nn  #paquete de capas y funciones de activación
from torch import optim  # paquete de optimización
from torch.optim import lr_scheduler # paquete de scheduler
import torchvision

# Conjunto de datos
from torch.utils import data # crear nuevos datasets o iterar sobre uno ya creado
from torchvision import datasets # conjuntos de datos precargados
from torchvision import transforms # transformaciones sobre los datos luego de ser cargados

# Modelos preentrenados
from torchvision import models # cargar diferentes modelos preentrenados
from PIL import Image
import pandas as pd
import folium
import pickle
import random
from datetime import datetime

app = Flask(__name__)

device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')





#cargar modelo
#loaded_model = pickle.load(open('model/model.pkl' ,'rb'))
loaded_model = torch.hub.load('ultralytics/yolov5', 'yolov5s', pretrained=True)

def predict_image(model, image):
    

    #image = cv2.imread(image)
    # Inference
    results = model(image)

    # Results
    results.print()
    results.save()  # or .show()

    results.xyxy[0]  # img1 predictions (tensor)
    results.pandas().xyxy[0]
    
    
    df = results.pandas().xyxy[0]
    df = df[df["name"] == "person"]

    count_people = df.shape[0]

    return(count_people)

@app.route('/conteo', methods = ['POST'])
def api_root():
    #app.logger.info(PROJECT_HOME)
    if request.method == 'POST' and request.files['image']:
        
        img = request.files['image']
        img_name = cv2.imdecode(np.frombuffer(img.read(),np.uint8), cv2.IMREAD_COLOR)
        customers = predict_image(loaded_model, img_name) 
        id = random.randint(1, 5)

        workers = random.randint(2, 5)

        
        insertar_lugar(id,customers, workers)

        return jsonify({
            "customers": customers,
            "id_lugar": id,
            "workers":workers
            })
            

    else:
        return "Where is the image?"
        

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8080)