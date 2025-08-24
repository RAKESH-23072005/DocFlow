import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Download, ArrowLeft, Share2, Facebook, Twitter, Linkedin, ChevronDown } from "lucide-react";
import { formatFileSize } from "@/lib/image-utils";
import { useToast } from "@/hooks/use-toast";
import SEO from "@/components/seo";

interface CompressedImageData {
  id: string;
  originalName: string;
  originalSize: number;
  compressedSize: number;
  compressedBlob: Blob;
}

export default function DownloadPage() {
  const [, setLocation] = useLocation();
  const [compressedImages, setCompressedImages] = useState<CompressedImageData[]>([]);
  const [totalSavings, setTotalSavings] = useState(0);
  const [downloadFormat, setDownloadFormat] = useState<"zip" | "individual">("individual");
  const { toast } = useToast();

  useEffect(() => {
    // Only clear sessionStorage if navigating away, not on refresh
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      // Save compressed images and blobs to sessionStorage before refresh
      if (compressedImages.length > 0) {
        const dataToStore = compressedImages.map(img => ({
          ...img,
          compressedBlob: null // blobs can't be stored directly
        }));
        sessionStorage.setItem('compressedImages', JSON.stringify(dataToStore));
        // Save blobs in global storage
        if (!(window as any).compressedBlobs) {
          (window as any).compressedBlobs = new Map();
        }
        compressedImages.forEach(img => {
          (window as any).compressedBlobs.set(img.id, img.compressedBlob);
        });
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [compressedImages]);

  useEffect(() => {
    const storedCompressedImages = sessionStorage.getItem('compressedImages');
    // Restore compressed blobs from global storage if available, else do not filter
    const compressedBlobs = (window as any).compressedBlobs;
    if (storedCompressedImages) {
      const parsedImages = JSON.parse(storedCompressedImages);
      let imagesWithBlobs;
      if (compressedBlobs) {
        imagesWithBlobs = parsedImages.map((img: any) => ({
          ...img,
          compressedBlob: compressedBlobs.get(img.id)
        })).filter((img: any) => img.compressedBlob);
      } else {
        // fallback: keep the parsed images as is (will not be downloadable, but will not blank page)
        imagesWithBlobs = parsedImages;
      }
      setCompressedImages(imagesWithBlobs);
      // Calculate total savings
      const totalOriginal = imagesWithBlobs.reduce((sum: number, img: any) => sum + img.originalSize, 0);
      const totalCompressed = imagesWithBlobs.reduce((sum: number, img: any) => sum + img.compressedSize, 0);
      const savings = totalOriginal > 0 ? Math.round(((totalOriginal - totalCompressed) / totalOriginal) * 100) : 0;
      setTotalSavings(savings);
      // Automatically trigger download as individual files if blobs are available
      if (compressedBlobs) {
        setTimeout(() => {
          imagesWithBlobs.forEach((image: any) => {
            const url = URL.createObjectURL(image.compressedBlob);
            const a = document.createElement('a');
            a.href = url;
            a.download = image.originalName.replace(/\.[^/.]+$/, "") + "_compressed" + image.originalName.match(/\.[^/.]+$/)?.[0];
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
          });
        }, 500);
      }
      // Do NOT clear sessionStorage here, so data persists on refresh
    } else {
      // Redirect to home if no compressed images
      setLocation('/');
    }
  }, [setLocation]);

  const handleDownloadAll = async () => {
    if (compressedImages.length === 0) return;

    if (downloadFormat === "zip" || compressedImages.length > 1) {
      // Download as ZIP
      const { default: JSZip } = await import("jszip");
      const zip = new JSZip();

      for (const image of compressedImages) {
        const fileName = image.originalName.replace(/\.[^/.]+$/, "") + "_compressed" + image.originalName.match(/\.[^/.]+$/)?.[0];
        zip.file(fileName, image.compressedBlob);
      }

      try {
        const content = await zip.generateAsync({ type: "blob" });
        const url = URL.createObjectURL(content);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'compressed_images.zip';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      } catch (error) {
        console.error('Failed to create zip file:', error);
      }
    } else {
      // Download individual files
      for (const image of compressedImages) {
        const url = URL.createObjectURL(image.compressedBlob);
        const a = document.createElement('a');
        a.href = url;
        a.download = image.originalName.replace(/\.[^/.]+$/, "") + "_compressed" + image.originalName.match(/\.[^/.]+$/)?.[0];
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        // Small delay between downloads to avoid browser blocking
        await new Promise(resolve => setTimeout(resolve, 200));
      }
    }
  };

  const handleBackToCompress = () => {
    setLocation('/');
  };

  const totalOriginalSize = compressedImages.reduce((sum, img) => sum + img.originalSize, 0);
  const totalCompressedSize = compressedImages.reduce((sum, img) => sum + img.compressedSize, 0);

  if (compressedImages.length === 0) {
    return null; // Will redirect in useEffect
  }

  return (
    <div className="min-h-screen bg-gray-50 relative">
      <SEO
        title="Download Compressed Images - Free Image Compression Results | docFlow"
        description="Download your compressed images instantly. Choose between ZIP download or individual files. View compression statistics and share your results."
        keywords="download compressed images, compressed image download, image compression results, zip download, compressed files download"
        canonical="https://yourwebsite.com/download"
      />
      {/* Mobile Success Banner */}
      <div className="block lg:hidden w-full bg-gradient-to-r from-green-50 to-blue-50 border-b border-green-200">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span className="text-sm text-green-800 font-medium">Compression Complete!</span>
            </div>
            <div className="text-right">
              <div className="text-xs text-green-600 bg-green-100 px-2 py-1 rounded-full font-medium">
                {totalSavings}% smaller
              </div>
            </div>
          </div>
        </div>
      </div>
      <Header />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Success Message */}
        <div className="text-center mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">
            Your IMAGES have been compressed!
          </h1>

          {/* Download Options */}
          <div className="max-w-md mx-auto space-y-4 mb-6">
            {/* Format Selection */}
            <div className="text-left">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Download Format
              </label>
              <Select value={downloadFormat} onValueChange={(value: "zip" | "individual") => setDownloadFormat(value)}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select download format" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="zip">ZIP File (All images in one archive)</SelectItem>
                  <SelectItem value="individual">Individual Files (Original format)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Download Button */}
            <Button
              onClick={handleDownloadAll}
              className="w-full bg-primary text-white hover:bg-blue-700 font-medium py-4 text-lg shadow-lg"
            >
              <Download className="mr-2 h-5 w-5" />
              {downloadFormat === "zip" ? "Download ZIP Archive" : "Download Individual Files"}
            </Button>
          </div>

          {/* Back Button */}
          <Button
            onClick={handleBackToCompress}
            variant="outline"
            className="px-6 py-3"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
        </div>

        {/* Savings Circle */}
        <div className="flex justify-center mb-8">
          <div className="relative">
            <div className="w-32 h-32 rounded-full border-8 border-primary flex items-center justify-center bg-white shadow-lg">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">{totalSavings}%</div>
                <div className="text-xs text-gray-600">smaller</div>
              </div>
            </div>
          </div>
          <div className="ml-6 flex flex-col justify-center">
            <p className="text-gray-700 mb-1">
              Your images are now <span className="font-semibold text-primary">{totalSavings}% smaller!</span>
            </p>
            <p className="text-sm text-gray-600">
              {formatFileSize(totalOriginalSize)} → {formatFileSize(totalCompressedSize)}
            </p>
          </div>
        </div>

        {/* Continue Section */}
        {/* <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Continue to...</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button
              variant="outline"
              className="flex items-center justify-start p-4 h-auto"
              onClick={() => setLocation('/')}
            >
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                <Download className="w-4 h-4 text-blue-600" />
              </div>
              <span>Resize IMAGE</span>
            </Button>
            <Button
              variant="outline"
              className="flex items-center justify-start p-4 h-auto"
              onClick={() => setLocation('/')}
            >
              <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center mr-3">
                <Download className="w-4 h-4 text-green-600" />
              </div>
              <span>Rotate IMAGE</span>
            </Button>
            <Button
              variant="outline"
              className="flex items-center justify-start p-4 h-auto"
              onClick={() => setLocation('/')}
            >
              <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center mr-3">
                <Download className="w-4 h-4 text-yellow-600" />
              </div>
              <span>Convert to JPG</span>
            </Button>
          </div>
          <Button
            variant="outline"
            className="flex items-center justify-start p-4 h-auto mt-4"
            onClick={() => setLocation('/')}
          >
            <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center mr-3">
              <Download className="w-4 h-4 text-purple-600" />
            </div>
            <span>Watermark IMAGE</span>
          </Button>
        </div>

        {/* Social Sharing */}
        <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl shadow-lg border border-blue-100 p-8 mb-8">
          <div className="text-center mb-6">
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Share the Love! 💙</h3>
            <p className="text-gray-600">Help others discover this amazing tool and inspire more productive people!</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {/* WhatsApp */}
            <button
              onClick={() => window.open('https://wa.me/?text=Check%20out%20this%20awesome%20image%20compressor%20tool!%20https://docflow-9gr1.onrender.com', '_blank')}
              className="group relative overflow-hidden bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white rounded-xl p-4 transition-all duration-300 transform hover:scale-105 hover:shadow-xl"
            >
              <div className="flex flex-col items-center space-y-2">
                <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center group-hover:bg-white/30 transition-colors">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488" />
                  </svg>
                </div>
                <span className="font-semibold text-sm">WhatsApp</span>
              </div>
            </button>

            {/* Facebook */}
            <button
              onClick={() => window.open('https://www.facebook.com/sharer/sharer.php?u=https://docflow-9gr1.onrender.com', '_blank')}
              className="group relative overflow-hidden bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-xl p-4 transition-all duration-300 transform hover:scale-105 hover:shadow-xl"
            >
              <div className="flex flex-col items-center space-y-2">
                <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center group-hover:bg-white/30 transition-colors">
                  <Facebook className="w-4 h-4" />
                </div>
                <span className="font-semibold text-sm">Facebook</span>
              </div>
            </button>

            {/* Twitter */}
            <button
              onClick={() => window.open('https://twitter.com/intent/tweet?url=https://docflow-9gr1.onrender.com', '_blank')}
              className="group relative overflow-hidden bg-gradient-to-r from-sky-500 to-sky-600 hover:from-sky-600 hover:to-sky-700 text-white rounded-xl p-4 transition-all duration-300 transform hover:scale-105 hover:shadow-xl"
            >
              <div className="flex flex-col items-center space-y-2">
                <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center group-hover:bg-white/30 transition-colors">
                  <Twitter className="w-4 h-4" />
                </div>
                <span className="font-semibold text-sm">Twitter</span>
              </div>
            </button>

            {/* LinkedIn */}
            <button
              onClick={() => window.open('https://www.linkedin.com/sharing/share-offsite/?url=https://docflow-9gr1.onrender.com', '_blank')}
              className="group relative overflow-hidden bg-gradient-to-r from-blue-700 to-blue-800 hover:from-blue-800 hover:to-blue-900 text-white rounded-xl p-4 transition-all duration-300 transform hover:scale-105 hover:shadow-xl"
            >
              <div className="flex flex-col items-center space-y-2">
                <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center group-hover:bg-white/30 transition-colors">
                  <Linkedin className="w-4 h-4" />
                </div>
                <span className="font-semibold text-sm">LinkedIn</span>
              </div>
            </button>
          </div>

          {/* Additional sharing options */}
          <div className="mt-6 pt-6 border-t border-blue-200">
            <div className="flex flex-wrap justify-center gap-3">
              <button
                onClick={() => {
                  navigator.clipboard.writeText('https://docflow-9gr1.onrender.com');
                  toast({
                    title: "Link Copied",
                    description: "The link has been copied to your clipboard!"
                  });
                }}
                className="flex items-center space-x-2 px-4 py-2 bg-white/80 hover:bg-white text-gray-700 rounded-lg transition-all duration-200 hover:shadow-md"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
                <span className="text-sm font-medium">Copy Link</span>
              </button>

              {/* <button
                onClick={() => window.open('mailto:?subject=Check out this awesome image compressor tool!&body=Hi! I found this amazing image compression tool that you might find useful: https://yourwebsite.com', '_blank')}
                className="flex items-center space-x-2 px-4 py-2 bg-white/80 hover:bg-white text-gray-700 rounded-lg transition-all duration-200 hover:shadow-md"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <span className="text-sm font-medium">Email</span>
              </button> */}
            </div>
          </div>
        </div>

        {/* Trust Section */}
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Your trusted online image editor, loved by users worldwide
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            docFlow is your simple solution for editing images online. Access all the tools
            you need to enhance your images easily, straight from the web, with 100% security.
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
}