const website = process.env.NEXT_PUBLIC_WEBSITE || 'http://localhost:3000';
const companyName = process.env.NEXT_PUBLIC_NAME_COMPANY || 'HighLands Marine Supply SA';

export const metadata = {
    title: `Admin Login - ${companyName}`,
    description: `Administrator login page for ${companyName}`,
    metadataBase: new URL(website),
    robots: {
        index: false,
        follow: false,
        noarchive: true,
        nosnippet: true,
    },
};

export default function AdminLoginLayout({ children }) {
    return <>{children}</>;
}

