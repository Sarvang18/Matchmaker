export function ExpiredLink() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-red-50 to-pink-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 px-6 py-8 text-center shadow-sm">
        <div className="flex items-center justify-center gap-3 mb-2">
          <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-pink-600 rounded-lg flex items-center justify-center shadow-md">
            <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900" style={{ fontFamily: 'Georgia, serif' }}>
            BYvowed
          </h1>
        </div>
        <p className="text-gray-600 text-sm tracking-wide">
          MATCHMAKING · CURATED FOR YOU
        </p>
      </div>

      {/* Content */}
      <div className="max-w-md mx-auto px-6 py-16 text-center">
        <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
          <div className="text-5xl mb-4">⏰</div>
          <h2 className="text-xl font-semibold text-gray-900 mb-3" style={{ fontFamily: 'Georgia, serif' }}>
            This link has expired
          </h2>
          <p className="text-gray-600 leading-relaxed">
            This link is no longer valid or has expired.
          </p>
          <p className="text-gray-600 leading-relaxed mt-2">
            Please contact your matchmaker for a new link.
          </p>
        </div>
      </div>
    </div>
  );
}
