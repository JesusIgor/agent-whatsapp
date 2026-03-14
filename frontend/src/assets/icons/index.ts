import cat from "./cat.svg";
import star from "./star.svg";
import google from "./google.svg";
import twitter from "./twitter.svg";
import facebook from "./facebook.svg";
import linkedin from "./linkedin.svg";
import instagram from "./instagram.svg";
import check_circle from "./check_circle.svg";
import close_circle from "./close_circle.svg";
import fallback from "../images/placeholder.svg";
import footprint_left from "./footprint_left.svg";
import footprint_right from "./footprint_right.svg";

export const icons = {
  cat,
  star,
  google,
  twitter,
  facebook,
  linkedin,
  fallback,
  instagram,
  check_circle,
  close_circle,
  footprint_left,
  footprint_right,
};

export type IIcons = keyof typeof icons;

export const getIcons = (id: IIcons) => {
  return icons[id] ?? icons.fallback;
};
