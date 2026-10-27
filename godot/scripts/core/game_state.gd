extends Node

## GameState.gd
## Singleton para la persistencia y sincronizacion del estado global del alumno:
## Energia de Jade (10 pts con reinicio ritual de 24h), usuario activo, monedas de jade y ajustes.

signal energy_updated(current_energy: int)
signal progress_updated(total_stars: int, jade_coins: int)
signal user_changed(user_data: Dictionary)

const MAX_JADE_ENERGY: int = 10
const ENERGY_RESET_INTERVAL_SECS: int = 24 * 3600
const SAVE_PATH: String = "user://game_state.dat"
const ENCRYPTION_KEY: String = "itzamna_sacred_key_32bit"

var current_user: Dictionary = {
    "id": "u_miguelito",
    "email": "miguelito@alumno.com",
    "nickname": "MIGUELITO",
    "role": "student",
    "avatar": "🦅",
    "difficulty": "aprendiz",
    "language": "es"
}

var jade_energy: int = 10
var last_energy_reset_time: int = 0
var total_stars: int = 5
var jade_coins: int = 220
var active_tab: String = "feed" # feed, sendero, arcade, codex

var settings: Dictionary = {
    "bgm": true,
    "sfx": true,
    "volume": 80,
    "difficulty": "sacerdote",
    "language": "es"
}

func _ready() -> void:
    load_state()
    check_energy_daily_reset()

func check_energy_daily_reset() -> void:
    var now: int = int(Time.get_unix_time_from_system())
    if last_energy_reset_time == 0 or (now - last_energy_reset_time) >= ENERGY_RESET_INTERVAL_SECS:
        jade_energy = MAX_JADE_ENERGY
        last_energy_reset_time = now
        save_state()
        energy_updated.emit(jade_energy)

func consume_energy(amount: int = 1) -> bool:
    check_energy_daily_reset()
    if jade_energy >= amount:
        jade_energy -= amount
        save_state()
        energy_updated.emit(jade_energy)
        return true
    return false

func add_rewards(stars: int, coins: int) -> void:
    total_stars += stars
    jade_coins += coins
    save_state()
    progress_updated.emit(total_stars, jade_coins)

func set_user(user_data: Dictionary) -> void:
    current_user = user_data
    save_state()
    user_changed.emit(current_user)

func save_state() -> void:
    var file := FileAccess.open_encrypted_with_pass(SAVE_PATH, FileAccess.WRITE, ENCRYPTION_KEY)
    if file:
        var data := {
            "current_user": current_user,
            "jade_energy": jade_energy,
            "last_energy_reset_time": last_energy_reset_time,
            "total_stars": total_stars,
            "jade_coins": jade_coins,
            "settings": settings
        }
        file.store_string(JSON.stringify(data))
        file.close()

func load_state() -> void:
    if not FileAccess.file_exists(SAVE_PATH):
        return
    var file := FileAccess.open_encrypted_with_pass(SAVE_PATH, FileAccess.READ, ENCRYPTION_KEY)
    if file:
        var text := file.get_as_text()
        file.close()
        var json := JSON.new()
        if json.parse(text) == OK and typeof(json.data) == TYPE_DICTIONARY:
            var data: Dictionary = json.data
            if data.has("current_user"): current_user = data["current_user"]
            if data.has("jade_energy"): jade_energy = int(data["jade_energy"])
            if data.has("last_energy_reset_time"): last_energy_reset_time = int(data["last_energy_reset_time"])
            if data.has("total_stars"): total_stars = int(data["total_stars"])
            if data.has("jade_coins"): jade_coins = int(data["jade_coins"])
            if data.has("settings"): settings = data["settings"]
