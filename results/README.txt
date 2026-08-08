This folder contains the restored test outputs produced by SemiRestoreNet on the official test set.

Place your restored PNG images here after running:

    python scripts/evaluate.py \
        --ckpt checkpoints/best.pt \
        --test-dir ./data/test_in_distribution/degraded \
        --out-dir ./results

Each file in this folder corresponds to a restored version of the degraded input image.
Filenames match the input filenames from the test set (e.g., image_001.png → image_001.png).
