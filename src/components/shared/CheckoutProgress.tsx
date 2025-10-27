import React from "react";
import { useRouter } from "next/router";
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
  const router = useRouter();

  const steps: CheckoutStep[] = [
    {
      id: "cart",
      title: "Sepet",
      description: "Ürünleri inceleyin",
      icon: "bx bx-cart",
      path: "/shopping-cart",
    },
    {
      id: "checkout",
      title: "Adres Bilgileri",
      description: "Adres Seçimi",
      icon: "bx bx-map",
      path: "/checkout",
    },
    {
      id: "payment",
      title: "Ödeme",
      description: "Ödeme yöntemi seçimi",
      icon: "bx bx-credit-card",
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
                    <i className="bx bx-check"></i>
                  ) : (
                    <i className={step.icon}></i>
                  )}
                </div>

                <div className={styles.stepContent}>
                  <h4 className={styles.stepTitle}>{step.title}</h4>
                  <p className={styles.stepDescription}>{step.description}</p>
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
