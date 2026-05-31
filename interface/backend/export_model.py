"""
Export trained checkpoint to TorchScript for the API.

Usage:
  python export_model.py path/to/best_model.pth
  python export_model.py path/to/best_model.pth --output model.pt
"""

import argparse
from model_loader import export_torchscript


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("checkpoint", help="Path to .pth state_dict or checkpoint")
    parser.add_argument("--output", default=None, help="Output .pt path (default: backend/model.pt)")
    args = parser.parse_args()
    export_torchscript(args.checkpoint, args.output)


if __name__ == "__main__":
    main()
