export type CharacterModelOption = {
  id: string;
  name: string;
  url: string;
};

export const characterModels: CharacterModelOption[] = [
  {
    id: "miku",
    name: "初音未来",
    url: "/models/miku.glb",
  },
  {
    id: "vroid-sample",
    name: "二次元角色",
    url: "/models/anime-character.glb",
  },
];
