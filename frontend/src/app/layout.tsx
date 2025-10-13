import { Toaster } from "sonner";
import "../styles/globals.css";
import { SessionProviders } from "@/providers/session-provider";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <SessionProviders>
          <Toaster richColors position="top-right" closeButton />
          {children}
        </SessionProviders>
      </body>
    </html>
  );
}
