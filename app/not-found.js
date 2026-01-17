import Image from 'next/image';
import Link from 'next/link';
import { Box, Container, Typography } from '@mui/material';

export const metadata = {
  title: '404 - Page Not Found',
  description: 'The page you are looking for could not be found.',
};

export default function NotFound() {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#FAFAFA',
        p: 3,
        textAlign: 'center',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          maxWidth: '600px',
          width: '100%',
        }}
      >
        <Box sx={{ mb: 4, display: 'flex', justifyContent: 'center' }}>
          <Image
            src="/images/logo.png"
            alt="HighLands Marine Supply Logo"
            width={400}
            height={133}
            style={{ objectFit: 'contain' }}
            priority
          />
        </Box>
        <Typography
          variant="h1"
          sx={{
            fontSize: { xs: '4rem', md: '6rem' },
            fontWeight: 700,
            color: '#0F2A55',
            mb: 2,
            textAlign: 'center',
          }}
        >
          404
        </Typography>
        <Typography
          variant="h5"
          sx={{
            color: '#666',
            mb: 4,
            fontFamily: 'var(--font-montserrat), sans-serif',
            textAlign: 'center',
          }}
        >
          Page Not Found
        </Typography>
        <Link
          href="/"
          style={{
            color: '#0F2A55',
            textDecoration: 'none',
            fontFamily: 'var(--font-montserrat), sans-serif',
            fontWeight: 600,
            fontSize: '1rem',
            textAlign: 'center',
            display: 'inline-block',
          }}
        >
          Go Home
        </Link>
      </Box>
    </Box>
  );
}

