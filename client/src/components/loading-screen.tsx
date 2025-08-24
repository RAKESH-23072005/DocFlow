export default function LoadingScreen() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/80 backdrop-blur-sm">
      <div className="flex flex-col items-center">
        <div
          className="h-12 w-12 rounded-full border-4 border-primary/30 border-t-primary animate-spin"
          aria-label="Loading"
          role="status"
        />
        <p className="mt-4 text-sm text-gray-600">Loading…</p>
      </div>
    </div>
  );
}
