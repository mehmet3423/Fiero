import GeneralModal from "@/components/shared/GeneralModal";
import {
  UpdateAffiliateCollectionRequest,
  AffiliateCollection,
} from "@/constants/models/Affiliate";
import { useUpdateAffiliateCollection } from "@/hooks/services/affiliate/useUpdateAffiliateCollection";
import { useGetAllProducts } from "@/hooks/services/products/useGetAllProducts";
import { useState, useEffect, useRef } from "react";
import toast from "react-hot-toast";

interface UpdateCollectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  collection: AffiliateCollection | null;
}

const UpdateCollectionModal: React.FC<UpdateCollectionModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  collection,
}) => {
  const { updateCollection, isPending } = useUpdateAffiliateCollection();
  const { data: productsData, isLoading: productsLoading } = useGetAllProducts({
    pageSize: 100,
  });

  const [formData, setFormData] = useState<UpdateAffiliateCollectionRequest>({
    id: "",
    name: "",
    description: "",
  });
  const [searchTerm, setSearchTerm] = useState("");
  const isModalOpenRef = useRef(false);

  useEffect(() => {
    if (collection) {
      setFormData({
        id: collection.id,
        name: collection.name,
        description: collection.description,
      });
    }
  }, [collection]);

  useEffect(() => {
    const modalElement = $("#updateCollectionModal");

    if (isOpen) {
      // Modal'ı göster
      isModalOpenRef.current = true;
      modalElement.modal("show");
    } else {
      // Modal'ı gizle
      isModalOpenRef.current = false;
      modalElement.modal("hide");

      // Backdrop'u temizle
      setTimeout(() => {
        $(".modal-backdrop").remove();
        $("body").removeClass("modal-open");
        $("body").css("padding-right", "");
      }, 150);
    }
  }, [isOpen]);

  // Bootstrap modal event listener'ları ekle
  useEffect(() => {
    const modalElement = $("#updateCollectionModal");

    const handleModalHidden = () => {
      // Modal tamamen kapatıldığında React state'ini güncelle
      // Sadece modal React state'inde açık olarak işaretlenmişse onClose'u çağır
      if (isModalOpenRef.current) {
        isModalOpenRef.current = false;

        // Backdrop'u temizle
        $(".modal-backdrop").remove();
        $("body").removeClass("modal-open");
        $("body").css("padding-right", "");

        onClose();
      }
    };

    // Modal kapatılma event'ini dinle
    modalElement.on("hidden.bs.modal", handleModalHidden);

    // Cleanup function
    return () => {
      modalElement.off("hidden.bs.modal", handleModalHidden);
    };
  }, [onClose]);

  const handleSubmit = async () => {
    if (!formData.name.trim()) {
      toast.error("Koleksiyon adı gereklidir");
      return;
    }

    if (!formData.description.trim()) {
      toast.error("Koleksiyon açıklaması gereklidir");
      return;
    }

    try {
      const collectionData = {
        ...formData,
      };

      await updateCollection(collectionData);

      // Modal'ı düzgün şekilde kapat
      const modalElement = $("#updateCollectionModal");
      modalElement.modal("hide");

      // Backdrop'u manuel olarak temizle
      setTimeout(() => {
        $(".modal-backdrop").remove();
        $("body").removeClass("modal-open");
        $("body").css("padding-right", "");
      }, 150);

      onSuccess?.();
      onClose();
    } catch (error) {
      console.error("Error updating collection:", error);
    }
  };

  const handleInputChange = (
    field: keyof UpdateAffiliateCollectionRequest,
    value: string
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const filteredProducts =
    productsData?.items?.filter((product) =>
      product.title.toLowerCase().includes(searchTerm.toLowerCase())
    ) || [];

  if (!collection) return null;

  return (
    <GeneralModal
      id="updateCollectionModal"
      title="Koleksiyonu Güncelle"
      showFooter={true}
      approveButtonText={
        isPending ? "Güncelleniyor..." : "Koleksiyonu Güncelle"
      }
      isLoading={isPending}
      onApprove={handleSubmit}
      onClose={onClose}
      size="lg"
    >
      <div className="row">
        <div className="col-md-6">
          <label className="form-label">
            Koleksiyon Adı <span className="text-danger">*</span>
          </label>
          <input
            type="text"
            className="form-control"
            placeholder="Koleksiyon adını girin"
            value={formData.name}
            onChange={(e) => handleInputChange("name", e.target.value)}
            maxLength={100}
          />
        </div>
      </div>

      <div className="mb-3">
        <label className="form-label">
          Açıklama <span className="text-danger">*</span>
        </label>
        <textarea
          className="form-control"
          rows={3}
          placeholder="Koleksiyon açıklamasını girin"
          value={formData.description}
          onChange={(e) => handleInputChange("description", e.target.value)}
          maxLength={500}
        />
        <small className="text-muted">
          {formData.description.length}/500 karakter
        </small>
      </div>

      <style jsx>{`
        .products-list::-webkit-scrollbar {
          width: 6px;
        }

        .products-list::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 3px;
        }

        .products-list::-webkit-scrollbar-thumb {
          background: #c1c1c1;
          border-radius: 3px;
        }

        .products-list::-webkit-scrollbar-thumb:hover {
          background: #a8a8a8;
        }

        .form-check:hover {
          background-color: #f8f9fa;
        }
      `}</style>
    </GeneralModal>
  );
};

export default UpdateCollectionModal;
