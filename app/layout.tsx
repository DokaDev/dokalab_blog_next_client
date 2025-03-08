import type { Metadata } from "next";
import { AuthProvider } from "@/app/components/auth/AuthContext";
import "./globals.scss";

export const metadata: Metadata = {
    title: "My Blog - JWT Authentication",
    description: "A personal tech blog with JWT authentication",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body>
                <AuthProvider>
                    {children}
                </AuthProvider>
            </body>
        </html>
    );
}
