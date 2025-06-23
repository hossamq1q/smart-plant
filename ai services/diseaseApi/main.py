from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.responses import JSONResponse
from tensorflow import keras
import numpy as np
import logging
from classesName import class_names
from preprocessImage import preprocess_images
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


MODEL_PATH = "best_model(1).keras"
DETECT_MODEL_PATH = "best_detect_plant_model.keras"
try:
    DISEASE_MODEL = keras.models.load_model(MODEL_PATH)
    DETECT_MODEL = keras.models.load_model(DETECT_MODEL_PATH)
except Exception as e:
    logging.error(f"Error loading modelS: {e}")
    raise RuntimeError("Failed to load modelS. Check modelS file path.")

CONFIDENCE_THRESHOLD = 0.6

@app.post("/predict")
async def predict(image: UploadFile = File(...)):
    try:
        image_bytes = await image.read()
        
        processed_image = preprocess_images(image_bytes)
        
        
        check_if_image_is_plant_or_no = DETECT_MODEL.predict(processed_image)
        max_probability_detect = np.max(check_if_image_is_plant_or_no)
        prediction_class_detect = np.argmax(check_if_image_is_plant_or_no)
        
        if prediction_class_detect == 0 :
            return JSONResponse(content={
                "prediction": "this image is dont match with rules of model",
                "confidence": float(max_probability_detect)
            })
        
        prediction = DISEASE_MODEL.predict(processed_image)
        
        max_probability = np.max(prediction)
        prediction_class = np.argmax(prediction)
        
        if max_probability < CONFIDENCE_THRESHOLD:
            return JSONResponse(content={
                "prediction": "i dont can detect disease",
                "confidence": float(max_probability)
            })
        
        return JSONResponse(content={
            "prediction": class_names[prediction_class],
            "confidence": float(max_probability)
        })
        
    except Exception as e:
        logging.error(f"Prediction error: {e}")
        raise HTTPException(status_code=500, detail=str(e))