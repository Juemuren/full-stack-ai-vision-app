# 分割数据集
split_dataset NAME TRAIN_RATIO VAL_RATIO: 
    python scripts/split_dataset.py \
        --images "data/images" \
        --labels "data/{{NAME}}_labels" \
        --output "training/datasets/{{NAME}}-{{TRAIN_RATIO}}-{{VAL_RATIO}}" \
        --train-ratio {{TRAIN_RATIO}} \
        --val-ratio {{VAL_RATIO}}