# Ad Integration Guide

This document explains how to integrate Google AdSense or other ad networks with the existing ad placeholder components.

## 🎯 Current Ad Placeholders

The app currently has clean ad placeholders in strategic locations:

### 1. **Banner Ad** (Below Header)
- **Location**: `client/src/components/page-layout.tsx`
- **Type**: `<AdSlot type="banner" />`
- **Dimensions**: 728x90, 970x90, 970x250 (responsive)
- **Mobile**: 250px height, Desktop: 90px height

### 2. **Sidebar Ad** (Right Sidebar)
- **Location**: `client/src/pages/compress.tsx`
- **Type**: `<AdSlot type="sidebar" />`
- **Dimensions**: 300x600, 300x250
- **Mobile**: 300px height, Desktop: 600px height

### 3. **Inline Ad** (After Main Content)
- **Location**: `client/src/components/image-compressor.tsx`
- **Type**: `<AdSlot type="inline" />`
- **Dimensions**: 300x250, 728x90
- **Mobile**: 250px height

### 4. **Mobile Ad** (Mobile Only)
- **Location**: `client/src/components/image-compressor.tsx`
- **Type**: `<AdSlot type="banner" className="min-h-[200px]" />`
- **Visibility**: Hidden on desktop (`lg:hidden`)

## 🔧 AdSense Integration Steps

### Step 1: Replace Placeholder Components

Replace each `<AdSlot />` component with actual AdSense code:

```tsx
// Before (placeholder)
<AdSlot type="banner" />

// After (AdSense)
<div className="ad-slot">
  <ins className="adsbygoogle"
       style={{ display: 'block' }}
       data-ad-client="ca-pub-YOUR_PUBLISHER_ID"
       data-ad-slot="YOUR_AD_SLOT_ID"
       data-ad-format="auto"
       data-full-width-responsive="true"></ins>
  <script>
    (adsbygoogle = window.adsbygoogle || []).push({});
  </script>
</div>
```

### Step 2: Add AdSense Script

Add the AdSense script to your `index.html`:

```html
<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-YOUR_PUBLISHER_ID"
     crossorigin="anonymous"></script>
```

### Step 3: Update Component Props

Modify the `AdSlot` component to accept AdSense configuration:

```tsx
interface AdSlotProps {
  type: 'banner' | 'sidebar' | 'inline';
  className?: string;
  adClient?: string;        // ca-pub-YOUR_PUBLISHER_ID
  adSlot?: string;          // YOUR_AD_SLOT_ID
  adFormat?: string;        // auto, rectangle, etc.
  responsive?: boolean;      // true for responsive ads
}
```

## 📱 Responsive Behavior

### Desktop Layout
- Banner: 970x90 or 728x90
- Sidebar: 300x600
- Inline: 300x250 or 728x90

### Mobile Layout
- Banner: 320x100 or 300x250
- Sidebar: Hidden (collapsed)
- Inline: 300x250
- Mobile-specific: 320x50

## 🎨 Styling Guidelines

### CSS Classes
- `.ad-slot`: Base ad container
- `.ad-slot[data-type="banner"]`: Banner-specific styles
- `.ad-slot[data-type="sidebar"]`: Sidebar-specific styles
- `.ad-slot[data-type="inline"]`: Inline-specific styles

### Responsive Breakpoints
- **Mobile**: `< 768px` - Stacked layout, smaller heights
- **Tablet**: `768px - 1024px` - Medium heights
- **Desktop**: `> 1024px` - Full heights, sidebar visible

## 🚀 Performance Considerations

### Lazy Loading
Ad slots are already optimized for performance:
- No external scripts loaded initially
- Placeholders prevent layout shifts
- Responsive heights maintain layout integrity

### Future Optimizations
```tsx
// Lazy load ads when component is visible
import { useInView } from 'react-intersection-observer';

const { ref, inView } = useInView({
  threshold: 0.1,
  triggerOnce: true
});

// Only load AdSense when ad slot is visible
{inView && <AdSenseComponent />}
```

## 📊 Ad Performance Tracking

### Google Analytics Integration
```tsx
// Track ad impressions and clicks
const trackAdImpression = (adSlot: string) => {
  gtag('event', 'ad_impression', {
    ad_slot: adSlot,
    page_location: window.location.pathname
  });
};
```

### Custom Metrics
- Ad viewability rates
- Click-through rates by position
- Revenue per page view
- User engagement with ads

## 🔒 Privacy & Compliance

### GDPR Compliance
- Add consent management for EU users
- Implement ad personalization controls
- Provide opt-out mechanisms

### Cookie Consent
```tsx
// Check user consent before loading ads
const { consent } = useCookieConsent();

if (consent.ads) {
  // Load AdSense
} else {
  // Show non-personalized ads or placeholder
}
```

## 🧪 Testing

### Development Testing
- Use AdSense test ads (`data-adtest="on"`)
- Verify responsive behavior across devices
- Check layout integrity with different ad sizes

### Production Monitoring
- Monitor Core Web Vitals impact
- Track ad revenue performance
- A/B test ad positions and sizes

## 📝 File Locations

- **Component**: `client/src/components/ad-slot.tsx`
- **Styles**: `client/src/styles/ad-slots.css`
- **Integration**: Various page components
- **Documentation**: `ADS_INTEGRATION.md`

## 🎯 Next Steps

1. **Get AdSense Approval**: Apply and wait for Google approval
2. **Create Ad Units**: Set up ad units in AdSense dashboard
3. **Replace Placeholders**: Swap components with actual ad code
4. **Test & Monitor**: Verify performance and revenue
5. **Optimize**: A/B test positions and sizes for best performance

---

**Note**: Keep the placeholder components until you're ready to integrate ads. They provide a clean, professional look while maintaining layout integrity.

