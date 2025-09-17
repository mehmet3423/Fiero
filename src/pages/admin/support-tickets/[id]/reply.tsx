import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import { SupportTicket } from "@/constants/models/SupportTicket";
import { GeneralSupportRequestType } from "@/constants/enums/support-ticket/GeneralSupportTicket/GeneralSupportRequestType";
import Link from "next/link";
import { GET_SUPPORT_TICKET_BY_ID, BASE_URL } from "@/constants/links";
import useMyMutation from "@/hooks/useMyMutation";
import { HttpMethod } from "@/constants/enums/HttpMethods";
import { useQueryClient } from "@tanstack/react-query";

export default function SupportTicketReplyPage() {
  const router = useRouter();
  const { id } = router.query;
  const queryClient = useQueryClient();

  const [ticket, setTicket] = useState<SupportTicket | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [replyContent, setReplyContent] = useState("");

  // Mutation hook'larını kullanarak API isteklerini yapıyoruz
  const getTicketMutation = useMyMutation<SupportTicket>();
  const replyMutation = useMyMutation<any>();

  useEffect(() => {
    if (!id) return;

    // ID'yi string olarak kullanıyoruz
    const ticketId = typeof id === "string" ? id : id[0];

    setLoading(true);

    // useMyMutation hook'unu kullanarak destek talebi detayını alıyoruz
    getTicketMutation.mutate(
      {
        url: `${GET_SUPPORT_TICKET_BY_ID}?id=${ticketId}`,
        method: HttpMethod.GET,
      },
      {
        onSuccess: (response) => {
          setTicket(response.data);
          setLoading(false);
        },
        onError: (err) => {
          setError(
            err instanceof Error ? err : new Error("Bilinmeyen bir hata oluştu")
          );
          setLoading(false);
        },
      }
    );
  }, [id, getTicketMutation]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!replyContent.trim()) {
      alert("Lütfen bir yanıt girin");
      return;
    }

    if (!id) {
      alert("Destek talebi ID'si bulunamadı");
      return;
    }

    // ID'yi string olarak kullanıyoruz
    const ticketId = typeof id === "string" ? id : id[0];

    // ÖNEMLİ NOT: Bu bir geçici çözümdür!
    // API'de şu anda destek talebine yanıt vermek için özel bir endpoint bulunmamaktadır.
    // Gerçek endpoint eklendiğinde aşağıdaki kod güncellenmelidir.

    // TODO: Gerçek ReplyGeneralSupportTicket endpoint'i eklendiğinde bu kısmı güncelle
    // Örnek gerçek implementasyon:
    // url: `${BASE_URL}GeneralSupportTicket/General/ReplyGeneralSupportTicket`,
    // method: HttpMethod.POST,
    // data: { ticketId: ticketId, content: replyContent },

    // Geçici simülasyon - gerçek yanıt gönderme işlemi yerine sadece detay sayfasına yönlendiriyoruz
    alert(
      "Yanıt gönderme özelliği henüz API'de mevcut değil. Backend ekibi ile iletişime geçiniz."
    );

    // Detay sayfasına yönlendir
    router.push(`/admin/support-tickets/${ticketId}`);

    // useMyMutation hook'unu kullanarak yanıt gönderiyoruz - şu anda devre dışı
    /*
    replyMutation.mutate(
      {
        url: `${BASE_URL}GeneralSupportTicket/General/GetGeneralSupportTicketById?id=${ticketId}`,
        method: HttpMethod.GET, // Geçici olarak GET kullanıyoruz
      },
      {
        onSuccess: () => {
          alert("Yanıtınız başarıyla gönderildi (Simülasyon)");
          
          queryClient.invalidateQueries({ queryKey: ["supportTickets"] });
          
          router.push(`/admin/support-tickets/${ticketId}`);
        },
        onError: (err) => {
          setError(
            err instanceof Error
              ? err
              : new Error("Yanıt gönderilirken bir hata oluştu")
          );
        },
      }
    );
    */
  };

  if (loading)
    return (
      <div className="loading-overlay">
        <div className="spinner"></div>
      </div>
    );

  if (error)
    return <div className="alert alert-danger">Hata: {error.message}</div>;

  if (!ticket)
    return <div className="alert alert-warning">Destek talebi bulunamadı</div>;

  return (
    <main className="main">
      <div
        className="page-header text-center"
        style={{ backgroundImage: 'url("/assets/images/page-header-bg.jpg")' }}
      >
        <div className="container">
          <h1 className="page-title">
            Destek Talebi Yanıtla
            <span>Ticket #{ticket.id.toString().slice(0, 8)}</span>
          </h1>
        </div>
      </div>

      <div className="page-content">
        <div className="container">
          <div className="row">
            <div className="col-lg-8">
              <div className="card">
                <div className="card-header d-flex justify-content-between align-items-center">
                  <h5 className="card-title mb-0">{ticket.title}</h5>
                  <span
                    className={`badge bg-${
                      ticket.status === 0 ? "warning" : "success"
                    }`}
                  >
                    {ticket.status === 0 ? "Beklemede" : "Yanıtlandı"}
                  </span>
                </div>
                <div className="card-body">
                  <div className="ticket-meta mb-4">
                    <div className="row">
                      <div className="col-md-6">
                        <p>
                          <strong>Müşteri ID:</strong> {ticket.customerId}
                        </p>
                        <p>
                          <strong>Talep Türü:</strong>{" "}
                          {GeneralSupportRequestType[ticket.requestType]}
                        </p>
                      </div>
                      <div className="col-md-6">
                        <p>
                          <strong>Oluşturulma Tarihi:</strong>{" "}
                          {new Date(ticket.createdOnValue).toLocaleString(
                            "tr-TR"
                          )}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="ticket-content">
                    <h6>Talep İçeriği</h6>
                    <p>{ticket.content || "İçerik bulunamadı"}</p>
                  </div>

                  <div className="reply-form mt-4">
                    <h6>Yanıtınız</h6>
                    <form onSubmit={handleSubmit}>
                      <div className="mb-3">
                        <textarea
                          className="form-control"
                          rows={6}
                          placeholder="Yanıtınızı buraya yazın..."
                          value={replyContent}
                          onChange={(e) => setReplyContent(e.target.value)}
                          required
                        ></textarea>
                      </div>

                      <div className="d-flex justify-content-between">
                        <Link
                          href={`/admin/support-tickets/${id}`}
                          className="btn btn-outline-secondary"
                        >
                          <i className="icon-arrow-left me-2"></i>Geri Dön
                        </Link>
                        <button type="submit" className="btn btn-primary">
                          <i className="icon-paper-plane me-2"></i>Yanıtı Gönder
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-lg-4">
              <div className="card">
                <div className="card-header">
                  <h5 className="card-title mb-0">Müşteri Bilgileri</h5>
                </div>
                <div className="card-body">
                  <p>
                    <strong>Müşteri ID:</strong> {ticket.customerId}
                  </p>
                  {/* Diğer müşteri bilgileri burada gösterilebilir */}
                </div>
              </div>

              <div className="card mt-4">
                <div className="card-header">
                  <h5 className="card-title mb-0">Hazır Yanıtlar</h5>
                </div>
                <div className="card-body">
                  <div className="list-group">
                    <button
                      type="button"
                      className="list-group-item list-group-item-action"
                      onClick={() =>
                        setReplyContent(
                          "Merhaba,\n\nTalebiniz için teşekkür ederiz. Sorununuzu çözmek için çalışıyoruz ve en kısa sürede size dönüş yapacağız.\n\nSaygılarımızla,\nDestek Ekibi"
                        )
                      }
                    >
                      Standart Karşılama
                    </button>
                    <button
                      type="button"
                      className="list-group-item list-group-item-action"
                      onClick={() =>
                        setReplyContent(
                          "Merhaba,\n\nSorununuz çözülmüştür. Başka bir sorunuz olursa bize bildirmekten çekinmeyin.\n\nSaygılarımızla,\nDestek Ekibi"
                        )
                      }
                    >
                      Çözüm Bildirimi
                    </button>
                    <button
                      type="button"
                      className="list-group-item list-group-item-action"
                      onClick={() =>
                        setReplyContent(
                          "Merhaba,\n\nTalebinizle ilgili daha fazla bilgiye ihtiyacımız var. Lütfen aşağıdaki detayları bize iletir misiniz?\n\n- Sorunu ne zaman yaşadınız?\n- Hangi ürün/sipariş ile ilgili?\n- Hata mesajı aldıysanız, ekran görüntüsü\n\nSaygılarımızla,\nDestek Ekibi"
                        )
                      }
                    >
                      Ek Bilgi Talebi
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .ticket-meta p {
          margin-bottom: 0.5rem;
        }

        .ticket-content {
          background-color: #f8f9fa;
          padding: 1rem;
          border-radius: 0.25rem;
          margin-bottom: 1.5rem;
        }

        .loading-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(255, 255, 255, 0.8);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 1000;
        }

        .spinner {
          width: 50px;
          height: 50px;
          border: 5px solid #f3f3f3;
          border-top: 5px solid var(--primary);
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </main>
  );
}
