import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { getImage } from "@/assets/images";
import { Button } from "@/components/atoms/Button";
import { FormField } from "@/components/molecules/FormField";

const forgotPasswordSchema = z.object({
  email: z.string().email("Email inválido"),
});

type ForgotPasswordForm = z.infer<typeof forgotPasswordSchema>;

interface ForgotPasswordModalProps {
  open: boolean;
  onClose: () => void;
}

export function ForgotPasswordModal({
  open,
  onClose,
}: ForgotPasswordModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [sent, setSent] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    reset,
  } = useForm<ForgotPasswordForm>();

  useEffect(() => {
    if (!open) {
      reset();
      setSent(false);
    }
  }, [open, reset]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && open) onClose();
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [open, onClose]);

  const onSubmit = async (data: ForgotPasswordForm) => {
    const result = forgotPasswordSchema.safeParse(data);
    if (!result.success) {
      for (const issue of result.error.issues) {
        const field = issue.path[0] as keyof ForgotPasswordForm;
        setError(field, { message: issue.message });
      }
      return;
    }

    setIsSubmitting(true);
    try {
      setSent(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center p-0 backdrop-blur-sm sm:items-center sm:p-4 animate-backdrop"
      onClick={(e) => e.target === e.currentTarget && onClose()}
      aria-hidden="true"
    >
      <div
        className="animate-scale-in mx-0 flex max-h-[90vh] w-full max-w-[510px] flex-col overflow-y-auto rounded-t-2xl border border-[#727B8E]/10 bg-white dark:border-[#40485A] dark:bg-[#1A1B1D] p-6 shadow-xl dark:shadow-black/30 sm:mx-4 sm:max-h-none sm:rounded-2xl sm:p-[42px]"
        role="dialog"
        aria-modal="true"
        aria-labelledby="forgot-password-title"
      >
        {sent ? (
          <div className="flex w-full flex-col items-center gap-[41px]">
            <div className="flex flex-col items-center gap-1">
              <img
                src={getImage("logo_main").src}
                alt="AuZap.IA logo"
                width={55}
                height={60}
              />
              <h2 className="mt-1 text-center font-sans text-2xl font-semibold leading-[38px] text-[#3F4655] dark:text-[#f5f9fc]">
                Email enviado!
              </h2>
              <p className="text-center font-sans text-sm leading-6 text-[#727B8E] dark:text-[#8a94a6]">
                Verifique sua caixa de entrada para redefinir sua senha.
              </p>
            </div>

            <Button type="button" className="w-full" onClick={onClose}>
              Voltar ao login
            </Button>
          </div>
        ) : (
          <div className="flex w-full flex-col gap-[41px]">
            <div className="flex flex-col items-center gap-1">
              <img
                src={getImage("logo_main").src}
                alt="AuZap.IA logo"
                width={55}
                height={60}
              />
              <h2
                id="forgot-password-title"
                className="mt-1 text-center font-sans text-2xl font-semibold leading-[38px] text-[#3F4655] dark:text-[#f5f9fc]"
              >
                Esqueceu sua senha?
              </h2>
              <p className="text-center font-sans text-sm leading-6 text-[#727B8E] dark:text-[#8a94a6]">
                Lorem ipsum sti dolor...
              </p>
            </div>

            <form
              onSubmit={handleSubmit(onSubmit)}
              className="flex flex-col gap-3"
              noValidate
            >
              <FormField
                id="forgot-email"
                label="Email"
                type="email"
                placeholder="exemple@gmail.com"
                error={errors.email?.message}
                {...register("email")}
              />

              <Button
                type="submit"
                className="mt-3 w-full font-be-vietnam-pro text-base font-bold"
                loading={isSubmitting}
              >
                Iniciar
              </Button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
