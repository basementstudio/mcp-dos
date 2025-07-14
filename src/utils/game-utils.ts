interface KeyMapping {
  code: number;
  key: string;
  text?: string;
}

export const DOS_GAMES: Record<string, {
  file: string;
  executable: string;
  title: string;
  cdnFile?: string;
  keys: KeyMapping[];
}> = {
  'doom': {
    file: "upload/DOOM-@evilution.zip",
    executable: "./DOOM/DOOM.EXE",
    title: "DOOM",
    cdnFile: "https://js-dos.com/cdn/upload/DOOM-@evilution.zip",
    keys: [
      { code: -1, key: 'No action' },
      { code: 38, key: 'ArrowUp', text: 'Forward' },
      { code: 40, key: 'ArrowDown', text: 'Back' },
      { code: 37, key: 'ArrowLeft', text: 'Left' },
      { code: 39, key: 'ArrowRight', text: 'Right' },
      { code: 87, key: 'KeyW', text: 'Use' },
      { code: 83, key: 'KeyS', text: 'Fire' },
      { code: 65, key: 'KeyA', text: 'Strafe left' },
      { code: 68, key: 'KeyD', text: 'Strafe right' },
      { code: 13, key: 'Enter' },
    ]
  },
  'super-mario': {
    file: "upload/mario-colin.zip",
    executable: "./Mario.exe",
    title: "Super Mario",
    cdnFile: "https://js-dos.com/cdn/upload/mario-colin.zip",
    keys: [
      { code: -1, key: 'No action' },
      { code: 37, key: 'ArrowLeft', text: 'Left' },
      { code: 39, key: 'ArrowRight', text: 'Right' },
      { code: 18, key: 'AltLeft', text: 'Jump' },
    ]
  },
  'tetris': {
    file: "upload/Tetris-neozeed.zip",
    executable: "./",
    title: "Tetris",
    cdnFile: "https://js-dos.com/cdn/upload/Tetris-neozeed.zip",
    keys: [
      { code: -1, key: 'No action' },
      { code: 55, key: 'Digit7', text: 'Left' },
      { code: 56, key: 'Digit8', text: 'Right' },
      { code: 57, key: 'Digit9', text: 'Rotate' },
      { code: 32, key: 'Space', text: 'Drop' },
      { code: 13, key: 'Enter' },
    ]
  },
  'duke3d': {
    file: "upload/Duke Nukem 3d-@digitalwalt.zip",
    executable: "./DUKE3D/DUKE3D.EXE",
    title: "Duke Nukem 3D",
    cdnFile: "https://js-dos.com/cdn/upload/Duke Nukem 3d-@digitalwalt.zip",
    keys: [
      { code: -1, key: 'No action' },
      { code: 38, key: 'ArrowUp', text: 'Forward' },
      { code: 40, key: 'ArrowDown', text: 'Back' },
      { code: 37, key: 'ArrowLeft', text: 'Left' },
      { code: 39, key: 'ArrowRight', text: 'Right' },
      { code: 17, key: 'ControlRight', text: 'Fire' },
      { code: 65, key: 'KeyA', text: 'Jump' },
      { code: 13, key: 'Enter' },
    ]
  },
};