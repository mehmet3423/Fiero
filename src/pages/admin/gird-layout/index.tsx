import {
  GeneralContentModel,
  GeneralContentType,
} from "@/constants/models/GeneralContent";
import { useEffect, useState } from "react";
import { Responsive, WidthProvider } from "react-grid-layout";
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";

const ResponsiveGridLayout = WidthProvider(Responsive);

// Default layout configuration
// const defaultLayouts = {
//     lg: [
//         { i: 'a3c590e4-d789-4768-9376-14b68cec0f7e', x: 0, y: 0, w: 6, h: 4 },
//         { i: '29c468a8-a1a0-455a-9614-f3d423f6d60d', x: 6, y: 0, w: 6, h: 4 },
//         { i: '29c468a8-a1a0-455a-9614-f3d423f6120d', x: 0, y: 4, w: 12, h: 4 },
//     ],
// };

const defaultWidgets: GeneralContentModel[] = [
  {
    id: "a3c590e4-d789-4768-9376-14b68cec0f7e",
    $id: "a3c590e4-d789-4768-9376-14b68cec0f7e",
    content:
      '{"lg":[{"w":3,"h":1,"x":1,"y":0,"i":"a3c590e4-d789-4768-9376-14b68cec0f7e","moved":false,"static":false}]}',
    contentUrl:
      "https://encrypted-tbn2.gstatic.com/images?q=tbn:ANd9GcQmoHh2b_js2SxvzfQJpmb6xx1cUTOiycC0aTQzwYmh9-Hd4IwYbi2qnxPw1I0LjLQZ8w6FfsnwUFiJJUQnIE8QinNxvKe1Il2VEueZS_g",
    generalContentType: GeneralContentType.Index_ShowcaseBanner,
    imageUrl:
      "https://encrypted-tbn2.gstatic.com/images?q=tbn:ANd9GcQmoHh2b_js2SxvzfQJpmb6xx1cUTOiycC0aTQzwYmh9-Hd4IwYbi2qnxPw1I0LjLQZ8w6FfsnwUFiJJUQnIE8QinNxvKe1Il2VEueZS_g",
    order: 1,
    title: "QWEQEWEQW",
    willRender: true,
  },
  {
    id: "29c468a8-a1a0-455a-9614-f3d423f6d60d",
    $id: "29c468a8-a1a0-455a-9614-f3d423f6d60d",
    content:
      '{"lg":[{"w":1,"h":1,"x":0,"y":0,"i":"29c468a8-a1a0-455a-9614-f3d423f6d60d","moved":false,"static":false}]}',
    contentUrl:
      "https://encrypted-tbn2.gstatic.com/images?q=tbn:ANd9GcQmoHh2b_js2SxvzfQJpmb6xx1cUTOiycC0aTQzwYmh9-Hd4IwYbi2qnxPw1I0LjLQZ8w6FfsnwUFiJJUQnIE8QinNxvKe1Il2VEueZS_g",
    generalContentType: GeneralContentType.Index_ShowcaseBanner,
    imageUrl:
      "https://encrypted-tbn2.gstatic.com/images?q=tbn:ANd9GcQmoHh2b_js2SxvzfQJpmb6xx1cUTOiycC0aTQzwYmh9-Hd4IwYbi2qnxPw1I0LjLQZ8w6FfsnwUFiJJUQnIE8QinNxvKe1Il2VEueZS_g",
    order: 0,
    title: "12331212",
    willRender: true,
  },
  {
    id: "29c468a8-a1a0-455a-9614-f3d423f6120d",
    $id: "29c468a8-a1a0-455a-9614-f3d423f6120d",
    content:
      '{"lg":[{"w":1,"h":1,"x":2,"y":0,"i":"29c468a8-a1a0-455a-9614-f3d423f6120d","moved":false,"static":false}]}',
    contentUrl:
      "https://encrypted-tbn2.gstatic.com/images?q=tbn:ANd9GcQmoHh2b_js2SxvzfQJpmb6xx1cUTOiycC0aTQzwYmh9-Hd4IwYbi2qnxPw1I0LjLQZ8w6FfsnwUFiJJUQnIE8QinNxvKe1Il2VEueZS_g",
    generalContentType: GeneralContentType.Index_ShowcaseBanner,
    imageUrl:
      "https://encrypted-tbn2.gstatic.com/images?q=tbn:ANd9GcQmoHh2b_js2SxvzfQJpmb6xx1cUTOiycC0aTQzwYmh9-Hd4IwYbi2qnxPw1I0LjLQZ8w6FfsnwUFiJJUQnIE8QinNxvKe1Il2VEueZS_g",
    order: 2,
    title: "asdfasads",
    willRender: true,
  },
];

interface LayoutConfig {
  lg?: LayoutItem[];
  md?: LayoutItem[];
  sm?: LayoutItem[];
  xs?: LayoutItem[];
  [key: string]: LayoutItem[] | undefined;
}
interface LayoutItem {
  w: number;
  h: number;
  x: number;
  y: number;
  i: string; // Ürün ID'si
  moved: boolean;
  static: boolean;
}

function parseContentToLayout(contentArray: GeneralContentModel[]) {
  const layouts: Record<string, LayoutItem[]> = {
    lg: [],
    md: [],
    sm: [],
    xs: [],
  };

  contentArray.forEach((content) => {
    if (content.content) {
      try {
        const layoutConfig = JSON.parse(content.content) as LayoutConfig;

        // Her breakpoint için layout'ları birleştir
        Object.keys(layoutConfig).forEach((size) => {
          if (layoutConfig[size]) {
            layouts[size] = [...(layouts[size] || []), ...layoutConfig[size]];
          }
        });
      } catch (error) {
        console.error(
          `Error parsing layout for content ${content.$id}:`,
          error
        );
      }
    }
  });

  return layouts;
}

function GridLayout() {
  const [layouts, setLayouts] = useState({});
  const [widgets, setWidgets] = useState<GeneralContentModel[]>(defaultWidgets);
  // const [currentBreakpoint, setCurrentBreakpoint] = useState('lg');--------

  // Load saved layout from localStorage on component mount
  useEffect(() => {
    // const savedLayouts = localStorage.getItem('gridLayouts');
    // const savedWidgets = localStorage.getItem('gridWidgets');

    // if (savedLayouts) {
    //     setLayouts(JSON.parse(savedLayouts));
    // }
    // if (savedWidgets) {
    //     setWidgets(JSON.parse(savedWidgets));
    // }
    const parsedLayouts = parseContentToLayout(defaultWidgets);
    setLayouts({
      lg: parsedLayouts.lg || [],
    });
  }, []);

  // Save layout to localStorage whenever it changes
  const handleLayoutChange = (layout: any, layouts: any) => {
    setLayouts(layouts);
    localStorage.setItem("gridLayouts", JSON.stringify(layouts));
  };

  // Handle breakpoint changes
  // const handleBreakpointChange = (breakpoint: string) => {
  //     setCurrentBreakpoint(breakpoint);
  // };

  // Add new widget
  // const addWidget = () => {
  //     const newId = `widget${widgets.length + 1}`;
  //     const newWidget = {
  //         id: newId,
  //         content: `Widget ${widgets.length + 1}`,
  //         backgroundColor: `hsl(${Math.random() * 360}, 70%, 90%)`,
  //     };

  //     setWidgets([...widgets, newWidget]);

  //     const newLayouts = { ...layouts };
  //     newLayouts.lg = [
  //         ...(newLayouts.lg || []),
  //         {
  //             i: newId,
  //             x: (layouts.lg?.length || 0) * 2 % 12,
  //             y: Infinity,
  //             w: 6,
  //             h: 4,
  //         },
  //     ];

  //     setLayouts(newLayouts);
  //     localStorage.setItem('gridLayouts', JSON.stringify(newLayouts));
  //     localStorage.setItem('gridWidgets', JSON.stringify([...widgets, newWidget]));
  // };

  // Remove widget
  // const removeWidget = (widgetId: string) => {
  //     setWidgets(widgets.filter(widget => widget.id !== widgetId));

  //     const newLayouts = { ...layouts };
  //     newLayouts.lg = newLayouts.lg.filter(item => item.i !== widgetId);

  //     setLayouts(newLayouts);
  //     localStorage.setItem('gridLayouts', JSON.stringify(newLayouts));
  //     localStorage.setItem('gridWidgets', JSON.stringify(widgets.filter(widget => widget.id !== widgetId)));
  // };

  return (
    <div className="p-4">
      <div className="mb-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold">Dashboard Grid Layout</h1>
        <div className="space-x-2">
          {/* <button
                        onClick={addWidget}
                        className="btn btn-primary"
                    >
                        Add Widget
                    </button> */}
          {/* <button
                        onClick={() => {
                            localStorage.removeItem('gridLayouts');
                            localStorage.removeItem('gridWidgets');
                            setLayouts(defaultLayouts);
                            setWidgets(defaultWidgets);
                        }}
                        className="btn btn-secondary"
                    >
                        Reset Layout
                    </button> */}
        </div>
      </div>

      <ResponsiveGridLayout
        className="layout"
        layouts={layouts}
        breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
        cols={{ lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }}
        style={{ position: "relative" }}
        rowHeight={100}
        onLayoutChange={handleLayoutChange}
        // onBreakpointChange={handleBreakpointChange}
        isDraggable={true}
        isResizable={true}
        margin={[20, 20]}
      >
        {widgets.map((widget) => (
          <div
            key={widget.$id}
            style={{
              backgroundColor: "#f0f0f0",
              borderRadius: "8px",
              padding: "16px",
              boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
            }}
          >
            <div className="h-full flex flex-col">
              <div className="flex justify-between items-center mb-2">
                {/* <h3 className="font-semibold">{widget.content}</h3> */}
                asdqweqweqwqw
                <button
                  // onClick={() => removeWidget(widget.$id)}
                  className="text-red-500 hover:text-red-700"
                >
                  <i className="icon-trash"></i>
                </button>
              </div>
              <div className="flex-grow">
                {/* Widget content area */}
                <div className="h-full flex items-center justify-center text-gray-500">
                  Customizable Content Area
                </div>
              </div>
            </div>
          </div>
        ))}
      </ResponsiveGridLayout>

      <style jsx global>{`
        .layout {
          min-height: calc(100vh - 200px);
        }
        .react-grid-item {
          transition: all 200ms ease;
          transition-property: left, top, width, height;
        }
        .react-grid-item.react-grid-placeholder {
          background: #eee;
          opacity: 0.2;
          border-radius: 8px;
        }
        .react-grid-item:hover {
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        }
        .btn {
          padding: 8px 16px;
          border-radius: 4px;
          cursor: pointer;
          font-weight: 500;
          transition: all 200ms ease;
        }
        .btn-primary {
          background-color: #007bff;
          color: white;
        }
        .btn-primary:hover {
          background-color: #0056b3;
        }
        .btn-secondary {
          background-color: #6c757d;
          color: white;
        }
        .btn-secondary:hover {
          background-color: #545b62;
        }
      `}</style>
    </div>
  );
}

export default GridLayout;
