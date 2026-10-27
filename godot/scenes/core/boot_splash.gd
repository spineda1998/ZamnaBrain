extends Control

## BootSplash.gd
## Pantalla de inicio ceremonial con fondo cosmico dithered Bayer 4x4,
## titulo canónico ITZAMNA ACADEMIA con pulso ritmico y verificacion de credenciales.

@onready var title_label: Label = $CenterContainer/VBoxContainer/TitleLabel
@onready var subtitle_label: Label = $CenterContainer/VBoxContainer/SubtitleLabel
@onready var status_label: Label = $CenterContainer/VBoxContainer/StatusLabel
@onready var center_box: VBoxContainer = $CenterContainer/VBoxContainer

var pulse_time: float = 0.0

func _ready() -> void:
    status_label.text = "CONSULTANDO EL CODICE SAGRADO..."
    start_boot_sequence()

func _process(delta: float) -> void:
    pulse_time += delta * 2.5
    # Pulso y escalado suave SNES identical al PixelArtSpinner
    var scale_factor: float = 1.0 + sin(pulse_time) * 0.045
    center_box.scale = Vector2(scale_factor, scale_factor)
    center_box.pivot_offset = center_box.size * 0.5

func start_boot_sequence() -> void:
    var timer := get_tree().create_timer(1.2)
    timer.timeout.connect(_on_boot_timer_done)

func _on_boot_timer_done() -> void:
    if ApiClient.auth_token != "":
        ApiClient.fetch_progress()
        ApiClient.progress_loaded.connect(func(_data):
            # Transicion a vista principal
            status_label.text = "CODICE SINCRONIZADO"
        , CONNECT_ONE_SHOT)
    else:
        status_label.text = "INICIADO LISTO"
