import { DiscountType } from "@/constants/enums/DiscountType";
import { DiscountValueType } from "@/constants/enums/DiscountValueType";
import { CartDiscount } from "@/constants/models/Discount";
import { useCreateCartDiscount } from "@/hooks/services/discounts/cart-discount/useCreateCartDiscount";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";
import { toast } from "react-hot-toast";
import NotificationSettings from "@/components/shared/NotificationSettings";
import { NotificationSettings as NotificationSettingsType } from "@/constants/models/Notification";

interface CartDiscountForm {
  name: string;
  description: string;
  discountValue: string;
  discountValueType: DiscountValueType;
  maxDiscountValue: number;
  startDate: string;
  endDate: string;
  minimumCartAmount: number;
  maximumCartAmount: number;
  minimumCartProductCount: number;
  maximumCartProductCount: number;
  isActive: boolean;
  type: DiscountType;
  isWithinActiveDateRange: boolean;
  notificationSettings: NotificationSettingsType;
}

const CreateCartDiscountPage = () => {
  const router = useRouter();
  const { createCartDiscount, isPending } = useCreateCartDiscount();

  const [formData, setFormData] = useState<CartDiscountForm>({
    name: "",
    description: "",
    discountValue: "",
    discountValueType: DiscountValueType.Percentage,
    maxDiscountValue: 0,
    startDate: "",
    endDate: "",
    minimumCartAmount: 0,
    maximumCartAmount: 0,
    minimumCartProductCount: 0,
    maximumCartProductCount: 0,
    isActive: true,
    type: DiscountType.Cart,
    isWithinActiveDateRange: false,
    notificationSettings: {
      isEmailNotificationEnabled: false,
      emailNotificationSubject: "",
      emailNotificationTextBody: "",
      emailNotificationHtmlBody: "",
      isSMSNotificationEnabled: false,
      smsNotificationSubject: "",
      smsNotificationTextBody: "",
      smsNotificationHtmlBody: "",
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const requestData: Omit<
        CartDiscount,
        "id" | "createdOn" | "createdOnValue"
      > = {
        ...formData,
        discountValue: Number(formData.discountValue),
        minimumCartAmount: Number(formData.minimumCartAmount),
      };

      await createCartDiscount(requestData);
      router.push("/admin/campaigns/cart-discount");
    } catch (error) {
      toast.error("Sepet indirimi oluşturulurken bir hata oluştu");
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleNotificationSettingsChange = (
    notificationSettings: NotificationSettingsType
  ) => {
    setFormData((prev) => ({
      ...prev,
      notificationSettings,
    }));
  };

  return (
    <div className="container-fluid">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h4 className="fw-bold py-3 mb-4">
            <span className="text-muted fw-light">
              <Link
                href="/admin/campaigns"
                className="text-muted fw-light hover:text-primary"
              >
                Kampanyalar
              </Link>{" "}
              /{" "}
              <Link
                href="/admin/campaigns/cart-discount"
                className="text-muted fw-light hover:text-primary"
              >
                Sepet İndirimleri
              </Link>{" "}
              /
            </span>{" "}
            Yeni İndirim
          </h4>
          <Link
            href="/admin/campaigns/cart-discount"
            className="btn btn-outline-secondary"
            style={{
              backgroundColor: "#e9e9e9",
              color: "#000",
              borderColor: "#d9d9d9",
            }}
          >
            <i className="bx bx-arrow-back me-1"></i>
            Geri
          </Link>
        </div>
      </div>

      <div className="row">
        <div className="col-md-12">
          <div className="card mb-4">
            <div className="card-body">
              <form onSubmit={handleSubmit}>
                <div className="row mb-3">
                  <div className="col-md-6">
                    <label className="form-label">İndirim Adı</label>
                    <input
                      type="text"
                      className="form-control"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Açıklama</label>
                    <input
                      type="text"
                      className="form-control"
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="row mb-3">
                  <div className="col-md-4">
                    <label className="form-label">İndirim Değeri</label>
                    <input
                      type="number"
                      className="form-control"
                      name="discountValue"
                      value={formData.discountValue}
                      onChange={handleChange}
                      min={0}
                      required
                      onWheel={(e) => (e.target as HTMLInputElement).blur()}
                    />
                  </div>
                  <div className="col-md-4">
                    <label className="form-label">İndirim Tipi</label>
                    <select
                      className="form-select"
                      name="discountValueType"
                      value={formData.discountValueType}
                      onChange={handleChange}
                      required
                    >
                      <option value={1}>Yüzde (%)</option>
                      <option value={2}>Sabit Tutar (₺)</option>
                    </select>
                  </div>
                  <div className="col-md-4">
                    <label className="form-label">
                      Maksimum İndirim Değeri
                    </label>
                    <input
                      type="number"
                      className="form-control"
                      name="maxDiscountValue"
                      value={formData.maxDiscountValue}
                      onChange={handleChange}
                      min={0}
                      onWheel={(e) => (e.target as HTMLInputElement).blur()}
                    />
                  </div>
                </div>

                <div className="row mb-3">
                  <div className="col-md-3">
                    <label className="form-label">Minimum Sepet Tutarı</label>
                    <input
                      type="number"
                      className="form-control"
                      name="minimumCartAmount"
                      value={formData.minimumCartAmount}
                      onChange={handleChange}
                      min={0}
                      required
                      onWheel={(e) => (e.target as HTMLInputElement).blur()}
                    />
                  </div>
                  <div className="col-md-3">
                    <label className="form-label">Maximum Sepet Tutarı</label>
                    <input
                      type="number"
                      className="form-control"
                      name="maximumCartAmount"
                      value={formData.maximumCartAmount}
                      onChange={handleChange}
                      min={0}
                      onWheel={(e) => (e.target as HTMLInputElement).blur()}
                    />
                  </div>
                  <div className="col-md-3">
                    <label className="form-label">Minimum Ürün Sayısı</label>
                    <input
                      type="number"
                      className="form-control"
                      name="minimumCartProductCount"
                      value={formData.minimumCartProductCount}
                      onChange={handleChange}
                      min={0}
                      onWheel={(e) => (e.target as HTMLInputElement).blur()}
                    />
                  </div>
                  <div className="col-md-3">
                    <label className="form-label">Maximum Ürün Sayısı</label>
                    <input
                      type="number"
                      className="form-control"
                      name="maximumCartProductCount"
                      value={formData.maximumCartProductCount}
                      onChange={handleChange}
                      min={0}
                      onWheel={(e) => (e.target as HTMLInputElement).blur()}
                    />
                  </div>
                </div>

                <div className="row mb-3">
                  <div className="col-md-6">
                    <label className="form-label">Başlangıç Tarihi</label>
                    <input
                      type="datetime-local"
                      className="form-control"
                      name="startDate"
                      value={formData.startDate}
                      onChange={handleChange}
                      min={new Date().toISOString().slice(0, 16)}
                      required
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Bitiş Tarihi</label>
                    <input
                      type="datetime-local"
                      className="form-control"
                      name="endDate"
                      value={formData.endDate}
                      onChange={handleChange}
                      min={
                        formData.startDate ||
                        new Date().toISOString().slice(0, 16)
                      }
                      required
                    />
                  </div>
                </div>

                <div className="row mb-3">
                  <div className="col-md-6">
                    <label className="form-label">Durum</label>
                    <div className="form-check">
                      <input
                        type="checkbox"
                        className="form-check-input form-check-input-sm"
                        name="isActive"
                        checked={formData.isActive}
                        onChange={handleChange}
                        style={{ transform: "scale(0.7)" }}
                      />
                      <label
                        className="form-check-label"
                        style={{ fontSize: "0.875rem" }}
                      >
                        İndirim aktif
                      </label>
                    </div>
                  </div>
                </div>

                {/* Notification Settings */}
                <NotificationSettings
                  value={formData.notificationSettings}
                  onChange={handleNotificationSettingsChange}
                />

                <div className="mt-4">
                  <button
                    type="submit"
                    className="btn btn-outline-secondary"
                    style={{
                      backgroundColor: "#e9e9e9",
                      color: "#000",
                      borderColor: "#d9d9d9",
                    }}
                    disabled={isPending}
                  >
                    {isPending ? "Kaydediliyor..." : "Kaydet"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateCartDiscountPage;
