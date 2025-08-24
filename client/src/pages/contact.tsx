import { useState } from "react";
import { useLocation } from "wouter";
import PageLayout from "@/components/page-layout";
import { Mail, MessageSquare, Send, CheckCircle, Shield } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function Contact() {
    const [, setLocation] = useLocation();
    const { toast } = useToast();
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        subject: "",
        message: ""
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const res = await fetch("/api/contact", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });
            if (!res.ok) {
                const text = await res.text();
                throw new Error(text || "Failed to send message");
            }
            toast({
                title: "Message Sent!",
                description: "Thank you for contacting us. We'll get back to you soon.",
            });
            setIsSubmitted(true);
            setFormData({ name: "", email: "", subject: "", message: "" });
            setTimeout(() => setIsSubmitted(false), 3000);
        } catch (err: any) {
            toast({
                title: "Failed to send",
                description: err?.message || "Please try again later.",
                variant: "destructive",
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <PageLayout
          seoTitle="Contact Us - Get Help & Support | docFlow"
          seoDescription="Contact docFlow for support, feedback, or questions about our image compression tool. We're here to help you get the most out of our service."
          seoKeywords="contact us, support, help, image compression support, feedback"
          canonical="https://yourwebsite.com/contact"
        >
            {/* Header */}
            <div className="page-header">
                <div className="flex justify-center mb-4">
                    <MessageSquare className="h-12 w-12 text-blue-600" />
                </div>
                <h1 className="text-4xl font-bold text-gray-900 mb-4">Contact Us</h1>
                <p className="text-lg muted max-w-2xl mx-auto">
                    Have questions, feedback, or need help? We'd love to hear from you. Get in touch with our team.
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                {/* Contact Information */}
                <div>
                    <h2 className="section-title mb-6">Get in Touch</h2>

                    <div className="space-y-6">
                        <div className="flex items-start space-x-4">
                            <div className="flex-shrink-0">
                                <Mail className="h-6 w-6 text-blue-600" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-gray-900">Email Support</h3>
                                <p className="muted">docflowimagecompressor.dev@gmail.com</p>
                                <p className="text-sm text-gray-500">We typically respond within 24 hours</p>
                            </div>
                        </div>
                    </div>

                    {/* FAQ Link */}
                    <div className="mt-8 p-6 bg-blue-50 rounded-lg">
                        <h3 className="font-semibold text-gray-900 mb-2">Quick Help</h3>
                        <p className="muted mb-4">
                            Check our Help Center for answers to common questions about image compression.
                        </p>
                        <button
                            onClick={() => setLocation('/help-center')}
                            className="text-blue-600 hover:text-blue-700 font-medium"
                        >
                            Visit Help Center →
                        </button>
                    </div>
                </div>

                {/* Contact Form */}
                <div>
                    <h2 className="section-title mb-6">Send us a Message</h2>

                    {isSubmitted ? (
                        <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
                            <CheckCircle className="h-12 w-12 text-green-600 mx-auto mb-4" />
                            <h3 className="text-lg font-semibold text-green-900 mb-2">Message Sent Successfully!</h3>
                            <p className="text-green-700">
                                Thank you for contacting us. We'll get back to you as soon as possible.
                            </p>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                                        Full Name *
                                    </label>
                                    <input
                                        type="text"
                                        id="name"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        required
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        placeholder="Your full name"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                                        Email Address *
                                    </label>
                                    <input
                                        type="email"
                                        id="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        required
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        placeholder="your.email@example.com"
                                    />
                                </div>
                            </div>

                            <div>
                                <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                                    Subject *
                                </label>
                                <select
                                    id="subject"
                                    name="subject"
                                    value={formData.subject}
                                    onChange={handleInputChange}
                                    required
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                >
                                    <option value="">Select a subject</option>
                                    <option value="Technical Support">Technical Support</option>
                                    <option value="Feature Request">Feature Request</option>
                                    <option value="Bug Report">Bug Report</option>
                                    <option value="General Inquiry">General Inquiry</option>
                                    <option value="Partnership">Partnership</option>
                                    <option value="Other">Other</option>
                                </select>
                            </div>

                            <div>
                                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                                    Message *
                                </label>
                                <textarea
                                    id="message"
                                    name="message"
                                    value={formData.message}
                                    onChange={handleInputChange}
                                    required
                                    rows={6}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="Tell us how we can help you..."
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                            >
                                {isSubmitting ? (
                                    <>
                                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                                        Sending...
                                    </>
                                ) : (
                                    <>
                                        <Send className="h-5 w-5 mr-2" />
                                        Send Message
                                    </>
                                )}
                            </button>
                        </form>
                    )}
                </div>
            </div>

            {/* Additional Information */}
            <div className="mt-16">
                <h2 className="section-title mb-8 text-center">Why Choose docFlow?</h2>
                <div className="card-grid-3 gap-8">
                    <div className="text-center">
                        <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                            <Shield className="h-8 w-8 text-blue-600" />
                        </div>
                        <h3 className="font-semibold text-gray-900 mb-2">Privacy First</h3>
                        <p className="muted">Your images never leave your device. All processing happens locally in your browser.</p>
                    </div>
                    <div className="text-center">
                        <div className="bg-green-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                            <CheckCircle className="h-8 w-8 text-green-600" />
                        </div>
                        <h3 className="font-semibold text-gray-900 mb-2">Free Forever</h3>
                        <p className="muted">No hidden fees, no watermarks, no registration required. Use our tool completely free.</p>
                    </div>
                    <div className="text-center">
                        <div className="bg-purple-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                            <MessageSquare className="h-8 w-8 text-purple-600" />
                        </div>
                        <h3 className="font-semibold text-gray-900 mb-2">Great Support</h3>
                        <p className="muted">Our team is here to help you get the most out of our image compression tool.</p>
                    </div>
                </div>
            </div>

            {/* Back to Home */}
            <div className="mt-12 text-center">
                <a
                    href="/"
                    className="bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition-colors"
                >
                    Back to Image Compressor
                </a>
            </div>
        </PageLayout>
    );
} 