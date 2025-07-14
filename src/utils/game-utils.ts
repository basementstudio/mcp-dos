export const DOS_GAMES: Record<string, { file: string; executable: string; title: string; cdnFile?: string }> = {
  'doom': {
    file: "upload/DOOM-@evilution.zip",
    executable: "./DOOM/DOOM.EXE",
    title: "DOOM",
    cdnFile: "https://js-dos.com/cdn/upload/DOOM-@evilution.zip"
  },
  'super-mario': {
    file: "upload/mario-colin.zip",
    executable: "./Mario.exe",
    title: "Super Mario",
    cdnFile: "https://js-dos.com/cdn/upload/mario-colin.zip"
  },
  'tetris': {
    file: "upload/Tetris-neozeed.zip",
    executable: "./",
    title: "Tetris",
    cdnFile: "https://js-dos.com/cdn/upload/Tetris-neozeed.zip"
  },
  'duke3d': {
    file: "upload/Duke Nukem 3d-@digitalwalt.zip",
    executable: "./DUKE3D/DUKE3D.EXE",
    title: "Duke Nukem 3D",
    cdnFile: "https://js-dos.com/cdn/upload/Duke Nukem 3d-@digitalwalt.zip"
  },
};