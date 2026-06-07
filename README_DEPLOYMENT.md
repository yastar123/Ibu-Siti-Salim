# Panduan Deployment Landing Page Ibu Siti

## 🚀 Quick Start

### Prerequisites
- Node.js 16+ atau baru
- pnpm (atau npm/yarn)
- Vercel account (untuk deployment)

### Installation

1. Clone atau download project
```bash
cd ibu-siti-landing
```

2. Install dependencies
```bash
pnpm install
# atau
npm install
# atau
yarn install
```

3. Update WhatsApp number di `app/page.tsx`:
```javascript
const whatsappNumber = '62812345678' // Ganti dengan nomor Anda (format: 628XXXXXXXXX)
```

4. Run dev server
```bash
pnpm dev
# atau
npm run dev
```

5. Buka http://localhost:3000 di browser

---

## 🌐 Deployment Options

### **Option 1: Deploy ke Vercel (Recommended)**

Vercel adalah platform optimal untuk Next.js apps dengan deployment otomatis dari Git.

#### Steps:
1. Push project ke GitHub
2. Buka https://vercel.com
3. Click "Add New" → "Project"
4. Select GitHub repository
5. Import project
6. Click "Deploy"
7. Share live URL

#### Environment Variables (jika diperlukan):
- Tidak ada env vars yang diperlukan untuk MVP ini
- Semua config sudah hardcoded

---

### **Option 2: Deploy ke Netlify**

1. Push project ke GitHub
2. Buka https://netlify.com
3. Click "New site from Git"
4. Select repository
5. Build settings:
   - Build command: `npm run build` atau `pnpm build`
   - Publish directory: `.next`
6. Deploy

---

### **Option 3: Manual Server Deployment**

#### Build for production:
```bash
pnpm build
# Output: .next folder
```

#### Start production server:
```bash
pnpm start
# Server akan berjalan di port 3000
```

#### Deploy ke server:
- Upload `.next` folder ke server
- Upload `public` folder
- Upload `package.json` dan `package-lock.json` (atau `pnpm-lock.yaml`)
- Install dependencies: `npm install --production`
- Start server: `npm start`

---

## 📋 Pre-Deployment Checklist

### Content
- [ ] WhatsApp number sudah diupdate
- [ ] Contact email sudah diupdate
- [ ] Address sudah diupdate
- [ ] Social media links sudah diupdate
- [ ] Testimonials sudah diupdate
- [ ] Product descriptions sudah diupdate

### Design
- [ ] All product images loading correctly
- [ ] Colors dan branding sesuai
- [ ] All animations smooth
- [ ] Mobile responsivity perfect
- [ ] All buttons functional

### Testing
- [ ] Navigation links working
- [ ] Search filter working
- [ ] Wishlist working
- [ ] WhatsApp buttons working
- [ ] All forms functional
- [ ] No console errors
- [ ] PageSpeed Insights score > 80

### Performance
- [ ] Images optimized
- [ ] CSS minified
- [ ] JavaScript bundled
- [ ] Caching headers set
- [ ] CDN enabled (jika available)

---

## 🔧 Configuration

### Domain Setup
1. Beli domain (GoDaddy, Namecheap, etc.)
2. Update DNS records ke Vercel/Netlify
3. Wait 24-48 hours untuk propagation
4. Verify di domain provider

### SSL Certificate
- Automatically included di Vercel/Netlify
- Free dan auto-renew

### Custom Email (Optional)
- Setup Google Workspace atau email service
- Update MX records
- Configure email forwarding

---

## 📊 Performance Optimization Tips

### Images
- Keep file sizes < 500KB per image
- Use modern formats (WebP)
- Implement lazy loading
- Use next/image component

### Code
- Enable static generation (SSG) jika possible
- Minimize JavaScript bundle
- Remove unused CSS
- Implement code splitting

### Caching
- Set cache headers untuk static assets
- Use CDN untuk image delivery
- Implement service worker

---

## 🔒 Security

### Best Practices
- Never commit secrets ke Git
- Use environment variables untuk sensitive data
- Implement HTTPS (automatic di Vercel/Netlify)
- Regular security updates
- Input validation di forms

### WhatsApp Integration
- WhatsApp links are secure (standard Web API)
- No API keys exposed
- Messages sent through WhatsApp's official channel

---

## 📈 Monitoring & Analytics

### Google Analytics
```html
<!-- Add to layout.tsx if needed -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_ID"></script>
```

### Vercel Analytics (Recommended)
- Automatically enabled di Vercel
- View at https://vercel.com/[project]

### Core Web Vitals
- Monitor LCP, FID, CLS
- Use PageSpeed Insights
- Check Lighthouse scores regularly

---

## 🐛 Troubleshooting

### Issue: WhatsApp button not working
**Solution:** 
- Check WhatsApp number format (628XXXXXXXXX)
- Verify number is active on WhatsApp
- Test di desktop and mobile

### Issue: Images not loading
**Solution:**
- Check `/public/products/` folder exists
- Verify image file names match code
- Clear browser cache (Ctrl+Shift+Delete)

### Issue: Slow performance
**Solution:**
- Run `pnpm build` and check bundle size
- Optimize images (compress, reduce resolution)
- Enable Vercel Analytics dan check bottlenecks
- Consider implementing lazy loading

### Issue: Mobile menu not closing
**Solution:**
- Clear browser cache
- Check z-index hierarchy di globals.css
- Verify click handlers di page.tsx

---

## 📱 Mobile Optimization

### Device Testing
- Test di actual devices (iPhone, Android)
- Check all breakpoints (320px, 768px, 1024px)
- Test touch interactions
- Verify forms and inputs

### Mobile Performance
- Lighthouse mobile score > 80
- First Contentful Paint < 3s
- Largest Contentful Paint < 2.5s
- Cumulative Layout Shift < 0.1

---

## 🔄 Continuous Improvement

### Regular Tasks
- Monthly: Review analytics dan user feedback
- Quarterly: Update products dan testimonials
- Quarterly: Test all features
- Semi-annual: Security audit
- Annual: Major feature updates

### Feedback Collection
- Add Google Forms untuk customer feedback
- Monitor WhatsApp conversations
- Track which products get most inquiries
- Note common questions untuk FAQ section

---

## 📚 Additional Resources

### Documentation
- [Next.js Docs](https://nextjs.org/docs)
- [Vercel Deployment](https://vercel.com/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)

### Tools
- [PageSpeed Insights](https://pagespeed.web.dev)
- [GTmetrix](https://gtmetrix.com)
- [Lighthouse](https://developers.google.com/web/tools/lighthouse)

---

## 📞 Support

### For Issues:
1. Check documentation di folder `/docs`
2. Review FITUR_DOKUMENTASI.md
3. Check browser console untuk errors
4. Test di incognito/private mode
5. Clear cache dan reload

### Professional Help:
- Contact web developer untuk custom modifications
- Reach out untuk performance optimization
- Hire for SEO implementation

---

## ✅ Deployment Checklist Final

Before going live:

- [ ] All content updated
- [ ] WhatsApp number tested
- [ ] Images loading correctly
- [ ] Mobile tested thoroughly
- [ ] Performance optimized
- [ ] Security checklist completed
- [ ] Analytics setup (optional)
- [ ] Domain DNS configured
- [ ] SSL certificate active
- [ ] Backup of project created
- [ ] Documentation reviewed
- [ ] Team trained on maintenance

---

## 🎉 Success!

Selamat! Landing page Anda sudah siap untuk production. 

**Next Steps:**
1. Monitor analytics untuk track visitors
2. Respond cepat ke WhatsApp inquiries
3. Collect customer feedback
4. Update products regularly
5. Maintain dan improve website

---

**Last Updated:** 2024
**Version:** 1.0.0
