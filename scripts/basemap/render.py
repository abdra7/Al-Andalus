"""Render a self-hosted, parchment-style relief basemap for the Al-Andalus atlas.

Sources (both public domain / open):
  * Natural Earth 1:10m vectors (land, lakes, rivers) — public domain, naturalearthdata.com
  * NASA Blue Marble Shaded Relief + Bathymetry tiles (via @freetiler/nasa-bluemarble) —
    NASA imagery, public domain under NASA's open data policy. Used only as a relief source.

Output: XYZ tiles (EPSG:3857, 256px, WebP) at OUT/{z}/{x}/{y}.webp

Inputs (not committed — fetch them once):
  NE_DIR: GeoJSON from https://github.com/nvkelso/natural-earth-vector/tree/master/geojson
          (ne_10m_land, ne_10m_lakes, ne_10m_rivers_lake_centerlines, ne_10m_rivers_europe)
  BM_DIR: `npm pack @freetiler/nasa-bluemarble` → package/tiles/{z}/{x}/{y}.jpeg (z0–7)

Usage:
  pip install numpy scipy shapely pillow
  NE_DIR=… BM_DIR=… python3 scripts/basemap/render.py public/tiles 5 6 7 8
Then update src/data/basemap-manifest.json if the tile ranges change
(MAX_BOUNDS below must match MAX_BOUNDS in src/components/MapView.tsx).
"""
import json
import math
import os
import sys
from functools import lru_cache

import numpy as np
from PIL import Image, ImageDraw, ImageFilter
from scipy import ndimage
from shapely.geometry import box, shape, mapping
from shapely.ops import unary_union

NE = os.environ.get("NE_DIR", "data/natural-earth")
BM = os.environ.get("BM_DIR", "data/bluemarble/package/tiles")
TS = 256
PAD = 48  # px of context around each tile so blurs/distances are seamless
SS = 3  # supersampling for vector rasterisation

# Map view constraints (keep in sync with MapView.tsx)
MAX_BOUNDS = (-13.0, 33.0, 7.0, 46.0)  # lon_min, lat_min, lon_max, lat_max
VIEW_W, VIEW_H = 2200, 1400  # generous desktop map viewport, px

# palette (sRGB)
LAND = np.array([236, 223, 190], dtype=np.float32)
LAND_HIGH = np.array([219, 200, 156], dtype=np.float32)
RELIEF_DARK = np.array([132, 104, 68], dtype=np.float32)
SEA_DEEP = np.array([142, 166, 176], dtype=np.float32)
SEA_SHELF = np.array([171, 191, 194], dtype=np.float32)
SEA_COAST = np.array([204, 214, 205], dtype=np.float32)
COAST = (92, 74, 54)
KEY_RIVERS = {"Guadalquivir", "Tajo", "Tejo", "Ebro", "Duero", "Douro", "Guadiana", "Segura", "Júcar", "Genil", "Miño", "Minho", "Mio", "Mondego", "Zncara", "Záncara"}
RIVER = (104, 135, 150)
LAKE = (170, 192, 196)


# ---------- projection ----------

def lonlat_to_px(lon, lat, z):
    n = TS * (2 ** z)
    x = (lon + 180.0) / 360.0 * n
    lat = max(min(lat, 85.0511), -85.0511)
    s = math.sin(math.radians(lat))
    y = (0.5 - math.log((1 + s) / (1 - s)) / (4 * math.pi)) * n
    return x, y


def px_to_lonlat(x, y, z):
    n = TS * (2 ** z)
    lon = x / n * 360.0 - 180.0
    lat = math.degrees(math.atan(math.sinh(math.pi * (1 - 2 * y / n))))
    return lon, lat


# ---------- data ----------

REGION = box(-80, -5, 70, 75)


def load(name, simplify=0.0):
    d = json.load(open(os.path.join(NE, name + ".geojson")))
    out = []
    for f in d["features"]:
        g = shape(f["geometry"])
        if not g.is_valid:
            g = g.buffer(0)
        if g.intersects(REGION):
            g = g.intersection(REGION)
            if simplify:
                g = g.simplify(simplify, preserve_topology=True)
            out.append((g, f["properties"]))
    return out


print("loading vectors…", flush=True)
LAND_G = unary_union([g for g, _ in load("ne_10m_land")])
LAKES = [(g, p) for g, p in load("ne_10m_lakes") if (p.get("scalerank") or 0) <= 9]
RIVERS = [(g, p) for g, p in load("ne_10m_rivers_lake_centerlines") + load("ne_10m_rivers_europe")
          if p.get("featurecla", "").startswith("River") or p.get("featurecla") == "Lake Centerline"]
print(f"  land ok, {len(LAKES)} lakes, {len(RIVERS)} rivers", flush=True)


def polys(g):
    if g.is_empty:
        return []
    if g.geom_type == "Polygon":
        return [g]
    if g.geom_type in ("MultiPolygon", "GeometryCollection"):
        return [p for p in g.geoms if p.geom_type == "Polygon"]
    return []


def lines(g):
    if g.is_empty:
        return []
    if g.geom_type == "LineString":
        return [g]
    if g.geom_type in ("MultiLineString", "GeometryCollection"):
        return [l for l in g.geoms if l.geom_type == "LineString"]
    return []


# ---------- raster helpers ----------

def tile_extent_lonlat(z, x0, y0, w, h):
    lon0, lat0 = px_to_lonlat(x0, y0, z)
    lon1, lat1 = px_to_lonlat(x0 + w, y0 + h, z)
    return box(lon0, lat1, lon1, lat0)


def proj_coords(coords, z, x0, y0, s):
    out = []
    for lon, lat in coords:
        px, py = lonlat_to_px(lon, lat, z)
        out.append(((px - x0) * s, (py - y0) * s))
    return out


def raster_mask(geoms, z, x0, y0, w, h):
    """Antialiased coverage mask (0..1) of polygons over a pixel window."""
    img = Image.new("L", (w * SS, h * SS), 0)
    dr = ImageDraw.Draw(img)
    for poly in geoms:
        dr.polygon(proj_coords(poly.exterior.coords, z, x0, y0, SS), fill=255)
        for ring in poly.interiors:
            dr.polygon(proj_coords(ring.coords, z, x0, y0, SS), fill=0)
    img = img.resize((w, h), Image.Resampling.BOX)
    return np.asarray(img, dtype=np.float32) / 255.0


@lru_cache(maxsize=4096)
def bm_tile(z, x, y):
    zz = min(z, 7)
    n = 2 ** z
    x %= n
    if y < 0 or y >= n:
        return np.zeros((TS, TS, 3), np.float32)
    if zz == z:
        p = os.path.join(BM, str(z), str(x), f"{y}.jpeg")
        if not os.path.exists(p):
            return np.zeros((TS, TS, 3), np.float32)
        return np.asarray(Image.open(p).convert("RGB"), dtype=np.float32)
    # upsample from z7 for deeper zooms
    f = 2 ** (z - zz)
    px, py = x // f, y // f
    src = bm_tile(zz, px, py)
    sx, sy = (x % f) * TS // f, (y % f) * TS // f
    crop = Image.fromarray(src.astype(np.uint8)).crop((sx, sy, sx + TS // f, sy + TS // f))
    return np.asarray(crop.resize((TS, TS), Image.Resampling.BICUBIC), dtype=np.float32)


def bm_window(z, x0, y0, w, h):
    tx0, ty0 = x0 // TS, y0 // TS
    tx1, ty1 = (x0 + w - 1) // TS, (y0 + h - 1) // TS
    mos = np.zeros(((ty1 - ty0 + 1) * TS, (tx1 - tx0 + 1) * TS, 3), np.float32)
    for ty in range(ty0, ty1 + 1):
        for tx in range(tx0, tx1 + 1):
            mos[(ty - ty0) * TS:(ty - ty0 + 1) * TS, (tx - tx0) * TS:(tx - tx0 + 1) * TS] = bm_tile(z, tx, ty)
    ox, oy = x0 - tx0 * TS, y0 - ty0 * TS
    return mos[oy:oy + h, ox:ox + w]


def hash_noise(xs, ys, cell, seed):
    """Seamless value noise in global pixel space."""
    gx, gy = xs / cell, ys / cell
    ix, iy = np.floor(gx).astype(np.int64), np.floor(gy).astype(np.int64)
    fx, fy = gx - ix, gy - iy

    def h(a, b):
        v = (a * 374761393 + b * 668265263 + seed * 2147483647) & 0xFFFFFFFF
        v = (v ^ (v >> 13)) * 1274126177 & 0xFFFFFFFF
        return ((v ^ (v >> 16)) & 0xFFFF) / 65535.0

    fx = fx * fx * (3 - 2 * fx)
    fy = fy * fy * (3 - 2 * fy)
    a, b, c, d = h(ix, iy), h(ix + 1, iy), h(ix, iy + 1), h(ix + 1, iy + 1)
    return (a * (1 - fx) + b * fx) * (1 - fy) + (c * (1 - fx) + d * fx) * fy


def paper(z, x0, y0, w, h):
    # noise is defined in *world* units so it stays put across zooms
    ys, xs = np.mgrid[y0:y0 + h, x0:x0 + w].astype(np.float64)
    n = 0.5 * hash_noise(xs, ys, 3.0, 1) + 0.3 * hash_noise(xs, ys, 11.0, 2) + 0.2 * hash_noise(xs, ys, 47.0, 3)
    return (n - 0.5).astype(np.float32)


# ---------- tile renderer ----------

def render_tile(z, tx, ty):
    x0, y0 = tx * TS - PAD, ty * TS - PAD
    W = H = TS + 2 * PAD
    ext = tile_extent_lonlat(z, x0, y0, W, H).buffer(0.05)

    land_here = polys(LAND_G.intersection(ext))
    lake_here = [p for g, _ in LAKES if g.intersects(ext) for p in polys(g.intersection(ext))]
    land = raster_mask(land_here, z, x0, y0, W, H)
    lake = raster_mask(lake_here, z, x0, y0, W, H) if lake_here else np.zeros_like(land)
    land = np.clip(land - lake, 0, 1)

    bm = bm_window(z, x0, y0, W, H)
    lum = (0.299 * bm[..., 0] + 0.587 * bm[..., 1] + 0.114 * bm[..., 2]) / 255.0

    # --- land: flat parchment + extracted relief (high-pass of the shaded relief) ---
    s1 = 5.0 + 0.6 * (8 - z)
    hp = lum - ndimage.gaussian_filter(lum, sigma=s1)
    hp = ndimage.gaussian_filter(hp, 1.1)
    rough = ndimage.gaussian_filter(np.abs(hp), s1 * 1.6)
    rough = np.clip((rough - 0.007) / 0.03, 0, 1) ** 1.2  # mountains -> 1, plains -> 0
    shade = np.clip(hp * 4.8, -0.65, 0.45) * (0.3 + 0.7 * rough)
    base = LAND[None, None] * (1 - rough[..., None]) + LAND_HIGH[None, None] * rough[..., None]
    dark = np.clip(-shade, 0, 1)[..., None]
    light = np.clip(shade, 0, 1)[..., None]
    land_rgb = base * (1 - 0.95 * dark) + RELIEF_DARK * 0.95 * dark
    land_rgb = land_rgb * (1 - 0.6 * light) + np.array([250, 244, 226], np.float32) * 0.6 * light

    # --- water: depth tint from bathymetry + coastal halo + engraved ripple lines ---
    sea_bin = (land < 0.5)
    dist = ndimage.distance_transform_edt(sea_bin).astype(np.float32)  # px to nearest land
    depth = ndimage.gaussian_filter(lum, 9)  # bathymetry: brighter = shallower
    shelf = np.clip((depth - 0.14) / 0.3, 0, 1) * 0.55
    off = np.clip(dist / (40 + 10 * (z - 5)), 0, 1) ** 0.8
    w_shelf = np.clip(shelf + (1 - off) * 0.45, 0, 1)
    sea_rgb = SEA_DEEP[None, None] * (1 - w_shelf[..., None]) + SEA_SHELF[None, None] * w_shelf[..., None]
    halo = np.exp(-dist / (6 + 1.5 * (z - 5)))
    sea_rgb = sea_rgb * (1 - halo[..., None]) + SEA_COAST[None, None] * halo[..., None]
    spacing = 4.0 + 0.5 * (z - 5)
    rip = np.zeros_like(dist)
    for k in (1, 2, 3):
        rip += np.exp(-((dist - k * spacing) ** 2) / 0.9) * (0.55 / k)
    rip *= (dist < 3.6 * spacing)
    sea_rgb = sea_rgb * (1 - 0.3 * rip[..., None]) + np.array(COAST, np.float32) * 0.3 * rip[..., None]
    lake_rgb = np.array(LAKE, np.float32)[None, None] * np.ones_like(sea_rgb)
    water_rgb = np.where(lake[..., None] > 0.5, lake_rgb, sea_rgb)

    rgb = land_rgb * land[..., None] + water_rgb * (1 - land[..., None])

    # --- paper grain over everything ---
    g = paper(z, x0, y0, W, H)
    rgb = rgb * (1 + 0.06 * g[..., None])

    img = Image.fromarray(np.clip(rgb, 0, 255).astype(np.uint8), "RGB")

    # --- vector strokes (supersampled) ---
    ov = Image.new("RGBA", (W * SS, H * SS), (0, 0, 0, 0))
    dr = ImageDraw.Draw(ov)
    rw = {5: 0.9, 6: 1.1, 7: 1.4, 8: 1.7}[min(z, 8)]
    for g_, p in RIVERS:
        sr = p.get("scalerank") or 10
        key = (p.get("name") or "") in KEY_RIVERS
        if sr > {5: 6, 6: 7, 7: 8, 8: 9}[min(z, 8)] and not key:
            continue
        if not g_.intersects(ext):
            continue
        width = max(1, int(round(SS * rw * (1.25 if sr <= 6 else 1.0))))
        for ln in lines(g_.intersection(ext)):
            dr.line(proj_coords(ln.coords, z, x0, y0, SS), fill=RIVER + (230,), width=width, joint="curve")
    cw = max(1, int(round(SS * (0.9 + 0.2 * (z - 5)))))
    for poly in land_here:
        for ring in [poly.exterior, *poly.interiors]:
            dr.line(proj_coords(ring.coords, z, x0, y0, SS), fill=COAST + (235,), width=cw, joint="curve")
    for poly in lake_here:
        dr.line(proj_coords(poly.exterior.coords, z, x0, y0, SS), fill=RIVER + (200,), width=max(1, cw - 1))
    ov = ov.resize((W, H), Image.Resampling.LANCZOS)
    img = Image.alpha_composite(img.convert("RGBA"), ov).convert("RGB")

    return img.crop((PAD, PAD, PAD + TS, PAD + TS))


def tiles_for_zoom(z):
    lon0, lat0, lon1, lat1 = MAX_BOUNDS
    ax, ay = lonlat_to_px(lon0, lat1, z)
    bx, by = lonlat_to_px(lon1, lat0, z)
    ax -= VIEW_W / 2
    bx += VIEW_W / 2
    ay -= VIEW_H / 2
    by += VIEW_H / 2
    n = 2 ** z
    for tx in range(max(0, int(ax // TS)), min(n - 1, int(bx // TS)) + 1):
        for ty in range(max(0, int(ay // TS)), min(n - 1, int(by // TS)) + 1):
            yield tx, ty


if __name__ == "__main__":
    out = sys.argv[1]
    zooms = [int(a) for a in sys.argv[2:]] or [5, 6, 7, 8]
    only = os.environ.get("ONLY")  # "z/x/y,z/x/y" for previews
    for z in zooms:
        todo = list(tiles_for_zoom(z))
        if only:
            todo = [(int(s.split("/")[1]), int(s.split("/")[2])) for s in only.split(",") if int(s.split("/")[0]) == z]
        print(f"z{z}: {len(todo)} tiles", flush=True)
        for i, (tx, ty) in enumerate(todo):
            d = os.path.join(out, str(z), str(tx))
            os.makedirs(d, exist_ok=True)
            render_tile(z, tx, ty).save(os.path.join(d, f"{ty}.webp"), "WEBP", quality=74, method=6)
            if i % 50 == 0:
                print(f"  {i}/{len(todo)}", flush=True)
