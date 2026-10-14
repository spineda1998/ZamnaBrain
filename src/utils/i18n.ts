import { AppLanguage } from '../types';

export interface Translations {
  // Navigation
  feedTab: string;
  senderoTab: string;
  minigamesTab: string;
  codexTab: string;
  
  // Settings Modal
  settingsTitle: string;
  settingsSubtitle: string;
  linkedEmail: string;
  accountLinked: string;
  playerName: string;
  ceremonialAvatar: string;
  selectLanguage: string;
  audioEffects: string;
  bgmMusic: string;
  sfxEffects: string;
  volume: string;
  cancel: string;
  save: string;
  saved: string;
  
  // Header & Status
  level: string;
  stars: string;
  jadeEnergy: string;
  logout: string;
  settings: string;
  
  // Feed
  welcomeWarrior: string;
  senderoTitle: string;
  senderoDesc: string;
  minigamesTitle: string;
  minigamesDesc: string;
  codexTitle: string;
  codexDesc: string;
  startExpedition: string;
  
  // Fullscreen & Controls
  pauseTitle: string;
  resumeGame: string;
  restartGame: string;
  exitGame: string;
  backToHub: string;
  fullscreenBack: string;
  freePlay: string;
}

export const TRANSLATIONS: Record<AppLanguage, Translations> = {
  es: {
    feedTab: 'FEED',
    senderoTab: 'SENDERO',
    minigamesTab: 'MINIJUEGOS',
    codexTab: 'CÓDICE',
    
    settingsTitle: 'AJUSTES & PERFIL',
    settingsSubtitle: 'CONFIGURACIÓN DEL JUEGO',
    linkedEmail: 'CORREO ELECTRÓNICO VINCULADO',
    accountLinked: 'CUENTA VINCULADA',
    playerName: 'NOMBRE DE JUGADOR',
    ceremonialAvatar: 'AVATAR CEREMONIAL',
    selectLanguage: 'CAMBIAR IDIOMA',
    audioEffects: 'AUDIO & EFECTOS',
    bgmMusic: 'MÚSICA BGM',
    sfxEffects: 'EFECTOS SFX',
    volume: 'VOLUMEN',
    cancel: 'CANCELAR',
    save: 'GUARDAR',
    saved: '¡GUARDADO!',
    
    level: 'NIVEL',
    stars: 'ESTRELLAS',
    jadeEnergy: 'ENERGÍA DE JADE',
    logout: 'SALIR',
    settings: 'AJUSTES',
    
    welcomeWarrior: 'BIENVENIDO AL SANTUARIO',
    senderoTitle: 'SENDERO SAGRADO',
    senderoDesc: 'Avanza por los 5 templos rituales y desbloquea el saber ancestral.',
    minigamesTitle: 'MINIJUEGOS ARCADE',
    minigamesDesc: 'Entrena cálculo, memoria y velocidad con cartuchos de 32-bits.',
    codexTitle: 'CÓDICE ANCESTRAL',
    codexDesc: 'Descubre glifos, jeroglíficos y sabiduría matemática.',
    startExpedition: 'INICIAR EXPEDICIÓN ▶',
    
    pauseTitle: 'RITUAL EN PAUSA',
    resumeGame: 'CONTINUAR PARTIDA',
    restartGame: 'REINICIAR RITUAL',
    exitGame: 'SALIR / VOLVER ATRÁS',
    backToHub: 'VOLVER AL SANTUARIO',
    fullscreenBack: 'VOLVER ATRÁS',
    freePlay: 'JUGAR LIBRE ▶',
  },
  
  nah: {
    feedTab: 'TLAHTOLLI',
    senderoTab: 'OHTLI',
    minigamesTab: 'MAHUIZTLI',
    codexTab: 'AMOXTICPAC',
    
    settingsTitle: 'TLAHTOLLI & YOLCATL',
    settingsSubtitle: 'TEOPAN NEMILIZTLI',
    linkedEmail: 'AMATL TETLAN TOCATL',
    accountLinked: 'YOLCAMEH VINCULADO',
    playerName: 'MO TOCATL TEOPAN',
    ceremonialAvatar: 'TEO-IXTLI CEREMONIAL',
    selectLanguage: 'PATLA TLAHTOLLI',
    audioEffects: 'TZATZILIZTLI & TLAPITZALLI',
    bgmMusic: 'CUIQUICA BGM',
    sfxEffects: 'TZATZIZTLI SFX',
    volume: 'CHICAHUALIZTLI',
    cancel: 'AHMO TLAHTO',
    save: 'PIYA AMATL',
    saved: '¡O-MO-PIX!',
    
    level: 'TLACOLI',
    stars: 'CITLALTIN',
    jadeEnergy: 'CHALCHIHUITL CHICA',
    logout: 'QUISA',
    settings: 'TLAPATILIZTLI',
    
    welcomeWarrior: 'XIMOLLACAN TEOPANCALCO',
    senderoTitle: 'YEC-OHTLI SAGRADO',
    senderoDesc: 'Xicpano macuilli teocalli ihuan xicmati tlamatiliztli.',
    minigamesTitle: 'ARCADE MAHUIZTLI',
    minigamesDesc: 'Tlapohualiztli, yolililiztli ihuan iciucayotl 32-bit.',
    codexTitle: 'AMOXTICPAC ANCESTRAL',
    codexDesc: 'Xiquitta machiyotl ihuan tlamatiliztli cempoalli.',
    startExpedition: 'XIPEHUA OHTLI ▶',
    
    pauseTitle: 'PAUSA RITUAL',
    resumeGame: 'XICAQUI NEMILIZTLI',
    restartGame: 'YANCUIC PEHUALIZTLI',
    exitGame: 'XICUISA / MOCUEPA',
    backToHub: 'MOCUEPA TEOPAN',
    fullscreenBack: 'MOCUEPA',
    freePlay: 'MAHUILLI ▶',
  },
  
  myn: {
    feedTab: 'K\'AABA\'',
    senderoTab: 'BEEL',
    minigamesTab: 'BÁAXAL',
    codexTab: 'WOOHIL',
    
    settingsTitle: 'UTZ K\'AJAL & WÍINKILIL',
    settingsSubtitle: 'KUXTALIL BÁAXAL',
    linkedEmail: 'TS\'ÍIB TU\'UX TÁAN K\'AABA\'',
    accountLinked: 'MOLAYIL VINCULADO',
    playerName: 'A K\'AABA\' AJ-BÁAXAL',
    ceremonialAvatar: 'WÍINKILIL K\'UJ',
    selectLanguage: 'K\'EX T\'AAN',
    audioEffects: 'PÁAX & JUUM',
    bgmMusic: 'K\'AAY BGM',
    sfxEffects: 'JUUMIL SFX',
    volume: 'MÚUK\'IL JUUM',
    cancel: 'MA\'ALOB / P\'ÁATAL',
    save: 'LÍIKS AJ-TS\'ÍIB',
    saved: '¡LÍIKSA\'AN!',
    
    level: 'XÓOT\'',
    stars: 'E\'EK\'OB',
    jadeEnergy: 'YA\'AX TÚUNICH MÚUK\'',
    logout: 'JÓOK\'OL',
    settings: 'UTSKÍINSAJ',
    
    welcomeWarrior: 'KUB\'IK OOLAL TI\' TE\'ELO\'',
    senderoTitle: 'K\'ULICHO\' BEEL',
    senderoDesc: 'Xíimbal jo\'opol k\'ujnáaj yéetel k\'ajóolil na\'at.',
    minigamesTitle: 'BÁAXALOB ARCADE',
    minigamesDesc: 'K\'a\'ajsaj, xook yéetel séebal ti\' 32-bit.',
    codexTitle: 'ÚUCHBEN WOOH',
    codexDesc: 'Il glifos yéetel kuxa\'an xookil cero.',
    startExpedition: 'JÓP\'OL BÁAXAL ▶',
    
    pauseTitle: 'BÁAXAL TI\' JE\'ELEL',
    resumeGame: 'TS\'O\'OKBESIK BÁAXAL',
    restartGame: 'KA\'A TÚUMBUL',
    exitGame: 'JÓOK\'OL / SUUT TA PACH',
    backToHub: 'SUUT TI\' K\'UJNÁAJ',
    fullscreenBack: 'SUUT TA PACH',
    freePlay: 'BÁAXAL SÉEB ▶',
  },
  
  en: {
    feedTab: 'FEED',
    senderoTab: 'SACRED PATH',
    minigamesTab: 'MINIGAMES',
    codexTab: 'CODEX',
    
    settingsTitle: 'SETTINGS & PROFILE',
    settingsSubtitle: 'GAME CONFIGURATION',
    linkedEmail: 'LINKED USER EMAIL',
    accountLinked: 'ACCOUNT LINKED',
    playerName: 'WARRIOR NAME',
    ceremonialAvatar: 'CEREMONIAL AVATAR',
    selectLanguage: 'CHANGE LANGUAGE',
    audioEffects: 'AUDIO & SFX',
    bgmMusic: 'BGM MUSIC',
    sfxEffects: 'SFX SOUNDS',
    volume: 'VOLUME',
    cancel: 'CANCEL',
    save: 'SAVE CHANGES',
    saved: 'SAVED!',
    
    level: 'LEVEL',
    stars: 'STARS',
    jadeEnergy: 'JADE ENERGY',
    logout: 'LOGOUT',
    settings: 'SETTINGS',
    
    welcomeWarrior: 'WELCOME TO THE SANCTUARY',
    senderoTitle: 'SACRED PATH',
    senderoDesc: 'Ascend through 5 ritual temples and unlock ancestral knowledge.',
    minigamesTitle: 'ARCADE MINIGAMES',
    minigamesDesc: 'Train vigesimal math, memory, and speed with 32-bit cartridges.',
    codexTitle: 'ANCESTRAL CODEX',
    codexDesc: 'Discover Mesoamerican glyphs, hieroglyphics, and vigesimal math.',
    startExpedition: 'START EXPEDITION ▶',
    
    pauseTitle: 'RITUAL PAUSED',
    resumeGame: 'RESUME GAME',
    restartGame: 'RESTART RITUAL',
    exitGame: 'EXIT / GO BACK',
    backToHub: 'RETURN TO SANCTUARY',
    fullscreenBack: 'GO BACK',
    freePlay: 'PLAY FREE ▶',
  },
};

export const getT = (lang: AppLanguage = 'es'): Translations => {
  return TRANSLATIONS[lang] || TRANSLATIONS.es;
};
