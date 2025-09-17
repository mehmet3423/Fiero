import React, { useState, useEffect, useRef } from 'react';
import { useSendInvoiceLink } from '@/hooks/services/admin-trendyol-marketplace/useSendInvoiceLink';
import toast from 'react-hot-toast';

interface UploadInvoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  orderNumber: string;
  shipmentPackageId?: number;
}

const UploadInvoiceModal: React.FC<UploadInvoiceModalProps> = ({
  isOpen,
  onClose,
  orderNumber,
  shipmentPackageId
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [invoiceNumber, setInvoiceNumber] = useState<string>('');
  const [invoiceDate, setInvoiceDate] = useState<string>('');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedFileUrl, setUploadedFileUrl] = useState<string>('');
  const [validationErrors, setValidationErrors] = useState<{ [key: string]: string }>({});
  const [isDragActive, setIsDragActive] = useState(false);
  const [filePreview, setFilePreview] = useState<string>('');
  const [showPdfPreview, setShowPdfPreview] = useState(false);
  const [pdfUrl, setPdfUrl] = useState<string>('');
  const isModalOpenRef = useRef(false);

  // Hooks
  const { sendInvoiceLink, isPending: isSendingInvoice } = useSendInvoiceLink();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const processFile = (file: File) => {
    // Validate file type and size
    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'];
    const maxSize = 10 * 1024 * 1024; // 10MB

    if (!allowedTypes.includes(file.type)) {
      toast.error('Sadece PDF, JPEG, JPG ve PNG formatları desteklenir');
      return;
    }

    if (file.size > maxSize) {
      toast.error('Dosya boyutu çok büyük (maksimum 10MB)');
      return;
    }

    setSelectedFile(file);
    // Clear uploaded file URL when new file is selected
    setUploadedFileUrl('');

    // Create file preview
    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setFilePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
      setPdfUrl('');
    } else if (file.type === 'application/pdf') {
      setFilePreview('');
      // Create object URL for PDF preview
      const objectUrl = URL.createObjectURL(file);
      setPdfUrl(objectUrl);
    } else {
      setFilePreview('');
      setPdfUrl('');
    }
  };

  const uploadToCloudinary = async (file: File): Promise<string | null> => {
    try {
      setIsUploading(true);

      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', process.env.NEXT_PUBLIC_CLOUDINARY_PRESET_NAME || '');
      formData.append('folder', 'trendyol-invoices'); // Organize invoices in a specific folder

      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/upload`,
        {
          method: 'POST',
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error('Dosya yüklenemedi');
      }

      const data = await response.json();
      return data.secure_url;

    } catch (error) {
      toast.error('Dosya yüklenirken bir hata oluştu');
      return null;
    } finally {
      setIsUploading(false);
    }
  };

  const validateInvoiceNumber = (invoiceNum: string): boolean => {
    // Trendyol invoice number validation:
    // First 3 characters: alphanumeric
    // Next 4 characters: year (2020-2099)
    // Remaining 9 characters: numeric
    // Total length: 16 characters

    if (!invoiceNum || invoiceNum.length !== 16) {
      setValidationErrors(prev => ({ ...prev, invoiceNumber: 'Fatura numarası 16 karakter olmalıdır' }));
      return false;
    }

    const firstThree = invoiceNum.substring(0, 3);
    const year = invoiceNum.substring(3, 7);
    const lastNine = invoiceNum.substring(7, 16);

    // Check first 3 characters are alphanumeric
    const alphanumericRegex = /^[A-Za-z0-9]{3}$/;
    if (!alphanumericRegex.test(firstThree)) {
      setValidationErrors(prev => ({ ...prev, invoiceNumber: 'İlk 3 karakter alfa-nümerik olmalıdır' }));
      return false;
    }

    // Check year is valid (2020-2099)
    const yearRegex = /^[0-9]{4}$/;
    if (!yearRegex.test(year)) {
      setValidationErrors(prev => ({ ...prev, invoiceNumber: '4-7. karakterler sayı olmalıdır (yıl)' }));
      return false;
    }
    
    const yearNum = parseInt(year);
    if (yearNum < 2020 || yearNum > 2099) {
      setValidationErrors(prev => ({ ...prev, invoiceNumber: 'Yıl 2020-2099 arasında olmalıdır' }));
      return false;
    }

    // Check last 9 characters are numeric
    const numericRegex = /^[0-9]{9}$/;
    if (!numericRegex.test(lastNine)) {
      setValidationErrors(prev => ({ ...prev, invoiceNumber: 'Son 9 karakter sayı olmalıdır' }));
      return false;
    }

    // Clear validation error if valid
    setValidationErrors(prev => ({ ...prev, invoiceNumber: '' }));
    return true;
  };

  const validateInvoiceDate = (dateStr: string): boolean => {
    if (!dateStr) {
      setValidationErrors(prev => ({ ...prev, invoiceDate: 'Fatura tarihi gereklidir' }));
      return false;
    }

    const date = new Date(dateStr);
    if (isNaN(date.getTime())) {
      setValidationErrors(prev => ({ ...prev, invoiceDate: 'Geçerli bir tarih giriniz' }));
      return false;
    }

    // Clear validation error if valid
    setValidationErrors(prev => ({ ...prev, invoiceDate: '' }));
    return true;
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      toast.error('Lütfen bir dosya seçin');
      return;
    }

    if (!shipmentPackageId) {
      toast.error('Paket ID bulunamadı');
      return;
    }

    // Validate invoice number and date if provided
    let isValid = true;

    if (invoiceNumber && !validateInvoiceNumber(invoiceNumber)) {
      isValid = false;
    }

    if (invoiceDate && !validateInvoiceDate(invoiceDate)) {
      isValid = false;
    }

    if (!isValid) {
      toast.error('Lütfen hataları düzeltin');
      return;
    }

    try {
      // First upload file to Cloudinary
      let fileUrl = uploadedFileUrl;

      if (!fileUrl) {
        const uploadResult = await uploadToCloudinary(selectedFile);
        if (!uploadResult) {
          return; // Upload failed, error already shown
        }
        fileUrl = uploadResult;
        setUploadedFileUrl(fileUrl);
      }

      // Prepare invoice data
      const invoiceData = {
        invoiceLink: fileUrl,
        shipmentPackageId: shipmentPackageId,
        invoiceNumber: invoiceNumber || undefined,
        invoiceDateTime: invoiceDate ? Math.floor(new Date(invoiceDate).getTime() / 1000) : undefined
      };

      // Send invoice link to Trendyol
      await sendInvoiceLink(invoiceData);

      // Reset form and close modal on success
      setSelectedFile(null);
      setInvoiceNumber('');
      setInvoiceDate('');
      setUploadedFileUrl('');
      setValidationErrors({});

      // Close modal
      const modalElement = $("#uploadInvoiceModal");
      modalElement.modal("hide");

      // Backdrop cleanup
      setTimeout(() => {
        $(".modal-backdrop").remove();
        $("body").removeClass("modal-open");
        $("body").css("padding-right", "");
      }, 150);

      onClose();

    } catch (error) {
      // Error handling is done in the useSendInvoiceLink hook
    }
  };

  const handleRemoveFile = () => {
    // Clean up object URL to prevent memory leaks
    if (pdfUrl) {
      URL.revokeObjectURL(pdfUrl);
    }

    setSelectedFile(null);
    setUploadedFileUrl('');
    setFilePreview('');
    setPdfUrl('');
    setShowPdfPreview(false);
  };

  const resetForm = () => {
    // Clean up object URL to prevent memory leaks
    if (pdfUrl) {
      URL.revokeObjectURL(pdfUrl);
    }

    setSelectedFile(null);
    setInvoiceNumber('');
    setInvoiceDate('');
    setUploadedFileUrl('');
    setValidationErrors({});
    setFilePreview('');
    setPdfUrl('');
    setIsDragActive(false);
    setShowPdfPreview(false);
  };

  useEffect(() => {
    const modalElement = $("#uploadInvoiceModal");

    if (isOpen) {
      // Reset form when opening
      resetForm();
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
    const modalElement = $("#uploadInvoiceModal");

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

  return (
    <div
      className="modal fade"
      id="uploadInvoiceModal"
      tabIndex={-1}
      aria-labelledby="uploadInvoiceModalLabel"
      aria-hidden="true"
    >
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title" id="uploadInvoiceModalLabel">
              Fatura Yükle
            </h5>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div className="modal-body">
            {/* Warning Banner */}
            <div className="alert alert-warning mb-4" role="alert" style={{ border: '1px solid #ffc107', backgroundColor: '#fff3cd' }}>
              <div style={{ fontSize: '14px' }}>
                Bu alandan faturanızı pdf, jpeg, jpg, png dosya türlerinde yükleyerek otomatik olarak müşteriye gönderebilirsiniz. <span className="text-decoration-underline fw-bold">Entegratör linkinden</span> fatura besliyorsanız bu alandan ayrıca yükleme yapmanıza gerek yoktur.
              </div>
            </div>

            {/* Invoice Information Fields */}
            <div className="row mb-4">
              <div className="col-md-6">
                <label htmlFor="invoiceNumber" className="form-label">
                  Fatura Numarası <span className="text-muted">(İsteğe Bağlı)</span>
                </label>
                <input
                  type="text"
                  className={`form-control ${validationErrors.invoiceNumber ? 'is-invalid' : ''}`}
                  id="invoiceNumber"
                  placeholder="Örn: TY42024567890123"
                  value={invoiceNumber}
                  onChange={(e) => {
                    setInvoiceNumber(e.target.value);
                    if (e.target.value) {
                      validateInvoiceNumber(e.target.value);
                    } else {
                      setValidationErrors(prev => ({ ...prev, invoiceNumber: '' }));
                    }
                  }}
                  maxLength={16}
                />
                {validationErrors.invoiceNumber && (
                  <div className="invalid-feedback">
                    {validationErrors.invoiceNumber}
                  </div>
                )}
              </div>
              <div className="col-md-6">
                <label htmlFor="invoiceDate" className="form-label">
                  Fatura Tarihi <span className="text-muted">(İsteğe Bağlı)</span>
                </label>
                <input
                  type="date"
                  className={`form-control ${validationErrors.invoiceDate ? 'is-invalid' : ''}`}
                  id="invoiceDate"
                  value={invoiceDate}
                  onChange={(e) => {
                    setInvoiceDate(e.target.value);
                    if (e.target.value) {
                      validateInvoiceDate(e.target.value);
                    } else {
                      setValidationErrors(prev => ({ ...prev, invoiceDate: '' }));
                    }
                  }}
                />
                {validationErrors.invoiceDate && (
                  <div className="invalid-feedback">
                    {validationErrors.invoiceDate}
                  </div>
                )}
              </div>
            </div>

            {/* Legal Notice for Micro Export */}
            <div className="alert alert-info mb-4" role="alert" style={{ fontSize: '13px' }}>
              <i className="bx bx-info-circle me-2"></i>
              <strong>Önemli Bilgiler:</strong>
              <ul className="mb-0 mt-2" style={{ paddingLeft: '20px' }}>
                <li>Fatura numarası ve tarihi mikro ihracat gönderileri için zorunludur, diğer gönderiler için isteğe bağlıdır.</li>
                <li>Yüklediğiniz fatura dosyalarının yasal gereklilik nedeniyle 10 yıl boyunca erişilebilir olması gerekmektedir.</li>
              </ul>
            </div>

            {/* File Upload Area */}
            <div className="mb-4">
              <div
                className={`border-3 border-dashed rounded p-5 text-center transition-all duration-300 ${isDragActive
                  ? 'bg-warning bg-opacity-10 border-warning shadow-sm'
                  : 'bg-light border-secondary border-opacity-25'
                  }`}
                style={{
                  minHeight: '250px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  transition: 'all 0.3s ease',
                  transform: isDragActive ? 'scale(1.02)' : 'scale(1)'
                }}
                onDragEnter={(e) => {
                  e.preventDefault();
                  setIsDragActive(true);
                }}
                onDragOver={(e) => {
                  e.preventDefault();
                  setIsDragActive(true);
                }}
                onDragLeave={(e) => {
                  e.preventDefault();
                  // Only set to false if we're leaving the entire drop zone
                  if (!e.currentTarget.contains(e.relatedTarget as Node)) {
                    setIsDragActive(false);
                  }
                }}
                onDrop={(e) => {
                  e.preventDefault();
                  setIsDragActive(false);

                  const files = e.dataTransfer.files;
                  if (files.length > 0) {
                    processFile(files[0]);
                  }
                }}
              >
                <input
                  type="file"
                  className="form-control"
                  id="invoiceFile"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={handleFileChange}
                  style={{ display: 'none' }}
                />

                {/* Upload Icon with animation */}
                <div className="mb-3">
                  <i
                    className={`bx ${isDragActive ? 'bx-down-arrow-alt animate-bounce' : 'bx-upload'}`}
                    style={{
                      fontSize: '3rem',
                      color: isDragActive ? '#ff8c00' : '#6c757d',
                      transition: 'all 0.3s ease'
                    }}
                  ></i>
                </div>

                {/* Dynamic content based on drag state */}
                {isDragActive ? (
                  <>
                    <h6 className="mb-3 text-warning" style={{ fontSize: '18px', fontWeight: 'bold' }}>
                      Dosyayı Buraya Bırakın
                    </h6>
                    <p className="text-warning mb-4" style={{ fontSize: '14px', fontWeight: '500' }}>
                      Fatura dosyanızı yüklemek için bırakın
                    </p>
                  </>
                ) : (
                  <>
                    <h6 className="mb-3" style={{ fontSize: '18px', fontWeight: 'bold', color: '#333' }}>
                      Fatura Dosyası Yükle
                    </h6>
                    <p className="text-muted mb-4" style={{ fontSize: '14px' }}>
                      Dosyayı seçiniz veya <strong>sürükleyerek bu alana bırakınız</strong>
                      <br />
                      <small className="text-muted">Desteklenen formatlar: PDF, JPEG, JPG, PNG (Max: 10MB)</small>
                    </p>

                    {/* Upload Button */}
                    <label htmlFor="invoiceFile" className="btn btn-warning text-white px-4 py-2" style={{ backgroundColor: '#ff8c00', borderColor: '#ff8c00' }}>
                      <i className="bx bx-folder-open me-2"></i>
                      Dosya Seç
                    </label>
                  </>
                )}
              </div>
            </div>

            {/* Selected File Info with Preview */}
            {selectedFile && (
              <div className="mb-4">
                <div className="card border-success shadow-sm">
                  <div className="card-header bg-light border-success d-flex justify-content-between align-items-center" style={{ backgroundColor: '#f8f9fa !important' }}>
                    <div className="d-flex align-items-center">
                      <i className="bx bx-check-circle text-success me-2" style={{ fontSize: '1.2rem' }}></i>
                      <span className="fw-bold text-success">Dosya Seçildi</span>
                    </div>
                    <button
                      type="button"
                      className="btn btn-sm btn-outline-danger"
                      onClick={handleRemoveFile}
                      disabled={isUploading}
                      title="Dosyayı Kaldır"
                    >
                      <i className="bx bx-trash"></i>
                    </button>
                  </div>

                  <div className="card-body">
                    <div className="row align-items-center">
                      {/* File Preview */}
                      <div className="col-md-3">
                        <div className="text-center">
                          {filePreview ? (
                            <img
                              src={filePreview}
                              alt="Dosya Önizleme"
                              className="img-thumbnail"
                              style={{
                                maxWidth: '100px',
                                maxHeight: '100px',
                                objectFit: 'cover',
                                border: '2px solid #28a745',
                                cursor: 'pointer'
                              }}
                              onClick={() => window.open(filePreview, '_blank')}
                              title="Büyük boyutta görmek için tıklayın"
                            />
                          ) : pdfUrl ? (
                            <div
                              className="d-flex flex-column align-items-center justify-content-center bg-light rounded position-relative"
                              style={{
                                width: '100px',
                                height: '100px',
                                border: '2px solid #28a745',
                                cursor: 'pointer'
                              }}
                              onClick={() => setShowPdfPreview(true)}
                              title="PDF önizlemesi için tıklayın"
                            >
                              <i className="bx bxs-file-pdf text-danger" style={{ fontSize: '2.5rem' }}></i>
                              <small className="text-dark mt-1 fw-bold">PDF</small>
                              <div
                                className="position-absolute top-0 end-0 bg-primary text-white rounded-circle d-flex align-items-center justify-content-center"
                                style={{ width: '20px', height: '20px', fontSize: '10px', transform: 'translate(25%, -25%)' }}
                              >
                                <i className="bx bx-show"></i>
                              </div>
                            </div>
                          ) : (
                            <div
                              className="d-flex flex-column align-items-center justify-content-center bg-light rounded"
                              style={{
                                width: '100px',
                                height: '100px',
                                border: '2px solid #28a745'
                              }}
                            >
                              <i className="bx bx-file text-secondary" style={{ fontSize: '2.5rem' }}></i>
                              <small className="text-muted mt-1">Dosya</small>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* File Info */}
                      <div className="col-md-9">
                        <div className="row">
                          <div className="col-12">
                            <p className="mb-2">
                              <strong>Dosya Adı:</strong>
                              <span className="text-primary ms-1">{selectedFile.name}</span>
                            </p>
                          </div>
                          <div className="col-md-6">
                            <p className="mb-2">
                              <strong>Boyut:</strong>
                              <span className="text-primary ms-1 fw-bold">
                                {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                              </span>
                            </p>
                          </div>
                          <div className="col-md-6">
                            <p className="mb-2">
                              <strong>Tür:</strong>
                              <span className="text-secondary ms-1 fw-bold">
                                {selectedFile.type.split('/')[1].toUpperCase()}
                              </span>
                            </p>
                          </div>
                        </div>

                        {/* File Status */}
                        <div className="mt-2">
                          {uploadedFileUrl ? (
                            <span className="badge bg-success">
                              <i className="bx bx-check me-1"></i>
                              Yükleme Tamamlandı
                            </span>
                          ) : (
                            <span className="badge text-dark">
                              <i className="bx bx-time me-1"></i>
                              Yüklenmeyi Bekliyor
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Upload Progress */}
            {isUploading && (
              <div className="mb-4">
                <div className="alert alert-info" role="alert">
                  <div className="d-flex align-items-center">
                    <div className="spinner-border spinner-border-sm me-2" role="status">
                      <span className="visually-hidden">Yükleniyor...</span>
                    </div>
                    Dosya yükleniyor, lütfen bekleyin...
                  </div>
                </div>
              </div>
            )}

            {/* Upload Success */}
            {uploadedFileUrl && (
              <div className="mb-4">
                <div className="alert alert-success" role="alert">
                  <i className="bx bx-check-circle me-2"></i>
                  <strong>Dosya başarıyla yüklendi!</strong> Şimdi Trendyol'a fatura bağlantısı gönderilecek.
                </div>
              </div>
            )}
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-outline-secondary" data-bs-dismiss="modal">
              Vazgeç
            </button>
            <button
              type="button"
              className="btn text-white"
              onClick={handleUpload}
              disabled={!selectedFile || isUploading || isSendingInvoice}
              style={{ backgroundColor: '#ff8c00', borderColor: '#ff8c00' }}
            >
              {isUploading ? (
                <>
                  <div className="spinner-border spinner-border-sm me-2" role="status">
                    <span className="visually-hidden">Yükleniyor...</span>
                  </div>
                  Dosya Yükleniyor...
                </>
              ) : isSendingInvoice ? (
                <>
                  <div className="spinner-border spinner-border-sm me-2" role="status">
                    <span className="visually-hidden">Gönderiliyor...</span>
                  </div>
                  Trendyol'a Gönderiliyor...
                </>
              ) : (
                'Faturayı Yükle ve Gönder'
              )}
            </button>
          </div>
        </div>
      </div>

      {/* PDF Preview Modal */}
      {showPdfPreview && pdfUrl && (
        <div
          className="modal fade show"
          style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}
          onClick={() => setShowPdfPreview(false)}
        >
          <div
            className="modal-dialog modal-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  <i className="bx bxs-file-pdf text-danger me-2"></i>
                  PDF Önizleme: {selectedFile?.name}
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowPdfPreview(false)}
                ></button>
              </div>
              <div className="modal-body p-0">
                <iframe
                  src={pdfUrl}
                  style={{
                    width: '100%',
                    height: '70vh',
                    border: 'none'
                  }}
                  title="PDF Önizleme"
                />
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-outline-primary"
                  onClick={() => window.open(pdfUrl, '_blank')}
                >
                  <i className="bx bx-external-link me-1"></i>
                  Yeni Sekmede Aç
                </button>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowPdfPreview(false)}
                >
                  Kapat
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UploadInvoiceModal;