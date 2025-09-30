set windows-shell := ["pwsh.exe", "-nop", "-c"]

# 分割数据集
split_dataset dataset_name train_ratio val_ratio: 
    python scripts/split_dataset.py \
        --images "data/{{dataset_name}}/images" \
        --labels "data/{{dataset_name}}/labels" \
        --output "training/datasets/{{dataset_name}}-{{train_ratio}}-{{val_ratio}}" \
        --train-ratio {{train_ratio}} \
        --val-ratio {{val_ratio}}

# 训练参数参考 https://docs.ultralytics.com/zh/modes/train/#train-settings
# 可用的预训练模型参考 https://docs.ultralytics.com/zh/models/

# 模型训练
train data model epochs batch lr:
    cd training && \
    yolo train \
        data="{{data}}.yaml" \
        model="{{model}}.pt" \
        epochs={{epochs}} \
        batch={{batch}} \
        lr0={{lr}} \
        project="runs/{{model}}-{{epochs}}-{{batch}}-{{lr}}" \
        name="train"

# 验证参数参考 https://docs.ultralytics.com/zh/modes/val/#arguments-for-yolo-model-validation

# 模型验证
val data project split:
    cd training && \
    yolo val \
        data="{{data}}.yaml" \
        model="runs/{{project}}/train/weights/best.pt" \
        split={{split}} \
        project="runs/{{project}}" \
        name="val-{{split}}"

# 训练并验证
train_val data model epochs batch lr:
    just train {{data}} {{model}} {{epochs}} {{batch}} {{lr}}
    just val {{data}} {{model}}-{{epochs}}-{{batch}}-{{lr}} test
    just val {{data}} {{model}}-{{epochs}}-{{batch}}-{{lr}} val
    just val {{data}} {{model}}-{{epochs}}-{{batch}}-{{lr}} train


# 训练、验证、记录日志并过滤转义字符
train_val_log data model epochs batch lr:
    script -q -c "just train_val {{data}} {{model}} {{epochs}} {{batch}} {{lr}}" temp.log
    ansifilter -i temp.log -o "training/runs/{{model}}-{{epochs}}-{{batch}}-{{lr}}/train_val.log"
    rm temp.log


# 启动后端开发服务器
backend:
    cd backend && \
    fastapi dev main.py


# 启动前端开发服务器
frontend:
    cd frontend && \
    npm run dev
