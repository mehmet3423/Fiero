import React from "react";
import { useRouter } from "next/router";
import { useLanguage } from "@/context/LanguageContext";
import styles from "@/styles/CheckoutProgress.module.css";

interface CheckoutStep {
  id: string;
  title: string;
  description: string;
  icon: string;
  path: string;
}

interface CheckoutProgressProps {
  currentStep: string;
  className?: string;
}

const CheckoutProgress: React.FC<CheckoutProgressProps> = ({
  currentStep,
  className = "",
}) => {
  const { t } = useLanguage();
  const router = useRouter();

  const steps: CheckoutStep[] = [
    {
      id: "cart",
      title: t("common.checkoutProgress.cart") || "Sepet",
      description: t("common.checkoutProgress.cartDescription") || "Ürünleri inceleyin",
      icon: "icon icon-shopping-cart",
      path: "/shopping-cart",
    },
    {
      id: "checkout",
      title: t("common.checkoutProgress.checkout") || "Adres Bilgileri",
      description: t("common.checkoutProgress.checkoutDescription") || "Adres Seçimi",
      icon: "icon icon-map-marker",
      path: "/checkout",
    },
    {
      id: "payment",
      title: t("common.checkoutProgress.payment") || "Ödeme",
      description: t("common.checkoutProgress.paymentDescription") || "Ödeme yöntemi seçimi",
      icon: "icon icon-dollar",
      path: "/payment",
    },
  ];

  const getCurrentStepIndex = () => {
    return steps.findIndex((step) => step.id === currentStep);
  };

  const isStepCompleted = (stepId: string) => {
    const currentIndex = getCurrentStepIndex();
    const stepIndex = steps.findIndex((step) => step.id === stepId);
    return stepIndex < currentIndex;
  };

  const isStepActive = (stepId: string) => {
    return stepId === currentStep;
  };

  const handleStepClick = (step: CheckoutStep) => {
    // Sadece tamamlanmış veya aktif adımlara tıklanabilir
    const currentIndex = getCurrentStepIndex();
    const stepIndex = steps.findIndex((s) => s.id === step.id);

    if (stepIndex <= currentIndex) {
      router.push(step.path);
    }
  };

  return (
    <div className={`${styles.checkoutProgress} ${className}`}>
      <div className="container">
        <div className={styles.progressSteps}>
          {steps.map((step, index) => {
            const isCompleted = isStepCompleted(step.id);
            const isActive = isStepActive(step.id);
            const isClickable = isCompleted || isActive;

            return (
              <div
                key={step.id}
                className={`${styles.progressStep} ${
                  isCompleted ? styles.completed : ""
                } ${isActive ? styles.active : ""} ${
                  isClickable ? styles.clickable : ""
                }`}
                onClick={() => isClickable && handleStepClick(step)}
              >
                <div className={styles.stepIcon}>
                  {isCompleted ? (
                    <i className="icon icon-check"></i>
                  ) : (
                    <i className={step.icon}></i>
                  )}
                </div>

                <div className={styles.stepContent}>
                  <h4 className={styles.stepTitle}>{step.title}</h4>
                  {/* <p className={styles.stepDescription}>{step.description}</p> */}
                </div>

                {index < steps.length - 1 && (
                  <div className={styles.stepConnector}>
                    <div className={styles.connectorLine}></div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default CheckoutProgress;
