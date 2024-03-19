import type { Metadata } from 'next';
import { AntdRegistry } from '@ant-design/nextjs-registry';
import './globals.css'
import ReduxProvider from '@/redux/provider';

export const metadata: Metadata = {
  title: 'Create Next App',
  description: 'Generated by create next app',
}

export default function RootLayout({ children, }: { children: React.ReactNode }) {

  return (
    <html lang="en">
      <body>
        <AntdRegistry>
            <ReduxProvider>
              <div>
                {children}
              </div>
            </ReduxProvider>
        </AntdRegistry>
      </body>
    </html>
  )
}
