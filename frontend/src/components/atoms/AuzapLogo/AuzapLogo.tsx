import { getImage } from "@/assets/images";

export function AuzapLogo() {
  return <img src={getImage("logo").src} alt="Logotipo Auzap" height={32} />;
}
