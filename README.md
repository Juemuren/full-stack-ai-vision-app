# 技术路线

数据标注 X-AnyLabeling

模型 YOLO

```sh
cd training
# 训练
yolo train model=yolo11n.pt data="car.yaml"
# 预测
yolo predict model=yolo11n.pt source="../data/images"
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
