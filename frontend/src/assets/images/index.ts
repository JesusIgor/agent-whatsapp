import dogRaw from "./dog.png";
import logoRaw from "./logo.png";
import boredRaw from "./bored.png";
import mail_boxRaw from "./mail_box.svg";
import logo_mainRaw from "./logo_main.svg";
import logo_darkRaw from "./logo_dark.png";
import fallbackRaw from "./placeholder.svg";
import video_callRaw from "./video_call.png";
import logo_footerRaw from "./logo_footer.svg";
import company_logoRaw from "./company_logo.png";
import cleber_santosRaw from "./cleber_santos.png";
import page_not_foundRaw from "./page_not_found.png";
import hero_dashboardRaw from "./hero_dashboard.png";
import pets_not_foundRaw from "./not_found_clientes_ativos.png";
import bg_video_feedback_cardRaw from "./bg_video_feedback_card.png";
import not_found_clientes_ativosRaw from "./not_found_clientes_ativos.png";

type ImageObject = {
  src: string;
};

export const images: Record<string, ImageObject> = {
  dog: { src: dogRaw },
  logo: { src: logoRaw },
  bored: { src: boredRaw },
  fallback: { src: fallbackRaw },
  mail_box: { src: mail_boxRaw },
  logo_main: { src: logo_mainRaw },
  logo_dark: { src: logo_darkRaw },
  video_call: { src: video_callRaw },
  logo_footer: { src: logo_footerRaw },
  company_logo: { src: company_logoRaw },
  cleber_santos: { src: cleber_santosRaw },
  page_not_found: { src: page_not_foundRaw },
  hero_dashboard: { src: hero_dashboardRaw },
  pets_not_found: { src: pets_not_foundRaw },
  bg_video_feedback_card: { src: bg_video_feedback_cardRaw },
  not_found_clientes_ativos: { src: not_found_clientes_ativosRaw },
};

type IImage = keyof typeof images;

export const getImage = (id: IImage) => {
  return images[id] ?? images.fallback;
};
