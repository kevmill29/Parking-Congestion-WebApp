import './globals.css';
import ThemeRegistry from '@/app/ThemeRegistry';

export const metadata = {
  title: 'Parking Management Dashboard',
  description: 'Track parking lots, enforcement, and reports',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <ThemeRegistry>{children}</ThemeRegistry>
      </body>
    </html>
  );
}
