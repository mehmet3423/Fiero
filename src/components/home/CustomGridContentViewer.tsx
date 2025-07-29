import { GeneralContentModel, LayoutItem } from "@/constants/models/GeneralContent";
import { parseContentToLayout } from "@/helpers/general-content/parseContentToLayout";
import Image from "next/image";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Responsive, WidthProvider } from "react-grid-layout";

const ResponsiveGridLayout = WidthProvider(Responsive);


interface CustomGridContentViewerProps {
    contents: GeneralContentModel[];
}
function CustomGridContentViewer({ contents }: CustomGridContentViewerProps) {
    const [layouts, setLayouts] = useState<Record<string, LayoutItem[]>>({});
    const [widgets, setWidgets] = useState<GeneralContentModel[]>([]);
    const router = useRouter();

    useEffect(() => {
        const parsedLayouts = parseContentToLayout(contents);
        setLayouts(parsedLayouts);
        setWidgets(contents);
    }, [contents]);


    return (
        <>
            {widgets.length > 0 && (
                <ResponsiveGridLayout
                    style={{ position: 'relative' }}
                    layouts={layouts}
                    breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
                    cols={{ lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }}
                    rowHeight={100}
                    isDraggable={false}
                    isResizable={false}
                    margin={[10, 10]}

                >
                    {widgets.map((widget) => (
                        <div
                            key={widget.id}
                            onClick={() => router.push(widget.contentUrl || "")}
                            style={{
                                cursor: 'pointer',
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
                                </div>
                            </div>
                        </div>
                    ))}
                </ResponsiveGridLayout>
            )}
        </>
    )
}

export default CustomGridContentViewer