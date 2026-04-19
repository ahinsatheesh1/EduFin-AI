import type { Metadata } from "next";
import "./globals.css";
import { UserProvider } from "@/context/UserContext";
import Navbar from "@/components/Navbar";
import ChatBot from "@/components/ChatBot";

export const metadata: Metadata = {
  title: "EduFin AI – Smart Study & Loan Decision Engine",
  description: "AI-powered platform for Indian students planning higher education. Get personalized university recommendations, ROI predictions, loan risk scores, and smart decision advice.",
  keywords: "education loan, study abroad, student loan India, AI career navigator, university admission",
  authors: [{ name: "EduFin AI" }],
  openGraph: {
    title: "EduFin AI – Smart Study & Loan Decision Engine",
    description: "Plan your future. Decide your loan. Powered by AI.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <UserProvider>
          <Navbar />
          <main>{children}</main>
          <ChatBot />
        </UserProvider>
      </body>
    </html>
  );
}
