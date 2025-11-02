import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Authentication | Linear Clone',
  description: 'Sign in or create an account',
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-4">
      <div className="w-full max-w-md">
        {/* Logo/Brand */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Linear Clone</h1>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Modern project management for high-performance teams
          </p>
        </div>

        {/* Auth Form Card */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-8 border border-gray-200 dark:border-gray-700">
          {children}
        </div>

        {/* Footer */}
        <div className="mt-8 text-center text-sm text-gray-600 dark:text-gray-400">
          <p>Built with Next.js, Hono.js, and Better Auth</p>
        </div>
      </div>
    </div>
  );
}
