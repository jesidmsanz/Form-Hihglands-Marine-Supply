const website = process.env.NEXT_PUBLIC_WEBSITE || 'http://localhost:3000';
const companyName = process.env.NEXT_PUBLIC_NAME_COMPANY || 'HighLands Marine Supply SA';

export const metadata = {
    title: `Contacts Management - Admin Panel - ${companyName}`,
    description: `Manage and view all contact submissions for ${companyName}`,
    metadataBase: new URL(website),
    robots: {
        index: false,
        follow: false,
        noarchive: true,
        nosnippet: true,
    },
};

export default function ContactsLayout({ children }) {
    return <>{children}</>;
}

