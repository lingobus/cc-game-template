A Cocos2d-js Game Template
====

Install
====
```bash
#init project
vue init lingobus/cc-game-template <project-name>
cd <project-name>
```

Conventions
====

- Main.fire: entry scene
- animations: all animation files
- audios: all audio files
  - common: audios shared between scenes
- scenes: scene files along with their same named script files.
- scripts: all other script files
- textures: all textures
  - common: textures shared among scenes
  - Scene#1: all textures used only in scene#1
- cc_modules: managed packages
