extends Node2D

## BalanzaJade.gd
## Balanza ceremonial de pesas mayas con resolucion nativa 32x32.

signal tribute_balanced(target: int, actual: int)

var target_weight: int = 14
var current_offering: int = 0
