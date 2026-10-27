extends RefCounted
class_name PixelConstants

## PixelConstants.gd
## Constantes de calibracion y utilidades para el renderizado Pixel Art a 32x32 bits
## en Itzamna Academia (Godot Engine 4).

## Dimensiones de mosaico sagrado SNES
const TILE_SIZE: int = 32
const TILE_VECTOR := Vector2i(TILE_SIZE, TILE_SIZE)

## Cuadricula vertical movil exacta de 12 x 20 bloques (384 x 640 px)
const GRID_COLS: int = 12
const GRID_ROWS: int = 20
const VIEWPORT_WIDTH: int = GRID_COLS * TILE_SIZE  # 384
const VIEWPORT_HEIGHT: int = GRID_ROWS * TILE_SIZE # 640

## Paletas oficiales SNES 32x32 biseladas (Luz, Base, Sombra, Glifo)
const PALETTE_JADE := {
    "light": Color("#6ee7b7"),
    "base": Color("#10b981"),
    "dark": Color("#047857"),
    "glyph": Color("#022c22")
}

const PALETTE_GOLD := {
    "light": Color("#fef08a"),
    "base": Color("#fabc4c"),
    "dark": Color("#b45309"),
    "glyph": Color("#3f1a02")
}

const PALETTE_MAYA_BLUE := {
    "light": Color("#cffafe"),
    "base": Color("#73c2fb"),
    "dark": Color("#0284c7"),
    "glyph": Color("#083344")
}

const PALETTE_CINNABAR := {
    "light": Color("#fca5a5"),
    "base": Color("#ef4444"),
    "dark": Color("#b91c1c"),
    "glyph": Color("#450a0a")
}

## Cuantiza un vector en el espacio local al grid exacto de 32x32
static func snap_to_grid(pos: Vector2) -> Vector2:
    return (pos / float(TILE_SIZE)).floor() * float(TILE_SIZE)

## Convierte coordenadas de celda (col, row) a pixeles del mundo
static func grid_to_world(cell: Vector2i) -> Vector2:
    return Vector2(cell.x * TILE_SIZE, cell.y * TILE_SIZE)

## Convierte pixeles del mundo a celda de la cuadricula
static func world_to_grid(world_pos: Vector2) -> Vector2i:
    return Vector2i(int(world_pos.x / TILE_SIZE), int(world_pos.y / TILE_SIZE))
