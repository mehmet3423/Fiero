import styles from "@/styles/PageLoadingAnimation.module.css";

const PageLoadingAnimation = () => {
  return (
    <div className={styles.loadingOverlay}>
      <div className={styles.loadingOverlayContent}>
        <div
          className={`spinner-border text-primary ${styles.spinner}`}
          role="status"
          style={{ width: "3rem", height: "3rem" }}
        ></div>
      </div>
    </div>
  );
};

export default PageLoadingAnimation;
