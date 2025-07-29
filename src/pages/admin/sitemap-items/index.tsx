import React from 'react';
import { useGetPaginatedSitemapItems, SitemapItem } from '@/hooks/services/sitemap-item/useGetPaginatedSitemapItems';
import { useDeleteSitemapItem } from '@/hooks/services/sitemap-item/useDeleteSitemapItem';
import { useReportPagination } from '@/hooks/shared/useReportPagination';
import Link from 'next/link';
import CirclePagination from '@/components/shared/CirclePagination';
import GeneralModal from '@/components/shared/GeneralModal';

function SitemapItemListPage() {
  const {
    displayPage,
    pageSize,
    changePage,
    getApiParams,
  } = useReportPagination({ defaultPageSize: 10 });

  const [list, setList] = React.useState<SitemapItem[]>([]);
  const [totalCount, setTotalCount] = React.useState(0);
  const [deletingId, setDeletingId] = React.useState<string | null>(null);
  const { isLoading, fetchPaginatedSitemapItems } = useGetPaginatedSitemapItems();
  const { deleteSitemapItem, isLoading: isDeleting } = useDeleteSitemapItem();

  // Fetch data on mount and when page changes
  React.useEffect(() => {
    fetchPaginatedSitemapItems(getApiParams(), {
      onSuccess: (response: any) => {
        if (response && response.data && response.data.data) {
          setList(response.data.data.items || []);
          setTotalCount(response.data.data.count || 0);
        } else {
          setList([]);
          setTotalCount(0);
        }
      },
    });
  }, [displayPage, pageSize]);

  const handleDelete = (id: string) => {
    setDeletingId(id);
    // Modal açılacak
    const modal = document.getElementById('deleteConfirmModal');
    if (modal) {
      // Bootstrap modal ise:
      // @ts-ignore
      if (window.$) window.$(modal).modal('show');
    }
  };

  const handleConfirmDelete = async () => {
    if (deletingId) {
      await deleteSitemapItem(deletingId, {
        onSuccess: () => {
          // Modalı kapat
          const modal = document.getElementById('deleteConfirmModal');
          if (modal) {
            // @ts-ignore
            if (window.$) window.$(modal).modal('hide');
          }
          setDeletingId(null);
          // Listeyi yenile
          fetchPaginatedSitemapItems(getApiParams(), {
            onSuccess: (response: any) => {
              if (response && response.data && response.data.data) {
                setList(response.data.data.items || []);
                setTotalCount(response.data.data.count || 0);
              } else {
                setList([]);
                setTotalCount(0);
              }
            },
          });
        },
      });
    }
  };

  return (
    <div className="page-content">
      <div className="row g-3">
        <div className="col-12">
          <div className="card-header bg-transparent border-0 d-flex justify-content-between align-items-center" style={{ padding: '20px' }}>
            <h6 className="mb-0" style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>
              Sitemap Kayıtları Yönetimi
            </h6>
            <Link href="/admin/sitemap-items/create" className="btn btn-primary btn-sm">
              + Yeni Sitemap Kaydı Ekle
            </Link>
          </div>
          <div className="card">
            <div className="card-body">
              {isLoading ? (
                <div className="d-flex justify-content-center py-5">
                  <div className="spinner-border" role="status">
                    <span className="visually-hidden">Yükleniyor...</span>
                  </div>
                </div>
              ) : list.length === 0 ? (
                <div className="text-center py-4">
                  <p className="text-muted">Henüz bir sitemap kaydı bulunmuyor.</p>
                  <Link href="/admin/sitemap-items/create" className="btn btn-primary">
                    İlk Sitemap Kaydını Oluştur
                  </Link>
                </div>
              ) : (
                <>
                  <div className="table-responsive">
                    <table className="table table-striped">
                      <thead>
                        <tr>
                          <th>Sayfa Yolu (URL)</th>
                          <th>Değişim Sıklığı</th>
                          <th>Öncelik</th>
                          <th>Oluşturulma Tarihi</th>
                          <th>Güncellenme Tarihi</th>
                          <th>İşlemler</th>
                        </tr>
                      </thead>
                      <tbody>
                        {list.map((item) => (
                          <tr key={item.id}>
                            <td>{item.url}</td>
                            <td>{item.changeFrequency}</td>
                            <td>{item.priority}</td>
                            <td>{item.createdOnValue ? new Date(item.createdOnValue).toLocaleString('tr-TR') : '-'}</td>
                            <td>{item.modifiedOnValue ? new Date(item.modifiedOnValue).toLocaleString('tr-TR') : '-'}</td>
                            <td>
                              <div className="d-flex gap-2">
                                <Link href={`/admin/sitemap-items/edit/${item.id}`} className="btn btn-sm btn-outline-primary">
                                  Düzenle
                                </Link>
                                <button
                                  className="btn btn-sm btn-outline-danger"
                                  onClick={() => handleDelete(item.id)}
                                  disabled={isDeleting}
                                >
                                  Sil
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  {/* Pagination */}
                  {(totalCount ?? 0) > pageSize && (
                    <div className="d-flex justify-content-center p-3 border-top">
                      <CirclePagination
                        currentPage={displayPage}
                        totalCount={totalCount ?? 0}
                        pageSize={pageSize}
                        onPageChange={changePage}
                      />
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
      {/* Delete Confirm Modal */}
      <GeneralModal
        id="deleteConfirmModal"
        title="Sitemap Kaydını Sil"
        size="sm"
        onClose={() => setDeletingId(null)}
        onApprove={handleConfirmDelete}
        approveButtonText="Evet, Sil"
        isLoading={isDeleting}
        showFooter={true}
      >
        <div className="text-center">
          <i
            className="bx bx-error-circle mb-2"
            style={{ fontSize: "3rem", color: "#ff3e1d" }}
          ></i>
          <h6 style={{ fontSize: "0.9rem" }}>Emin misiniz?</h6>
          <p className="text-muted" style={{ fontSize: "0.8rem" }}>
            Bu sitemap kaydını silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.
          </p>
        </div>
      </GeneralModal>
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
        .table {
          font-size: 0.875rem;
        }
        .page-content {
          padding: 0.5rem 0;
        }
      `}</style>
    </div>
  );
}

export default SitemapItemListPage;
