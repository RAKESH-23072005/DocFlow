import { useState } from "react";
import { useLocation } from "wouter";
import PageLayout from "@/components/page-layout";
import { ChevronDown, Search, FileImage, Download, Settings } from "lucide-react";

interface FAQItem {
    question: string;
    answer: string;
    category: string;
}

const faqs: FAQItem[] = [
    {
        question: "How do I compress images?",
        answer: "Simply drag and drop your images onto the upload area or click to select files. Choose your compression quality, then click 'Compress All Images' to process them.",
        category: "Getting Started"
    },
    {
        question: "What image formats are supported?",
        answer: "We support JPG, PNG, GIF, and WebP formats. You can upload multiple formats at once and compress them all together.",
        category: "Supported Formats"
    },
    {
        question: "Is my data safe?",
        answer: "Yes! All image processing happens in your browser. Your images never leave your device and are not stored on our servers. Your privacy is guaranteed.",
        category: "Privacy & Security"
    },
    {
        question: "What's the maximum file size?",
        answer: "You can compress images up to 50MB each. For larger files, we recommend splitting them into smaller parts.",
        category: "File Limits"
    },
    {
        question: "How much can I reduce my image file size?",
        answer: "Depending on the image content and quality settings, you can typically reduce file sizes by 20-80% while maintaining good visual quality.",
        category: "Compression"
    },
    {
        question: "Can I compress multiple images at once?",
        answer: "Yes! You can upload and compress multiple images simultaneously. Our batch processing feature handles all your images efficiently.",
        category: "Batch Processing"
    },
    {
        question: "How do I choose the right compression quality?",
        answer: "Higher quality (80-100%) maintains better image quality but larger file sizes. Lower quality (20-60%) creates smaller files but may reduce visual quality. We recommend starting with 80%.",
        category: "Quality Settings"
    },
    {
        question: "Can I download compressed images as a ZIP file?",
        answer: "Yes! After compression, you can choose to download all images as a single ZIP file or download them individually.",
        category: "Download Options"
    },
    {
        question: "Is this tool completely free?",
        answer: "Yes, our image compression tool is completely free to use. No registration, no hidden fees, no watermarks.",
        category: "Pricing"
    },
    {
        question: "What if my compression doesn't work?",
        answer: "Make sure your images are in supported formats (JPG, PNG, GIF, WebP) and under 50MB. Try refreshing the page or using a different browser if issues persist.",
        category: "Troubleshooting"
    }
];

const categories = ["All", "Getting Started", "Supported Formats", "Privacy & Security", "File Limits", "Compression", "Batch Processing", "Quality Settings", "Download Options", "Pricing", "Troubleshooting"];

export default function HelpCenter() {
    const [, setLocation] = useLocation();
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("All");
    const [expandedItems, setExpandedItems] = useState<Set<number>>(new Set());

    const filteredFAQs = faqs.filter(faq => {
        const matchesSearch = faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
            faq.answer.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = selectedCategory === "All" || faq.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    const toggleExpanded = (index: number) => {
        const newExpanded = new Set(expandedItems);
        if (newExpanded.has(index)) {
            newExpanded.delete(index);
        } else {
            newExpanded.add(index);
        }
        setExpandedItems(newExpanded);
    };

    return (
        <PageLayout
          seoTitle="Help Center - Image Compression Support & FAQs | docFlow"
          seoDescription="Get help with our image compression tool. Find answers to frequently asked questions, tutorials, and troubleshooting guides."
          seoKeywords="image compression help, compression tool support, image compressor FAQ, compression tutorial"
          canonical="https://yourwebsite.com/help-center"
        >
            {/* Header */}
            <div className="page-header">
                <h1 className="text-4xl font-bold text-gray-900 mb-4">Help Center</h1>
                <p className="text-lg muted max-w-2xl mx-auto">
                    Find answers to common questions and learn how to get the most out of our image compression tool.
                </p>
            </div>

            {/* Search and Filter */}
            <div className="mb-8">
                <div className="flex flex-col md:flex-row gap-4 mb-6">
                    <div className="flex-1 relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                        <input
                            type="text"
                            placeholder="Search for help..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </div>
                    <select
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                        {categories.map(category => (
                            <option key={category} value={category}>{category}</option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="card-grid-3 mb-12">
                <div className="card">
                    <FileImage className="h-8 w-8 text-blue-600 mb-4" />
                    <h3 className="font-semibold text-gray-900 mb-2">Upload Images</h3>
                    <p className="text-sm muted">Learn how to upload and prepare your images for compression.</p>
                </div>
                <div className="card">
                    <Settings className="h-8 w-8 text-green-600 mb-4" />
                    <h3 className="font-semibold text-gray-900 mb-2">Quality Settings</h3>
                    <p className="text-sm muted">Understand compression quality and choose the right settings.</p>
                </div>
                <div className="card">
                    <Download className="h-8 w-8 text-purple-600 mb-4" />
                    <h3 className="font-semibold text-gray-900 mb-2">Download Results</h3>
                    <p className="text-sm muted">Get your compressed images in ZIP or individual files.</p>
                </div>
            </div>

            {/* FAQs */}
            <div className="space-y-4">
                <h2 className="section-title mb-6">Frequently Asked Questions</h2>
                {filteredFAQs.length > 0 ? (
                    filteredFAQs.map((faq, index) => (
                        <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-200">
                            <button
                                onClick={() => toggleExpanded(index)}
                                className="w-full px-6 py-4 text-left flex justify-between items-center hover:bg-gray-50 transition-colors"
                            >
                                <div>
                                    <h3 className="font-semibold text-gray-900">{faq.question}</h3>
                                    <span className="text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded-full mt-1 inline-block">
                                        {faq.category}
                                    </span>
                                </div>
                                <ChevronDown
                                    className={`h-5 w-5 text-gray-400 transition-transform ${expandedItems.has(index) ? 'rotate-180' : ''}`}
                                />
                            </button>
                            {expandedItems.has(index) && (
                                <div className="px-6 pb-4">
                                    <p className="muted">{faq.answer}</p>
                                </div>
                            )}
                        </div>
                    ))
                ) : (
                    <div className="text-center py-12">
                        <p className="text-gray-500">No questions found matching your search criteria.</p>
                    </div>
                )}
            </div>

            {/* Contact Support */}
            <div className="mt-12 bg-blue-50 rounded-lg p-8 text-center">
                <h2 className="section-title mb-4">Still Need Help?</h2>
                <p className="muted mb-6">
                    Can't find what you're looking for? Our support team is here to help.
                </p>
                <button
                    onClick={() => setLocation('/contact')}
                    className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
                >
                    Contact Support
                </button>
            </div>
        </PageLayout>
    );
} 