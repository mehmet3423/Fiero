interface CampaignBasicFieldsProps {
  name: string;
  nameEn: string;
  description: string;
  onNameChange: (name: string) => void;
  onNameEnChange: (nameEn: string) => void;
  onDescriptionChange: (description: string) => void;
  nameLabel?: string;
}

export default function CampaignBasicFields({
  name,
  nameEn,
  description,
  onNameChange,
  onNameEnChange,
  onDescriptionChange,
  nameLabel = "İndirim Adı",
}: CampaignBasicFieldsProps) {
  return (
    <div className="row mb-3">
      <div className="col-md-6">
        <label className="form-label">{nameLabel}</label>
        <input
          type="text"
          className="form-control"
          name="name"
          value={name}
          onChange={(e) => onNameChange(e.target.value)}
          required
        />
      </div>
      <div className="col-md-6">
        <label className="form-label">{nameLabel} (EN)</label>
        <input
          type="text"
          className="form-control"
          name="nameEn"
          value={nameEn}
          onChange={(e) => onNameEnChange(e.target.value)}
          required
        />
      </div>
      <div className="col-md-12 mt-3">
        <label className="form-label">İndirim Açıklaması</label>
        <input
          type="text"
          className="form-control"
          name="description"
          value={description}
          onChange={(e) => onDescriptionChange(e.target.value)}
        />
      </div>
    </div>
  );
}
