interface CampaignActiveToggleProps {
  isActive: boolean;
  onToggle: (isActive: boolean) => void;
}

export default function CampaignActiveToggle({
  isActive,
  onToggle,
}: CampaignActiveToggleProps) {
  return (
    <div className="row mb-3">
      <div className="col-md-12">
        <div className="form-check form-switch" style={{ fontSize: "16px" }}>
          <input
            className="form-check-input"
            type="checkbox"
            id="isActive"
            name="isActive"
            checked={isActive}
            onChange={(e) => onToggle(e.target.checked)}
            style={{ cursor: "pointer" }}
          />
          <label className="form-check-label" htmlFor="isActive">
            Aktif
          </label>
        </div>
      </div>
    </div>
  );
}
