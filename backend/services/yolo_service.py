from ultralytics import YOLO
from PIL import Image
import io

class YOLOService:
    def __init__(self, model_path):
        self.model = YOLO(model_path)

    def predict(self, image_bytes):
        image = Image.open(io.BytesIO(image_bytes))
        results = self.model(image)
        result = results[0]
        return result
