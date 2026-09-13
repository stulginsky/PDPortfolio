export const HOME_FILTERS = [
  { id: "all", label: "Все кейсы" },
  { id: "product", label: "Продукт" },
  { id: "ux", label: "UX" },
  { id: "design-system", label: "Дизайн система" },
  { id: "branding", label: "Брендинг" },
  { id: "creative", label: "Креатив" },
  { id: "gamedev", label: "Gamedev" },
  { id: "3d-vfx", label: "3D + VFX" },
  { id: "packaging", label: "Упаковка" },
] as const;

export type HomeFilterId = (typeof HOME_FILTERS)[number]["id"];
export type HomeDirection = Exclude<HomeFilterId, "all">;

export type HomeCard = {
  title: string;
  subtitle: string;
  badges: string;
  image: string;
  backgroundColor?: string;
  href: string;
  directions: HomeDirection[];
  show: boolean;
  index: number;
};
