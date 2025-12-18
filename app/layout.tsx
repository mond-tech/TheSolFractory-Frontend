import './globals.css'
import { CartProvider } from '@/src/contexts/CartContext'

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&display=swap"
          rel="stylesheet"
        />
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"
        />
      </head>
      <body className="antialiased selection:bg-blue-600 selection:text-white">
        {/* Global liquid glass background – shared across all pages */}
        <div className="liquid-canvas">
          <div className="orb orb-1" />
          <div className="orb orb-2" />
        </div>

        <CartProvider>
          {children}
        </CartProvider>
      </body>
    </html>
  );
}
