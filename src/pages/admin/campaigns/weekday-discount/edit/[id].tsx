import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useCreateWeekdayDiscount } from "@/hooks/services/discounts/weekday-dicount/useCreateWeekdayDiscount";
import Link from "next/link";
import { DiscountType } from "@/constants/enums/DiscountType";
import { WeekdayDiscount } from "@/constants/models/Discount";
import { useGetDiscountList } from "@/hooks/services/discounts/useGetDiscountList";

interface WeekdayDiscountForm {
  name: string;
  description: string;
  discountValue: number;
  discountValueType: number;
  maxDiscountValue: number;
  startDate: string;
  endDate: string;
  dayOfWeek: number;
  isActive: boolean;
  type: DiscountType;
  isWithinActiveDateRange: boolean;
}

function EditWeekdayDiscount() {
  const router = useRouter();
  const { id } = router.query;

  const { isPending: isCreating } = useCreateWeekdayDiscount();

  // Fetch discount data for edit mode
  const { discounts: allDiscounts, isLoading: isLoadingDiscounts } =
    useGetDiscountList({
      discountType: DiscountType.WeekdayDiscount,
    });

  const [formData, setFormData] = useState<WeekdayDiscountForm>({
    name: "",
    description: "",
    discountValue: 0,
    discountValueType: 0,
    maxDiscountValue: 0,
    startDate: "",
    endDate: "",
    dayOfWeek: 1, // Default: Pazartesi
    isActive: true,
    type: DiscountType.WeekdayDiscount,
    isWithinActiveDateRange: false,
  });

  const [isDataLoaded, setIsDataLoaded] = useState(false);

  useEffect(() => {
    if (id && allDiscounts.length > 0 && !isDataLoaded) {
      // ID'yi string olarak karşılaştır (router.query string döner)
      const discount = allDiscounts.find(
        (d) => d.id === String(id)
      ) as WeekdayDiscount;
      if (discount) {
        console.log("Found discount for edit:", discount);
        console.log("dayOfWeek:", discount.dayOfWeek);

        // API'den gelen veride weekday-specific alanlar olmayabilir
        // Bu durumda default değerleri kullanıyoruz
        const dayOfWeek = discount.dayOfWeek ?? 1; // Default: Pazartesi

        setFormData({
          name: discount.name,
          description: discount.description || "",
          discountValue: discount.discountValue,
          discountValueType: discount.discountValueType,
          maxDiscountValue: discount.maxDiscountValue || 0,
          startDate: discount.startDate.includes("T")
            ? discount.startDate.slice(0, 16)
            : new Date(discount.startDate).toISOString().slice(0, 16),
          endDate: discount.endDate.includes("T")
            ? discount.endDate.slice(0, 16)
            : new Date(discount.endDate).toISOString().slice(0, 16),
          dayOfWeek: dayOfWeek,
          isActive: discount.isActive,
          type: DiscountType.WeekdayDiscount,
          isWithinActiveDateRange: discount.isWithinActiveDateRange || false,
        });
        setIsDataLoaded(true);

        console.log("Form data set with dayOfWeek:", dayOfWeek);
      } else {
        console.log("Discount not found with id:", id, "Type:", typeof id);
        console.log(
          "Available discounts IDs:",
          allDiscounts.map((d) => ({ id: d.id, type: typeof d.id }))
        );
      }
    }
  }, [id, allDiscounts, isDataLoaded]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // TODO: Implement update functionality when needed
      // For now, we only support create
      console.warn("Edit functionality not yet implemented");
      router.push("/admin/campaigns/weekday-discount");
    } catch (error) {
      console.error("Error saving discount:", error);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox"
          ? (e.target as HTMLInputElement).checked
          : type === "number"
          ? parseFloat(value)
          : value,
    }));
  };

  const weekdays = [
    { value: 0, label: "Pazar", description: "Hafta sonu" },
    { value: 1, label: "Pazartesi", description: "Hafta içi" },
    { value: 2, label: "Salı", description: "Hafta içi" },
    { value: 3, label: "Çarşamba", description: "Hafta içi" },
    { value: 4, label: "Perşembe", description: "Hafta içi" },
    { value: 5, label: "Cuma", description: "Hafta içi" },
    { value: 6, label: "Cumartesi", description: "Hafta sonu" },
  ];

  if (isLoadingDiscounts || !isDataLoaded) {
    return (
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ height: "400px" }}
      >
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Yükleniyor...</span>
        </div>
      </div>
    );
  }

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
                href="/admin/campaigns/weekday-discount"
                className="text-muted fw-light hover:text-primary"
              >
                Haftanın Günleri İndirimleri
              </Link>{" "}
              /
            </span>{" "}
            İndirim Düzenle
          </h4>
          <Link
            href="/admin/campaigns/weekday-discount"
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

      <div className="card">
        <div className="card-body">
          <form onSubmit={handleSubmit}>
            <div className="row">
              <div className="col-md-6 mb-3">
                <label className="form-label">İndirim Adı *</label>
                <input
                  type="text"
                  className="form-control"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder="Haftanın günü indirimi adı"
                />
              </div>
              <div className="col-md-6 mb-3">
                <label className="form-label">İndirim Açıklaması</label>
                <input
                  type="text"
                  className="form-control"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="İndirim açıklaması (isteğe bağlı)"
                />
              </div>
            </div>

            <div className="row">
              <div className="col-md-4 mb-3">
                <label className="form-label">İndirim Değeri *</label>
                <input
                  type="number"
                  className="form-control"
                  name="discountValue"
                  value={formData.discountValue}
                  onChange={handleChange}
                  min={0}
                  step="0.01"
                  required
                  placeholder="İndirim değeri"
                />
              </div>
              <div className="col-md-4 mb-3">
                <label className="form-label">İndirim Tipi *</label>
                <select
                  className="form-select"
                  name="discountValueType"
                  value={formData.discountValueType}
                  onChange={handleChange}
                  required
                >
                  <option value="1">Yüzde (%)</option>
                  <option value="2">Tutar (₺)</option>
                </select>
              </div>
              <div className="col-md-4 mb-3">
                <label className="form-label">Maksimum İndirim Değeri</label>
                <input
                  type="number"
                  className="form-control"
                  name="maxDiscountValue"
                  value={formData.maxDiscountValue}
                  onChange={handleChange}
                  min={0}
                  step="0.01"
                  required
                />
              </div>
            </div>

            <div className="row">
              <div className="col-md-6 mb-3">
                <label className="form-label">Başlangıç Tarihi *</label>
                <input
                  type="datetime-local"
                  className="form-control"
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="col-md-6 mb-3">
                <label className="form-label">Bitiş Tarihi *</label>
                <input
                  type="datetime-local"
                  className="form-control"
                  name="endDate"
                  value={formData.endDate}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="row">
              <div className="col-md-6 mb-3">
                <label className="form-label">Haftanın Günü *</label>
                <select
                  className="form-select"
                  name="dayOfWeek"
                  value={formData.dayOfWeek}
                  onChange={handleChange}
                  required
                >
                  {weekdays.map((day) => (
                    <option key={day.value} value={day.value}>
                      {day.label} ({day.description})
                    </option>
                  ))}
                </select>
                <small className="form-text text-muted">
                  İndirimin hangi gün geçerli olacağını seçin
                </small>
              </div>
            </div>

            <div className="row">
              <div className="col-md-6 mb-3">
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

            <div className="row">
              <div className="col-12">
                <div className="d-flex gap-3">
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={isCreating}
                  >
                    {isCreating ? (
                      <>
                        <span
                          className="spinner-border spinner-border-sm me-2"
                          role="status"
                          aria-hidden="true"
                        ></span>
                        Güncelleniyor...
                      </>
                    ) : (
                      "İndirimi Güncelle"
                    )}
                  </button>
                  <Link
                    href="/admin/campaigns/weekday-discount"
                    className="btn btn-outline-secondary"
                  >
                    İptal
                  </Link>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default EditWeekdayDiscount;
