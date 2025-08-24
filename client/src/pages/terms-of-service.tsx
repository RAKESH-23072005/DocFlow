import PageLayout from "@/components/page-layout";
import { FileText, CheckCircle, AlertTriangle, Scale } from "lucide-react";

export default function TermsOfService() {
    return (
        <PageLayout
          seoTitle="Terms of Service - Image Compression Service | docFlow"
          seoDescription="Read our terms of service for using the docFlow image compression tool. Learn about acceptable use, limitations, and your rights as a user."
          seoKeywords="terms of service, terms and conditions, image compression terms, service agreement"
          canonical="https://yourwebsite.com/terms-of-service"
        >
            {/* Header */}
            <div className="page-header">
                <div className="flex justify-center mb-4">
                    <FileText className="h-12 w-12 text-blue-600" />
                </div>
                <h1 className="text-4xl font-bold text-gray-900 mb-4">Terms of Service</h1>
                <p className="text-lg muted max-w-2xl mx-auto">
                    Please read these terms carefully before using our image compression service.
                </p>
                <p className="text-sm text-gray-500 mt-2">
                    Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                </p>
            </div>

            {/* Key Points */}
            <div className="card-grid-3 mb-12">
                <div className="card text-center">
                    <CheckCircle className="h-8 w-8 text-green-600 mx-auto mb-4" />
                    <h3 className="font-semibold text-gray-900 mb-2">Free Service</h3>
                    <p className="text-sm muted">Our image compression tool is completely free to use for all users.</p>
                </div>
                <div className="card text-center">
                    <Scale className="h-8 w-8 text-blue-600 mx-auto mb-4" />
                    <h3 className="font-semibold text-gray-900 mb-2">Fair Use</h3>
                    <p className="text-sm muted">Use our service responsibly and in accordance with applicable laws.</p>
                </div>
                <div className="card text-center">
                    <AlertTriangle className="h-8 w-8 text-orange-600 mx-auto mb-4" />
                    <h3 className="font-semibold text-gray-900 mb-2">No Warranty</h3>
                    <p className="text-sm muted">Service provided "as is" without any warranties or guarantees.</p>
                </div>
            </div>

            {/* Terms Content */}
            <div className="prose-box">
                <div className="prose max-w-none">
                    <section className="mb-8">
                        <h2 className="section-title">1. Acceptance of Terms</h2>
                        <p className="muted mb-4">
                            By accessing and using docFlow's image compression service, you accept and agree to be bound by the terms and provision of this agreement.
                        </p>
                        <p className="muted">
                            If you do not agree to abide by the above, please do not use this service.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="section-title">2. Description of Service</h2>
                        <p className="muted mb-4">
                            docFlow provides an online image compression tool that allows users to:
                        </p>
                        <ul className="list-disc pl-6 muted space-y-2">
                            <li>Upload and compress image files (JPG, PNG, GIF, WebP)</li>
                            <li>Adjust compression quality settings</li>
                            <li>Download compressed images individually or as ZIP files</li>
                            <li>Process multiple images in batch</li>
                        </ul>
                        <p className="muted mt-4">
                            All processing occurs locally in your web browser. No images are uploaded to our servers.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="section-title">3. User Responsibilities</h2>
                        <p className="muted mb-4">
                            You agree to use our service only for lawful purposes and in accordance with these Terms. You agree not to:
                        </p>
                        <ul className="list-disc pl-6 muted space-y-2">
                            <li>Upload images that violate copyright, trademark, or other intellectual property rights</li>
                            <li>Upload images containing illegal, harmful, or offensive content</li>
                            <li>Attempt to reverse engineer or hack our service</li>
                            <li>Use our service for commercial purposes that violate these terms</li>
                            <li>Upload images larger than 50MB per file</li>
                            <li>Use automated tools to access our service excessively</li>
                        </ul>
                    </section>

                    <section className="mb-8">
                        <h2 className="section-title">4. Intellectual Property</h2>
                        <p className="muted mb-4">
                            <strong>Your Content:</strong> You retain all rights to your images. We do not claim ownership of any images you upload or compress.
                        </p>
                        <p className="muted mb-4">
                            <strong>Our Service:</strong> The docFlow service, including its design, code, and functionality, is owned by us and protected by intellectual property laws.
                        </p>
                        <p className="muted">
                            <strong>Third-Party Content:</strong> Our service may include third-party libraries and tools, which are subject to their respective licenses.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="section-title">5. Privacy and Data</h2>
                        <p className="muted mb-4">
                            Your privacy is important to us. Please review our Privacy Policy, which also governs your use of the service.
                        </p>
                        <p className="muted">
                            Since all processing happens in your browser, we do not collect, store, or transmit your images.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="section-title">6. Service Availability</h2>
                        <p className="muted mb-4">
                            We strive to maintain high availability of our service, but we do not guarantee:
                        </p>
                        <ul className="list-disc pl-6 muted space-y-2">
                            <li>Uninterrupted or error-free service</li>
                            <li>Compatibility with all browsers or devices</li>
                            <li>Specific compression results or file size reductions</li>
                            <li>Availability during maintenance or updates</li>
                        </ul>
                    </section>

                    <section className="mb-8">
                        <h2 className="section-title">7. Disclaimers and Limitations</h2>
                        <p className="muted mb-4">
                            <strong>Service Provided "As Is":</strong> Our service is provided without warranties of any kind, either express or implied.
                        </p>
                        <p className="muted mb-4">
                            <strong>No Guarantees:</strong> We do not guarantee specific compression ratios, quality levels, or file size reductions.
                        </p>
                        <p className="muted">
                            <strong>Limitation of Liability:</strong> In no event shall we be liable for any indirect, incidental, special, or consequential damages.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="section-title">8. Indemnification</h2>
                        <p className="muted">
                            You agree to indemnify and hold harmless docFlow from any claims, damages, or expenses arising from your use of the service or violation of these terms.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="section-title">9. Termination</h2>
                        <p className="muted mb-4">
                            We may terminate or suspend access to our service immediately, without prior notice, for any reason, including breach of these Terms.
                        </p>
                        <p className="muted">
                            Upon termination, your right to use the service will cease immediately.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="section-title">10. Changes to Terms</h2>
                        <p className="muted">
                            We reserve the right to modify these terms at any time. We will notify users of any material changes by updating the "Last updated" date.
                            Your continued use of the service after changes constitutes acceptance of the new terms.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="section-title">11. Governing Law</h2>
                        <p className="muted">
                            These terms shall be governed by and construed in accordance with the laws of [Your Jurisdiction],
                            without regard to its conflict of law provisions.
                        </p>
                    </section>

                    <section>
                        <h2 className="section-title">12. Contact Information</h2>
                        <p className="muted mb-4">
                            If you have any questions about these Terms of Service, please contact us:
                        </p>
                        <div className="p-4 bg-gray-50 rounded-lg">
                            <p className="muted">
                                <strong>Email:</strong> docflowimagecompressor.dev@gmail.com<br />
                                {/* <strong>Address:</strong> [Your Company Address]<br /> */}
                                <strong>Website:</strong> https://yourwebsite.com
                            </p>
                        </div>
                    </section>
                </div>
            </div>

            {/* Back to Home */}
            <div className="mt-12 text-center">
                <a href="/" className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors">Back to Image Compressor</a>
            </div>
        </PageLayout>
    );
} 