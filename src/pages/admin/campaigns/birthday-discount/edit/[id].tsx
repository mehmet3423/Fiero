import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useCreateBirthdayDiscount } from "@/hooks/services/discounts/birthday-discount/useCreateBirthdayDiscount";
import Link from "next/link";
import { useUpdateBirthdayDiscount } from "@/hooks/services/discounts/birthday-discount/useUpdateBirthdayDiscount";
import { DiscountType } from "@/constants/enums/DiscountType";
import { BirthdayDiscount } from "@/constants/models/Discount";
import { useGetDiscountList } from "@/hooks/services/discounts/useGetDiscountList";

interface BirthdayDiscountForm {
  name: string;
  description: string;
  discountValue: number;
  discountValueType: number;
  maxDiscountValue: number;
  startDate: string;
  endDate: string;
  validDaysBefore: number;
  validDaysAfter: number;
  isActive: boolean;
  type: DiscountType;
  isWithinActiveDateRange: boolean;
}

function EditBirthdayDiscount() {
  const router = useRouter();
  const { id } = router.query;
  const { updateDiscount, isPending: isUpdating } = useUpdateBirthdayDiscount();

  // Fetch discount data for edit mode
  const { discounts: allDiscounts, isLoading: isLoadingDiscounts } =
    useGetDiscountList({
      discountType: DiscountType.BirthdayDiscount,
    });

  const [formData, setFormData] = useState<BirthdayDiscountForm>({
    name: "",
    description: "",
    discountValue: 0,
    discountValueType: 1,
    maxDiscountValue: 0,
    startDate: "",
    endDate: "",
    validDaysBefore: 7,
    validDaysAfter: 7,
    isActive: true,
    type: DiscountType.BirthdayDiscount,
    isWithinActiveDateRange: false,
  });

  const [isDataLoaded, setIsDataLoaded] = useState(false);

  useEffect(() => {
    if (id && allDiscounts.length > 0 && !isDataLoaded) {
      // ID'yi string olarak karşılaştır (router.query string döner)
      const discount = allDiscounts.find(
        (d) => d.id === String(id)
      ) as BirthdayDiscount;
      if (discount) {
        // API'den gelen veride birthday-specific alanlar olmayabilir
        // Bu durumda default değerleri kullanıyoruz
        const validDaysBefore = discount.validDaysBefore ?? 7;
        const validDaysAfter = discount.validDaysAfter ?? 7;

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
          validDaysBefore: validDaysBefore,
          validDaysAfter: validDaysAfter,
          isActive: discount.isActive,
          type: DiscountType.BirthdayDiscount,
          isWithinActiveDateRange: discount.isWithinActiveDateRange || false,
        });
        setIsDataLoaded(true);
      } else {
      }
    }
  }, [id, allDiscounts, isDataLoaded]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const apiData: BirthdayDiscount = {
        id: String(id),
        ...formData,
        createdOn: Date.now(),
        createdOnValue: new Date().toISOString(),
      };
      // Son kontrol: discountValueType'ı number'a çevir
      if (typeof apiData.discountValueType === "string") {
        apiData.discountValueType = parseInt(apiData.discountValueType, 10);
      }

      await updateDiscount(apiData);
      router.push("/admin/campaigns/birthday-discount");
    } catch (error) {
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
                href="/admin/campaigns/birthday-discount"
                className="text-muted fw-light hover:text-primary"
              >
                Doğum Günü İndirimleri
              </Link>{" "}
              /
            </span>{" "}
            İndirim Düzenle
          </h4>
          <Link
            href="/admin/campaigns/birthday-discount"
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
          <form onSubmit={(e) => { handleSubmit(e); }}>
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
                  placeholder="Doğum günü indirimi adı"
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
                  onChange={handleChange}
                  required
                >
                  <option value="1">Yüzde (%)</option>
                  <option value="2">Tutar (₺)</option>
                </select>
              </div>
              <div className="col-md-4 mb-3">
                <label className="form-label">Maksimum İndirim Değeri *</label>
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
                <label className="form-label">
                  Doğum Gününden Önce Geçerli Gün Sayısı *
                </label>
                <input
                  type="number"
                  className="form-control"
                  name="validDaysBefore"
                  value={formData.validDaysBefore}
                  onChange={handleChange}
                  min={0}
                  onWheel={(e) => (e.target as HTMLInputElement).blur()}
                  required
                  placeholder="Örn: 7 (7 gün önce)"
                />
                <small className="form-text text-muted">
                  İndirimin doğum gününden kaç gün önce başlayacağı
                </small>
              </div>
              <div className="col-md-6 mb-3">
                <label className="form-label">
                  Doğum Gününden Sonra Geçerli Gün Sayısı *
                </label>
                <input
                  type="number"
                  className="form-control"
                  name="validDaysAfter"
                  value={formData.validDaysAfter}
                  onChange={handleChange}
                  min={0}
                  required
                  onWheel={(e) => (e.target as HTMLInputElement).blur()}
                  placeholder="Örn: 7 (7 gün sonra)"
                />
                <small className="form-text text-muted">
                  İndirimin doğum gününden kaç gün sonra biteceği
                </small>
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
                disabled={isUpdating}
              >
                {isUpdating ? (
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
                href="/admin/campaigns/birthday-discount"
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
export default EditBirthdayDiscount;
