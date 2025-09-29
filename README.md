# 技术路线

数据标注 X-AnyLabeling

```sh
# 分割数据集
python scripts/split_dataset.py --images "path/to/images" --labels "path/to/labels" --output "path/to/output" --train-ratio 0.7 --val-ratio 0.1
# 或者使用 just，对图片和标签的摆放位置有要求，具体可以看 Justfile
just split_dataset dataset_name 0.7 0.1
```

模型 YOLO

```sh
# 确保激活了训练环境，并正确安装了 YOLO
cd training

# 训练
yolo detect train data="detect.yaml" model=yolo11n.pt epochs=10 lr0=0.01
# 或者使用 just
just detect_train yolo11n.pt 10 0.01

# 验证
yolo detect val data="detect.yaml" model="path/to/best.pt" split=test
# 或者使用 just
just detect_val model_name test

# 预测
yolo detect predict model="path/to/best.pt" source="../data/images"
# 或者使用 just
just detect_predict model_name ../data/images
```

前端 React + Vite

```sh
cd frontend
npm install
npm run dev
```

后端 FastAPI

```sh
cd backend
pip install -r requirements.txt
fastapi dev main.py
```
