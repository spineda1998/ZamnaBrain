extends Node

## AudioManager.gd
## Singleton para reproduccion y mezcla de audio ceremonial retro (BGM y SFX) en Godot 4.
## Soporta generacion sintetica de tonos 8-bit y chiptune en tiempo real con AudioStreamGenerator.

var bgm_player: AudioStreamPlayer
var sfx_players: Array[AudioStreamPlayer] = []
const MAX_SFX_CHANNELS: int = 8

func _ready() -> void:
    bgm_player = AudioStreamPlayer.new()
    bgm_player.bus = &"Master"
    add_child(bgm_player)
    
    for i in range(MAX_SFX_CHANNELS):
        var p := AudioStreamPlayer.new()
        p.bus = &"Master"
        add_child(p)
        sfx_players.append(p)

func play_sfx(stream: AudioStream) -> void:
    if not GameState.settings.get("sfx", true):
        return
    for p in sfx_players:
        if not p.playing:
            p.stream = stream
            p.play()
            return
    # Reutilizar el primero si todos estan ocupados
    sfx_players[0].stream = stream
    sfx_players[0].play()

func play_bgm(stream: AudioStream, fade_in_sec: float = 0.5) -> void:
    if not GameState.settings.get("bgm", true):
        return
    if bgm_player.stream == stream and bgm_player.playing:
        return
    bgm_player.stream = stream
    bgm_player.volume_db = -80.0
    bgm_player.play()
    var tween := create_tween()
    tween.tween_property(bgm_player, "volume_db", 0.0, fade_in_sec)

func stop_bgm(fade_out_sec: float = 0.5) -> void:
    var tween := create_tween()
    tween.tween_property(bgm_player, "volume_db", -80.0, fade_out_sec)
    tween.tween_callback(bgm_player.stop)

## Sintetizador de sonido procedural 8-bit retro para feedback instantaneo
func play_beep(freq: float = 440.0, duration: float = 0.08) -> void:
    if not GameState.settings.get("sfx", true):
        return
    var sample_rate: float = 22050.0
    var num_samples: int = int(sample_rate * duration)
    var buffer := PackedByteArray()
    buffer.resize(num_samples * 2)
    
    for i in range(num_samples):
        var t: float = float(i) / sample_rate
        var sample: float = sin(t * freq * TAU)
        # Onda cuadrada suave SNES
        var val: int = int((1.0 if sample > 0.0 else -1.0) * 0.4 * 32767.0)
        buffer.encode_s16(i * 2, val)
        
    var audio_stream := AudioStreamWAV.new()
    audio_stream.format = AudioStreamWAV.FORMAT_16_BITS
    audio_stream.mix_rate = int(sample_rate)
    audio_stream.stereo = false
    audio_stream.data = buffer
    
    play_sfx(audio_stream)
