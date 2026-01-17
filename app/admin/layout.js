const website = process.env.NEXT_PUBLIC_WEBSITE || 'http://localhost:3000';
const companyName = process.env.NEXT_PUBLIC_NAME_COMPANY || 'HighLands Marine Supply SA';
const metaDescription = process.env.NEXT_PUBLIC_META_DESCRIPTION || '';

export const metadata = {
    title: `Admin Panel - ${companyName}`,
    description: metaDescription || `Administration panel for ${companyName}`,
    metadataBase: new URL(website),
    robots: {
        index: false,
        follow: false,
        noarchive: true,
        nosnippet: true,
    },
    openGraph: {
        title: `Admin Panel - ${companyName}`,
        description: metaDescription || `Administration panel for ${companyName}`,
        url: `${website}/admin`,
        siteName: companyName,
        type: 'website',
    },
};

export default function AdminLayout({ children }) {
    return <>{children}</>;
}

