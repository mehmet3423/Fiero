const PageLoadingAnimation = () => {
  return (
    <div className="loadingOverlay">
      <div className="loadingOverlayContent">
        <div
          className={`spinner-border text-primary`}
          role="status"
          style={{ width: "3rem", height: "3rem" }}
        ></div>
      </div>
    </div>
  );
};

export default PageLoadingAnimation;
