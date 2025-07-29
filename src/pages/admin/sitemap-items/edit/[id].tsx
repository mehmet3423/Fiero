import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { useGetSitemapItemById } from '@/hooks/services/sitemap-item/useGetSitemapItemById';
import { useUpdateSitemapItem } from '@/hooks/services/sitemap-item/useUpdateSitemapItem';
import { toast } from 'react-hot-toast';

const changeFrequencyOptions = [
  { value: 'always', label: 'Her zaman' },
  { value: 'hourly', label: 'Saatlik' },
  { value: 'daily', label: 'Günlük' },
  { value: 'weekly', label: 'Haftalık' },
  { value: 'monthly', label: 'Aylık' },
  { value: 'yearly', label: 'Yıllık' },
  { value: 'never', label: 'Asla' },
];

function EditSitemapItemPage() {
  const router = useRouter();
  const { id } = router.query;
  const { item, isLoading, error, refetch } = useGetSitemapItemById(typeof id === 'string' ? id : '', !!id);
  const { updateSitemapItem, isLoading: isUpdating, error: updateError } = useUpdateSitemapItem();
  const [form, setForm] = useState({
    id: '',
    url: '',
    changeFrequency: 'monthly',
    priority: 0.5,
  });
  const [priorityTouched, setPriorityTouched] = useState(false);

  useEffect(() => {
    if (item) {
      setForm({
        id: item.id,
        url: item.url,
        changeFrequency: item.changeFrequency,
        priority: item.priority,
      });
    }
  }, [item]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name === 'priority') {
      setPriorityTouched(true);
      let num = parseFloat(value);
      if (isNaN(num)) num = 0;
      if (num < 0) num = 0;
      if (num > 1) num = 1;
      setForm((prev) => ({ ...prev, [name]: num }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const validate = () => {
    if (!form.url || !form.url.startsWith('/')) {
      toast.error('URL alanı zorunludur ve "/" ile başlamalıdır.');
      return false;
    }
    if (!form.changeFrequency) {
      toast.error('Değişim sıklığı seçilmelidir.');
      return false;
    }
    if (form.priority < 0 || form.priority > 1) {
      toast.error('Öncelik 0 ile 1 arasında olmalıdır.');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    try {
      const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
      await updateSitemapItem({ ...form, baseUrl });
      toast.success('Sitemap kaydı başarıyla güncellendi. Yönlendiriliyorsunuz...');
      setTimeout(() => {
        router.push('/admin/sitemap-items');
      }, 1200);
    } catch (err) {
      toast.error('Kayıt güncellenemedi.');
    }
  };

  if (isLoading) {
    return (
      <div className="page-content">
        <div className="d-flex justify-content-center py-5">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Yükleniyor...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="page-content">
        <div className="alert alert-danger">Kayıt bulunamadı veya yüklenemedi.</div>
        <Link href="/admin/sitemap-items" className="btn btn-outline-secondary">Geri Dön</Link>
      </div>
    );
  }

  return (
    <div className="page-content">
      <div className="row g-3">
        <div className="col-12">
          <div className="card-header bg-transparent border-0 d-flex justify-content-between align-items-center" style={{ padding: '20px' }}>
            <h6 className="mb-0" style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>
              Sitemap Kaydını Güncelle
            </h6>
            <Link href="/admin/sitemap-items" className="btn btn-outline-secondary btn-sm">
              Geri Dön
            </Link>
          </div>
          <div className="card">
            <div className="card-body">
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label">Sayfa Yolu (URL) <span className="text-danger">*</span></label>
                  <input
                    type="text"
                    className="form-control"
                    name="url"
                    value={form.url}
                    onChange={handleChange}
                    placeholder="/ornek-sayfa"
                    required
                  />
                  <small className="text-muted">Örnek: <b>/hakkimizda</b> veya <b>/iletisim</b></small>
                </div>
                <div className="mb-3">
                  <label className="form-label">Değişim Sıklığı <span className="text-danger">*</span></label>
                  <select
                    className="form-select"
                    name="changeFrequency"
                    value={form.changeFrequency}
                    onChange={handleChange}
                    required
                  >
                    {changeFrequencyOptions.map(opt => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                </div>
                <div className="mb-3">
                  <label className="form-label">Öncelik (0-1) <span className="text-danger">*</span></label>
                  <input
                    type="number"
                    className={`form-control${priorityTouched && (form.priority < 0 || form.priority > 1) ? ' is-invalid' : ''}`}
                    name="priority"
                    value={form.priority}
                    onChange={handleChange}
                    min={0}
                    max={1}
                    step={0.1}
                    required
                    onBlur={() => setPriorityTouched(true)}
                  />
                  <small className="text-muted">0 (en düşük) - 1 (en yüksek)</small>
                  {priorityTouched && (form.priority < 0 || form.priority > 1) && (
                    <div className="text-danger">Öncelik değeri 0 ile 1 arasında olmalıdır.</div>
                  )}
                </div>
                <div className="d-flex gap-2 justify-content-end">
                  <Link href="/admin/sitemap-items" className="btn btn-outline-secondary">
                    İptal
                  </Link>
                  <button type="submit" className="btn btn-primary" disabled={isUpdating}>
                    {isUpdating ? 'Güncelleniyor...' : 'Sitemap Kaydını Güncelle'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
      <style jsx>{`
        .card {
          border: 1px solid #e0e0e0;
          border-radius: 0.5rem;
        }
        .card-header {
          padding: 0.75rem;
          background-color: #fafafa;
          border-bottom: 1px solid #e0e0e0;
        }
        .page-content {
          padding: 0.5rem 0;
        }
      `}</style>
    </div>
  );
}

export default EditSitemapItemPage;
