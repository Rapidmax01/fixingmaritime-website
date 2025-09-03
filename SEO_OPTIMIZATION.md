# SEO Optimization Guide for Fixing Maritime

## Overview
This document outlines the SEO optimizations implemented for better Google search visibility.

## ✅ Implemented SEO Features

### 1. **Enhanced Meta Tags**
- **Location**: `/app/layout.tsx`
- Comprehensive metadata with:
  - Descriptive titles with location keywords (Nigeria, Lagos)
  - Detailed descriptions (160 characters)
  - Targeted keywords for maritime services
  - Author and publisher information
  - Format detection settings

### 2. **Open Graph & Twitter Cards**
- Full social media optimization
- Custom images for sharing
- Proper content types
- Twitter summary cards

### 3. **Dynamic Sitemap Generation**
- **Location**: `/app/sitemap.ts`
- Automatically generated XML sitemap
- Includes all public pages
- Dynamic service pages from database
- Proper priorities and change frequencies
- Accessible at: `https://www.fixingmaritime.com/sitemap.xml`

### 4. **Robots.txt Configuration**
- **Location**: `/public/robots.txt`
- Allows crawling of public content
- Blocks admin and private areas
- Sitemap reference
- Crawl delay settings

### 5. **Structured Data (JSON-LD)**
- **Location**: `/components/StructuredData.tsx`
- Organization schema
- LocalBusiness schema
- Service schemas
- Breadcrumb support
- FAQ schema ready

### 6. **Google Analytics Integration**
- **Location**: `/components/GoogleAnalytics.tsx`
- Ready for GA4 tracking
- Event tracking functions
- Performance monitoring

### 7. **Search Engine Verification**
- Google Search Console verification meta tag
- Bing Webmaster Tools support
- Yandex verification ready

### 8. **Canonical URLs**
- Prevents duplicate content issues
- Proper URL structure
- Metadata base URL configured

## 📋 Next Steps for Better SEO

### 1. **Environment Variables Required**
Add these to your Vercel environment:
```
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION=your-verification-code
NEXT_PUBLIC_BING_VERIFICATION=your-bing-code
```

### 2. **Google Search Console Setup**
1. Go to [Google Search Console](https://search.google.com/search-console)
2. Add property: `https://www.fixingmaritime.com`
3. Verify using HTML tag (already implemented)
4. Submit sitemap: `https://www.fixingmaritime.com/sitemap.xml`

### 3. **Content Optimization Tips**
- Use location-based keywords: "maritime services Lagos", "freight forwarding Nigeria"
- Create detailed service pages with 500+ words
- Add customer testimonials and reviews
- Include FAQ sections on service pages
- Regular blog posts about maritime industry

### 4. **Local SEO**
- Create Google My Business listing
- Add complete business information
- Upload photos of operations
- Encourage customer reviews
- Add business hours and contact

### 5. **Technical SEO Improvements**
- [ ] Implement image optimization with next/image
- [ ] Add alt text to all images
- [ ] Compress images (use WebP/AVIF format)
- [ ] Implement lazy loading
- [ ] Minimize JavaScript bundles
- [ ] Enable caching headers
- [ ] Add breadcrumb navigation

### 6. **Link Building**
- Register with Nigerian business directories
- Join maritime industry associations
- Partner website backlinks
- Press releases for major contracts
- Industry publication features

### 7. **Performance Optimization**
- Target Core Web Vitals:
  - LCP (Largest Contentful Paint) < 2.5s
  - FID (First Input Delay) < 100ms
  - CLS (Cumulative Layout Shift) < 0.1
- Use Lighthouse for testing

## 🎯 Keywords to Target

### Primary Keywords:
- Maritime services Nigeria
- Freight forwarding Lagos
- Custom clearing agent Nigeria
- Warehousing services Lagos
- Truck services Nigeria

### Long-tail Keywords:
- Tug boat rental services Nigeria
- Import clearance agent Lagos port
- Export documentation services Nigeria
- Marine logistics company Lagos
- Barge transportation services Nigeria

### Local Keywords:
- Maritime services Apapa Lagos
- Tin Can port clearing agent
- Lagos port freight forwarder
- Nigerian customs clearing services

## 📊 Monitoring SEO Performance

1. **Google Analytics**: Track organic traffic growth
2. **Google Search Console**: Monitor impressions, clicks, and rankings
3. **PageSpeed Insights**: Track performance metrics
4. **Rank tracking tools**: Monitor keyword positions

## 🚨 Important Notes

1. **Content Quality**: Ensure all content is original and valuable
2. **Mobile Optimization**: Site must be fully responsive
3. **Page Speed**: Aim for < 3 second load times
4. **HTTPS**: Already enabled through Vercel
5. **Regular Updates**: Keep content fresh and updated

## Quick Checklist for New Pages

When adding new pages:
- [ ] Add page-specific metadata
- [ ] Include in sitemap
- [ ] Add structured data if applicable
- [ ] Use proper heading hierarchy (H1, H2, H3)
- [ ] Include internal links
- [ ] Optimize images
- [ ] Test mobile responsiveness
- [ ] Check page speed

## Resources

- [Google Search Console](https://search.google.com/search-console)
- [Bing Webmaster Tools](https://www.bing.com/webmasters)
- [Schema.org Validator](https://validator.schema.org/)
- [Google PageSpeed Insights](https://pagespeed.web.dev/)
- [Google Rich Results Test](https://search.google.com/test/rich-results)

---

*Last Updated: September 2025*