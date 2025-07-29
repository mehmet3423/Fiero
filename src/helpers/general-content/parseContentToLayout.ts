import { GeneralContentModel, LayoutConfig, LayoutItem } from "@/constants/models/GeneralContent";

export function parseContentToLayout(contents: GeneralContentModel[]) {
    const layouts: Record<string, LayoutItem[]> = {
        lg: [],
        md: [],
        sm: [],
        xs: [],
    };


    contents.forEach((content) => {
        if (content.content) {
            try {
                const layoutConfig = JSON.parse(content.content) as LayoutConfig;
                Object.keys(layoutConfig).forEach((size) => {
                    if (layoutConfig[size]) {
                        layouts[size] = [
                            ...(layouts[size] || []),
                            ...layoutConfig[size]!,
                        ];
                    }
                });
            } catch (error) {
                console.error(`Hata oluştu: ${content.$id}`, error);
            }
        } else {
            layouts["lg"].push({
                w: 2,
                h: 2,
                x: layouts["lg"].length * 2 % 12,
                y: Infinity,
                i: content.id,
                moved: false,
                static: false,
            });
        }
    });

    return layouts;
}