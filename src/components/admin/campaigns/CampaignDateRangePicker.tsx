interface CampaignDateRangePickerProps {
  startDate: string;
  endDate: string;
  onStartDateChange: (date: string) => void;
  onEndDateChange: (date: string) => void;
}

export default function CampaignDateRangePicker({
  startDate,
  endDate,
  onStartDateChange,
  onEndDateChange,
}: CampaignDateRangePickerProps) {
  const handleStartDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onStartDateChange(e.target.value);
  };

  const handleEndDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onEndDateChange(e.target.value);
  };

  return (
    <div className="row mb-3">
      <div className="col-md-6">
        <label className="form-label">Başlangıç Tarihi</label>
        <input
          type="datetime-local"
          className="form-control"
          name="startDate"
          value={startDate}
          onChange={handleStartDateChange}
          required
          style={{ cursor: "pointer" }}
        />
      </div>
      <div className="col-md-6">
        <label className="form-label">Bitiş Tarihi</label>
        <input
          type="datetime-local"
          className="form-control"
          name="endDate"
          value={endDate}
          onChange={handleEndDateChange}
          min={startDate}
          required
          style={{ cursor: "pointer" }}
        />
      </div>
    </div>
  );
}
