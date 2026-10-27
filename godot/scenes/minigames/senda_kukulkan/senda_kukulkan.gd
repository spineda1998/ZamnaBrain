extends Node2D

## SendaKukulkan.gd
## Serpiente de orbes sagrados con suma vigesimal 20 y sprites octagonales 32x32.

signal combo_achieved(combo_count: int)

var loaded_orb_value: int = 8
var snake_orbs: Array = []
