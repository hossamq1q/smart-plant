from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from starlette.responses import StreamingResponse
import cv2
import torch
from PIL import Image
import io
import numpy as np
import base64
from ultralytics import YOLO 
import os

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["Content-Disposition"]
)

model = YOLO("best.pt") 
model.to("cuda" if torch.cuda.is_available() else "cpu") 

import os
import uuid
from fastapi import UploadFile, File, HTTPException
from fastapi.responses import JSONResponse

base_dir = r"C:\Users\almal\Desktop\nodejs projects\Nest projects\smartplant\pestsAnnotated"

@app.post("/detect/image")
async def detect_pests_image(image: UploadFile = File(...)):
    try:
        save_dir = os.path.join(base_dir, "annotatedImages")
        image = Image.open(io.BytesIO(await image.read()))
        image_np = np.array(image)
        image_resized = cv2.resize(image_np,(640,640))
        
        result = model(image_resized)
        
        pests_detected = set()
        for box in result[0].boxes: 
            class_id = int(box.cls)
            class_name = model.names[class_id]
            pests_detected.add(class_name)

        annotated_image_bgr = result[0].plot()  
        annotated_image_rgb = cv2.cvtColor(annotated_image_bgr, cv2.COLOR_BGR2RGB)
        filename = f"annotated_{uuid.uuid4().hex}.png"
        save_path = os.path.join(save_dir, filename)
        Image.fromarray(annotated_image_rgb).save(save_path)


        return JSONResponse(content={
            "pestsDetected": list(pests_detected),
            "imageUrl": filename,
        })

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Processing error: {str(e)}")

@app.post("/detect/video")
async def detect_pests_video(video: UploadFile = File(...)):
    try:
        os.environ["OPENH264_LIBRARY_PATH"] = r"C:\Users\almal\Desktop\openh264\openh264-1.8.0-win64.dll"

        input_dir = r"C:\Users\almal\Desktop\New folder\all_pests_dataset\pestsApi\originalPestsVideos"
        save_dir = r"C:\Users\almal\Desktop\nodejs projects\Nest projects\smartplant\pestsAnnotated\annotatedVideos"

        input_filename = f"temp_{uuid.uuid4().hex}{os.path.splitext(video.filename)[1]}"
        output_filename = f"annotated_{uuid.uuid4().hex}.mp4"
        input_path = os.path.join(input_dir, input_filename)
        output_path = os.path.join(save_dir, output_filename)

        with open(input_path, "wb") as buffer:
            content = await video.read()
            if not content:
                raise HTTPException(400, "Empty video file")
            buffer.write(content)

        cap = cv2.VideoCapture(input_path)
        if not cap.isOpened():
            raise HTTPException(400, "Invalid video file")

        frame_width = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH))
        frame_height = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))
        original_size = (frame_width, frame_height)
        fps = cap.get(cv2.CAP_PROP_FPS)
        if fps <= 0:
            fps = 30  

        fourcc = cv2.VideoWriter_fourcc(*'avc1')
        out = cv2.VideoWriter(output_path, fourcc, fps, original_size)
        if not out.isOpened():
            raise HTTPException(500, "Failed to initialize video writer with H.264 codec")
        
        pests_detected = {}

        while True:
            ret, frame = cap.read()
            if not ret:
                break

            resized_frame = cv2.resize(frame, (640, 640))
            
            results = model(resized_frame)
            

            annotated_resized = results[0].plot()
            
            annotated_frame = cv2.resize(annotated_resized, original_size)
            
            out.write(annotated_frame)

            for box in results[0].boxes:
                pest_name = model.names[int(box.cls)]
                pests_detected[pest_name] = pests_detected.get(pest_name, 0) + 1
                
        result = []    
        for pest, freq in pests_detected.items(): 
            if freq > 20:
                result.append(pest)
                    

        cap.release()
        out.release()

        os.remove(input_path)

        return JSONResponse(content={
            "pestsDetected": list(result),
            "videoUrl": output_filename,
        })

    except Exception as e:
        raise HTTPException(500, f"Video processing failed: {str(e)}")