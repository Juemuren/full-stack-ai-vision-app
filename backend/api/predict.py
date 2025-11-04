from fastapi import APIRouter, UploadFile, File, Form, HTTPException
from fastapi.responses import Response
import cv2
import json
import os
from services.yolo_service import YOLOService

router = APIRouter()

MODELS_JSON_PATH = os.path.join(os.path.dirname(__file__), "../models.json")


def get_model_path_by_id(model_id):
    with open(MODELS_JSON_PATH, "r", encoding="utf-8") as f:
        data = json.load(f)
    for m in data.get("models", []):
        if m["id"] == model_id:
            return m["path"]
    return None


def get_predict_objects_num(result):
    return len(result.boxes) if result.boxes is not None else 0


def get_predict_detalis(result):
    predict_details = []
    if result.boxes is not None:
        for box in result.boxes:
            class_id = int(box.cls[0])
            class_name = result.names[class_id]
            confidence = float(box.conf[0])
            predict_details.append(
                {"class": class_name, "confidence": round(confidence, 2)}
            )
    return predict_details


def get_predict_image_bytes(result):
    annotated_image = result.plot()
    is_success, buffer = cv2.imencode(".jpg", annotated_image)
    if not is_success:
        raise HTTPException(status_code=500, detail="图片处理失败")
    return buffer.tobytes()


@router.post("/api/predict")
async def predict_image(file: UploadFile = File(...), model: str = Form(...)):
    if not file.content_type or not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="请上传图片文件")
    model_path = get_model_path_by_id(model)
    if not model_path:
        raise HTTPException(status_code=400, detail="模型不存在")
    try:
        image_data = await file.read()
        yolo_service = YOLOService(model_path)
        result = yolo_service.predict(image_data)
        predict_bojects_num = get_predict_objects_num(result)
        predict_details = get_predict_detalis(result)
        predict_image_bytes = get_predict_image_bytes(result)
        return Response(
            content=predict_image_bytes,
            media_type="image/jpeg",
            headers={
                "Content-Disposition": "attachment; filename=result.jpg",
                "X-Predict-Objects-Num": json.dumps(predict_bojects_num),
                "X-Predict-Details": json.dumps(predict_details),
                "Access-Control-Expose-Headers": "X-Predict-Objects-Num, X-Predict-Details",
            },
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"处理失败: {str(e)}")
