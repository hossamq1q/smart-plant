import numpy as np
from io import BytesIO
from PIL import Image
import tensorflow as tf
from fastapi import HTTPException
import logging

def preprocess_images(image_bytes):
    try:
        image = Image.open(BytesIO(image_bytes))
        image = image.resize((224, 224))
        image_array = tf.keras.preprocessing.image.img_to_array(image)
        return np.expand_dims(image_array, axis=0)
    except Exception as e:
        logging.error(f"Disease model preprocessing error: {e}")
        raise HTTPException(status_code=400, detail="Invalid image format")