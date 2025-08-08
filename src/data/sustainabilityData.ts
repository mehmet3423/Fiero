

export interface SustainabilityItem {
    key: string;
    title: string;
    bannerTitle: string;
    image: string;
    bannerImage: string;
    sideImage: string;
    slug: string;
    content: string;
}

// Sustainability collections verisi
export const sustainabilityCollections: SustainabilityItem[] = [
    {
        key: "1",
        bannerTitle: "BAŞLIK",
        title: "BAŞLIK",
        image: "/assets/site/images/collections/collection-72.jpg",
        bannerImage: "/assets/site/images/sustainability/enerji/gunes-paneli.jpe",
        sideImage: "/assets/site/images/sustainability/enerji/erisilebilir-enerji.png",
        slug: "enerji",
        content: `
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. 
            Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. 
            Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
        `
    },
    {
        key: "2",
        bannerTitle: "BAŞLIK",
        title: "BAŞLIK",
        image: "/assets/site/images/collections/collection-71.jpg",
        bannerImage: "/assets/site/images/sustainability/leather/leather-bg.jpg",
        sideImage: "/assets/site/images/sustainability/index/leather-banner.jpg",
        slug: "leather-working-group",
        content: `
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. 
            Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. 
            Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
        `
    },
    {
        key: "3",
        bannerTitle: "BAŞLIK",
        title: "BAŞLIK",
        image: "/assets/site/images/collections/collection-68.jpg",
        bannerImage: "/assets/site/images/sustainability/orman/agaclar.jpeg",
        sideImage: "/assets/site/images/sustainability/orman/karasal-yasam.jpe",
        slug: "hatira-ormani",
        content: `
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. 
            Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. 
            Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
        `
    },
];