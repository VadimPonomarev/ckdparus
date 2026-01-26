import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { Provider } from "@/components/ui/provider"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "ЦКД 'ПАРУС' | Центр культуры и досуга",
  description: "Официальный сайт Центра культуры и досуга 'Парус' города Советск",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ru" suppressHydrationWarning>
      <body>
        <Provider>
          {children}
        </Provider>
      </body>
    </html>
  )
}