# 分割数据集
split_dataset NAME TRAIN_RATIO VAL_RATIO: 
    python scripts/split_dataset.py \
        --images "data/images" \
        --labels "data/{{NAME}}_labels" \
        --output "training/datasets/{{NAME}}-{{TRAIN_RATIO}}-{{VAL_RATIO}}" \
        --train-ratio {{TRAIN_RATIO}} \
        --val-ratio {{VAL_RATIO}}

# 训练参数参考 https://docs.ultralytics.com/zh/modes/train/#train-settings
# 可用的预训练模型参考 https://docs.ultralytics.com/zh/models/

# 目标检测模型训练
detect_train model epochs lr:
    cd training && \
    yolo detect train \
        data="detect.yaml" \
        model={{model}} \
        epochs={{epochs}} \
        lr0={{lr}} \
        name="train-{{model}}-{{epochs}}-{{lr}}"

# 语义分割模型训练
segment_train model epochs lr:
    cd training && \
    yolo segment train \
        data="segment.yaml" \
        model={{model}} \
        epochs={{epochs}} \
        lr0={{lr}} \
        name="train-{{model}}-{{epochs}}-{{lr}}"

# 验证参数参考 https://docs.ultralytics.com/zh/modes/val/#arguments-for-yolo-model-validation

# 目标检测模型验证
detect_val model split:
    cd training && \
    yolo detect val \
        data="detect.yaml" \
        model="runs/detect/{{model}}/weights/best.pt" \
        split={{split}} \
        name="val-{{model}}-{{split}}"

# 语义分割模型验证
segment_val model split:
    cd training && \
    yolo segment val \
        data="segment.yaml" \
        model="runs/segment/{{model}}/weights/best.pt" \
        split={{split}} \
        name="val-{{model}}-{{split}}"

# 预测参数参考 https://docs.ultralytics.com/zh/modes/predict/#inference-arguments

# 目标检测模型预测
detect_predict model source:
    cd training && \
    yolo detect predict \
        model="runs/detect/{{model}}/weights/best.pt" \
        source={{source}} \
        name="predict-{{model}}"

# 语义分割模型预测
segment_predict model source:
    cd training && \
    yolo segment predict \
        model="runs/segment/{{model}}/weights/best.pt" \
        source={{source}} \
        name="predict-{{model}}"

# 启动后端开发服务器
fastapi_dev:
    cd backend && \
    fastapi dev main.py


# 启动前端开发服务器
react_dev:
    cd frontend && \
    npm run dev
