from pathlib import Path

from PIL import Image, ImageDraw, ImageFont


ROOT = Path(__file__).resolve().parents[1]
SIZE = 128


ASSETS = [
    ("backgrounds/bg_board.png", "BOARD\nBG", "#9BCB7C", "rounded"),
    ("backgrounds/bg_village.png", "VILLAGE\nBG", "#7FC5A4", "rounded"),
    ("board/board_cell_empty.png", "CELL", "#D7B77A", "square"),
    ("board/board_cell_highlight.png", "MATCH", "#F7D45A", "square"),
    ("truck/truck_idle.png", "TRUCK", "#6DB7E8", "truck"),
    ("crates/crate_cardboard.png", "BOX", "#C98C45", "box"),
    ("crates/crate_wood.png", "WOOD", "#9C6330", "box"),
    ("crates/crate_mystery.png", "MYSTERY", "#A679D2", "box"),
    ("items/item_egg.png", "EGG", "#FFD766", "circle"),
    ("items/item_chick.png", "CHICK", "#FFE36E", "circle"),
    ("items/item_chicken.png", "CHICKEN", "#F6F1DA", "circle"),
    ("items/item_chicken_coop.png", "COOP", "#E8834D", "house"),
    ("buildings/building_chicken_coop.png", "COOP", "#E8834D", "house"),
    ("village/village_empty_lot.png", "LOT", "#B9D58A", "rounded"),
    ("village/village_chicken_coop.png", "COOP", "#E8834D", "house"),
    ("ui/ui_coin.png", "COIN", "#F4C542", "circle"),
    ("ui/ui_truck.png", "TRUCK", "#6DB7E8", "truck"),
    ("ui/ui_settings.png", "SET", "#9DA8B2", "circle"),
    ("ui/ui_village_button.png", "VILLAGE", "#7FC5A4", "rounded"),
    ("ui/ui_cargo_count.png", "CARGO", "#C98C45", "box"),
    ("ui/ui_time.png", "TIME", "#8FB8F2", "circle"),
    ("effects/effect_merge_success_01.png", "MERGE", "#FFE66D", "burst"),
    ("effects/effect_build_fly_01.png", "FLY", "#FF9F5A", "burst"),
    ("effects/effect_coin_fly_01.png", "COIN", "#F4C542", "burst"),
    ("particles/particle_spark.png", "SPARK", "#FFF176", "burst"),
    ("icons/icon_placeholder.png", "ICON", "#8FB8F2", "circle"),
    ("placeholder/placeholder_generic.png", "ASSET", "#B9C2C9", "rounded"),
    ("placeholder/placeholder_missing.png", "MISSING", "#F06B6B", "rounded"),
]


def font(size: int):
    candidates = [
        "/System/Library/Fonts/Supplemental/Arial Bold.ttf",
        "/System/Library/Fonts/Supplemental/Arial.ttf",
        "/Library/Fonts/Arial.ttf",
    ]
    for candidate in candidates:
        try:
            return ImageFont.truetype(candidate, size)
        except OSError:
            pass
    return ImageFont.load_default()


def draw_centered_text(draw: ImageDraw.ImageDraw, text: str) -> None:
    lines = text.split("\n")
    text_font = font(18 if max(len(line) for line in lines) <= 6 else 14)
    line_boxes = [draw.textbbox((0, 0), line, font=text_font) for line in lines]
    line_heights = [box[3] - box[1] for box in line_boxes]
    total_height = sum(line_heights) + (len(lines) - 1) * 4
    y = (SIZE - total_height) / 2
    for line, box, line_height in zip(lines, line_boxes, line_heights):
        width = box[2] - box[0]
        x = (SIZE - width) / 2
        draw.text((x + 1, y + 1), line, fill=(255, 255, 255, 180), font=text_font)
        draw.text((x, y), line, fill=(55, 61, 70, 255), font=text_font)
        y += line_height + 4


def draw_shape(draw: ImageDraw.ImageDraw, style: str, fill: str) -> None:
    outline = "#35424A"
    shadow = (0, 0, 0, 46)

    if style == "circle":
        draw.ellipse((26, 30, 104, 108), fill=shadow)
        draw.ellipse((22, 22, 102, 102), fill=fill, outline=outline, width=4)
        draw.arc((34, 32, 84, 76), 200, 320, fill=(255, 255, 255, 110), width=4)
    elif style == "square":
        draw.rounded_rectangle((24, 28, 108, 112), radius=12, fill=shadow)
        draw.rounded_rectangle((20, 20, 104, 104), radius=10, fill=fill, outline=outline, width=4)
        draw.line((24, 50, 100, 50), fill=(255, 255, 255, 75), width=3)
        draw.line((50, 24, 50, 100), fill=(255, 255, 255, 55), width=3)
    elif style == "box":
        draw.rounded_rectangle((26, 34, 108, 110), radius=8, fill=shadow)
        draw.rounded_rectangle((20, 28, 102, 102), radius=8, fill=fill, outline=outline, width=4)
        draw.line((20, 54, 102, 54), fill=outline, width=3)
        draw.line((61, 28, 61, 102), fill=(255, 255, 255, 70), width=3)
    elif style == "truck":
        draw.rounded_rectangle((22, 52, 104, 94), radius=9, fill=shadow)
        draw.rounded_rectangle((18, 42, 78, 82), radius=8, fill=fill, outline=outline, width=4)
        draw.rounded_rectangle((76, 52, 106, 82), radius=6, fill="#A6D8F6", outline=outline, width=4)
        draw.ellipse((28, 76, 46, 94), fill=outline)
        draw.ellipse((80, 76, 98, 94), fill=outline)
    elif style == "house":
        draw.polygon([(64, 22), (22, 58), (106, 58)], fill=shadow)
        draw.polygon([(64, 16), (18, 58), (110, 58)], fill="#B74C3F", outline=outline)
        draw.rounded_rectangle((28, 52, 100, 106), radius=8, fill=fill, outline=outline, width=4)
        draw.rectangle((55, 78, 73, 106), fill="#7E4D2E", outline=outline, width=3)
    elif style == "burst":
        points = [
            (64, 14), (75, 45), (108, 32), (86, 60), (116, 72), (82, 78),
            (94, 112), (64, 90), (34, 112), (46, 78), (12, 72), (42, 60),
            (20, 32), (53, 45),
        ]
        offset_points = [(x + 3, y + 5) for x, y in points]
        draw.polygon(offset_points, fill=shadow)
        draw.polygon(points, fill=fill, outline=outline)
        draw.line(points + [points[0]], fill=outline, width=4)
    else:
        draw.rounded_rectangle((24, 30, 108, 112), radius=18, fill=shadow)
        draw.rounded_rectangle((18, 20, 104, 104), radius=18, fill=fill, outline=outline, width=4)
        draw.arc((30, 30, 88, 78), 200, 320, fill=(255, 255, 255, 110), width=4)


def make_asset(relative_path: str, label: str, fill: str, style: str) -> None:
    image = Image.new("RGBA", (SIZE, SIZE), (0, 0, 0, 0))
    draw = ImageDraw.Draw(image)
    draw_shape(draw, style, fill)
    draw_centered_text(draw, label)

    target = ROOT / "assets" / relative_path
    target.parent.mkdir(parents=True, exist_ok=True)
    image.save(target, "PNG")


def main() -> None:
    for relative_path, label, fill, style in ASSETS:
        make_asset(relative_path, label, fill, style)


if __name__ == "__main__":
    main()
