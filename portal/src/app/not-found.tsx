export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-brand-primary">404</h1>
        <p className="mt-4 text-xl text-gray-600">Page not found</p>
        <p className="mt-2 text-gray-500">
          The page you&apos;re looking for doesn&apos;t exist.
        </p>
        <a
          href="/"
          className="mt-6 inline-block px-6 py-3 bg-brand-primary text-white rounded-md hover:bg-brand-primary/90 transition-colors"
        >
          Go Home
        </a>
      </div>
    </div>
  )
}
