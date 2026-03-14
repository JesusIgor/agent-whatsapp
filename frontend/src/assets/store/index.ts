import fallback from "../images/placeholder.svg";
import pacote_magnata from "./pacote_magnata.svg";
import pacote_automacoes from "./pacote_automacoes.svg";
import pacote_bilionario from "./pacote_bilionario.svg";
import pacote_milionario from "./pacote_milionario.svg";

import machado_de_ouro from "./machado_de_ouro.svg";
import machado_de_ferro from "./machado_de_ferro.svg";
import machado_de_pedra from "./machado_de_pedra.svg";
import machado_de_diamante from "./machado_de_diamante.svg";

import um_cinco_b_de_cash from "./1_5B_de_cash.svg";
import sete_cinco_b_de_cash from "./7_5B_de_cash.svg";
import energia_infinita from "./energia_infinita.svg";
import x_maquina_de_cash from "./2x_maquina_de_cash.svg";

import booster_de_Pesca from "./booster_de_pesca.svg";
import booster_de_Spawners from "./booster_de_spawners.svg";
import booster_de_Mineração from "./booster_de_mineracao.svg";
import booster_de_Plantação from "./booster_de_plantacao.svg";

export const images: Record<string, string> = {
  fallback,
  pacote_magnata,
  pacote_automacoes,
  pacote_bilionario,
  pacote_milionario,

  machado_de_ouro,
  machado_de_ferro,
  machado_de_pedra,
  machado_de_diamante,

  energia_infinita,
  x_maquina_de_cash,
  um_cinco_b_de_cash,
  sete_cinco_b_de_cash,

  booster_de_Pesca,
  booster_de_Spawners,
  booster_de_Mineração,
  booster_de_Plantação,
};

type IImage = keyof typeof images;

export const getStoreImage = (id: IImage): string => {
  return images[id] ?? images.fallback;
};
