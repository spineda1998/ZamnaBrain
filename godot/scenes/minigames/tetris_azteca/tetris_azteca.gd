extends Node2D

## TetrisAzteca.gd
## Motor de Tetris Azteca con estetica SNES de 32x32 bits y cuadricula vigesimal.
## Utiliza celdas exactas de 32x32 con biseles de 16 bits sin distorsion.

const BOARD_COLS: int = 10
const BOARD_ROWS: int = 20
const TILE_PX: int = PixelConstants.TILE_SIZE # 32

var grid: Array = []
var score: int = 0
var lines_cleared: int = 0

func _ready() -> void:
    init_board()

func init_board() -> void:
    grid.clear()
    for r in range(BOARD_ROWS):
        var row := []
        for c in range(BOARD_COLS):
            row.append(0)
        grid.append(row)
