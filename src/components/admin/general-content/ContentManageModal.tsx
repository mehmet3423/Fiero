import { GeneralContentType } from '@/constants/models/GeneralContent';
import styles from '@/styles/GeneralContent.module.css';
import Image from 'next/image';

interface ContentManageModalProps {
    selectedType: GeneralContentType | null;
    contents: any;
    isLoading: boolean;
    onEdit: (content: any) => void;
    onDelete: (id: string) => void;
    isDeleting: boolean;
    onAdd: () => void;
}

export default function ContentManageModal({
    selectedType,
    contents,
    isLoading,
    onEdit,
    onDelete,
    isDeleting,
    onAdd
}: ContentManageModalProps) {
    return (
        <div className="p-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h4 className="mb-0">İçerik Listesi</h4>
                <button
                    className="btn btn-primary"
                    onClick={onAdd}
                >
                    <i className="fas fa-plus mr-2"></i>
                    Yeni İçerik Ekle
                </button>
            </div>

            <div className={styles.contentList}>
                {isLoading ? (
                    <div className="text-center py-5">
                        <div className="spinner-border text-primary" role="status">
                            <span className="sr-only">Yükleniyor...</span>
                        </div>
                    </div>
                ) : contents?.items.$values.length === 0 ? (
                    <div className="text-center py-5">
                        <i className="fas fa-inbox mb-3" style={{ fontSize: '2rem', color: '#ccc' }}></i>
                        <p className="text-muted">Bu kategoride henüz içerik bulunmuyor.</p>
                    </div>
                ) : (
                    contents?.items.$values.map((content: any) => (
                        <div key={content.id} className={`${styles.contentCard} p-4 mb-3 border rounded`}>
                            <div className={styles.contentInfo}>
                                <h5 className="mb-3">{content.title}</h5>
                                <p className="text-muted mb-3">{content.content}</p>
                                {content.imageUrl && (
                                    <Image
                                        width={0}
                                        height={0}
                                        sizes="100vw"
                                        src={content.imageUrl}
                                        alt={content.title}
                                        className={`${styles.contentImage} rounded`}
                                    />
                                )}
                            </div>
                            <div className={`${styles.contentActions} mt-3`}>
                                <button
                                    className="btn btn-sm btn-outline-primary mr-2"
                                    onClick={() => onEdit(content)}
                                >
                                    <i className="fas fa-edit mr-1"></i>
                                    Düzenle
                                </button>
                                <button
                                    className="btn btn-sm btn-outline-danger"
                                    onClick={() => onDelete(content.id)}
                                    disabled={isDeleting}
                                >
                                    <i className="fas fa-trash-alt mr-1"></i>
                                    Sil
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
} 