import Header from "@/components/header";
import UploadArea from "@/components/upload-area";
import Footer from "@/components/footer";
import SEO from "@/components/seo";

export default function Home() {
  const handleFilesSelected = (files: File[]) => {
    // This will be handled by the UploadArea component's redirect logic
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <SEO
        title="Free Online Image Compressor - Compress JPG, PNG, GIF, WebP | docFlow"
        description="Free online image compression tool. Compress JPG, PNG, GIF, and WebP images with advanced algorithms. Reduce file sizes up to 80% while maintaining quality. No registration required, 100% secure."
        keywords="image compressor, compress images, jpg compressor, png compressor, gif compressor, webp compressor, online image compression, free image compression, reduce image size, image optimization"
        canonical="https://yourwebsite.com/"
      />
      <Header />

      {/* Hero Section */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Free Online Image Compressor
          </h1>
          <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto mb-6">
            Compress <span className="text-primary font-medium">JPG</span>,
            {" "}<span className="text-primary font-medium">PNG</span>,
            {" "}<span className="text-primary font-medium">GIF</span>, and
            {" "}<span className="text-primary font-medium">WebP</span> images with advanced algorithms.
            Reduce file sizes up to 80% while maintaining visual quality.
          </p>
          <p className="text-sm text-gray-500 max-w-2xl mx-auto">
            No registration required • 100% secure • Process unlimited images • Works in your browser
          </p>
        </div>

        <UploadArea onFilesSelected={handleFilesSelected} />

        {/* Features Section */}
        <section className="mt-16 mb-16">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">Why Choose Our Image Compressor?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <article className="text-center">
              <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-primary" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zm0 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V8zm0 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1v-2z" clipRule="evenodd" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Smart Compression</h3>
              <p className="text-gray-600">Advanced algorithms reduce file size while maintaining visual quality. Perfect for websites, social media, and email.</p>
            </article>
            <article className="text-center">
              <div className="bg-green-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-success" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Secure & Private</h3>
              <p className="text-gray-600">All processing happens in your browser - your images never leave your device. Your privacy is guaranteed.</p>
            </article>
            <article className="text-center">
              <div className="bg-purple-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Lightning Fast</h3>
              <p className="text-gray-600">Process multiple images simultaneously with batch compression. Save time with our optimized algorithms.</p>
            </article>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="mt-16 mb-16">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">How to Compress Images</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="bg-gray-100 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4 text-lg font-bold text-gray-700">1</div>
              <h3 className="font-semibold text-gray-900 mb-2">Upload Images</h3>
              <p className="text-sm text-gray-600">Drag & drop or click to select your JPG, PNG, GIF, or WebP images</p>
            </div>
            <div className="text-center">
              <div className="bg-gray-100 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4 text-lg font-bold text-gray-700">2</div>
              <h3 className="font-semibold text-gray-900 mb-2">Choose Quality</h3>
              <p className="text-sm text-gray-600">Adjust compression quality to balance file size and image quality</p>
            </div>
            <div className="text-center">
              <div className="bg-gray-100 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4 text-lg font-bold text-gray-700">3</div>
              <h3 className="font-semibold text-gray-900 mb-2">Compress</h3>
              <p className="text-sm text-gray-600">Our advanced algorithms process your images in seconds</p>
            </div>
            <div className="text-center">
              <div className="bg-gray-100 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4 text-lg font-bold text-gray-700">4</div>
              <h3 className="font-semibold text-gray-900 mb-2">Download</h3>
              <p className="text-sm text-gray-600">Download your compressed images individually or as a ZIP file</p>
            </div>
          </div>
        </section>


        {/* FAQ Section */}
        <section className="mt-16 mb-16">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">Frequently Asked Questions</h2>
          <div className="max-w-3xl mx-auto space-y-6">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="font-semibold text-gray-900 mb-2">Is this image compressor free to use?</h3>
              <p className="text-gray-600">Yes, our image compression tool is completely free to use. No registration, no hidden fees, no watermarks.</p>
            </div>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="font-semibold text-gray-900 mb-2">Are my images safe and private?</h3>
              <p className="text-gray-600">Absolutely! All image processing happens in your browser. Your images never leave your device and are not stored on our servers.</p>
            </div>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="font-semibold text-gray-900 mb-2">What's the maximum file size I can compress?</h3>
              <p className="text-gray-600">You can compress images up to 50MB each. For larger files, we recommend splitting them into smaller parts.</p>
            </div>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="font-semibold text-gray-900 mb-2">How much can I reduce my image file size?</h3>
              <p className="text-gray-600">Depending on the image content and quality settings, you can typically reduce file sizes by 20-80% while maintaining good visual quality.</p>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
