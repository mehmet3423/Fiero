import { GetStaticPaths, GetStaticProps } from 'next';
import { useRouter } from 'next/router';
import { sustainabilityCollections, SustainabilityItem } from '../../data/sustainabilityData';
import SustainabilitySub from '@/components/sustainability-sub/SustainabilitySub';

interface SustainabilityDetailProps {
    item: SustainabilityItem | null;
}

function SustainabilityDetail({ item }: SustainabilityDetailProps) {
    const router = useRouter();

    if (router.isFallback) {
        return <div>Loading...</div>;
    }

    if (!item) {
        return <div>Item not found</div>;
    }

    return (
        <SustainabilitySub
            bannerImage={item.bannerImage}
            sideImage={item.sideImage}
            title={item.title}
            bannerTitle={item.bannerTitle}
            content={item.content}
            canonical={`/sustainability/${item.slug}`}
        />
    );
}

export const getStaticPaths: GetStaticPaths = async () => {
    const paths = sustainabilityCollections.map((item) => ({
        params: { slug: item.slug },
    }));

    return {
        paths,
        fallback: false,
    };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
    const slug = params?.slug as string;
    const item = sustainabilityCollections.find((col) => col.slug === slug) || null;

    return {
        props: {
            item,
        },
    };
};

export default SustainabilityDetail;