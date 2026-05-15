from __future__ import annotations

from collections import deque
from pathlib import Path

from PIL import Image


ROOT = Path(__file__).resolve().parents[1]
ASSET_ROOT = ROOT / "artifacts/inspire-web/src/assets/inspire-guide-character"
OUTPUT_DIR = ASSET_ROOT / "cleaned"

SOURCES = {
    "rig-overview-transparent.png": ASSET_ROOT / "reference/rig-overview.jpg",
    "guide-bar-variants-transparent.png": ASSET_ROOT / "motion/guide-bar-variants.jpg",
    "body-keyframes-transparent.png": ASSET_ROOT / "motion/body-keyframes.jpg",
}


def is_background_like(pixel: tuple[int, int, int, int]) -> bool:
    r, g, b, _ = pixel
    brightest = max(r, g, b)
    darkest = min(r, g, b)
    return brightest >= 218 and (brightest - darkest) <= 28


def remove_connected_light_background(source: Path, target: Path) -> None:
    image = Image.open(source).convert("RGBA")
    pixels = image.load()
    width, height = image.size
    visited: set[tuple[int, int]] = set()
    queue: deque[tuple[int, int]] = deque()

    for x in range(width):
        queue.append((x, 0))
        queue.append((x, height - 1))
    for y in range(height):
        queue.append((0, y))
        queue.append((width - 1, y))

    while queue:
        x, y = queue.popleft()
        if (x, y) in visited:
            continue
        visited.add((x, y))

        if not is_background_like(pixels[x, y]):
            continue

        r, g, b, _ = pixels[x, y]
        pixels[x, y] = (r, g, b, 0)

        if x > 0:
            queue.append((x - 1, y))
        if x < width - 1:
            queue.append((x + 1, y))
        if y > 0:
            queue.append((x, y - 1))
        if y < height - 1:
            queue.append((x, y + 1))

    image.save(target)


def main() -> None:
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    for output_name, source in SOURCES.items():
        remove_connected_light_background(source, OUTPUT_DIR / output_name)


if __name__ == "__main__":
    main()
