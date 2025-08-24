import Header from "@/components/header";
import Footer from "@/components/footer";
import SEO from "@/components/seo";
import AdSlot from "@/components/ad-slot";

interface PageLayoutProps {
  seoTitle: string;
  seoDescription: string;
  seoKeywords?: string;
  canonical?: string;
  children: React.ReactNode;
}

export default function PageLayout({ seoTitle, seoDescription, seoKeywords, canonical, children }: PageLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      <SEO title={seoTitle} description={seoDescription} keywords={seoKeywords} canonical={canonical} />
      <Header />
      
      {/* Banner Ad Slot - Below Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <AdSlot type="banner" />
      </div>
      
      <main className="page-container">
        {children}
      </main>
      <Footer />
    </div>
  );
}
