# 全栈图像识别应用

一个完整的 AI 图像识别应用，从数据标注到模型训练，再到后端和前端的搭建。由于原始数据和训练过程中产生文件占用了很大的存储空间，因此没有包含在这个仓库里

目前应用暂时无法部署到互联网上，只能下载仓库后在本地使用。请参考[后端](#后端)和[前端](#前端)两个章节了解如何启动开发服务器

- [全栈图像识别应用](#全栈图像识别应用)
  - [数据准备](#数据准备)
    - [数据标注](#数据标注)
    - [分割数据集](#分割数据集)
    - [数据集配置](#数据集配置)
  - [模型训练](#模型训练)
    - [YOLO CLI](#yolo-cli)
    - [Just](#just)
    - [Jupyter](#jupyter)
  - [后端](#后端)
  - [前端](#前端)

## 数据准备

### 数据标注

数据标注我使用了 `X-AnyLabeling`，当然你可以使用别的标注工具，只要能导出为 YOLO 使用的格式即可

### 分割数据集

标注完成后可以使用以下脚本分割数据集

```sh
python scripts/split_dataset.py --images "path/to/images" --labels "path/to/labels" --output "path/to/output" --train-ratio 0.7 --val-ratio 0.1
```

我用 `just` 将该命令包装成了更易用的形式，不过使用该方法要求安装了 `just`，且原始图片和标签应按如下方式存放

```txt
data
└── dataset_name
    ├── images
    └── labels
```

准备好后运行如下命令即可

```sh
just spsplit_dataset dataset_name 0.7 0.1
```

### 数据集配置

在正式开始训练之前，还需要一些东西

在 `training` 目录下新建一个 `data.yaml` 文件夹，填写如下信息

```yaml
# 更多内容请参考 https://docs.ultralytics.com/zh/datasets/
# 替换为你的数据集的名称和分割比例
path: dataset_name-0.7-0.1

train: images/train
val: images/val
test: images/test

# 替换为你的数据集的物体种类名
names:
  0: person
  1: bicycle
  # 后面省略
```

## 模型训练

请确保激活了正确的环境，并且安装了 YOLO

### YOLO CLI

YOLO CLI 提供了丰富的参数可以设置，基本上涵盖了所有的需求，很少有需要写代码的情况

```sh
cd training
# 更详细的设置可参考 https://docs.ultralytics.com/zh/modes
# 训练
yolo train data="path/to/data.yaml" model=yolo11n.pt epochs=10 batch=4 lr0=0.01
# 验证
yolo val model="path/to/best.pt" split=test
```

### Just

同样地，这些命令我用 `just` 包装了一下。如果想要使用 `just`，请在根目录运行

```sh
# 训练
just train coco8 yolo11n 10 4 0.01
# 验证
just val coco8 yolo11n-10-4-0.01 test
```

当然，还能更方便一点，一行命令完成训练和在所有数据集上分别验证

```sh
just tran_val coco8 yolo11n 10 4 0.01
```

如果需要记录日志，可以使用 `script` 和 `ansifilter`。前者记录日志（同时终端也能看到输出），后者处理 *ANSI* 转义字符

```sh
script -q -c "just tran_val coco8 yolo11n 10 4 0.01" output.log
ansifilter -i output.log -o output_filtered.log
```

两者都在 *Windows* 平台可用，建议通过 `MSYS` 来获取这两个工具

最后我又包装了这些命令。这个应该就是终极命令了，一行命令完成所有任务

- 模型训练
- 在所有数据集上分别验证模型
- 记录日志并处理 *ANSI* 转义字符

命令示例如下

```sh
just train_val_log coco8 yolo11n 10 4 0.01
```

### Jupyter

如果 YOLO CLI 满足不了你的非常特殊的需求，那么你可能需要使用 YOLO 的 Python 接口

不过我不推荐直接写 .py 脚本。使用 `Jupyter` 可能更好，这在科学计算、机器学习中非常流行

先在训练环境里 `pip install ipykernel`，再安装 `VSCode` 的 `Jupyter` 拓展，最后新建一个 `.ipynb` 格式的文件并选择正确的内核就可以开始编写代码了

`.ipynb` 文件中代码被分成了一个个单元格，点击运行后单元格里的代码会被发给 ipython 内核去执行。该内核会记住程序的状态，不需要重新启动解释器。这对于机器学习此类需要反复试验参数的场景帮助很大，可以节省很多时间

## 后端

后端使用 **FastAPI** 进行开发，并且直接使用 **YOLO** 进行模型推理

请确保安装了 `python`，并按照以下步骤启动后端开发服务器。我建议为后端新建一个环境。虽然我为了方便，后端环境和训练环境是一样的，并且还没有遇到过问题，但这总归是不太好的实践

```sh
cd backend
# 安装依赖
pip install -r requirements.txt
# 启动后端开发服务器
fastapi dev main.py
```

如果需要更改模型，可以修改 `backend/models.json` 文件。*path* 的值应为模型文件的相对路径，*id* 不能有重复，*name* 和 *description* 只在用户界面中使用，对后端没有影响

可以把模型复制到 `backend/models` 文件夹中。这样如果模型要更新，就不用反复更改 *path* 的值，只需覆盖原本的模型文件即可

## 前端

前端使用 **React** + **Vite** 进行开发

请确保安装了 `nodejs`，并按照以下步骤启动前端开发服务器

```sh
cd frontend
# 安装依赖
npm install
# 启动前端开发服务器
npm run dev
```

如果更改了 `backend/models.json` 文件，则需要刷新浏览器页面才能将更改同步到前端
