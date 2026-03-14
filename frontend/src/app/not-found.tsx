import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

import { getImage } from "@/assets/images";
import { Button } from "@/components/atoms/Button";
import { AuthLayout } from "@/components/templates/AuthLayout";

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <AuthLayout>
      <div className="flex w-full max-w-[800px] flex-col items-center gap-10 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-col items-start gap-6">
          <span className="font-be-vietnam-pro text-base font-semibold text-[#1E62EC]">
            404 error
          </span>

          <h1 className="font-be-vietnam-pro text-[40px] font-bold leading-[48px] text-[#3F4655]">
            Página <span className="text-[#1E62EC]">não</span>
            <br />
            encontrada
          </h1>

          <p className="font-be-vietnam-pro text-base leading-6 text-[#727B8E]">
            Desculpe, a página que você procura não existe.
            <br />
            Aqui estão alguns links úteis:
          </p>

          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              onClick={() => navigate(-1)}
              className="gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Voltar
            </Button>
            <Link to="/">
              <Button>Início</Button>
            </Link>
          </div>
        </div>

        <img
          src={getImage("page_not_found").src}
          alt="404 - Página não encontrada"
          width={400}
          height={400}
          className="h-auto w-full max-w-[400px]"
        />
      </div>
    </AuthLayout>
  );
}
