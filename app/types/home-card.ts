export type HomeCardComingSoon = {
  show: boolean;
  "badge-image": string;
};

export type HomeCard = {
  title: string;
  subtitle: string;
  badges: string;
  image: string;
  href: string;
  "coming-soon": HomeCardComingSoon;
  "background-color": string;
  "background-color-hover": string;
  "background-color-active": string;
  "background-color-tap": string;
  height: string;
  show: boolean;
  index: number;
};
