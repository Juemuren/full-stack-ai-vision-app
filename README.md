# 技术路线

数据标注 X-AnyLabeling

```sh
# 分割数据集
just split_dataset detect 0.7 0.2
```

模型 YOLO

```sh
cd training
# 训练
just detect_train yolo11n.pt 10 0.01
# 验证
just detect_val train-yolo11n.pt-10-0.01 test
# 预测
just detect_predict train-yolo11n.pt-10-0.01 ../data/images
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
