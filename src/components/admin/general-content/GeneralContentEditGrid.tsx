import { GeneralContentModel, LayoutItem } from "@/constants/models/GeneralContent";
import { parseContentToLayout } from "@/helpers/general-content/parseContentToLayout";
import styles from '@/styles/general-content/GeneralContentEditGrid.module.css';
import Image from "next/image";
import { useEffect, useState } from "react";
import { Responsive, WidthProvider } from "react-grid-layout";
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';
const ResponsiveGridLayout = WidthProvider(Responsive);


function GeneralContentEditGrid({
    contents,
    updateContent,
    refetchContent,
    deleteContent,
    handleEdit,
}: {
    contents: GeneralContentModel[];
    updateContent: (contentId: string, content: GeneralContentModel) => Promise<void>;
    refetchContent: () => void;
    deleteContent: (contentId: string, contentTitle?: string) => void;
    handleEdit: (content: GeneralContentModel) => void;
}) {
    const [layouts, setLayouts] = useState<Record<string, LayoutItem[]>>({});
    const [widgets, setWidgets] = useState<GeneralContentModel[]>([]);
    const [updateLoading, setUpdateLoading] = useState<boolean>(false);

    useEffect(() => {
        if (!contents || contents.length === 0) return;

        const parsedLayouts = parseContentToLayout(contents);

        // Tüm breakpoint'ler için aynı layout'u kullan
        const defaultLayout = parsedLayouts.lg || [];
        setLayouts({
            lg: defaultLayout,
            md: defaultLayout,
            sm: defaultLayout,
            xs: defaultLayout,
        });
        setWidgets(contents);
    }, [contents]);

    const removeWidget = (contentId: string) => {
        deleteContent(contentId, widgets.find(w => w.id === contentId)?.title);
        refetchContent()
    }

    const handleUpdate = async () => {
        if (!contents) return;
        setUpdateLoading(true);

        const updatedContents = contents.map((item) => ({
            ...item,
            content: JSON.stringify({
                lg: layouts.lg?.filter((i) => i.i === item.id) || [],
                md: layouts.md?.filter((i) => i.i === item.id) || [],
                sm: layouts.sm?.filter((i) => i.i === item.id) || [],
                xs: layouts.xs?.filter((i) => i.i === item.id) || [],
            }),
        }));

        for (const content of updatedContents) {
            await updateContent(content.id, content);
        }
        refetchContent();

        setUpdateLoading(false);
    };

    const handleLayoutChange = (layout: LayoutItem[], allLayouts: Record<string, LayoutItem[]>) => {
        setLayouts({ ...allLayouts });
    };

    return (
        <div className="p-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <button onClick={handleUpdate} className="btn btn-sm btn-primary" disabled={updateLoading}>
                    {
                        updateLoading ? (
                            <div className="spinner-border spinner-border-sm" role="status">
                            </div>
                        ) : (
                            <>
                                <i className='bx bxs-save' ></i> Değişiklikleri Kaydet
                            </>
                        )
                    }
                </button>
            </div>
            <div className="container">

                {widgets.length > 0 && (
                    <ResponsiveGridLayout
                        className={styles.layout}
                        style={{ position: 'relative', border: "1px solid black" }}
                        layouts={layouts}
                        breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
                        cols={{ lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }}
                        rowHeight={100}
                        onLayoutChange={handleLayoutChange}
                        isDraggable={true}
                        isResizable={true}
                        margin={[10, 10]}

                    >
                        {widgets.map((widget) => (
                            <div
                                key={widget.id}
                                style={{
                                    backgroundColor: '#fff',
                                    borderRadius: '12px',
                                    padding: '16px',
                                    boxShadow: '0 2px 15px rgba(0,0,0,0.08)',
                                    border: '1px solid rgba(0,0,0,0.05)',
                                    height: '100%'
                                }}
                            >
                                <div className="h-100 d-flex flex-column">
                                    <div className="position-relative mb-3">
                                        {widget.imageUrl && (
                                            <div className="image-container" style={{
                                                borderRadius: '8px',
                                                overflow: 'hidden',
                                                position: 'relative',
                                                width: '100%',
                                                paddingBottom: '56.25%', // 16:9 aspect ratio için default
                                                minHeight: '150px',
                                                maxHeight: '300px'
                                            }}>
                                                <Image
                                                    style={{
                                                        position: 'absolute',
                                                        width: '100%',
                                                        height: '100%',
                                                        objectFit: 'contain',
                                                        backgroundColor: '#f8f9fa'
                                                    }}
                                                    width={0}
                                                    height={0}
                                                    sizes="100vw"
                                                    src={widget.imageUrl}
                                                    alt={widget.title || ""}
                                                    className="widget-image"
                                                    onLoad={(e) => {
                                                        const img = e.target as HTMLImageElement;
                                                        const container = img.parentElement;
                                                        if (container) {
                                                            const aspectRatio = (img.naturalHeight / img.naturalWidth) * 100;
                                                            container.style.paddingBottom = `${aspectRatio}%`;
                                                        }
                                                    }}
                                                />
                                            </div>
                                        )}
                                    </div>

                                    <div className="d-flex justify-content-between align-items-center">
                                        <h5 className="mb-0 text-dark font-weight-bold" style={{ fontSize: '1.1rem' }}>
                                            {widget.title}
                                        </h5>
                                        <div className="d-flex gap-2">
                                            <button
                                                onClick={() => handleEdit(widget)}
                                                className="btn btn-link p-0 m-0"
                                                style={{ color: '#444' }}
                                            >
                                                <i className='bx bxs-edit' style={{ fontSize: 24 }}></i>
                                            </button>
                                            <button
                                                onClick={() => removeWidget(widget.id)}
                                                className="btn btn-link p-0 m-0"
                                                style={{ color: '#dc3545' }}
                                            >
                                                <i className='bx bxs-trash' style={{ fontSize: 24 }}></i>
                                            </button>
                                        </div>
                                    </div>

                                    <div className="mt-2 text-muted small">
                                        <i className='bx bx-move me-1'></i>
                                        Düzenlemek için sürükleyin
                                    </div>
                                </div>
                            </div>
                        ))}
                    </ResponsiveGridLayout>
                )}
            </div>
        </div>
    );
}

export default GeneralContentEditGrid;
