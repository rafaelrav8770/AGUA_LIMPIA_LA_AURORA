import { Navigation } from '@/components/Navigation'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen bg-gray-50 pb-16 md:pb-0">
      <Navigation />
      <main className="flex-1 w-full overflow-x-hidden md:max-w-4xl lg:max-w-6xl xl:max-w-full md:mx-auto">
        {children}
      </main>
    </div>
  )
}
