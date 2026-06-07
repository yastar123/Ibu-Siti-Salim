import { useState, useEffect, useRef, useCallback } from 'react'
import {
  Heart, Search, ShoppingBag, Menu, X, MessageCircle, Star,
  ChevronUp, User, Truck, Headphones, RotateCcw, Shield,
  ArrowRight, Check, Phone, MapPin, Instagram, Facebook, Youtube,
  ChevronDown
} from 'lucide-react'

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
    <article className="group reveal" style={{ '--tw-animation-delay': '0ms' } as React.CSSProperties}>
      {/* Image wrapper */}
      <div
        className="relative bg-[#f5f0eb] rounded-2xl overflow-hidden cursor-pointer"
        style={{ aspectRatio: size === 'sm' ? '1/1' : '4/5' }}
        onClick={() => onView(product)}
      >
        {(product.bestseller || product.badge) && (
          <span className="absolute top-3 left-3 z-10 bg-[#2d2420] text-white text-[9px] font-bold px-2.5 py-1 rounded-full uppercase tracking-widest">
            {product.badge ?? 'Bestseller'}
          </span>
        )}
        <button
          aria-label="Tambah ke wishlist"
          onClick={e => { e.stopPropagation(); onWishlist(product.id) }}
          className={`absolute top-3 right-3 z-10 w-8 h-8 rounded-full flex items-center justify-center shadow-sm transition-all duration-200 hover:scale-110 ${
            isWishlisted ? 'bg-[#8b7355]' : 'bg-white hover:bg-[#faf8f6]'
          }`}
        >
          <Heart size={14} className={isWishlisted ? 'fill-white text-white' : 'text-[#2d2420]'} />
        </button>

        <LazyImg src={product.image} alt={product.name} className="w-full h-full" />

        {/* Hover overlay */}
        <div className="absolute inset-x-0 bottom-0 translate-y-full group-hover:translate-y-0 transition-transform duration-350 ease-out">
          <div className="bg-[#2d2420]/92 backdrop-blur-sm p-3 flex gap-2">
            <button
              onClick={e => { e.stopPropagation(); onView(product) }}
              className="flex-1 text-white text-[11px] font-semibold py-2 rounded-xl border border-white/20 hover:bg-white/10 transition-colors"
            >
              Lihat Detail
            </button>
            <button
              onClick={e => { e.stopPropagation(); onOrder(product.name) }}
              className="flex-1 bg-[#8b7355] hover:bg-[#a88968] text-white text-[11px] font-semibold py-2 rounded-xl transition-colors"
            >
              Tanyakan
            </button>
          </div>
        </div>
      </div>

      {/* Info */}
      <div className="mt-3 space-y-1.5">
        <h3
          className="font-semibold text-[#2d2420] text-sm leading-snug group-hover:text-[#8b7355] transition-colors cursor-pointer line-clamp-2"
          onClick={() => onView(product)}
        >
          {product.name}
        </h3>
        <div className="flex items-center gap-1.5">
          <Stars rating={product.rating} />
          <span className="text-[10px] text-[#8b7355]">({product.reviews})</span>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="font-bold text-[#8b7355] text-sm">{product.price}</span>
          {product.originalPrice && (
            <span className="text-[11px] text-[#8b7355]/55 line-through">{product.originalPrice}</span>
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

  /* ── Scroll: back-to-top + hero parallax ── */
  useEffect(() => {
    const h = () => {
      const y = window.scrollY
      setShowBackToTop(y > 600)
      setHeroParallax(y * 0.28)
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

  /* ══════════════════════════════════
     RENDER
  ══════════════════════════════════ */
  return (
    <div className="min-h-screen bg-[#faf8f6] overflow-x-hidden">

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

      {/* ── HEADER ── */}
      <header className="sticky top-0 z-50 bg-white/96 backdrop-blur-md border-b border-[#e0d5cb]" style={{ boxShadow: '0 1px 12px rgba(45,36,32,0.07)' }}>
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
      <section className="relative overflow-hidden" style={{ height: 'clamp(400px, 65vh, 680px)' }}>
        {/* Bg image */}
        <div
          className={`absolute inset-0 bg-cover bg-center transition-opacity duration-700 ${heroLoaded ? 'opacity-100' : 'opacity-0'}`}
          style={{
            backgroundImage: `url('/products/seasonal-autumn.png')`,
            backgroundPosition: 'center 25%',
            transform: `translateY(${heroParallax}px)`,
            willChange: 'transform',
          }}
        />
        {!heroLoaded && <div className="absolute inset-0 shimmer" />}

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#2d2420]/85 via-[#2d2420]/40 to-[#2d2420]/10" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#2d2420]/30 to-transparent" />

        {/* Content */}
        <div className="relative z-10 h-full flex items-center">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
            <div className="max-w-lg">
              <p className="text-[#d4a574] text-[11px] sm:text-xs font-bold uppercase tracking-[0.25em] mb-3 animate-fade-in-up">
                ✦ Koleksi Eksklusif 2024
              </p>
              <h1
                className="font-bold text-white leading-[1.05] mb-4 animate-fade-in-up"
                style={{ fontSize: 'clamp(1.9rem, 5vw, 3.5rem)', animationDelay: '80ms' }}
              >
                TAMPIL PERCAYA<br className="hidden sm:block" /> DIRI SETIAP SAAT
              </h1>
              <p
                className="text-white/80 leading-relaxed mb-8 animate-fade-in-up"
                style={{ fontSize: 'clamp(0.82rem, 1.8vw, 1rem)', animationDelay: '160ms' }}
              >
                Sewa gaun pengantin, kebaya tradisional & baju adat berkualitas<br className="hidden sm:block" /> premium untuk hari istimewa Anda.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 animate-fade-in-up" style={{ animationDelay: '240ms' }}>
                <button
                  onClick={() => whatsapp()}
                  className="inline-flex items-center justify-center gap-2 bg-[#8b7355] hover:bg-[#a88968] text-white px-7 py-3.5 rounded-full text-sm font-semibold transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 hover-lift"
                >
                  <MessageCircle size={16} />
                  Hubungi Kami
                </button>
                <a
                  href="#koleksi"
                  className="inline-flex items-center justify-center gap-2 bg-white/15 hover:bg-white/25 backdrop-blur-sm text-white border border-white/30 hover:border-white/50 px-7 py-3.5 rounded-full text-sm font-semibold transition-all duration-300"
                >
                  Lihat Koleksi
                  <ArrowRight size={15} />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll hint */}
        <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 animate-float">
          <div className="w-5 h-8 rounded-full border-2 border-white/40 flex items-start justify-center pt-1.5">
            <div className="w-1 h-1.5 bg-white/70 rounded-full animate-bounce" />
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════
          STATS BAR
      ══════════════════════════════════ */}
      <div className="bg-[#8b7355] py-7" ref={statsRef}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-5 text-center">
            {stats.map((s, i) => (
              <div
                key={i}
                className="transition-all duration-700"
                style={{
                  opacity: statsVisible ? 1 : 0,
                  transform: statsVisible ? 'translateY(0)' : 'translateY(20px)',
                  transitionDelay: `${i * 120}ms`,
                }}
              >
                <p className="text-2xl sm:text-3xl font-bold text-white tracking-tight">{s.value}</p>
                <p className="text-white/65 text-[11px] mt-1 font-medium uppercase tracking-widest">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════
          CARA KERJA (HOW IT WORKS)
      ══════════════════════════════════ */}
      <section className="py-16 sm:py-20 bg-[#faf8f6]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 reveal">
            <p className="text-[#8b7355] text-[10px] font-bold uppercase tracking-[0.2em] mb-2">Mudah & Terpercaya</p>
            <h2 className="text-fluid-2xl font-bold text-[#2d2420]">Cara Kerja Penyewaan</h2>
            <p className="text-[#8b7355] text-sm mt-2 max-w-md mx-auto">Proses sewa yang mudah, cepat, dan terpercaya — siap dalam hitungan jam</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 lg:gap-8 relative">
            {/* Connector line desktop */}
            <div className="hidden sm:block absolute top-10 left-[calc(16.67%+1rem)] right-[calc(16.67%+1rem)] h-px bg-gradient-to-r from-[#e0d5cb] via-[#8b7355]/40 to-[#e0d5cb]" />

            {[
              {
                step: '01',
                title: 'Pilih Koleksi',
                desc: 'Browse koleksi lengkap kami — gaun pengantin, kebaya, atau baju adat. Gunakan filter untuk menemukan yang tepat.',
                icon: '👗',
              },
              {
                step: '02',
                title: 'Hubungi & Jadwalkan',
                desc: 'Chat via WhatsApp atau kunjungi showroom untuk fitting gratis. Tentukan tanggal dan durasi sewa Anda.',
                icon: '📅',
              },
              {
                step: '03',
                title: 'Tampil Memukau',
                desc: 'Kami antar ke lokasi Anda. Nikmati hari istimewa dengan tampilan yang sempurna dan penuh percaya diri.',
                icon: '✨',
              },
            ].map((step, i) => (
              <div
                key={step.step}
                className="relative bg-white rounded-3xl p-7 border border-[#e0d5cb] hover:border-[#8b7355]/50 hover:shadow-premium-lg transition-all duration-300 text-center group reveal"
                style={{ transitionDelay: `${i * 120}ms` }}
              >
                {/* Step number */}
                <div className="w-14 h-14 rounded-2xl bg-[#8b7355]/8 border border-[#e0d5cb] group-hover:bg-[#8b7355] group-hover:border-[#8b7355] flex items-center justify-center mx-auto mb-5 transition-all duration-300">
                  <span className="text-2xl group-hover:scale-110 transition-transform duration-300">{step.icon}</span>
                </div>
                <span className="text-[10px] font-bold text-[#8b7355] uppercase tracking-[0.2em] block mb-2">{step.step}</span>
                <h3 className="font-bold text-[#2d2420] text-base mb-2">{step.title}</h3>
                <p className="text-xs text-[#8b7355] leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>

          <div className="text-center mt-10 reveal">
            <button
              onClick={() => whatsapp()}
              className="inline-flex items-center gap-2 bg-[#8b7355] hover:bg-[#7a6448] text-white px-7 py-3.5 rounded-full text-sm font-semibold transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5"
            >
              <MessageCircle size={16} />
              Mulai Konsultasi Gratis
            </button>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════
          LATEST PRODUCTS
      ══════════════════════════════════ */}
      <section id="koleksi" className="py-16 sm:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-10 sm:mb-14">
            <div className="reveal">
              <p className="text-[#8b7355] text-[10px] font-bold uppercase tracking-[0.2em] mb-1.5">Terbaru</p>
              <h2 className="text-fluid-2xl font-bold text-[#2d2420]">Produk Terbaru</h2>
              <p className="text-[#8b7355] text-sm mt-1 max-w-xs">Koleksi terkini pilihan para pengantin dan pecinta fashion</p>
            </div>
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
      <section className="py-10 sm:py-14 bg-[#faf8f6] border-y border-[#e0d5cb]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {features.map(({ icon: Icon, title, desc }, i) => (
              <div
                key={title}
                className={`flex items-start gap-3 group reveal delay-${(i * 100) as 0 | 100 | 200 | 300}`}
              >
                <div className="w-11 h-11 rounded-2xl bg-[#8b7355]/10 flex items-center justify-center flex-shrink-0 group-hover:bg-[#8b7355] transition-all duration-300 group-hover:shadow-lg">
                  <Icon size={19} className="text-[#8b7355] group-hover:text-white transition-colors duration-300" />
                </div>
                <div className="min-w-0">
                  <p className="font-bold text-[#2d2420] text-sm">{title}</p>
                  <p className="text-[11px] text-[#8b7355] mt-0.5 leading-relaxed">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════
          CATEGORIES
      ══════════════════════════════════ */}
      <section id="kategori" className="py-16 sm:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-10 sm:mb-14 reveal">
            <p className="text-[#8b7355] text-[10px] font-bold uppercase tracking-[0.2em] mb-1.5">Jelajahi</p>
            <h2 className="text-fluid-2xl font-bold text-[#2d2420]">Kategori Koleksi</h2>
            <p className="text-[#8b7355] text-sm mt-1">Temukan baju yang sesuai dengan kebutuhan dan gaya Anda</p>
          </div>

          {/* Desktop: asymmetric grid */}
          <div className="hidden sm:grid grid-cols-3 gap-4 lg:gap-5 h-[500px]">
            {/* Tall card */}
            <div className="row-span-2 relative rounded-3xl overflow-hidden group cursor-pointer reveal-left">
              <LazyImg src={categories[0].image} alt={categories[0].name} className="w-full h-full" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#2d2420]/80 via-[#2d2420]/20 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <p className="text-white/60 text-[10px] font-semibold uppercase tracking-widest mb-1">{categories[0].count}</p>
                <h3 className="text-white font-bold text-xl mb-0.5">{categories[0].name}</h3>
                <p className="text-white/70 text-xs">{categories[0].desc}</p>
              </div>
            </div>
            {/* Two shorter cards */}
            {categories.slice(1).map((cat, i) => (
              <div key={cat.id} className={`relative rounded-3xl overflow-hidden group cursor-pointer ${i === 0 ? 'reveal' : 'reveal-right'}`}>
                <LazyImg src={cat.image} alt={cat.name} className="w-full h-full" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#2d2420]/80 via-[#2d2420]/10 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-5">
                  <p className="text-white/60 text-[10px] font-semibold uppercase tracking-widest mb-1">{cat.count}</p>
                  <h3 className="text-white font-bold text-lg">{cat.name}</h3>
                  <p className="text-white/70 text-xs mt-0.5">{cat.desc}</p>
                </div>
                <div className="absolute inset-0 group-hover:bg-[#8b7355]/20 transition-colors duration-300" />
              </div>
            ))}
          </div>

          {/* Mobile: vertical stack */}
          <div className="sm:hidden grid grid-cols-1 gap-4">
            {categories.map(cat => (
              <div key={cat.id} className="relative h-44 rounded-2xl overflow-hidden group cursor-pointer reveal">
                <LazyImg src={cat.image} alt={cat.name} className="w-full h-full" />
                <div className="absolute inset-0 bg-gradient-to-r from-[#2d2420]/70 to-[#2d2420]/20" />
                <div className="absolute inset-0 flex items-end p-5">
                  <div>
                    <p className="text-white/60 text-[10px] uppercase tracking-wider mb-0.5">{cat.count}</p>
                    <h3 className="text-white font-bold text-lg">{cat.name}</h3>
                    <p className="text-white/70 text-xs">{cat.desc}</p>
                  </div>
                </div>
              </div>
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
                <p className="text-[#8b7355] text-[10px] font-bold uppercase tracking-[0.2em] mb-2">Penawaran Spesial</p>
                <h2 className="text-fluid-2xl font-bold text-[#2d2420] leading-snug">
                  Penawaran Eksklusif<br />untuk Waktu Terbatas
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
      <section className="py-7 bg-[#2d2420] overflow-hidden" aria-hidden="true">
        <div className="flex gap-10 animate-marquee whitespace-nowrap select-none">
          {brandsFull.map((b, i) => (
            <span key={i} className="text-white/40 text-xs font-bold uppercase tracking-[0.25em] flex-shrink-0 hover:text-white/70 transition-colors cursor-default">
              {b}
            </span>
          ))}
        </div>
      </section>

      {/* ══════════════════════════════════
          FEATURED PRODUCTS
      ══════════════════════════════════ */}
      <section id="unggulan" className="py-16 sm:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-10 sm:mb-14">
            <div className="reveal">
              <p className="text-[#8b7355] text-[10px] font-bold uppercase tracking-[0.2em] mb-1.5">Pilihan Terbaik</p>
              <h2 className="text-fluid-2xl font-bold text-[#2d2420]">Produk Unggulan</h2>
            </div>
            <button
              onClick={() => whatsapp()}
              className="hidden sm:inline-flex items-center gap-1.5 text-sm font-semibold text-[#8b7355] hover:text-[#2d2420] transition-colors group reveal"
            >
              Lihat Semua
              <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform" />
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
      <section id="musiman" className="py-16 sm:py-24 bg-[#faf8f6]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-10 sm:mb-14 reveal">
            <p className="text-[#8b7355] text-[10px] font-bold uppercase tracking-[0.2em] mb-1.5">Tren Musim Ini</p>
            <h2 className="text-fluid-2xl font-bold text-[#2d2420]">Koleksi Musiman</h2>
            <p className="text-[#8b7355] text-sm mt-1">Temukan inspirasi gaya terkini dari koleksi musiman kami</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            {[
              { title: 'Koleksi Musim Semi', sub: 'Segar, Ringan & Feminin', image: '/products/seasonal-spring.png', items: 12 },
              { title: 'Koleksi Autumn', sub: 'Hangat, Elegan & Berkelas', image: '/products/seasonal-autumn.png', items: 9 },
            ].map((col, i) => (
              <div
                key={col.title}
                className={`relative rounded-3xl overflow-hidden group cursor-pointer ${i === 0 ? 'reveal-left' : 'reveal-right'}`}
                style={{ height: 'clamp(240px, 35vw, 420px)' }}
              >
                <LazyImg src={col.image} alt={col.title} className="w-full h-full group-hover:scale-105 transition-transform duration-700" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#2d2420]/80 via-[#2d2420]/20 to-transparent" />
                <div className="absolute inset-0 flex items-end justify-between p-6 sm:p-8">
                  <div>
                    <p className="text-white/60 text-[10px] uppercase tracking-widest mb-1">{col.items} Koleksi</p>
                    <p className="text-white/70 text-xs mb-1">{col.sub}</p>
                    <h3 className="text-white font-bold text-xl sm:text-2xl">{col.title}</h3>
                  </div>
                  <button
                    onClick={() => whatsapp(col.title)}
                    className="bg-white/15 backdrop-blur-sm text-white text-xs font-semibold px-4 py-2.5 rounded-full border border-white/30 hover:bg-white hover:text-[#2d2420] transition-all duration-300 flex-shrink-0 ml-3"
                  >
                    Explore →
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════
          TESTIMONIALS
      ══════════════════════════════════ */}
      <section id="testimoni" className="py-16 sm:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-16 reveal">
            <p className="text-[#8b7355] text-[10px] font-bold uppercase tracking-[0.2em] mb-2">Cerita Mereka</p>
            <h2 className="text-fluid-2xl font-bold text-[#2d2420] mb-2">Fashion Berbicara Sendiri</h2>
            <p className="text-[#8b7355] text-sm max-w-md mx-auto">Lebih dari 5.000 pelanggan puas telah membuktikan kualitas layanan kami</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6">
            {testimonials.map((t, i) => (
              <article
                key={i}
                className={`bg-[#faf8f6] rounded-3xl p-6 sm:p-7 border border-[#e0d5cb] hover:border-[#8b7355]/40 hover:shadow-premium-lg transition-all duration-300 reveal delay-${(i * 100) as 0 | 100 | 200}`}
              >
                <Stars rating={t.rating} size={15} />
                <blockquote className="text-[#2d2420] text-sm leading-relaxed my-4 italic">
                  "{t.feedback}"
                </blockquote>
                <div className="flex items-center gap-3 border-t border-[#e0d5cb] pt-4">
                  <div className="w-10 h-10 rounded-full bg-[#8b7355]/10 flex items-center justify-center text-xl flex-shrink-0">
                    {t.avatar}
                  </div>
                  <div>
                    <p className="font-bold text-[#2d2420] text-sm">{t.name}</p>
                    <p className="text-[11px] text-[#8b7355]">{t.role}</p>
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
      <section id="faq" className="py-16 sm:py-24 bg-[#faf8f6]">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 reveal">
            <p className="text-[#8b7355] text-[10px] font-bold uppercase tracking-[0.2em] mb-2">Pertanyaan Umum</p>
            <h2 className="text-fluid-2xl font-bold text-[#2d2420]">FAQ</h2>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <div key={i} className="bg-white rounded-2xl border border-[#e0d5cb] overflow-hidden reveal">
                <button
                  className="w-full flex items-center justify-between px-6 py-4 text-left gap-3 hover:bg-[#faf8f6] transition-colors"
                  onClick={() => setFaqOpen(faqOpen === i ? null : i)}
                  aria-expanded={faqOpen === i}
                >
                  <span className="font-semibold text-[#2d2420] text-sm">{faq.q}</span>
                  <ChevronDown
                    size={18}
                    className={`text-[#8b7355] flex-shrink-0 transition-transform duration-300 ${faqOpen === i ? 'rotate-180' : ''}`}
                  />
                </button>
                {faqOpen === i && (
                  <div className="px-6 pb-5 animate-slide-down">
                    <p className="text-sm text-[#8b7355] leading-relaxed">{faq.a}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════
          CTA BANNER
      ══════════════════════════════════ */}
      <section className="py-16 sm:py-24 bg-[#2d2420] relative overflow-hidden">
        {/* Decorative circles */}
        <div className="absolute -top-24 -right-24 w-80 h-80 rounded-full border-[48px] border-white/5 pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-80 h-80 rounded-full border-[48px] border-white/5 pointer-events-none" />
        <div className="absolute top-1/2 right-1/4 w-40 h-40 rounded-full border-[24px] border-[#8b7355]/20 pointer-events-none" />

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <p className="text-[#d4a574] text-[10px] font-bold uppercase tracking-[0.25em] mb-3 reveal">Konsultasi Gratis</p>
          <h2
            className="font-bold text-white mb-4 reveal"
            style={{ fontSize: 'clamp(1.8rem, 5vw, 3.5rem)' }}
          >
            Siap Tampil Memukau<br />di Hari Istimewa Anda?
          </h2>
          <p className="text-white/60 text-sm leading-relaxed mb-8 max-w-lg mx-auto reveal">
            Hubungi kami sekarang untuk konsultasi gratis. Tim ahli kami siap membantu Anda menemukan koleksi impian.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center reveal">
            <button
              onClick={() => whatsapp()}
              className="inline-flex items-center justify-center gap-2.5 bg-[#8b7355] hover:bg-[#a88968] text-white px-8 py-4 rounded-full font-semibold text-sm transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 animate-pulse-ring"
            >
              <MessageCircle size={18} />
              Chat WhatsApp Sekarang
            </button>
            <a
              href="tel:+62812345678"
              className="inline-flex items-center justify-center gap-2.5 bg-white/10 hover:bg-white/20 border border-white/20 text-white px-8 py-4 rounded-full font-semibold text-sm transition-all duration-300"
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
      <footer className="bg-[#1a1210] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-14 sm:pt-16 pb-10">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 pb-10 border-b border-white/10">
            {/* Brand */}
            <div className="col-span-2 sm:col-span-1">
              <p className="text-xl font-bold mb-0.5">Ibu Siti</p>
              <p className="text-[#8b7355] text-[10px] uppercase tracking-[0.15em] font-semibold mb-3">Wedding & Fashion</p>
              <p className="text-white/50 text-xs leading-relaxed mb-4">
                Penyedia sewa baju pengantin, kebaya tradisional & dekorasi pernikahan terpercaya sejak 1995.
              </p>
              <button
                onClick={() => whatsapp()}
                className="inline-flex items-center gap-1.5 bg-[#8b7355] hover:bg-[#a88968] text-white text-xs font-semibold px-4 py-2.5 rounded-full transition-colors"
              >
                <MessageCircle size={13} />
                WhatsApp Kami
              </button>
            </div>

            {/* Links */}
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-white/40 mb-4">Menu</p>
              <ul className="space-y-2.5">
                {['Beranda', 'Koleksi Terbaru', 'Kategori', 'Produk Unggulan', 'Koleksi Musiman', 'FAQ'].map(item => (
                  <li key={item}>
                    <a href="#" className="text-white/55 hover:text-white text-xs transition-colors">{item}</a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-white/40 mb-4">Layanan</p>
              <ul className="space-y-2.5">
                {['Sewa Baju', 'Dekorasi Pernikahan', 'Konsultasi Styling', 'Rias Pengantin', 'Fotografi', 'Antar-jemput'].map(item => (
                  <li key={item}>
                    <a href="#" className="text-white/55 hover:text-white text-xs transition-colors">{item}</a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-white/40 mb-4">Kontak</p>
              <ul className="space-y-3">
                <li className="flex items-start gap-2.5 text-xs text-white/55">
                  <MapPin size={13} className="text-[#8b7355] mt-0.5 flex-shrink-0" />
                  Jl. Contoh No. 123, Jakarta Selatan, DKI Jakarta
                </li>
                <li className="flex items-center gap-2.5 text-xs text-white/55">
                  <Phone size={13} className="text-[#8b7355] flex-shrink-0" />
                  +62 812 3456 78
                </li>
                <li className="flex items-center gap-2.5 text-xs text-white/55">
                  <MessageCircle size={13} className="text-[#8b7355] flex-shrink-0" />
                  Buka setiap hari, 08.00–21.00
                </li>
              </ul>

              <div className="flex gap-3 mt-5">
                {[
                  { icon: Instagram, label: 'Instagram' },
                  { icon: Facebook,  label: 'Facebook' },
                  { icon: Youtube,   label: 'YouTube' },
                ].map(({ icon: Icon, label }) => (
                  <button
                    key={label}
                    aria-label={label}
                    className="w-8 h-8 rounded-full bg-white/10 hover:bg-[#8b7355] flex items-center justify-center transition-colors"
                  >
                    <Icon size={14} className="text-white" />
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-white/35">
            <p>© 2024 Ibu Siti Wedding & Fashion. Semua hak dilindungi.</p>
            <div className="flex gap-5">
              {['Kebijakan Privasi', 'Syarat & Ketentuan'].map(s => (
                <a key={s} href="#" className="hover:text-white/60 transition-colors">{s}</a>
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

      {/* ── Floating WhatsApp Button ── */}
      <a
        href={`https://wa.me/62812345678?text=${encodeURIComponent('Halo Ibu Siti, saya ingin konsultasi tentang koleksi baju Anda.')}`}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat WhatsApp"
        className="fixed bottom-6 left-5 sm:left-7 z-40 flex items-center gap-2 bg-[#25D366] hover:bg-[#1ebe5d] text-white font-semibold text-xs px-4 py-3 rounded-full shadow-premium-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl group"
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
