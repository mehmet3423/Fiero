import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useUpdateSpecialDayDiscount } from "@/hooks/services/discounts/specialDay-discount/useUpdateSpecialDayDiscount";
import Link from "next/link";
import { DiscountType } from "@/constants/enums/DiscountType";
import { SpecialDayDiscount } from "@/constants/models/Discount";
import { useGetDiscountList } from "@/hooks/services/discounts/useGetDiscountList";
import SpecialDayDiscountPage from "..";

interface SpecialDayDiscountForm {
  name: string;
  description: string;
  discountValue: number;
  discountValueType: number;
  maxDiscountValue: number;
  startDate: string;
  endDate: string;
  day: number;
  month: number;
  isActive: boolean;
  type: DiscountType;
  isWithinActiveDateRange: boolean;
}

function EditSpecialDayDiscount() {
  const router = useRouter();
  const { id } = router.query;

  const { updateDiscount, isPending } = useUpdateSpecialDayDiscount();

  // Fetch discount data for edit mode
  const { discounts: allDiscounts, isLoading: isLoadingDiscounts } =
    useGetDiscountList({
      discountType: DiscountType.SpecialDayDiscount,
    });

  const [formData, setFormData] = useState<SpecialDayDiscountForm>({
    name: "",
    description: "",
    discountValue: 0,
    discountValueType: 1,
    maxDiscountValue: 0,
    startDate: "",
    endDate: "",
    day: 1,
    month: 1,
    isActive: true,
    type: DiscountType.SpecialDayDiscount,
    isWithinActiveDateRange: false,
  });

  const [isDataLoaded, setIsDataLoaded] = useState(false);

  useEffect(() => {
    if (id && allDiscounts.length > 0 && !isDataLoaded) {
      // ID'yi string olarak karşılaştır (router.query string döner)
      const discount = allDiscounts.find(
        (d) => d.id === String(id)
      ) as SpecialDayDiscount;
      if (discount) {
        const day = discount.day ?? 1;
        const month = discount.month ?? 1;

        setFormData({
          name: discount.name,
          description: discount.description || "",
          discountValue: discount.discountValue,
          discountValueType:
            typeof discount.discountValueType === "string"
              ? parseInt(discount.discountValueType, 10)
              : discount.discountValueType,
          maxDiscountValue: discount.maxDiscountValue || 0,
          startDate: discount.startDate.includes("T")
            ? discount.startDate.slice(0, 16)
            : new Date(discount.startDate).toISOString().slice(0, 16),
          endDate: discount.endDate.includes("T")
            ? discount.endDate.slice(0, 16)
            : new Date(discount.endDate).toISOString().slice(0, 16),
          day: discount.specialDayDiscount?.day ?? 1,
          month: discount.specialDayDiscount?.month ?? 1,
          isActive: discount.isActive,
          type: DiscountType.SpecialDayDiscount,
          isWithinActiveDateRange: discount.isWithinActiveDateRange ?? false,
        });
        setIsDataLoaded(true);
      } else {
      }
    }
  }, [id, allDiscounts, isDataLoaded]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const apiData: SpecialDayDiscount = {
        id: String(id),
        ...formData,
        createdOn: 0, // API dolduracaksa 0 bırak
        createdOnValue: "", // API dolduracaksa boş bırak
      };

      // Son kontrol: discountValueType'ı number'a çevir
      if (typeof apiData.discountValueType === "string") {
        apiData.discountValueType = parseInt(apiData.discountValueType, 10);
      }

      await updateDiscount(apiData);
      router.push("/admin/campaigns/special-day-discount");
    } catch (error) {
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;

    // Number olması gereken alanları belirle
    const numberFields = [
      "discountValueType",
      "day",
      "month",
      "discountValue",
      "maxDiscountValue",
    ];

    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox"
          ? (e.target as HTMLInputElement).checked
          : type === "number" || numberFields.includes(name)
            ? name === "discountValueType" || name === "day" || name === "month"
              ? parseInt(value, 10) // Integer alanlar için
              : parseFloat(value) // Float alanlar için
            : value,
    }));
  };

  const months = [
    { value: 1, label: "Ocak" },
    { value: 2, label: "Şubat" },
    { value: 3, label: "Mart" },
    { value: 4, label: "Nisan" },
    { value: 5, label: "Mayıs" },
    { value: 6, label: "Haziran" },
    { value: 7, label: "Temmuz" },
    { value: 8, label: "Ağustos" },
    { value: 9, label: "Eylül" },
    { value: 10, label: "Ekim" },
    { value: 11, label: "Kasım" },
    { value: 12, label: "Aralık" },
  ];

  const getDaysInMonth = (month: number) => {
    const daysInMonth = [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    return daysInMonth[month - 1];
  };

  const dayOptions = Array.from(
    { length: getDaysInMonth(formData.month) },
    (_, i) => i + 1
  );

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
                href="/admin/campaigns/special-day-discount"
                className="text-muted fw-light hover:text-primary"
              >
                Özel Gün İndirimleri
              </Link>{" "}
              /
            </span>{" "}
            İndirim Düzenle
          </h4>
          <Link
            href="/admin/campaigns/special-day-discount"
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
                  placeholder="Özel gün indirimi adı"
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
                  onWheel={(e) => (e.target as HTMLInputElement).blur()}
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
                  onChange={(e) => { handleChange(e); }}
                  required
                >
                  <option value={1}>Yüzde (%)</option>
                  <option value={2}>Tutar (₺)</option>
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
                  onWheel={(e) => (e.target as HTMLInputElement).blur()}
                  required
                  placeholder="Maksimum indirim değeri"
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
                <label className="form-label">Ay *</label>
                <select
                  className="form-select"
                  name="month"
                  value={formData.month}
                  onChange={handleChange}
                  required
                  onWheel={(e) => (e.target as HTMLInputElement).blur()}
                >
                  {months.map((month) => (
                    <option key={month.value} value={month.value}>
                      {month.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="col-md-6 mb-3">
                <label className="form-label">Gün *</label>
                <select
                  className="form-select"
                  name="day"
                  value={formData.day}
                  onChange={handleChange}
                  required
                  onWheel={(e) => (e.target as HTMLInputElement).blur()}
                >
                  {dayOptions.map((day) => (
                    <option key={day} value={day}>
                      {day}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="row mb-4">
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

            <div className="d-flex gap-3">
              <button
                type="submit"
                className="btn btn-primary"
                disabled={isPending}
              >
                {isPending ? (
                  <>
                    <span
                      className="spinner-border spinner-border-sm me-2"
                      role="status"
                      aria-hidden="true"
                    ></span>
                    Güncelleniyor...
                  </>
                ) : (
                  "İndirim Güncelle"
                )}
              </button>
              <Link
                href="/admin/campaigns/special-day-discount"
                className="btn btn-outline-secondary"
              >
                İptal
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default EditSpecialDayDiscount;
