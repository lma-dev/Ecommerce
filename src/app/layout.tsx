import { Toaster } from "sonner";
import "../styles/globals.css";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <Toaster richColors position="top-right" closeButton />
        {children}
      </body>
    </html>
  );
}
