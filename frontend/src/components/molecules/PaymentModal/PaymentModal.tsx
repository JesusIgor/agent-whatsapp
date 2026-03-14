import { useEffect, useState } from "react";
import { X, CreditCard, AlertCircle, CheckCircle, Loader2 } from "lucide-react";
import { cn } from "@/lib/cn";
import type { PaymentPreference } from "@/types/payment";

declare global {
  interface Window {
    MercadoPago?: any;
  }
}

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  preferenceId?: string;
  appointmentId: string;
  serviceName: string;
  amount: number;
  clientName: string;
  petName?: string;
  scheduledAt?: string;
  onPaymentSuccess: () => void;
  onPaymentError: (error: string) => void;
}

export function PaymentModal({
  isOpen,
  onClose,
  preferenceId,
  appointmentId,
  serviceName,
  amount,
  clientName,
  petName,
  scheduledAt,
  onPaymentSuccess,
  onPaymentError,
}: PaymentModalProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>();
  const [mpInstance, setMpInstance] = useState<any>(null);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(price);
  };

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return "";
    try {
      return new Date(dateStr).toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return dateStr;
    }
  };

  useEffect(() => {
    const initializeMercadoPago = () => {
      const publicKey = import.meta.env.VITE_MERCADO_PAGO_PUBLIC_KEY;

      if (!publicKey) {
        setError("Chave pública do Mercado Pago não configurada");
        return;
      }

      if (window.MercadoPago) {
        const mp = new window.MercadoPago(publicKey, {
          locale: "pt-BR",
        });
        setMpInstance(mp);
      } else {
        setError("SDK do Mercado Pago não carregado");
      }
    };

    if (isOpen) {
      initializeMercadoPago();
    }
  }, [isOpen]);

  useEffect(() => {
    if (!mpInstance || !preferenceId || !isOpen) return;

    const createCheckout = async () => {
      setLoading(true);
      setError(undefined);

      try {
        const checkout = mpInstance.checkout({
          preference: {
            id: preferenceId,
          },
          autoOpen: true,
        });

        checkout.on("payment", (data: any) => {
          if (data.status === "approved") {
            onPaymentSuccess();
          } else if (data.status === "rejected") {
            setError(
              "Pagamento rejeitado. Tente novamente com outro método de pagamento.",
            );
          }
        });

        checkout.on("error", (err: any) => {
          console.error("Mercado Pago error:", err);
          setError("Erro ao processar pagamento. Tente novamente.");
          onPaymentError("Erro ao processar pagamento");
        });

        await checkout.open();
      } catch (err) {
        console.error("Checkout error:", err);
        setError("Não foi possível abrir o checkout. Tente novamente.");
        onPaymentError("Erro ao abrir checkout");
      } finally {
        setLoading(false);
      }
    };

    createCheckout();
  }, [mpInstance, preferenceId, isOpen, onPaymentSuccess, onPaymentError]);

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget && !loading) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="payment-modal-title"
    >
      <div className="bg-white dark:bg-[#1A1B1D] rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h2
            id="payment-modal-title"
            className="text-xl font-bold text-gray-900 dark:text-white"
          >
            Pagamento do Agendamento
          </h2>
          <button
            onClick={onClose}
            disabled={loading}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors disabled:opacity-50"
            aria-label="Fechar modal"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {}
        <div className="p-6 space-y-6">
          {}
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 space-y-3">
            <h3 className="font-semibold text-blue-900 dark:text-blue-300 text-sm uppercase tracking-wide">
              Detalhes do Agendamento
            </h3>

            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">
                  Serviço:
                </span>
                <span className="font-medium text-gray-900 dark:text-white">
                  {serviceName}
                </span>
              </div>

              {scheduledAt && (
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">
                    Data/Hora:
                  </span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {formatDate(scheduledAt)}
                  </span>
                </div>
              )}

              {petName && (
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Pet:</span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {petName}
                  </span>
                </div>
              )}

              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Tutor:</span>
                <span className="font-medium text-gray-900 dark:text-white">
                  {clientName}
                </span>
              </div>
            </div>
          </div>

          {}
          <div className="bg-green-50 dark:bg-green-900/20 border-2 border-green-600 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <span className="text-lg font-semibold text-gray-900 dark:text-white">
                Total a Pagar:
              </span>
              <span className="text-2xl font-bold text-green-600">
                {formatPrice(amount)}
              </span>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
              Pagamento seguro via Mercado Pago
            </p>
          </div>

          {}
          {loading && (
            <div className="flex flex-col items-center justify-center py-8 space-y-4">
              <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
              <div className="text-center">
                <p className="text-gray-900 dark:text-white font-medium">
                  Preparando pagamento...
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  Você será redirecionado para o checkout do Mercado Pago
                </p>
              </div>
            </div>
          )}

          {}
          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 flex items-start space-x-3">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-semibold text-red-900 dark:text-red-300 text-sm mb-1">
                  Erro no Pagamento
                </h4>
                <p className="text-sm text-red-800 dark:text-red-400">
                  {error}
                </p>
              </div>
            </div>
          )}

          {}
          {!loading && !error && (
            <div className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 space-y-2">
              <div className="flex items-start space-x-2">
                <CreditCard className="w-5 h-5 text-gray-600 dark:text-gray-400 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-gray-700 dark:text-gray-300">
                  <p className="font-medium mb-1">
                    Métodos de Pagamento Aceitos:
                  </p>
                  <ul className="space-y-1 text-gray-600 dark:text-gray-400">
                    <li>• Cartão de crédito (até 12x)</li>
                    <li>• Cartão de débito</li>
                    <li>• PIX (aprovação instantânea)</li>
                    <li>• Boleto bancário</li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {}
          <div className="flex items-start space-x-2 text-xs text-gray-600 dark:text-gray-400">
            <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
            <p>
              Pagamento processado com segurança pelo Mercado Pago. Seus dados
              estão protegidos.
            </p>
          </div>
        </div>

        {}
        <div className="border-t border-gray-200 dark:border-gray-700 p-6 bg-gray-50 dark:bg-gray-800/50">
          <div className="flex items-center justify-between">
            <button
              onClick={onClose}
              disabled={loading}
              className="px-4 py-2 text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors disabled:opacity-50"
            >
              {loading ? "Aguarde..." : "Cancelar"}
            </button>

            <p className="text-xs text-gray-500 dark:text-gray-500">
              ID do Agendamento: {appointmentId.slice(0, 8)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
