import { GeneralSupportRequestType } from "@/constants/enums/GeneralRequestType";
import { getAllGeneralRequestTypes } from "@/helpers/enum/generalRequestType";
import { useGeneralSupport } from "@/hooks/services/support/useGeneralSupport";
import { useState } from "react";
import { useLanguage } from "@/context/LanguageContext";

function GeneralSupportTicket() {
  const { t } = useLanguage();
  const [formData, setFormData] = useState({
    title: "",
    requestType: GeneralSupportRequestType.Other,
    description: "",
    attachments: [] as File[],
  });

  const { handleSubmitTicket, isPending } = useGeneralSupport();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title?.trim() || !formData.description?.trim()) {
      console.error("Form validation failed:", formData);
      return;
    }

    await handleSubmitTicket(formData);

    // Form gönderildikten sonra alanları sıfırla
    setFormData({
      title: "",
      requestType: GeneralSupportRequestType.Other,
      description: "",
      attachments: [],
    });
    // Dosya inputunu da sıfırla
    const fileInput = document.getElementById("attachments") as HTMLInputElement;
    if (fileInput) fileInput.value = "";
  };

  return (
    <form onSubmit={handleSubmit} className="pt-2">
      <div className="form-group mb-3">
        <label htmlFor="subject" className="form-label">
          {t("generalSupportTicket.title")}
        </label>
        <input
          type="text"
          className="form-control"
          id="subject"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          required
        />
      </div>

      <div className="form-group mb-3">
        <label htmlFor="requestType" className="form-label">
          {t("generalSupportTicket.requestType")}
        </label>
        <select
          className="form-control"
          id="requestType"
          value={formData.requestType}
          onChange={(e) =>
            setFormData({ ...formData, requestType: Number(e.target.value) })
          }
          required
        >
          {getAllGeneralRequestTypes().map((type) => (
            <option key={type.value} value={type.value}>
              {type.title}
            </option>
          ))}
        </select>
      </div>

      <div className="form-group mb-3">
        <label htmlFor="message" className="form-label">
          {t("generalSupportTicket.description")}
        </label>
        <textarea
          className="form-control"
          id="description"
          rows={5}
          value={formData.description}
          onChange={(e) =>
            setFormData({ ...formData, description: e.target.value })
          }
          required
        ></textarea>
      </div>

      <div className="form-group mb-4">
        <label htmlFor="attachments" className="form-label">
          {t("generalSupportTicket.addFile")}
        </label>
        <input
          type="file"
          className="form-control"
          id="attachments"
          multiple
          onChange={(e) => {
            const files = Array.from(e.target.files || []);
            setFormData({ ...formData, attachments: files });
          }}
        />
      </div>

      <button type="submit" className="btn btn-dark" disabled={isPending}>
        <span>{isPending ? t("generalSupportTicket.submitting"): t("generalSupportTicket.submitButton")}</span>
        <i className="icon-long-arrow-right"></i>
      </button>

      <style jsx>{`
        .form-label {
          font-weight: 500;
          color: #333;
          margin-bottom: 0.5rem;
        }

        .form-control {
          border: 1px solid #ebebeb;
          border-radius: 0.3rem;
          padding: 0.7rem 1rem;
          transition: all 0.3s;
        }

        .form-control:focus {
          border-color: #040404;
          box-shadow: none;
        }

        textarea.form-control {
          resize: vertical;
          min-height: 120px;
        }

        .btn-primary {
          min-width: 150px;
        }

        .btn-primary i {
          margin-left: 0.5rem;
        }
      `}</style>
    </form>
  );
}

export default GeneralSupportTicket;
