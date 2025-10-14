import argparse
import shutil
import random
from pathlib import Path
from rich.console import Console


def split_dataset(
    images_path, labels_path, output_root, train_ratio=0.7, val_ratio=0.2, seed=42
):
    """
    分割数据集

    Args:
        images_path: 原始图片目录
        labels_path: 原始标签目录
        output_root: 输出根目录
        train_ratio: 训练集比例
        val_ratio: 验证集比例
        seed: 随机数种子
    """

    console = Console()

    # 验证比例总和正确
    total_ratio = train_ratio + val_ratio
    if total_ratio > 1.0:
        raise ValueError(f"验证集和训练集比例之和不能大于 1.0，当前为 {total_ratio}")

    # 设置路径
    image_dir = Path(images_path)
    label_dir = Path(labels_path)

    # 输出目录
    train_image_dir = Path(output_root) / "images/train"
    train_label_dir = Path(output_root) / "labels/train"
    val_image_dir = Path(output_root) / "images/val"
    val_label_dir = Path(output_root) / "labels/val"
    test_image_dir = Path(output_root) / "images/test"
    test_label_dir = Path(output_root) / "labels/test"

    # 创建输出目录
    for dir_path in [
        train_image_dir,
        train_label_dir,
        val_image_dir,
        val_label_dir,
        test_image_dir,
        test_label_dir,
    ]:
        dir_path.mkdir(parents=True, exist_ok=True)

    # 获取所有图片文件（不包括子目录）
    image_files = [f for f in image_dir.iterdir() if f.is_file()]

    # 根据图片文件名匹配标签
    data_pairs = []
    for image_path in image_files:
        # 标签文件与图片同名，扩展名为 .txt
        label_name = image_path.stem + ".txt"
        label_path = label_dir / label_name

        if label_path.exists():
            data_pairs.append((image_path, label_path))
        else:
            console.print(f"警告: 找不到标签文件 {label_path}", style="bold yellow")

    console.print(f"找到 {len(data_pairs)} 个有效的图片-标签对")

    # 随机打乱并分割
    random.seed(seed)
    random.shuffle(data_pairs)

    n_total = len(data_pairs)
    n_train = int(n_total * train_ratio)
    n_val = int(n_total * val_ratio)

    train_pairs = data_pairs[:n_train]
    val_pairs = data_pairs[n_train : n_train + n_val]
    test_pairs = data_pairs[n_train + n_val :]

    console.print(f"训练集: {len(train_pairs)} 个样本")
    console.print(f"验证集: {len(val_pairs)} 个样本")
    console.print(f"测试集: {len(test_pairs)} 个样本")

    # 复制文件
    def copy_files(pairs, img_dir, lbl_dir):
        for img_path, label_path in pairs:
            shutil.copy2(img_path, img_dir / img_path.name)
            shutil.copy2(label_path, lbl_dir / label_path.name)

    copy_files(train_pairs, train_image_dir, train_label_dir)
    copy_files(val_pairs, val_image_dir, val_label_dir)
    copy_files(test_pairs, test_image_dir, test_label_dir)

    console.print("数据集分割完成！", style="bold green")


def main():
    parser = argparse.ArgumentParser(description="分割数据集为训练集、验证集和测试集")

    parser.add_argument("--images", required=True, help="原始图片目录路径")
    parser.add_argument("--labels", required=True, help="原始标签目录路径")
    parser.add_argument("--output", required=True, help="输出根目录路径")
    parser.add_argument(
        "--train-ratio", type=float, default=0.7, help="训练集比例 (默认: 0.7)"
    )
    parser.add_argument(
        "--val-ratio", type=float, default=0.2, help="验证集比例 (默认: 0.2)"
    )
    parser.add_argument("--seed", type=int, default=42, help="随机数种子 (默认: 42)")

    args = parser.parse_args()

    split_dataset(
        images_path=args.images,
        labels_path=args.labels,
        output_root=args.output,
        train_ratio=args.train_ratio,
        val_ratio=args.val_ratio,
        seed=args.seed,
    )


if __name__ == "__main__":
    main()
