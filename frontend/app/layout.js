import "./globals.css";

export const metadata = {
  title: "APTS Training Tracker",
};

export default function RootLayout({ children }) {
  return (
    <html>
      <body>{children}</body>
    </html>
  );
}