import { useEffect } from 'react';

interface SEOProps {
    title?: string;
    description?: string;
    keywords?: string;
    ogImage?: string;
    canonical?: string;
}

export default function SEO({
    title = "Free Online Image Compressor - Compress JPG, PNG, GIF, WebP | docFlow",
    description = "Free online image compression tool. Compress JPG, PNG, GIF, and WebP images with advanced algorithms. Reduce file sizes up to 80% while maintaining quality.",
    keywords = "image compressor, compress images, jpg compressor, png compressor, gif compressor, webp compressor, online image compression, free image compression",
    ogImage = "https://yourwebsite.com/og-image.jpg",
    canonical = "https://yourwebsite.com/"
}: SEOProps) {
    useEffect(() => {
        // Update document title
        document.title = title;

        // Update meta description
        let metaDescription = document.querySelector('meta[name="description"]');
        if (!metaDescription) {
            metaDescription = document.createElement('meta');
            metaDescription.setAttribute('name', 'description');
            document.head.appendChild(metaDescription);
        }
        metaDescription.setAttribute('content', description);

        // Update meta keywords
        let metaKeywords = document.querySelector('meta[name="keywords"]');
        if (!metaKeywords) {
            metaKeywords = document.createElement('meta');
            metaKeywords.setAttribute('name', 'keywords');
            document.head.appendChild(metaKeywords);
        }
        metaKeywords.setAttribute('content', keywords);

        // Update Open Graph title
        let ogTitle = document.querySelector('meta[property="og:title"]');
        if (!ogTitle) {
            ogTitle = document.createElement('meta');
            ogTitle.setAttribute('property', 'og:title');
            document.head.appendChild(ogTitle);
        }
        ogTitle.setAttribute('content', title);

        // Update Open Graph description
        let ogDescription = document.querySelector('meta[property="og:description"]');
        if (!ogDescription) {
            ogDescription = document.createElement('meta');
            ogDescription.setAttribute('property', 'og:description');
            document.head.appendChild(ogDescription);
        }
        ogDescription.setAttribute('content', description);

        // Update Open Graph image
        let ogImageMeta = document.querySelector('meta[property="og:image"]');
        if (!ogImageMeta) {
            ogImageMeta = document.createElement('meta');
            ogImageMeta.setAttribute('property', 'og:image');
            document.head.appendChild(ogImageMeta);
        }
        ogImageMeta.setAttribute('content', ogImage);

        // Update canonical URL
        let canonicalLink = document.querySelector('link[rel="canonical"]');
        if (!canonicalLink) {
            canonicalLink = document.createElement('link');
            canonicalLink.setAttribute('rel', 'canonical');
            document.head.appendChild(canonicalLink);
        }
        canonicalLink.setAttribute('href', canonical);

        // Update Twitter Card title
        let twitterTitle = document.querySelector('meta[property="twitter:title"]');
        if (!twitterTitle) {
            twitterTitle = document.createElement('meta');
            twitterTitle.setAttribute('property', 'twitter:title');
            document.head.appendChild(twitterTitle);
        }
        twitterTitle.setAttribute('content', title);

        // Update Twitter Card description
        let twitterDescription = document.querySelector('meta[property="twitter:description"]');
        if (!twitterDescription) {
            twitterDescription = document.createElement('meta');
            twitterDescription.setAttribute('property', 'twitter:description');
            document.head.appendChild(twitterDescription);
        }
        twitterDescription.setAttribute('content', description);

        // Update Twitter Card image
        let twitterImage = document.querySelector('meta[property="twitter:image"]');
        if (!twitterImage) {
            twitterImage = document.createElement('meta');
            twitterImage.setAttribute('property', 'twitter:image');
            document.head.appendChild(twitterImage);
        }
        twitterImage.setAttribute('content', ogImage);

    }, [title, description, keywords, ogImage, canonical]);

    return null;
} 