# 分割数据集
split_dataset NAME TRAIN_RATIO VAL_RATIO: 
    python scripts/split_dataset.py \
        --images "data/images" \
        --labels "data/{{NAME}}_labels" \
        --output "training/datasets/{{NAME}}-{{TRAIN_RATIO}}-{{VAL_RATIO}}" \
        --train-ratio {{TRAIN_RATIO}} \
        --val-ratio {{VAL_RATIO}}

# 训练参数参考 https://docs.ultralytics.com/zh/modes/train/#train-settings

# 目标检测模型训练
detect_train epochs lr:
    cd training && \
    yolo detect train \
        data="detect.yaml" \
        model="yolo11n.pt" \
        epochs={{epochs}} \
        lr0={{lr}} \
        name="train-{{epochs}}-{{lr}}"

# 语义分割模型训练
segment_train epochs lr:
    cd training && \
    yolo segment train \
        data="segment.yaml" \
        model="yolo11n-seg.pt" \
        epochs={{epochs}} \
        lr0={{lr}} \
        name="train-{{epochs}}-{{lr}}"

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
