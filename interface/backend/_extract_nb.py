import json
from pathlib import Path

path = Path(r"c:\Users\gaida\OneDrive - SUPCOM\Desktop\p2m\finale\version1-finale.ipynb")
out = Path(__file__).parent
with path.open(encoding="utf-8") as f:
    nb = json.load(f)

patterns = {
    "densenet": "class DenseNet121PadChest",
    "labels": "TARGET_LABELS = [",
    "meta": "def build_metadata_features",
    "preprocess": "def load_and_normalize",
    "export": "torch.jit",
    "config": "'n_meta_features'",
}

for i, cell in enumerate(nb["cells"]):
    src = "".join(cell.get("source", []))
    for name, pat in patterns.items():
        if pat in src and (name != "labels" or "normal" in src):
            (out / f"_extract_{name}.txt").write_text(src, encoding="utf-8")
            print(name, "cell", i)
