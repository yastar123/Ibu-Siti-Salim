import { useState, useEffect, useRef, useCallback } from 'react'
import {
  Heart, Search, ShoppingBag, Menu, X, MessageCircle, Star,
  ChevronUp, User, Truck, Headphones, RotateCcw, Shield,
  ArrowRight, Check, Phone, MapPin, Instagram, Facebook, Youtube,
  ChevronDown, Sparkles
} from 'lucide-react'

/* ─── Animated counter hook ─── */
function useCountUp(target: number, duration = 1800, active = false) {
  const [count, setCount] = useState(0)
  useEffect(() => {
    if (!active) { setCount(0); return }
    let start = 0
    const totalSteps = Math.ceil(duration / 16)
    let step = 0
    const timer = setInterval(() => {
      step++
      const progress = step / totalSteps
      const ease = 1 - Math.pow(1 - progress, 3)
      start = Math.round(ease * target)
      setCount(start)
      if (step >= totalSteps) { setCount(target); clearInterval(timer) }
    }, 16)
    return () => clearInterval(timer)
  }, [active, target, duration])
  return count
}

/* ─── Types ─── */
type Product = {
  id: number
  name: string
  price: string
  originalPrice?: string
  color: string
  image: string
  rating: number
  reviews: number
  bestseller?: boolean
  badge?: string
  desc?: string
}

type Toast = { id: number; msg: string; type: 'success' | 'info' }

/* ─── Intersection-observer hook ─── */
function useReveal() {
  useEffect(() => {
    const els = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale')
    const io = new IntersectionObserver(
      entries => {
        entries.forEach(e => {
          if (e.isIntersecting) {
            e.target.classList.add('revealed')
            io.unobserve(e.target)
          }
        })
      },
      { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
    )
    els.forEach(el => io.observe(el))
    return () => io.disconnect()
  }, [])
}

/* ─── Star row ─── */
function Stars({ rating, size = 13 }: { rating: number; size?: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map(i => (
        <Star
          key={i}
          size={size}
          className={i <= Math.round(rating) ? 'fill-[#d4a574] text-[#d4a574]' : 'fill-[#e0d5cb] text-[#e0d5cb]'}
        />
      ))}
    </div>
  )
}

/* ─── Lazy image ─── */
function LazyImg({ src, alt, className }: { src: string; alt: string; className?: string }) {
  const [loaded, setLoaded] = useState(false)
  return (
    <div className={`relative overflow-hidden ${className ?? ''}`}>
      {!loaded && <div className="absolute inset-0 shimmer" />}
      <img
        src={src}
        alt={alt}
        loading="lazy"
        decoding="async"
        onLoad={() => setLoaded(true)}
        className={`w-full h-full object-cover transition-opacity duration-500 ${loaded ? 'opacity-100' : 'opacity-0'}`}
      />
    </div>
  )
}

/* ─── Product card ─── */
function ProductCard({
  product,
  onWishlist,
  isWishlisted,
  onView,
  onOrder,
  size = 'md',
}: {
  product: Product
  onWishlist: (id: number) => void
  isWishlisted: boolean
  onView: (p: Product) => void
  onOrder: (name: string) => void
  size?: 'sm' | 'md'
}) {
  return (
    <article className="group reveal">
      {/* Image wrapper */}
      <div
        className="relative bg-[#f0ece6] rounded-3xl overflow-hidden cursor-pointer"
        style={{ aspectRatio: size === 'sm' ? '1/1' : '3/4' }}
        onClick={() => onView(product)}
      >
        {/* Badge */}
        {(product.bestseller || product.badge) && (
          <span className="absolute top-3.5 left-3.5 z-10 bg-[#2d2420] text-white text-[8px] font-black px-3 py-1.5 rounded-full uppercase tracking-[0.18em]">
            {product.badge ?? 'Bestseller'}
          </span>
        )}

        {/* Wishlist button */}
        <button
          aria-label="Tambah ke wishlist"
          onClick={e => { e.stopPropagation(); onWishlist(product.id) }}
          className={`absolute top-3.5 right-3.5 z-10 w-9 h-9 rounded-full flex items-center justify-center transition-all duration-300 shadow-premium hover:scale-110 active:scale-95 ${
            isWishlisted
              ? 'bg-[#8b7355] shadow-gold'
              : 'bg-white/90 backdrop-blur-sm hover:bg-white'
          }`}
        >
          <Heart size={14} className={isWishlisted ? 'fill-white text-white' : 'text-[#2d2420]'} />
        </button>

        {/* Image */}
        <LazyImg src={product.image} alt={product.name} className="w-full h-full group-hover:scale-105 transition-transform duration-700 ease-out" />

        {/* Hover overlay — slides up from bottom */}
        <div className="absolute inset-x-0 bottom-0 translate-y-full group-hover:translate-y-0 transition-transform duration-400 ease-[cubic-bezier(0.16,1,0.3,1)]">
          <div className="bg-[#1a1210]/95 backdrop-blur-md p-4 flex gap-2.5">
            <button
              onClick={e => { e.stopPropagation(); onView(product) }}
              className="flex-1 text-white/85 hover:text-white text-[11px] font-semibold py-2.5 rounded-2xl border border-white/15 hover:border-white/35 transition-all duration-200"
            >
              Lihat Detail
            </button>
            <button
              onClick={e => { e.stopPropagation(); onOrder(product.name) }}
              className="flex-1 bg-[#d4a574] hover:bg-[#c49562] text-[#1a1210] text-[11px] font-bold py-2.5 rounded-2xl transition-all duration-200"
            >
              Tanyakan
            </button>
          </div>
        </div>
      </div>

      {/* Info */}
      <div className="mt-4 space-y-2">
        {/* Color indicator + rating */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <Stars rating={product.rating} size={12} />
            <span className="text-[10px] text-[#8b7355] font-medium">({product.reviews})</span>
          </div>
          <span className="text-[10px] text-[#8b7355]/60 font-medium bg-[#f5f0eb] px-2 py-0.5 rounded-full">{product.color}</span>
        </div>
        <h3
          className="font-bold text-[#2d2420] text-sm leading-snug group-hover:text-[#8b7355] transition-colors cursor-pointer line-clamp-1"
          onClick={() => onView(product)}
        >
          {product.name}
        </h3>
        <div className="flex items-baseline gap-2">
          <span className="font-black text-[#2d2420] text-base tracking-tight">{product.price}</span>
          <span className="text-[10px] text-[#8b7355]/70 font-medium">/hari</span>
          {product.originalPrice && (
            <span className="text-xs text-[#8b7355]/40 line-through">{product.originalPrice}</span>
          )}
        </div>
      </div>
    </article>
  )
}

/* ══════════════════════════════════════════════════
   LANDING PAGE
══════════════════════════════════════════════════ */
export default function LandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [wishlist, setWishlist] = useState<number[]>([])
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [showModal, setShowModal] = useState(false)
  const [showBackToTop, setShowBackToTop] = useState(false)
  const [toasts, setToasts] = useState<Toast[]>([])
  const [cartCount, setCartCount] = useState(0)
  const [heroLoaded, setHeroLoaded] = useState(false)
  const [faqOpen, setFaqOpen] = useState<number | null>(null)
  const [heroParallax, setHeroParallax] = useState(0)
  const [statsVisible, setStatsVisible] = useState(false)
  const [scrollProgress, setScrollProgress] = useState(0)
  const searchInputRef = useRef<HTMLInputElement>(null)
  const toastIdRef = useRef(0)
  const statsRef = useRef<HTMLDivElement>(null)

  useReveal()

  /* ── Init from localStorage ── */
  useEffect(() => {
    try {
      const w = localStorage.getItem('ibu-siti-wishlist')
      if (w) setWishlist(JSON.parse(w))
      const c = localStorage.getItem('ibu-siti-cart')
      if (c) setCartCount(JSON.parse(c).length)
    } catch {}
  }, [])

  useEffect(() => {
    localStorage.setItem('ibu-siti-wishlist', JSON.stringify(wishlist))
  }, [wishlist])

  /* ── Scroll: back-to-top + hero parallax + progress ── */
  useEffect(() => {
    const h = () => {
      const y = window.scrollY
      setShowBackToTop(y > 600)
      setHeroParallax(y * 0.28)
      const docH = document.documentElement.scrollHeight - window.innerHeight
      setScrollProgress(docH > 0 ? Math.min((y / docH) * 100, 100) : 0)
    }
    window.addEventListener('scroll', h, { passive: true })
    return () => window.removeEventListener('scroll', h)
  }, [])

  /* ── Stats count-up trigger ── */
  useEffect(() => {
    if (!statsRef.current) return
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setStatsVisible(true); io.disconnect() }
    }, { threshold: 0.4 })
    io.observe(statsRef.current)
    return () => io.disconnect()
  }, [])

  /* ── Hero image preload ── */
  useEffect(() => {
    const img = new Image()
    img.src = '/products/seasonal-autumn.png'
    img.onload = () => setHeroLoaded(true)
  }, [])

  /* ── Search keyboard shortcut ── */
  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') { e.preventDefault(); setSearchOpen(o => !o) }
      if (e.key === 'Escape') { setSearchOpen(false); setShowModal(false); setMobileMenuOpen(false) }
    }
    window.addEventListener('keydown', h)
    return () => window.removeEventListener('keydown', h)
  }, [])

  useEffect(() => {
    if (searchOpen) setTimeout(() => searchInputRef.current?.focus(), 50)
  }, [searchOpen])

  /* ── Lock scroll when modal/menu open ── */
  useEffect(() => {
    document.body.style.overflow = (showModal || mobileMenuOpen || searchOpen) ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [showModal, mobileMenuOpen, searchOpen])

  /* ── Toast ── */
  const addToast = useCallback((msg: string, type: Toast['type'] = 'success') => {
    const id = ++toastIdRef.current
    setToasts(prev => [...prev, { id, msg, type }])
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 3200)
  }, [])

  /* ── Actions ── */
  const whatsapp = (productName?: string) => {
    const msg = productName
      ? `Halo Ibu Siti, saya tertarik dengan ${productName}. Bisa saya pesan?`
      : `Halo Ibu Siti, saya ingin konsultasi tentang koleksi Anda.`
    window.open(`https://wa.me/62812345678?text=${encodeURIComponent(msg)}`, '_blank')
  }

  const toggleWishlist = useCallback((id: number) => {
    setWishlist(prev => {
      const next = prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
      addToast(prev.includes(id) ? 'Dihapus dari wishlist' : '❤️ Ditambah ke wishlist')
      return next
    })
  }, [addToast])

  const addToCart = useCallback((product: Product) => {
    try {
      const cart = JSON.parse(localStorage.getItem('ibu-siti-cart') || '[]')
      cart.push({ id: product.id, name: product.name, price: product.price, ts: Date.now() })
      localStorage.setItem('ibu-siti-cart', JSON.stringify(cart))
      setCartCount(cart.length)
      addToast(`🛍️ ${product.name} ditambahkan`)
    } catch {}
  }, [addToast])

  const openModal = (p: Product) => { setSelectedProduct(p); setShowModal(true) }

  /* ─── Data ─── */
  const latestProducts: Product[] = [
    { id: 1, name: 'Gaun Pengantin Premium', price: 'Rp 2.500.000', originalPrice: 'Rp 3.000.000', color: 'Putih Bersih', image: '/products/gaun-pengantin-premium.png', rating: 5, reviews: 24, bestseller: true, desc: 'Gaun pengantin mewah berbahan satin premium dengan detail payet tangan.' },
    { id: 2, name: 'Kebaya Bludru Modern', price: 'Rp 1.200.000', color: 'Marun Emas', image: '/products/kebaya-bludru.png', rating: 4.8, reviews: 18, desc: 'Kebaya bludru modern dengan bordir emas, cocok untuk acara adat & modern.' },
    { id: 3, name: 'Dress Adat Batak', price: 'Rp 800.000', originalPrice: 'Rp 1.000.000', color: 'Hitam Emas', image: '/products/dress-adat-batak.png', rating: 4.9, reviews: 22, bestseller: true, desc: 'Baju adat Batak autentik dengan motif ulos yang kaya makna budaya.' },
  ]

  const featuredProducts: Product[] = [
    { id: 101, name: 'Gaun Pink Premium', price: 'Rp 2.000.000', color: 'Pink Blush', image: '/products/gaun-pink-premium.png', rating: 5, reviews: 32, badge: 'New', desc: 'Gaun pink blush elegan dengan siluet A-line yang anggun.' },
    { id: 102, name: 'Jaket Brown Elegan', price: 'Rp 900.000', color: 'Cokelat Krem', image: '/products/jaket-brown-elegan.png', rating: 4.7, reviews: 15, desc: 'Jaket kasual elegan berbahan premium untuk tampilan semi-formal.' },
    { id: 103, name: 'Dress Hijau Mewah', price: 'Rp 1.500.000', color: 'Hijau Sage', image: '/products/dress-hijau-mewah.png', rating: 4.9, reviews: 28, badge: 'Best', desc: 'Dress hijau sage mewah dengan tekstur kain berkilau.' },
    { id: 104, name: 'Gaun Silver Eksklusif', price: 'Rp 2.200.000', color: 'Silver Shimmer', image: '/products/gaun-silver-eksklusif.png', rating: 5, reviews: 19, desc: 'Gaun silver berkilau eksklusif untuk momen gala atau pesta mewah.' },
  ]

  const allProducts = [...latestProducts, ...featuredProducts]

  const searchResults = searchQuery.trim().length >= 2
    ? allProducts.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()))
    : []

  const categories = [
    { id: 1, name: 'Gaun Pengantin', desc: 'Koleksi premium untuk hari istimewa', image: '/products/gaun-pengantin-premium.png', count: '24 Koleksi' },
    { id: 2, name: 'Kebaya Tradisional', desc: 'Keindahan warisan budaya nusantara', image: '/products/kebaya-bludru.png', count: '18 Koleksi' },
    { id: 3, name: 'Baju Adat', desc: 'Kekayaan adat dari seluruh Indonesia', image: '/products/dress-adat-batak.png', count: '32 Koleksi' },
  ]

  const features = [
    { icon: Truck,      title: 'Free Shipping',   desc: 'Pengiriman gratis ke seluruh Jakarta & sekitarnya' },
    { icon: Headphones, title: '24/7 Support',    desc: 'Tim kami siap membantu kapan saja, 7 hari seminggu' },
    { icon: RotateCcw,  title: 'Easy Returns',    desc: 'Pengembalian mudah & cepat jika ada ketidaksesuaian' },
    { icon: Shield,     title: 'Secure Checkout', desc: 'Transaksi 100% aman & terpercaya bersama kami' },
  ]

  const brands = ['Ibu Siti', '✦ Premium', '✦ Elegant', '✦ Tradisional', '✦ Wedding', '✦ Fashion', '✦ Eksklusif', '✦ Nusantara']
  const brandsFull = [...brands, ...brands]

  const testimonials = [
    { name: 'Ibu Khalim Santoso', role: 'Pengantin, Maret 2024', feedback: 'Gaun pengantin ini sangat indah dan nyaman dipakai sepanjang hari. Bahan premium dan jahitannya rapi sekali. Terima kasih Ibu Siti, momen pernikahan kami jadi sempurna!', rating: 5, avatar: '👰' },
    { name: 'Keluarga Aprilia', role: 'Resepsi Pernikahan, 2024', feedback: 'Layanan dekorasi dan baju yang luar biasa profesional. Tim Ibu Siti sangat responsif dan membantu dari awal hingga akhir. Hari spesial kami benar-benar sempurna!', rating: 5, avatar: '💍' },
    { name: 'Ibu Siti Salim', role: 'Acara Adat, Februari 2024', feedback: 'Koleksi baju adat sangat lengkap dan berkualitas tinggi. Pilihan motif dan warna sangat beragam. Kami sangat puas dan pasti akan kembali!', rating: 5, avatar: '👗' },
  ]

  const faqs = [
    { q: 'Berapa lama periode sewa?', a: 'Periode sewa standar adalah 1–3 hari. Untuk acara lebih panjang, kami menyediakan paket khusus dengan harga spesial. Hubungi kami via WhatsApp untuk detail.' },
    { q: 'Apakah bisa fitting sebelum menyewa?', a: 'Tentu! Kami sangat menyarankan fitting terlebih dahulu. Silakan jadwalkan kunjungan ke showroom kami di Jakarta. Tidak diperlukan booking, cukup hubungi via WhatsApp.' },
    { q: 'Bagaimana cara pembayaran?', a: 'Kami menerima transfer bank, pembayaran tunai, serta dompet digital (GoPay, OVO, Dana). DP 50% saat pemesanan, pelunasan saat pengambilan.' },
    { q: 'Apakah tersedia layanan antar-jemput?', a: 'Ya, kami menyediakan layanan antar-jemput ke lokasi Anda (area Jakarta & Jabodetabek) dengan biaya tambahan. Hubungi kami untuk informasi lebih lanjut.' },
  ]

  const stats = [
    { value: '5.000+', label: 'Pelanggan Puas' },
    { value: '29 Th', label: 'Pengalaman' },
    { value: '200+', label: 'Koleksi Baju' },
    { value: '4.9★', label: 'Rating Rata-rata' },
  ]

  /* ─── Animated counters (must be top-level hooks, not inside .map()) ─── */
  const cnt0 = useCountUp(5000, 1800, statsVisible)
  const cnt1 = useCountUp(29, 1800, statsVisible)
  const cnt2 = useCountUp(200, 1800, statsVisible)
  const cnt3 = useCountUp(49, 1800, statsVisible)
  const statDisplays = [
    cnt0.toLocaleString('id-ID') + '+',
    cnt1 + ' Th',
    cnt2 + '+',
    (cnt3 / 10).toFixed(1) + '★',
  ]

  /* ══════════════════════════════════
     RENDER
  ══════════════════════════════════ */
  return (
    <div className="min-h-screen bg-[#faf8f6] overflow-x-hidden pb-16 sm:pb-0">

      {/* ── Toast Notifications ── */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[200] flex flex-col gap-2 items-center pointer-events-none">
        {toasts.map(t => (
          <div key={t.id} className="animate-toast-in bg-[#2d2420] text-white text-xs font-medium px-5 py-2.5 rounded-full shadow-premium-lg flex items-center gap-2">
            <Check size={13} className="text-[#d4a574]" />
            {t.msg}
          </div>
        ))}
      </div>

      {/* ── Search Overlay ── */}
      {searchOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[150] flex items-start justify-center pt-20 px-4"
          onClick={() => setSearchOpen(false)}
        >
          <div
            className="bg-white rounded-2xl shadow-premium-lg w-full max-w-lg overflow-hidden animate-scale-up"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center gap-3 px-5 py-4 border-b border-[#e0d5cb]">
              <Search size={18} className="text-[#8b7355] flex-shrink-0" />
              <input
                ref={searchInputRef}
                type="text"
                placeholder="Cari koleksi, baju adat, gaun..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="flex-1 outline-none text-sm text-[#2d2420] placeholder:text-[#8b7355]/60"
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery('')} className="text-[#8b7355] hover:text-[#2d2420]">
                  <X size={16} />
                </button>
              )}
            </div>

            {searchResults.length > 0 ? (
              <div className="max-h-72 overflow-y-auto divide-y divide-[#f5f0eb]">
                {searchResults.map(p => (
                  <button
                    key={p.id}
                    className="w-full flex items-center gap-3 px-5 py-3 hover:bg-[#faf8f6] transition-colors text-left"
                    onClick={() => { openModal(p); setSearchOpen(false) }}
                  >
                    <img src={p.image} alt={p.name} className="w-10 h-10 object-cover rounded-xl flex-shrink-0" />
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-[#2d2420] truncate">{p.name}</p>
                      <p className="text-xs text-[#8b7355]">{p.price}</p>
                    </div>
                  </button>
                ))}
              </div>
            ) : searchQuery.trim().length >= 2 ? (
              <div className="py-10 text-center text-sm text-[#8b7355]">
                Tidak ditemukan produk untuk "<b>{searchQuery}</b>"
              </div>
            ) : (
              <div className="py-6 px-5">
                <p className="text-xs font-semibold text-[#8b7355] uppercase tracking-widest mb-3">Produk Populer</p>
                <div className="flex flex-wrap gap-2">
                  {['Gaun Pengantin', 'Kebaya', 'Baju Adat', 'Dress Elegan'].map(s => (
                    <button
                      key={s}
                      onClick={() => setSearchQuery(s)}
                      className="text-xs bg-[#f5f0eb] hover:bg-[#e8e3dd] text-[#2d2420] px-3 py-1.5 rounded-full transition-colors"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── PROMO BAR ── */}
      <div className="bg-[#2d2420] text-white text-center py-2.5 text-[11px] sm:text-xs font-medium tracking-wide">
        🎊 Gratis Konsultasi +&nbsp;
        <span className="text-[#d4a574] font-bold">Free Shipping</span>
        &nbsp;untuk pemesanan pertama Anda!&nbsp;
        <button onClick={() => whatsapp()} className="underline underline-offset-2 hover:text-[#d4a574] transition-colors ml-1">
          Pesan Sekarang →
        </button>
      </div>

      {/* ── Scroll Progress Bar ── */}
      <div className="sticky top-0 z-[60] h-[2px] bg-[#e0d5cb]">
        <div
          className="h-full bg-gradient-to-r from-[#8b7355] via-[#d4a574] to-[#a88968] transition-none shadow-sm"
          style={{ width: `${scrollProgress}%`, boxShadow: scrollProgress > 0 ? '0 0 6px rgba(212,165,116,0.5)' : 'none' }}
        />
      </div>

      {/* ── HEADER ── */}
      <header className="sticky top-0.5 z-50 bg-white/96 backdrop-blur-md border-b border-[#e0d5cb]" style={{ boxShadow: '0 1px 12px rgba(45,36,32,0.07)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-[60px] gap-3">

            {/* Logo */}
            <a href="#" className="flex-shrink-0 group" aria-label="Ibu Siti - Beranda">
              <span className="text-xl sm:text-2xl font-bold text-[#2d2420] group-hover:text-[#8b7355] transition-colors tracking-tight">
                Ibu Siti
              </span>
              <span className="text-[9px] text-[#8b7355] font-medium block -mt-0.5 tracking-[0.15em] uppercase">
                Wedding & Fashion
              </span>
            </a>

            {/* Desktop nav */}
            <nav className="hidden lg:flex items-center gap-7">
              {[
                { label: 'Koleksi', href: '#koleksi' },
                { label: 'Kategori', href: '#kategori' },
                { label: 'Unggulan', href: '#unggulan' },
                { label: 'Musiman', href: '#musiman' },
                { label: 'Testimoni', href: '#testimoni' },
              ].map(({ label, href }) => (
                <a
                  key={label}
                  href={href}
                  className="text-[13px] font-medium text-[#2d2420] hover:text-[#8b7355] transition-colors relative group py-1"
                >
                  {label}
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#8b7355] transition-all duration-300 group-hover:w-full rounded-full" />
                </a>
              ))}
            </nav>

            {/* Right icons */}
            <div className="flex items-center gap-0.5 sm:gap-1">
              <button
                aria-label="Cari produk (Ctrl+K)"
                onClick={() => setSearchOpen(true)}
                className="p-2.5 rounded-full hover:bg-[#f5f0eb] transition-colors group"
              >
                <Search size={18} className="text-[#2d2420] group-hover:text-[#8b7355] transition-colors" />
              </button>

              <button aria-label="Akun saya" className="p-2.5 rounded-full hover:bg-[#f5f0eb] transition-colors group hidden sm:flex">
                <User size={18} className="text-[#2d2420] group-hover:text-[#8b7355] transition-colors" />
              </button>

              <button
                aria-label="Wishlist"
                className="p-2.5 rounded-full hover:bg-[#f5f0eb] transition-colors relative group"
              >
                <Heart size={18} className={wishlist.length > 0 ? 'fill-[#8b7355] text-[#8b7355]' : 'text-[#2d2420] group-hover:text-[#8b7355] transition-colors'} />
                {wishlist.length > 0 && (
                  <span className="absolute top-1 right-1 bg-[#8b7355] text-white text-[9px] font-bold w-3.5 h-3.5 rounded-full flex items-center justify-center leading-none">
                    {wishlist.length}
                  </span>
                )}
              </button>

              <button
                aria-label="Keranjang"
                className="p-2.5 rounded-full hover:bg-[#f5f0eb] transition-colors relative group"
              >
                <ShoppingBag size={18} className="text-[#2d2420] group-hover:text-[#8b7355] transition-colors" />
                {cartCount > 0 && (
                  <span className="absolute top-1 right-1 bg-[#2d2420] text-white text-[9px] font-bold w-3.5 h-3.5 rounded-full flex items-center justify-center leading-none">
                    {cartCount}
                  </span>
                )}
              </button>

              {/* Mobile hamburger */}
              <button
                aria-label={mobileMenuOpen ? 'Tutup menu' : 'Buka menu'}
                onClick={() => setMobileMenuOpen(o => !o)}
                className="lg:hidden p-2.5 rounded-full hover:bg-[#f5f0eb] transition-colors ml-1"
              >
                {mobileMenuOpen
                  ? <X size={20} className="text-[#2d2420]" />
                  : <Menu size={20} className="text-[#2d2420]" />
                }
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-[#e0d5cb] bg-white animate-slide-down">
            <div className="max-w-7xl mx-auto px-4 py-5 space-y-1">
              {[
                { label: 'Koleksi Terbaru', href: '#koleksi' },
                { label: 'Kategori', href: '#kategori' },
                { label: 'Produk Unggulan', href: '#unggulan' },
                { label: 'Koleksi Musiman', href: '#musiman' },
                { label: 'Testimoni', href: '#testimoni' },
                { label: 'FAQ', href: '#faq' },
              ].map(({ label, href }) => (
                <a
                  key={label}
                  href={href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-between px-3 py-3 text-sm font-medium text-[#2d2420] hover:text-[#8b7355] hover:bg-[#faf8f6] rounded-xl transition-all"
                >
                  {label}
                  <ArrowRight size={14} className="text-[#8b7355]" />
                </a>
              ))}
              <div className="pt-3 border-t border-[#e0d5cb]">
                <button
                  onClick={() => { whatsapp(); setMobileMenuOpen(false) }}
                  className="w-full flex items-center justify-center gap-2 bg-[#8b7355] text-white py-3 rounded-xl text-sm font-semibold hover:bg-[#7a6448] transition-colors"
                >
                  <MessageCircle size={16} />
                  Hubungi via WhatsApp
                </button>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* ══════════════════════════════════
          HERO
      ══════════════════════════════════ */}
      <section className="relative overflow-hidden flex flex-col" style={{ minHeight: '100svh' }}>
        {/* Background image with parallax */}
        <div
          className={`absolute inset-0 bg-cover bg-center transition-opacity duration-1000 ${heroLoaded ? 'opacity-100' : 'opacity-0'}`}
          style={{
            backgroundImage: `url('/products/seasonal-autumn.png')`,
            backgroundPosition: 'center 30%',
            transform: `translateY(${heroParallax}px)`,
            willChange: 'transform',
            scale: '1.08',
          }}
        />
        {!heroLoaded && <div className="absolute inset-0 bg-[#1a1210]" />}

        {/* Layered gradient overlays */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#0e0b09]/97 via-[#1a1210]/80 to-[#1a1210]/30" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0e0b09]/70 via-transparent to-transparent" />
        <div className="noise-overlay" />

        {/* Decorative floating rings (desktop) */}
        <div className="absolute right-[5%] top-[10%] w-[460px] h-[460px] rounded-full border border-[#d4a574]/10 animate-spin-slow pointer-events-none hidden xl:block" />
        <div className="absolute right-[10%] top-[15%] w-[300px] h-[300px] rounded-full border border-[#d4a574]/08 animate-spin-slow-r pointer-events-none hidden xl:block" />
        <div className="absolute right-[18%] top-[22%] w-[140px] h-[140px] rounded-full border border-[#d4a574]/12 pointer-events-none hidden xl:block" />

        {/* Main content */}
        <div className="relative z-10 flex-1 flex items-center">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-24 lg:py-32">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">

              {/* ── Left: Text block ── */}
              <div>
                <div className="eyebrow text-[#d4a574] mb-6 animate-fade-in-up">
                  Koleksi Eksklusif 2024
                </div>

                <h1
                  className="font-black text-white leading-[1.03] mb-6 animate-fade-in-up"
                  style={{ fontSize: 'clamp(2.8rem, 7.5vw, 5.8rem)', animationDelay: '80ms', letterSpacing: '-0.02em' }}
                >
                  Tampil<br />
                  <span className="font-serif italic text-gradient-gold">Percaya Diri</span><br />
                  Setiap Saat
                </h1>

                <p
                  className="text-white/65 leading-[1.75] mb-10 animate-fade-in-up max-w-md"
                  style={{ fontSize: 'clamp(0.9rem, 1.8vw, 1.05rem)', animationDelay: '180ms' }}
                >
                  Sewa gaun pengantin, kebaya tradisional & baju adat berkualitas premium untuk momen istimewa Anda.
                </p>

                <div className="flex flex-col sm:flex-row gap-3 animate-fade-in-up" style={{ animationDelay: '260ms' }}>
                  <button onClick={() => whatsapp()} className="btn-primary">
                    <MessageCircle size={16} />
                    Konsultasi Gratis
                  </button>
                  <a href="#koleksi" className="btn-outline">
                    Lihat Koleksi
                    <ArrowRight size={15} />
                  </a>
                </div>

                {/* Micro-stats */}
                <div
                  className="flex items-center gap-0 mt-12 animate-fade-in-up"
                  style={{ animationDelay: '380ms' }}
                >
                  {[
                    { val: '5.000+', lbl: 'Pelanggan' },
                    { val: '29 Th', lbl: 'Pengalaman' },
                    { val: '200+', lbl: 'Koleksi' },
                    { val: '4.9★', lbl: 'Rating' },
                  ].map((b, i) => (
                    <div key={i} className="flex items-center">
                      {i > 0 && <div className="w-px h-9 bg-white/12 mx-5" />}
                      <div>
                        <p className="text-white font-black leading-none tracking-tight" style={{ fontSize: 'clamp(1rem, 2.2vw, 1.2rem)' }}>{b.val}</p>
                        <p className="text-white/40 text-[9px] uppercase tracking-[0.2em] mt-1.5">{b.lbl}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* ── Right: Product image collage (desktop) ── */}
              <div
                className="hidden lg:grid grid-cols-2 gap-4"
                style={{ height: 'clamp(440px, 55vw, 580px)', animationDelay: '500ms' }}
              >
                <div className="rounded-[28px] overflow-hidden row-span-2 shadow-dark ring-1 ring-white/8 animate-fade-in-up" style={{ animationDelay: '350ms' }}>
                  <LazyImg src="/products/gaun-pengantin-premium.png" alt="Gaun Pengantin Premium" className="w-full h-full hover:scale-105 transition-transform duration-[1200ms]" />
                </div>
                <div className="rounded-[28px] overflow-hidden shadow-dark ring-1 ring-white/8 animate-float animate-fade-in-up" style={{ animationDelay: '450ms' }}>
                  <LazyImg src="/products/kebaya-bludru.png" alt="Kebaya Bludru" className="w-full h-full hover:scale-105 transition-transform duration-[1200ms]" />
                </div>
                <div className="rounded-[28px] overflow-hidden shadow-dark ring-1 ring-white/8 animate-float2 animate-fade-in-up" style={{ animationDelay: '550ms' }}>
                  <LazyImg src="/products/gaun-pink-premium.png" alt="Gaun Pink" className="w-full h-full hover:scale-105 transition-transform duration-[1200ms]" />
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="relative z-10 pb-8 flex justify-center pointer-events-none">
          <div className="flex flex-col items-center gap-2 animate-float opacity-60">
            <span className="text-white/50 text-[8px] uppercase tracking-[0.35em] font-medium">Scroll</span>
            <div className="w-px h-10 bg-gradient-to-b from-white/50 to-transparent" />
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════
          STATS BAR
      ══════════════════════════════════ */}
      <div className="bg-[#1a1210] py-14 sm:py-20 relative overflow-hidden" ref={statsRef}>
        {/* Subtle background texture */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#2d2420]/60 via-transparent to-transparent pointer-events-none" />
        <div className="noise-overlay opacity-[0.02]" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="grid grid-cols-2 sm:grid-cols-4 divide-x divide-white/[0.07]">
            {[
              { emoji: '✦', label: 'Pelanggan Puas' },
              { emoji: '✦', label: 'Pengalaman' },
              { emoji: '✦', label: 'Koleksi Baju' },
              { emoji: '✦', label: 'Rating Rata-rata' },
            ].map((s, i) => (
              <div
                key={i}
                className="text-center px-4 sm:px-8 py-4 group"
                style={{
                  opacity: statsVisible ? 1 : 0,
                  transform: statsVisible ? 'translateY(0)' : 'translateY(32px)',
                  transition: 'opacity 0.8s cubic-bezier(0.16,1,0.3,1), transform 0.8s cubic-bezier(0.16,1,0.3,1)',
                  transitionDelay: `${i * 120}ms`,
                }}
              >
                <p
                  className="font-black tabular-nums leading-none text-gradient-gold"
                  style={{ fontSize: 'clamp(2.2rem, 5vw, 3.5rem)', letterSpacing: '-0.02em' }}
                >
                  {statsVisible ? statDisplays[i] : '—'}
                </p>
                <div className="w-6 h-px bg-[#d4a574]/30 mx-auto my-3 group-hover:w-12 transition-all duration-500 rounded-full" />
                <p className="text-white/40 font-semibold uppercase tracking-[0.22em]" style={{ fontSize: '0.62rem' }}>{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════
          CARA KERJA (HOW IT WORKS)
      ══════════════════════════════════ */}
      <section className="py-20 sm:py-28 bg-[#faf8f6] overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 sm:mb-20 reveal">
            <div className="eyebrow justify-center mb-4">Mudah &amp; Terpercaya</div>
            <h2
              className="font-black text-[#2d2420] leading-tight mb-4"
              style={{ fontSize: 'clamp(1.8rem, 4.5vw, 3rem)', letterSpacing: '-0.02em' }}
            >
              Tiga Langkah<br />
              <span className="font-serif italic text-[#8b7355]">Menuju Sempurna</span>
            </h2>
            <p className="text-[#8b7355] max-w-sm mx-auto leading-relaxed" style={{ fontSize: 'clamp(0.85rem, 1.6vw, 0.95rem)' }}>Proses sewa mudah, cepat, dan terpercaya — siap dalam hitungan jam</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 lg:gap-6 relative">
            {/* Connector line desktop */}
            <div className="hidden sm:block absolute top-12 left-[calc(16.67%+2rem)] right-[calc(16.67%+2rem)] h-px bg-gradient-to-r from-transparent via-[#8b7355]/25 to-transparent" />

            {[
              {
                step: '01',
                title: 'Pilih Koleksi',
                desc: 'Browse lebih dari 200 koleksi — gaun pengantin, kebaya, atau baju adat dari seluruh nusantara.',
                icon: '👗',
              },
              {
                step: '02',
                title: 'Hubungi & Fitting',
                desc: 'Chat via WhatsApp atau kunjungi showroom untuk fitting gratis. Tentukan tanggal dan durasi sewa.',
                icon: '📅',
              },
              {
                step: '03',
                title: 'Tampil Memukau',
                desc: 'Kami antar ke lokasi. Nikmati hari istimewa dengan tampilan sempurna penuh percaya diri.',
                icon: '✨',
              },
            ].map((step, i) => (
              <div
                key={step.step}
                className="group reveal card-premium p-8 text-center"
                style={{ transitionDelay: `${i * 120}ms` }}
              >
                <div className="relative inline-flex mb-6">
                  <div className="w-16 h-16 rounded-2xl bg-[#f5f0eb] group-hover:bg-[#2d2420] flex items-center justify-center transition-all duration-400 mx-auto">
                    <span className="text-2xl group-hover:scale-110 transition-transform duration-300">{step.icon}</span>
                  </div>
                  <span className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-[#d4a574] text-[#2d2420] text-[10px] font-black flex items-center justify-center leading-none">{i + 1}</span>
                </div>
                <p className="text-[9px] font-bold text-[#d4a574] uppercase tracking-[0.25em] mb-2">{step.step}</p>
                <h3 className="font-black text-[#2d2420] text-lg mb-3 group-hover:text-[#8b7355] transition-colors" style={{ letterSpacing: '-0.01em' }}>{step.title}</h3>
                <p className="text-sm text-[#8b7355] leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>

          <div className="text-center mt-12 reveal">
            <button onClick={() => whatsapp()} className="btn-primary">
              <MessageCircle size={16} />
              Mulai Konsultasi Gratis
            </button>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════
          MENGAPA KAMI
      ══════════════════════════════════ */}
      <section className="py-20 sm:py-28 bg-[#2d2420] overflow-hidden relative">
        <div className="noise-overlay opacity-[0.025]" />
        {/* Decorative accent */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full bg-[#8b7355]/5 blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 lg:gap-20 items-center">
            {/* Left copy */}
            <div className="reveal-left">
              <div className="eyebrow text-[#d4a574] mb-6">Keunggulan Kami</div>
              <h2
                className="font-black text-white leading-tight mb-6"
                style={{ fontSize: 'clamp(1.8rem, 4.5vw, 3rem)', letterSpacing: '-0.02em' }}
              >
                Mengapa Ribuan<br />
                Pengantin Memilih<br />
                <span className="font-serif italic text-[#d4a574]">Ibu Siti?</span>
              </h2>
              <p className="text-white/50 leading-[1.8] mb-10 max-w-md" style={{ fontSize: 'clamp(0.85rem, 1.6vw, 0.95rem)' }}>
                Selama 29 tahun, kami telah mendampingi ribuan pasangan merayakan momen terindah — dengan koleksi premium, pelayanan tulus, dan harga terjangkau.
              </p>
              <button onClick={() => whatsapp()} className="btn-gold">
                <MessageCircle size={16} />
                Konsultasi Gratis
              </button>
            </div>

            {/* Right USP grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 reveal-right">
              {[
                { icon: '🏆', title: '29 Tahun Pengalaman', desc: 'Berdiri sejak 1995, pilihan terpercaya keluarga Jakarta dan sekitarnya.' },
                { icon: '👗', title: '200+ Koleksi Eksklusif', desc: 'Gaun pengantin, kebaya, baju adat dari berbagai daerah nusantara.' },
                { icon: '📦', title: 'Antar & Jemput Gratis', desc: 'Layanan pengiriman gratis ke seluruh Jabodetabek.' },
                { icon: '✂️', title: 'Fitting & Alterasi', desc: 'Tim tailor profesional memastikan setiap pakaian muat sempurna.' },
              ].map((usp, i) => (
                <div
                  key={usp.title}
                  className="group bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] hover:border-[#d4a574]/30 rounded-3xl p-6 transition-all duration-400 reveal cursor-default"
                  style={{ transitionDelay: `${i * 100}ms` }}
                >
                  <span className="text-3xl block mb-4 group-hover:scale-110 transition-transform duration-300 origin-left">{usp.icon}</span>
                  <h3 className="font-black text-white text-sm mb-2 group-hover:text-[#d4a574] transition-colors" style={{ letterSpacing: '-0.01em' }}>{usp.title}</h3>
                  <p className="text-white/40 text-xs leading-relaxed group-hover:text-white/55 transition-colors">{usp.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════
          LATEST PRODUCTS
      ══════════════════════════════════ */}
      <section id="koleksi" className="py-20 sm:py-28 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-14 sm:mb-18">
            <div className="reveal">
              <div className="eyebrow mb-4">Koleksi Terbaru</div>
              <h2
                className="font-black text-[#2d2420] leading-tight"
                style={{ fontSize: 'clamp(1.8rem, 4.5vw, 3rem)', letterSpacing: '-0.02em' }}
              >
                Produk<br />
                <span className="font-serif italic text-[#8b7355]">Terbaru</span>
              </h2>
            </div>
            <p className="text-[#8b7355] text-sm max-w-xs leading-relaxed reveal sm:text-right">
              Koleksi terkini pilihan para pengantin dan pecinta fashion nusantara
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {latestProducts.map((p, i) => (
              <div key={p.id} className={`reveal delay-${(i + 1) * 100 as 100 | 200 | 300}`}>
                <ProductCard
                  product={p}
                  isWishlisted={wishlist.includes(p.id)}
                  onWishlist={toggleWishlist}
                  onView={openModal}
                  onOrder={whatsapp}
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════
          FEATURE BADGES
      ══════════════════════════════════ */}
      <section className="py-12 sm:py-16 bg-[#faf8f6] border-y border-[#e0d5cb]/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-10">
            {features.map(({ icon: Icon, title, desc }, i) => (
              <div
                key={title}
                className={`flex flex-col sm:flex-row items-start gap-4 group reveal delay-${(i * 100) as 0 | 100 | 200 | 300} cursor-default`}
              >
                <div className="w-12 h-12 rounded-2xl bg-[#2d2420] flex items-center justify-center flex-shrink-0 group-hover:bg-[#8b7355] transition-all duration-400 shadow-premium group-hover:shadow-gold group-hover:-translate-y-1">
                  <Icon size={20} className="text-[#d4a574] group-hover:text-white transition-colors duration-300" />
                </div>
                <div className="min-w-0">
                  <p className="font-black text-[#2d2420] text-sm mb-1" style={{ letterSpacing: '-0.01em' }}>{title}</p>
                  <p className="text-[11px] text-[#8b7355] leading-relaxed">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════
          CATEGORIES
      ══════════════════════════════════ */}
      <section id="kategori" className="py-20 sm:py-28 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-14 sm:mb-18">
            <div className="reveal">
              <div className="eyebrow mb-4">Jelajahi Koleksi</div>
              <h2
                className="font-black text-[#2d2420] leading-tight"
                style={{ fontSize: 'clamp(1.8rem, 4.5vw, 3rem)', letterSpacing: '-0.02em' }}
              >
                Kategori<br />
                <span className="font-serif italic text-[#8b7355]">Pilihan</span>
              </h2>
            </div>
            <p className="text-[#8b7355] text-sm max-w-xs leading-relaxed reveal sm:text-right">
              Temukan busana yang sesuai kebutuhan dan gaya Anda — dari gaun modern hingga baju adat
            </p>
          </div>

          {/* Desktop: asymmetric editorial grid */}
          <div className="hidden sm:grid grid-cols-3 gap-4 lg:gap-5" style={{ height: 'clamp(420px, 48vw, 560px)' }}>
            <a href="#koleksi" className="row-span-2 relative rounded-[28px] overflow-hidden group cursor-pointer reveal-left block">
              <LazyImg src={categories[0].image} alt={categories[0].name} className="w-full h-full group-hover:scale-106 transition-transform duration-700 ease-out" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0e0b09]/90 via-[#1a1210]/30 to-transparent transition-all duration-400" />
              {/* Category number */}
              <span className="absolute top-5 left-5 text-white/15 font-black" style={{ fontSize: '4rem', lineHeight: 1, letterSpacing: '-0.04em', fontFamily: 'Playfair Display, serif', fontStyle: 'italic' }}>01</span>
              <div className="absolute bottom-0 left-0 right-0 p-7 translate-y-2 group-hover:translate-y-0 transition-transform duration-400">
                <p className="text-white/50 text-[9px] font-bold uppercase tracking-[0.28em] mb-2">{categories[0].count}</p>
                <h3 className="text-white font-black text-2xl mb-1" style={{ letterSpacing: '-0.02em' }}>{categories[0].name}</h3>
                <p className="text-white/60 text-xs leading-relaxed mb-4 max-w-[200px]">{categories[0].desc}</p>
                <span className="inline-flex items-center gap-2 text-[#d4a574] text-[10px] font-black uppercase tracking-[0.2em] opacity-0 group-hover:opacity-100 transition-opacity duration-400">
                  Lihat Koleksi <ArrowRight size={11} />
                </span>
              </div>
            </a>
            {categories.slice(1).map((cat, i) => (
              <a href="#koleksi" key={cat.id} className={`relative rounded-[28px] overflow-hidden group cursor-pointer block ${i === 0 ? 'reveal delay-100' : 'reveal-right delay-200'}`}>
                <LazyImg src={cat.image} alt={cat.name} className="w-full h-full group-hover:scale-106 transition-transform duration-700 ease-out" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0e0b09]/88 via-[#1a1210]/25 to-transparent" />
                <span className="absolute top-4 left-5 text-white/12 font-black" style={{ fontSize: '3rem', lineHeight: 1, letterSpacing: '-0.04em', fontFamily: 'Playfair Display, serif', fontStyle: 'italic' }}>0{i + 2}</span>
                <div className="absolute bottom-0 left-0 right-0 p-5 translate-y-1 group-hover:translate-y-0 transition-transform duration-400">
                  <p className="text-white/50 text-[9px] font-bold uppercase tracking-[0.28em] mb-1.5">{cat.count}</p>
                  <h3 className="text-white font-black text-xl mb-1" style={{ letterSpacing: '-0.02em' }}>{cat.name}</h3>
                  <p className="text-white/55 text-xs mb-3">{cat.desc}</p>
                  <span className="inline-flex items-center gap-1.5 text-[#d4a574] text-[10px] font-black uppercase tracking-[0.2em] opacity-0 group-hover:opacity-100 transition-opacity duration-400">
                    Lihat <ArrowRight size={10} />
                  </span>
                </div>
              </a>
            ))}
          </div>

          {/* Mobile: vertical cards */}
          <div className="sm:hidden space-y-4">
            {categories.map((cat, i) => (
              <a href="#koleksi" key={cat.id} className="relative h-52 rounded-[24px] overflow-hidden group cursor-pointer reveal block">
                <LazyImg src={cat.image} alt={cat.name} className="w-full h-full group-hover:scale-105 transition-transform duration-700" />
                <div className="absolute inset-0 bg-gradient-to-r from-[#0e0b09]/88 via-[#1a1210]/50 to-transparent" />
                <span className="absolute top-3 right-4 text-white/10 font-black" style={{ fontSize: '3.5rem', lineHeight: 1, fontFamily: 'Playfair Display, serif', fontStyle: 'italic' }}>0{i + 1}</span>
                <div className="absolute inset-0 flex items-end p-6">
                  <div>
                    <p className="text-white/50 text-[9px] uppercase tracking-[0.22em] font-semibold mb-1.5">{cat.count}</p>
                    <h3 className="text-white font-black text-xl mb-1" style={{ letterSpacing: '-0.02em' }}>{cat.name}</h3>
                    <p className="text-white/60 text-xs">{cat.desc}</p>
                  </div>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════
          EXCLUSIVE OFFERS
      ══════════════════════════════════ */}
      <section className="py-16 sm:py-24 bg-[#faf8f6]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
            {/* Text */}
            <div className="space-y-6 reveal-left">
              <div>
                <div className="eyebrow mb-4">Penawaran Spesial</div>
                <h2
                  className="font-black text-[#2d2420] leading-tight"
                  style={{ fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', letterSpacing: '-0.02em' }}
                >
                  Penawaran<br />
                  <span className="font-serif italic text-[#8b7355]">Eksklusif</span><br />
                  Waktu Terbatas
                </h2>
              </div>
              <p className="text-[#8b7355] text-sm leading-relaxed">
                Dapatkan diskon hingga <span className="font-bold text-[#2d2420]">30%</span> untuk koleksi gaun pengantin premium dan kebaya eksklusif kami. Paket lengkap termasuk aksesoris dan konsultasi styling gratis.
              </p>

              <div className="grid grid-cols-3 gap-3">
                {[
                  { label: 'Konsultasi', value: 'Gratis' },
                  { label: 'Pengiriman', value: 'Gratis' },
                  { label: 'Diskon Max', value: '30%' },
                ].map(item => (
                  <div key={item.label} className="bg-white rounded-2xl px-4 py-3 border border-[#e0d5cb] text-center hover:border-[#8b7355] transition-colors">
                    <p className="font-bold text-[#2d2420] text-base">{item.value}</p>
                    <p className="text-[#8b7355] text-[10px] mt-0.5">{item.label}</p>
                  </div>
                ))}
              </div>

              <ul className="space-y-2">
                {['Fitting gratis di showroom Jakarta', 'Garansi kualitas 100%', 'Layanan antar-jemput tersedia'].map(item => (
                  <li key={item} className="flex items-center gap-2.5 text-sm text-[#2d2420]">
                    <span className="w-5 h-5 rounded-full bg-[#8b7355]/15 flex items-center justify-center flex-shrink-0">
                      <Check size={11} className="text-[#8b7355]" />
                    </span>
                    {item}
                  </li>
                ))}
              </ul>

              <div className="flex flex-col sm:flex-row gap-3 pt-1">
                <button
                  onClick={() => whatsapp()}
                  className="inline-flex items-center justify-center gap-2 bg-[#8b7355] hover:bg-[#7a6448] text-white px-6 py-3.5 rounded-full text-sm font-semibold transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5"
                >
                  <MessageCircle size={16} />
                  Dapatkan Penawaran
                </button>
                <a
                  href="#koleksi"
                  className="inline-flex items-center justify-center gap-2 border border-[#8b7355] text-[#8b7355] hover:bg-[#8b7355] hover:text-white px-6 py-3.5 rounded-full text-sm font-semibold transition-all duration-300"
                >
                  Lihat Koleksi <ArrowRight size={15} />
                </a>
              </div>
            </div>

            {/* Collage */}
            <div className="reveal-right">
              <div className="grid grid-cols-2 gap-3 sm:gap-4 h-[340px] sm:h-[440px]">
                <div className="rounded-3xl overflow-hidden row-span-2 shadow-premium">
                  <LazyImg src="/products/gaun-pengantin-premium.png" alt="Gaun Pengantin" className="w-full h-full" />
                </div>
                <div className="rounded-3xl overflow-hidden shadow-premium">
                  <LazyImg src="/products/kebaya-bludru.png" alt="Kebaya Bludru" className="w-full h-full" />
                </div>
                <div className="rounded-3xl overflow-hidden shadow-premium">
                  <LazyImg src="/products/dress-adat-batak.png" alt="Dress Batak" className="w-full h-full" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════
          BRAND MARQUEE
      ══════════════════════════════════ */}
      <section className="py-6 bg-[#2d2420] overflow-hidden" aria-hidden="true">
        <div className="flex gap-14 animate-marquee whitespace-nowrap select-none">
          {brandsFull.map((b, i) => (
            <span key={i} className="text-white/35 text-[11px] font-bold uppercase tracking-[0.3em] cursor-default hover:text-[#d4a574]/70 transition-colors duration-300 flex-shrink-0">
              {b}
            </span>
          ))}
        </div>
      </section>

      {/* ══════════════════════════════════
          FEATURED PRODUCTS
      ══════════════════════════════════ */}
      <section id="unggulan" className="py-20 sm:py-28 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-14">
            <div className="reveal">
              <div className="eyebrow mb-4">Pilihan Terbaik</div>
              <h2
                className="font-black text-[#2d2420] leading-tight"
                style={{ fontSize: 'clamp(1.8rem, 4.5vw, 3rem)', letterSpacing: '-0.02em' }}
              >
                Produk<br />
                <span className="font-serif italic text-[#8b7355]">Unggulan</span>
              </h2>
            </div>
            <button
              onClick={() => whatsapp()}
              className="hidden sm:inline-flex items-center gap-2 text-sm font-bold text-[#2d2420] hover:text-[#8b7355] transition-colors group reveal border-b border-[#2d2420]/30 hover:border-[#8b7355] pb-0.5 self-end mb-1"
            >
              Lihat Semua
              <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform duration-200" />
            </button>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {featuredProducts.map((p, i) => (
              <div key={p.id} className={`reveal delay-${(i * 100) as 0 | 100 | 200 | 300}`}>
                <ProductCard
                  product={p}
                  isWishlisted={wishlist.includes(p.id)}
                  onWishlist={toggleWishlist}
                  onView={openModal}
                  onOrder={whatsapp}
                  size="sm"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════
          SEASONAL COLLECTION
      ══════════════════════════════════ */}
      <section id="musiman" className="py-20 sm:py-28 bg-[#faf8f6]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-14">
            <div className="reveal">
              <div className="eyebrow mb-4">Tren Musim Ini</div>
              <h2
                className="font-black text-[#2d2420] leading-tight"
                style={{ fontSize: 'clamp(1.8rem, 4.5vw, 3rem)', letterSpacing: '-0.02em' }}
              >
                Koleksi<br />
                <span className="font-serif italic text-[#8b7355]">Musiman</span>
              </h2>
            </div>
            <p className="text-[#8b7355] text-sm max-w-xs leading-relaxed reveal sm:text-right">
              Inspirasi gaya terkini mengikuti ritme musim — segar, elegan, dan selalu relevan
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
            {[
              { title: 'Koleksi Musim Semi', sub: 'Segar, Ringan & Feminin', image: '/products/seasonal-spring.png', items: 12 },
              { title: 'Koleksi Autumn', sub: 'Hangat, Elegan & Berkelas', image: '/products/seasonal-autumn.png', items: 9 },
            ].map((col, i) => (
              <div
                key={col.title}
                className={`relative rounded-[28px] overflow-hidden group cursor-pointer ${i === 0 ? 'reveal-left' : 'reveal-right'}`}
                style={{ height: 'clamp(260px, 38vw, 460px)' }}
              >
                <LazyImg src={col.image} alt={col.title} className="w-full h-full group-hover:scale-105 transition-transform duration-700 ease-out" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0e0b09]/85 via-[#1a1210]/30 to-transparent" />
                <div className="absolute inset-0 flex items-end p-7 sm:p-9">
                  <div className="flex-1">
                    <p className="text-white/45 text-[9px] uppercase tracking-[0.28em] font-bold mb-2">{col.items} Koleksi · {col.sub}</p>
                    <h3 className="text-white font-black mb-5 group-hover:translate-y-[-2px] transition-transform duration-400" style={{ fontSize: 'clamp(1.2rem, 3vw, 2rem)', letterSpacing: '-0.02em' }}>{col.title}</h3>
                    <button
                      onClick={() => whatsapp(col.title)}
                      className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm hover:bg-[#d4a574] hover:text-[#0e0b09] text-white text-[11px] font-black px-5 py-2.5 rounded-full border border-white/20 hover:border-transparent transition-all duration-300"
                    >
                      Explore Koleksi <ArrowRight size={12} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════
          TESTIMONIALS
      ══════════════════════════════════ */}
      <section id="testimoni" className="py-20 sm:py-28 bg-[#faf8f6] overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 sm:mb-20 reveal">
            <div className="eyebrow justify-center mb-4">Cerita Pelanggan</div>
            <h2
              className="font-black text-[#2d2420] leading-tight mb-4"
              style={{ fontSize: 'clamp(1.8rem, 4.5vw, 3rem)', letterSpacing: '-0.02em' }}
            >
              Mereka Telah<br />
              <span className="font-serif italic text-[#8b7355]">Membuktikannya</span>
            </h2>
            <p className="text-[#8b7355] text-sm max-w-sm mx-auto leading-relaxed">
              Lebih dari 5.000 pelanggan puas telah mempercayakan hari istimewa mereka kepada kami
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6">
            {testimonials.map((t, i) => (
              <article
                key={i}
                className={`relative bg-white rounded-[28px] p-7 sm:p-8 border border-[#e0d5cb] hover:border-[#8b7355]/30 hover:shadow-premium-lg transition-all duration-400 group reveal delay-${(i * 100) as 0 | 100 | 200} overflow-hidden cursor-default`}
              >
                {/* Decorative large quote mark */}
                <div
                  className="absolute -top-3 -left-1 text-[#e0d5cb] group-hover:text-[#d4a574]/20 transition-colors duration-400 select-none pointer-events-none"
                  style={{ fontSize: '9rem', lineHeight: 1, fontFamily: 'Playfair Display, serif', fontStyle: 'italic', fontWeight: 800 }}
                  aria-hidden="true"
                >
                  "
                </div>
                <div className="relative z-10">
                  <div className="flex items-center gap-1.5 mb-5">
                    <Stars rating={t.rating} size={14} />
                    <span className="text-[9px] font-bold text-[#d4a574] bg-[#d4a574]/10 px-2 py-0.5 rounded-full ml-1">Terverifikasi</span>
                  </div>
                  <blockquote className="text-[#2d2420] text-sm leading-[1.8] mb-6 font-medium">
                    {t.feedback}
                  </blockquote>
                  <div className="flex items-center gap-3 border-t border-[#e0d5cb] pt-5">
                    <div className="w-11 h-11 rounded-full bg-gradient-to-br from-[#8b7355]/20 to-[#d4a574]/20 flex items-center justify-center text-xl flex-shrink-0 ring-2 ring-[#e0d5cb] group-hover:ring-[#8b7355]/30 transition-all duration-400">
                      {t.avatar}
                    </div>
                    <div>
                      <p className="font-black text-[#2d2420] text-sm" style={{ letterSpacing: '-0.01em' }}>{t.name}</p>
                      <p className="text-[10px] text-[#8b7355] font-medium mt-0.5">{t.role}</p>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════
          FAQ
      ══════════════════════════════════ */}
      <section id="faq" className="py-20 sm:py-28 bg-white">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14 reveal">
            <div className="eyebrow justify-center mb-4">Pertanyaan Umum</div>
            <h2
              className="font-black text-[#2d2420] leading-tight"
              style={{ fontSize: 'clamp(1.8rem, 4.5vw, 3rem)', letterSpacing: '-0.02em' }}
            >
              Ada yang ingin<br />
              <span className="font-serif italic text-[#8b7355]">ditanyakan?</span>
            </h2>
          </div>

          <div className="space-y-2">
            {faqs.map((faq, i) => (
              <div key={i} className="border-b border-[#e8e3dd] last:border-b-0 reveal">
                <button
                  className="w-full flex items-center justify-between py-5 text-left gap-4 group"
                  onClick={() => setFaqOpen(faqOpen === i ? null : i)}
                  aria-expanded={faqOpen === i}
                >
                  <span className={`font-black text-sm leading-snug transition-colors duration-200 ${faqOpen === i ? 'text-[#8b7355]' : 'text-[#2d2420] group-hover:text-[#8b7355]'}`} style={{ letterSpacing: '-0.01em' }}>{faq.q}</span>
                  <div className={`w-8 h-8 rounded-full border flex items-center justify-center flex-shrink-0 transition-all duration-300 ${faqOpen === i ? 'bg-[#2d2420] border-[#2d2420]' : 'border-[#e0d5cb] group-hover:border-[#8b7355]'}`}>
                    <ChevronDown
                      size={15}
                      className={`transition-all duration-300 ${faqOpen === i ? 'rotate-180 text-white' : 'text-[#8b7355]'}`}
                    />
                  </div>
                </button>
                {faqOpen === i && (
                  <div className="pb-5 animate-slide-down">
                    <p className="text-sm text-[#8b7355] leading-[1.85]">{faq.a}</p>
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="text-center mt-12 reveal">
            <p className="text-sm text-[#8b7355] mb-5">Masih ada pertanyaan lain?</p>
            <button onClick={() => whatsapp()} className="btn-primary">
              <MessageCircle size={16} />
              Tanya via WhatsApp
            </button>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════
          CTA BANNER
      ══════════════════════════════════ */}
      <section className="py-24 sm:py-36 bg-[#0e0b09] relative overflow-hidden">
        <div className="noise-overlay opacity-[0.03]" />
        {/* Decorative glowing rings */}
        <div className="absolute -top-40 -right-40 w-[700px] h-[700px] rounded-full border border-[#d4a574]/8 pointer-events-none animate-spin-slow" />
        <div className="absolute -top-20 -right-20 w-[500px] h-[500px] rounded-full border border-[#8b7355]/10 pointer-events-none animate-spin-slow-r" />
        <div className="absolute bottom-0 left-1/4 w-[400px] h-[400px] rounded-full bg-[#8b7355]/5 blur-3xl pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[900px] rounded-full bg-[#2d2420]/40 blur-3xl pointer-events-none" />

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className="eyebrow justify-center text-[#d4a574] mb-8 reveal">Konsultasi Gratis</div>
          <h2
            className="font-black text-white leading-tight mb-6 reveal"
            style={{ fontSize: 'clamp(2.2rem, 6vw, 4.5rem)', letterSpacing: '-0.03em' }}
          >
            Siap Tampil<br />
            <span className="font-serif italic text-gradient-gold">Memukau</span><br />
            di Hari Istimewa?
          </h2>
          <p className="text-white/45 leading-[1.8] mb-12 max-w-md mx-auto reveal" style={{ fontSize: 'clamp(0.85rem, 1.6vw, 0.95rem)' }}>
            Hubungi kami untuk konsultasi gratis. Tim ahli kami siap membantu menemukan koleksi impian Anda.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center reveal">
            <button
              onClick={() => whatsapp()}
              className="inline-flex items-center justify-center gap-2.5 bg-[#d4a574] hover:bg-[#c49562] text-[#0e0b09] font-black text-sm px-10 py-4.5 rounded-full transition-all duration-300 hover:-translate-y-1 hover:shadow-gold animate-pulse-ring"
              style={{ paddingTop: '1.125rem', paddingBottom: '1.125rem' }}
            >
              <MessageCircle size={18} />
              Chat WhatsApp Sekarang
            </button>
            <a
              href="tel:+62812345678"
              className="inline-flex items-center justify-center gap-2.5 bg-white/5 hover:bg-white/10 border border-white/12 hover:border-white/25 text-white font-semibold text-sm px-10 rounded-full transition-all duration-300"
              style={{ paddingTop: '1.125rem', paddingBottom: '1.125rem' }}
            >
              <Phone size={16} />
              Telepon Kami
            </a>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════
          FOOTER
      ══════════════════════════════════ */}
      <footer className="bg-[#0e0b09] text-white relative overflow-hidden">
        <div className="noise-overlay opacity-[0.02]" />
        {/* Top border accent */}
        <div className="h-px bg-gradient-to-r from-transparent via-[#8b7355]/40 to-transparent" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 sm:pt-20 pb-10 relative">
          {/* Brand statement row */}
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 pb-14 border-b border-white/[0.07] mb-14">
            <div className="max-w-md">
              <div className="flex items-baseline gap-3 mb-2">
                <span className="font-black text-2xl tracking-tight text-white" style={{ letterSpacing: '-0.02em' }}>Ibu Siti</span>
                <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-[#d4a574]/70">Wedding & Fashion</span>
              </div>
              <p className="text-white/35 text-sm leading-[1.8] max-w-sm">
                Penyedia sewa gaun pengantin, kebaya tradisional & baju adat berkualitas premium terpercaya sejak 1995 — mendampingi lebih dari 5.000 pasangan di hari istimewa mereka.
              </p>
            </div>
            <div className="flex gap-2.5">
              {[
                { icon: Instagram, label: 'Instagram' },
                { icon: Facebook,  label: 'Facebook' },
                { icon: Youtube,   label: 'YouTube' },
              ].map(({ icon: Icon, label }) => (
                <button
                  key={label}
                  aria-label={label}
                  className="w-10 h-10 rounded-2xl bg-white/[0.05] hover:bg-[#d4a574] flex items-center justify-center transition-all duration-300 hover:-translate-y-0.5 border border-white/[0.08]"
                >
                  <Icon size={15} className="text-white" />
                </button>
              ))}
            </div>
          </div>

          {/* Links grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 pb-14 border-b border-white/[0.07] mb-10">
            <div>
              <p className="text-[9px] font-black uppercase tracking-[0.22em] text-white/25 mb-5">Menu</p>
              <ul className="space-y-3">
                {[
                  { label: 'Beranda', href: '#' },
                  { label: 'Koleksi Terbaru', href: '#koleksi' },
                  { label: 'Kategori', href: '#kategori' },
                  { label: 'Produk Unggulan', href: '#unggulan' },
                  { label: 'Koleksi Musiman', href: '#musiman' },
                  { label: 'FAQ', href: '#faq' },
                ].map(({ label, href }) => (
                  <li key={label}>
                    <a href={href} className="text-white/40 hover:text-white/80 text-xs font-medium transition-colors duration-200">{label}</a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <p className="text-[9px] font-black uppercase tracking-[0.22em] text-white/25 mb-5">Layanan</p>
              <ul className="space-y-3">
                {['Sewa Baju', 'Dekorasi Pernikahan', 'Konsultasi Styling', 'Rias Pengantin', 'Fotografi', 'Antar-jemput'].map(item => (
                  <li key={item}>
                    <a href="#" className="text-white/40 hover:text-white/80 text-xs font-medium transition-colors duration-200">{item}</a>
                  </li>
                ))}
              </ul>
            </div>

            <div className="col-span-2">
              <p className="text-[9px] font-black uppercase tracking-[0.22em] text-white/25 mb-5">Kontak & Lokasi</p>
              <ul className="space-y-4 mb-6">
                <li className="flex items-start gap-3">
                  <div className="w-7 h-7 rounded-xl bg-white/[0.06] flex items-center justify-center flex-shrink-0 mt-0.5">
                    <MapPin size={12} className="text-[#d4a574]" />
                  </div>
                  <span className="text-white/40 text-xs leading-relaxed font-medium">Jl. Contoh No. 123, Jakarta Selatan, DKI Jakarta 12345</span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded-xl bg-white/[0.06] flex items-center justify-center flex-shrink-0">
                    <Phone size={12} className="text-[#d4a574]" />
                  </div>
                  <a href="tel:+6281234567" className="text-white/40 hover:text-white/70 text-xs font-medium transition-colors">+62 812 3456 78</a>
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded-xl bg-white/[0.06] flex items-center justify-center flex-shrink-0">
                    <MessageCircle size={12} className="text-[#d4a574]" />
                  </div>
                  <span className="text-white/40 text-xs font-medium">Buka setiap hari — 08.00–21.00 WIB</span>
                </li>
              </ul>
              <button
                onClick={() => whatsapp()}
                className="inline-flex items-center gap-2 bg-[#d4a574] hover:bg-[#c49562] text-[#0e0b09] text-xs font-black px-5 py-2.5 rounded-full transition-all duration-300 hover:-translate-y-0.5 hover:shadow-gold"
              >
                <MessageCircle size={13} />
                WhatsApp Kami
              </button>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-white/22 text-xs">© {new Date().getFullYear()} Ibu Siti Wedding & Fashion. Semua hak dilindungi.</p>
            <div className="flex gap-6">
              {['Kebijakan Privasi', 'Syarat & Ketentuan'].map(s => (
                <a key={s} href="#" className="text-white/22 hover:text-white/50 text-xs transition-colors">{s}</a>
              ))}
            </div>
          </div>
        </div>
      </footer>

      {/* ══════════════════════════════════
          PRODUCT DETAIL MODAL
      ══════════════════════════════════ */}
      {showModal && selectedProduct && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={selectedProduct.name}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4"
          onClick={() => setShowModal(false)}
        >
          <div
            className="bg-white rounded-t-3xl sm:rounded-3xl w-full sm:max-w-md overflow-hidden animate-scale-up shadow-2xl"
            onClick={e => e.stopPropagation()}
          >
            {/* Image */}
            <div className="relative aspect-[4/3] overflow-hidden bg-[#f5f0eb]">
              <LazyImg src={selectedProduct.image} alt={selectedProduct.name} className="w-full h-full" />
              <button
                aria-label="Tutup"
                onClick={() => setShowModal(false)}
                className="absolute top-4 right-4 w-9 h-9 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-sm hover:shadow-md transition-shadow"
              >
                <X size={16} className="text-[#2d2420]" />
              </button>
              {(selectedProduct.bestseller || selectedProduct.badge) && (
                <span className="absolute top-4 left-4 bg-[#2d2420] text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest">
                  {selectedProduct.badge ?? 'Bestseller'}
                </span>
              )}
            </div>

            {/* Details */}
            <div className="p-6 space-y-4">
              <div>
                <h2 className="text-xl font-bold text-[#2d2420]">{selectedProduct.name}</h2>
                <div className="flex items-center gap-2 mt-1.5">
                  <Stars rating={selectedProduct.rating} />
                  <span className="text-xs text-[#8b7355]">{selectedProduct.rating} ({selectedProduct.reviews} ulasan)</span>
                </div>
              </div>

              <div className="flex items-baseline gap-2.5">
                <span className="text-2xl font-bold text-[#8b7355]">{selectedProduct.price}</span>
                {selectedProduct.originalPrice && (
                  <span className="text-sm text-[#8b7355]/55 line-through">{selectedProduct.originalPrice}</span>
                )}
              </div>

              {selectedProduct.desc && (
                <p className="text-sm text-[#8b7355] leading-relaxed">{selectedProduct.desc}</p>
              )}

              <div className="flex items-center gap-2 text-xs text-[#8b7355] bg-[#faf8f6] rounded-xl px-4 py-2.5">
                <span className="w-2 h-2 rounded-full bg-green-400 flex-shrink-0" />
                Tersedia untuk disewa · Warna: <strong className="text-[#2d2420] ml-0.5">{selectedProduct.color}</strong>
              </div>

              <div className="flex gap-3 pt-1">
                <button
                  aria-label="Tambah ke wishlist"
                  onClick={() => toggleWishlist(selectedProduct.id)}
                  className={`w-12 h-12 rounded-2xl flex items-center justify-center border transition-all duration-200 ${
                    wishlist.includes(selectedProduct.id)
                      ? 'bg-[#8b7355] border-[#8b7355]'
                      : 'border-[#e0d5cb] hover:border-[#8b7355]'
                  }`}
                >
                  <Heart size={18} className={wishlist.includes(selectedProduct.id) ? 'fill-white text-white' : 'text-[#2d2420]'} />
                </button>
                <button
                  onClick={() => { addToCart(selectedProduct); setShowModal(false) }}
                  className="flex-1 bg-[#faf8f6] hover:bg-[#f0ebe5] border border-[#e0d5cb] text-[#2d2420] font-semibold py-3 rounded-2xl text-sm transition-colors"
                >
                  + Keranjang
                </button>
                <button
                  onClick={() => { whatsapp(selectedProduct.name); setShowModal(false) }}
                  className="flex-1 bg-[#8b7355] hover:bg-[#7a6448] text-white font-semibold py-3 rounded-2xl text-sm transition-colors flex items-center justify-center gap-2"
                >
                  <MessageCircle size={16} />
                  Pesan
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Mobile Bottom Navigation ── */}
      <nav className="sm:hidden fixed bottom-0 inset-x-0 z-50 bg-white/96 backdrop-blur-md border-t border-[#e0d5cb] px-2 pb-safe" style={{ boxShadow: '0 -1px 12px rgba(45,36,32,0.08)' }}>
        <div className="flex items-center justify-around h-[60px]">
          <a href="#" className="flex flex-col items-center gap-0.5 text-[#8b7355] min-w-[56px] py-1">
            <svg viewBox="0 0 24 24" className="w-5 h-5 fill-[#8b7355]"><path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/></svg>
            <span className="text-[9px] font-medium">Beranda</span>
          </a>
          <a href="#koleksi" className="flex flex-col items-center gap-0.5 text-[#2d2420]/40 min-w-[56px] py-1">
            <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current"><path d="M4 6h16v2H4zm2 5h12v2H6zm2 5h8v2H8z"/></svg>
            <span className="text-[9px] font-medium">Koleksi</span>
          </a>
          <button
            onClick={() => whatsapp()}
            className="flex flex-col items-center gap-0.5 relative -top-3"
          >
            <span className="w-12 h-12 rounded-2xl bg-[#8b7355] flex items-center justify-center shadow-premium-lg">
              <MessageCircle size={22} className="text-white" />
            </span>
            <span className="text-[9px] font-medium text-[#8b7355]">Tanya</span>
          </button>
          <button
            onClick={() => { document.getElementById('koleksi')?.scrollIntoView({ behavior: 'smooth' }) }}
            className="flex flex-col items-center gap-0.5 text-[#2d2420]/40 min-w-[56px] py-1 relative"
          >
            <Heart size={20} className={wishlist.length > 0 ? 'text-[#8b7355] fill-[#8b7355]' : ''} />
            <span className="text-[9px] font-medium">Wishlist</span>
            {wishlist.length > 0 && (
              <span className="absolute top-0 right-2 w-4 h-4 bg-[#8b7355] text-white text-[8px] font-bold rounded-full flex items-center justify-center leading-none">{wishlist.length}</span>
            )}
          </button>
          <button
            onClick={() => setSearchOpen(true)}
            className="flex flex-col items-center gap-0.5 text-[#2d2420]/40 min-w-[56px] py-1"
          >
            <Search size={20} />
            <span className="text-[9px] font-medium">Cari</span>
          </button>
        </div>
      </nav>

      {/* ── Floating WhatsApp Button (desktop only) ── */}
      <a
        href={`https://wa.me/62812345678?text=${encodeURIComponent('Halo Ibu Siti, saya ingin konsultasi tentang koleksi baju Anda.')}`}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat WhatsApp"
        className="hidden sm:flex fixed bottom-6 left-7 z-40 items-center gap-2 bg-[#25D366] hover:bg-[#1ebe5d] text-white font-semibold text-xs px-4 py-3 rounded-full shadow-premium-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl group"
      >
        {/* WhatsApp icon */}
        <svg viewBox="0 0 24 24" className="w-5 h-5 fill-white flex-shrink-0" xmlns="http://www.w3.org/2000/svg">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
        </svg>
        <span className="hidden sm:inline">Chat WhatsApp</span>
        {/* Pulse ring */}
        <span className="absolute inset-0 rounded-full animate-ping bg-[#25D366]/30 pointer-events-none" />
      </a>

      {/* ── Back to Top ── */}
      {showBackToTop && (
        <button
          aria-label="Kembali ke atas"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="fixed bottom-6 right-5 sm:right-7 w-11 h-11 bg-[#2d2420] hover:bg-[#8b7355] text-white rounded-full shadow-premium-lg flex items-center justify-center transition-all duration-300 hover:-translate-y-1 z-40 animate-scale-up"
        >
          <ChevronUp size={20} />
        </button>
      )}
    </div>
  )
}
