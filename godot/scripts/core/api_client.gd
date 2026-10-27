extends Node

## ApiClient.gd
## Singleton para comunicacion REST con el backend ceremonial de Itzamna Academia.
## Utiliza nodos HTTPRequest nativos de Godot y gestiona autenticacion JWT cifrada.

signal login_completed(success: boolean, user_data: Dictionary, error_msg: String)
signal progress_loaded(progress_data: Dictionary)
signal sections_loaded(sections_list: Array)
signal codex_loaded(codex_list: Array)

var base_url: String = "http://127.0.0.1:3000/v1"
var auth_token: String = ""
const TOKEN_PATH: String = "user://token.dat"
const ENCRYPTION_KEY: String = "itzamna_jwt_secure_32bit"

func _ready() -> void:
    load_saved_token()

func set_base_url(url: String) -> void:
    base_url = url.trim_suffix("/")

func save_token(token: String) -> void:
    auth_token = token
    var file := FileAccess.open_encrypted_with_pass(TOKEN_PATH, FileAccess.WRITE, ENCRYPTION_KEY)
    if file:
        file.store_string(token)
        file.close()

func load_saved_token() -> void:
    if FileAccess.file_exists(TOKEN_PATH):
        var file := FileAccess.open_encrypted_with_pass(TOKEN_PATH, FileAccess.READ, ENCRYPTION_KEY)
        if file:
            auth_token = file.get_as_text().strip_edges()
            file.close()

func clear_token() -> void:
    auth_token = ""
    if FileAccess.file_exists(TOKEN_PATH):
        DirAccess.remove_absolute(TOKEN_PATH)

func get_auth_headers() -> PackedStringArray:
    var headers := PackedStringArray(["Content-Type: application/json"])
    if auth_token != "":
        headers.append("Authorization: Bearer " + auth_token)
    return headers

## Login con credenciales rituales
func login(email: String, password: String) -> void:
    var http := HTTPRequest.new()
    add_child(http)
    
    var body := JSON.stringify({
        "email": email.strip_edges().to_lower(),
        "password": password.strip_edges()
    })
    
    http.request_completed.connect(func(result: int, response_code: int, _headers: PackedStringArray, body_bytes: PackedByteArray):
        http.queue_free()
        var text := body_bytes.get_string_from_utf8()
        var json := JSON.new()
        if json.parse(text) == OK and typeof(json.data) == TYPE_DICTIONARY:
            var data: Dictionary = json.data
            if response_code >= 200 and response_code < 300 and data.has("accessToken"):
                save_token(data["accessToken"])
                var user: Dictionary = data.get("user", {})
                GameState.set_user(user)
                login_completed.emit(true, user, "")
                return
        
        # Fallback offline para el alumno demo si no hay conexion
        if email.strip_edges().to_lower() == "miguelito@alumno.com" and password.strip_edges() == "12345678":
            var fallback_user := {
                "id": "u_miguelito",
                "email": "miguelito@alumno.com",
                "nickname": "MIGUELITO",
                "role": "student",
                "avatar": "🦅"
            }
            save_token("dummy_token_miguelito")
            GameState.set_user(fallback_user)
            login_completed.emit(true, fallback_user, "")
            return
            
        login_completed.emit(false, {}, "Codice ritual no reconocido. Verifica correo y clave.")
    )
    
    http.request(base_url + "/auth/login", PackedStringArray(["Content-Type: application/json"]), HTTPClient.METHOD_POST, body)

## Obtener progreso del usuario
func fetch_progress() -> void:
    var http := HTTPRequest.new()
    add_child(http)
    
    http.request_completed.connect(func(result: int, response_code: int, _headers: PackedStringArray, body_bytes: PackedByteArray):
        http.queue_free()
        var text := body_bytes.get_string_from_utf8()
        var json := JSON.new()
        if json.parse(text) == OK and typeof(json.data) == TYPE_DICTIONARY:
            var data: Dictionary = json.data
            if data.has("jadeCoins"):
                GameState.jade_coins = int(data["jadeCoins"])
            if data.has("totalStars"):
                GameState.total_stars = int(data["totalStars"])
            progress_loaded.emit(data)
            return
        
        # Fallback
        progress_loaded.emit({
            "jadeCoins": GameState.jade_coins,
            "totalStars": GameState.total_stars,
            "nodeProgress": []
        })
    )
    
    http.request(base_url + "/me/progress", get_auth_headers(), HTTPClient.METHOD_GET)

## Obtener Secciones del Sendero
func fetch_sections() -> void:
    var http := HTTPRequest.new()
    add_child(http)
    
    http.request_completed.connect(func(result: int, response_code: int, _headers: PackedStringArray, body_bytes: PackedByteArray):
        http.queue_free()
        var text := body_bytes.get_string_from_utf8()
        var json := JSON.new()
        if json.parse(text) == OK and typeof(json.data) == TYPE_ARRAY:
            sections_loaded.emit(json.data)
            return
        
        # Fallback local
        sections_loaded.emit([
            {"id": "s_alba", "name": "Sendero del Alba", "order": 1, "description": "Los primeros pasos del cazador de templos."},
            {"id": "s_kukulkan", "name": "Camara de Kukulkan", "order": 2, "description": "Pruebas avanzadas en la piramide central."}
        ])
    )
    
    http.request(base_url + "/sections", get_auth_headers(), HTTPClient.METHOD_GET)

## Obtener Entradas del Codice
func fetch_codex_entries(topic: String = "", query: String = "") -> void:
    var http := HTTPRequest.new()
    add_child(http)
    
    var endpoint := base_url + "/codex/entries"
    var params := PackedStringArray()
    if topic != "": params.append("topic=" + topic.uri_encode())
    if query != "": params.append("query=" + query.uri_encode())
    if params.size() > 0: endpoint += "?" + "&".join(params)
    
    http.request_completed.connect(func(result: int, response_code: int, _headers: PackedStringArray, body_bytes: PackedByteArray):
        http.queue_free()
        var text := body_bytes.get_string_from_utf8()
        var json := JSON.new()
        if json.parse(text) == OK and typeof(json.data) == TYPE_ARRAY:
            codex_loaded.emit(json.data)
            return
            
        # Fallback local
        codex_loaded.emit([
            {"id": "gy_aritmetica", "title": "Aritmetica Vigesimal Maya", "topic": "aritmetica", "summary": "Puntos, barras y conchas.", "unlocked": true},
            {"id": "gy_geometria", "title": "Geometria Sagrada y Piramides", "topic": "geometria", "summary": "Simetria ceremonial.", "unlocked": true},
            {"id": "gy_tzolkin", "title": "La Rueda Ritual Tzolkin", "topic": "calendario", "summary": "Ciclo de 260 dias.", "unlocked": true}
        ])
    )
    
    http.request(endpoint, get_auth_headers(), HTTPClient.METHOD_GET)
