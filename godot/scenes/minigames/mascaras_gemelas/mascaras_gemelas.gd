extends Control

## MascarasGemelas.gd
## Juego de memoria ancestral de tablillas mayas de 32x32 y glifos.

signal game_completed(moves: int)

var moves: int = 0
var matches_found: int = 0
