"""DenseNet121PadChest — matches training notebooks (n_meta=6)."""

from __future__ import annotations

import torch
import torch.nn as nn

try:
    import timm
except ImportError:
    timm = None


def make_meta_branch(n_meta=6):
    return nn.Sequential(
        nn.Linear(n_meta, 64),
        nn.BatchNorm1d(64),
        nn.ReLU(inplace=True),
        nn.Dropout(0.3),
        nn.Linear(64, 32),
        nn.ReLU(inplace=True),
    )


class DenseNet121PadChest(nn.Module):
    def __init__(self, n_classes=14, n_meta=6, pretrained=False, dropout=0.4):
        super().__init__()
        if timm is None:
            raise ImportError("pip install timm")

        self.backbone = timm.create_model(
            "densenet121", pretrained=pretrained, num_classes=0, global_pool="avg"
        )
        feat_dim = self.backbone.num_features
        self.meta_branch = make_meta_branch(n_meta)
        self.classifier = nn.Sequential(
            nn.Dropout(dropout),
            nn.Linear(feat_dim + 32, 512),
            nn.BatchNorm1d(512),
            nn.ReLU(inplace=True),
            nn.Dropout(dropout * 0.75),
            nn.Linear(512, n_classes),
        )
        self._init_weights()

    def _init_weights(self):
        for m in [self.meta_branch, self.classifier]:
            for layer in m.modules():
                if isinstance(layer, nn.Linear):
                    nn.init.kaiming_normal_(layer.weight)
                    nn.init.zeros_(layer.bias)

    def forward(self, image, metadata):
        return self.classifier(
            torch.cat([self.backbone(image), self.meta_branch(metadata)], dim=1)
        )

    def freeze_backbone(self):
        for p in self.backbone.parameters():
            p.requires_grad = False

    def unfreeze_backbone(self):
        for p in self.backbone.parameters():
            p.requires_grad = True
