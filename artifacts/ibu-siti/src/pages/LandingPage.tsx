import { useState, useEffect, useRef } from 'react'
import { Heart, Search, ShoppingBag, Menu, X, MessageCircle, Star, ChevronUp, User, Truck, Headphones, RotateCcw, Shield, ArrowRight } from 'lucide-react'

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
}

export default function LandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [wishlist, setWishlist] = useState<number[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [showProductModal, setShowProductModal] = useState(false)
  const [showBackToTop, setShowBackToTop] = useState(false)
  const [cartCount, setCartCount] = useState(0)
  const marqueeRef = useRef<HTMLDivElement>(null)

  const whatsappNumber = '62812345678'

  useEffect(() => {
    const saved = localStorage.getItem('wishlist')
    if (saved) setWishlist(JSON.parse(saved))
    const cart = localStorage.getItem('cart')
    if (cart) setCartCount(JSON.parse(cart).length)
  }, [])

  useEffect(() => {
    localStorage.setItem('wishlist', JSON.stringify(wishlist))
  }, [wishlist])

  useEffect(() => {
    const handleScroll = () => setShowBackToTop(window.scrollY > 500)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' })

  const handleWhatsAppContact = (productName?: string) => {
    const message = productName
      ? `Halo, saya ingin menanyakan tentang ${productName}`
      : `Halo, saya ingin mengetahui lebih lanjut tentang koleksi baju Anda`
    window.open(`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`, '_blank')
  }

  const toggleWishlist = (productId: number) => {
    setWishlist(prev =>
      prev.includes(productId) ? prev.filter(id => id !== productId) : [...prev, productId]
    )
  }

  const addToCart = (product: Product) => {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]')
    cart.push({ id: product.id, name: product.name, price: product.price })
    localStorage.setItem('cart', JSON.stringify(cart))
    setCartCount(cart.length)
  }

  const latestProducts: Product[] = [
    { id: 1, name: 'Gaun Pengantin Premium', price: 'Rp 2.500.000', originalPrice: 'Rp 3.000.000', color: 'Putih Bersih', image: '/products/gaun-pengantin-premium.png', rating: 5, reviews: 24, bestseller: true },
    { id: 2, name: 'Kebaya Bludru Modern', price: 'Rp 1.200.000', color: 'Marun', image: '/products/kebaya-bludru.png', rating: 4.8, reviews: 18, bestseller: false },
    { id: 3, name: 'Dress Adat Batak', price: 'Rp 800.000', originalPrice: 'Rp 1.000.000', color: 'Hitam Emas', image: '/products/dress-adat-batak.png', rating: 4.9, reviews: 22, bestseller: true },
  ]

  const featuredProducts: Product[] = [
    { id: 101, name: 'Gaun Pink Premium', price: 'Rp 2.000.000', color: 'Pink Soft', image: '/products/gaun-pink-premium.png', rating: 5, reviews: 32, badge: 'New' },
    { id: 102, name: 'Jaket Brown Elegan', price: 'Rp 900.000', color: 'Brown Cream', image: '/products/jaket-brown-elegan.png', rating: 4.7, reviews: 15 },
    { id: 103, name: 'Dress Hijau Mewah', price: 'Rp 1.500.000', color: 'Hijau Sage', image: '/products/dress-hijau-mewah.png', rating: 4.9, reviews: 28, badge: 'Best' },
    { id: 104, name: 'Gaun Silver Eksklusif', price: 'Rp 2.200.000', color: 'Silver Shimmer', image: '/products/gaun-silver-eksklusif.png', rating: 5, reviews: 19 },
  ]

  const categories = [
    { id: 1, name: 'Gaun Pengantin', desc: 'Koleksi premium untuk hari istimewa', image: '/products/gaun-pengantin-premium.png' },
    { id: 2, name: 'Kebaya Tradisional', desc: 'Keindahan warisan budaya nusantara', image: '/products/kebaya-bludru.png' },
    { id: 3, name: 'Baju Adat', desc: 'Kekayaan adat dari seluruh Indonesia', image: '/products/dress-adat-batak.png' },
  ]

  const features = [
    { icon: Truck, title: 'Free Shipping', desc: 'Pengiriman gratis ke seluruh Jakarta' },
    { icon: Headphones, title: '24/7 Support', desc: 'Siap melayani kapan saja' },
    { icon: RotateCcw, title: 'Easy Returns', desc: 'Pengembalian mudah & cepat' },
    { icon: Shield, title: 'Secure Checkout', desc: 'Transaksi aman & terpercaya' },
  ]

  const brands = ['Ibu Siti', 'Premium', 'Elegant', 'Tradisional', 'Wedding', 'Fashion', 'Ibu Siti', 'Premium', 'Elegant', 'Tradisional', 'Wedding', 'Fashion']

  const testimonials = [
    { name: 'Ibu Khalim', role: 'Pengantin 1995', feedback: 'Gaun pengantin ini sangat indah dan nyaman dipakai. Terima kasih Ibu Siti!', rating: 5, avatar: '👰' },
    { name: 'Keluarga Aprilia', role: 'Pengantin Modern', feedback: 'Layanan dekorasi dan baju yang luar biasa profesional. Hari spesial kami sempurna!', rating: 5, avatar: '💍' },
    { name: 'Ibu Siti Salim', role: 'Rias Pengantin', feedback: 'Koleksi baju adat sangat lengkap dan berkualitas tinggi. Rekomendasi terbaik!', rating: 5, avatar: '👗' },
  ]

  const filteredLatest = latestProducts.filter(p =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="min-h-screen bg-[#faf8f6] font-sans">

      {/* Promo Bar */}
      <div className="bg-[#2d2420] text-white text-center py-2.5 text-xs sm:text-sm font-medium tracking-wide">
        🎊 Gratis Konsultasi + <span className="text-[#d4a574] font-semibold">Free Shipping</span> untuk pemesanan pertama Anda!
      </div>

      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-[#e0d5cb] shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 gap-4">
            {/* Logo */}
            <a href="#" className="text-xl sm:text-2xl font-bold text-[#2d2420] flex-shrink-0 tracking-tight">
              Ibu Siti
            </a>

            {/* Desktop Nav */}
            <nav className="hidden lg:flex items-center gap-8">
              {['Koleksi', 'Kategori', 'Unggulan', 'Musiman', 'Testimoni'].map(item => (
                <a
                  key={item}
                  href={`#${item.toLowerCase()}`}
                  className="text-sm font-medium text-[#2d2420] hover:text-[#8b7355] transition-colors duration-200 relative group"
                >
                  {item}
                  <span className="absolute -bottom-0.5 left-0 w-0 h-0.5 bg-[#8b7355] transition-all duration-300 group-hover:w-full" />
                </a>
              ))}
            </nav>

            {/* Right Icons */}
            <div className="flex items-center gap-1 sm:gap-2">
              {/* Search - desktop */}
              <div className="hidden md:flex items-center bg-[#f5f0eb] rounded-full px-3 py-1.5 gap-2 w-36 lg:w-44">
                <Search size={15} className="text-[#8b7355] flex-shrink-0" />
                <input
                  type="text"
                  placeholder="Cari..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="bg-transparent text-xs w-full outline-none text-[#2d2420] placeholder:text-[#8b7355]"
                />
              </div>

              <button className="p-2 rounded-full hover:bg-[#f5f0eb] transition-colors duration-200" title="Akun">
                <User size={19} className="text-[#2d2420]" />
              </button>

              <button className="p-2 rounded-full hover:bg-[#f5f0eb] transition-colors duration-200 relative" title="Wishlist">
                <Heart size={19} className={wishlist.length > 0 ? 'fill-[#8b7355] text-[#8b7355]' : 'text-[#2d2420]'} />
                {wishlist.length > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 bg-[#8b7355] text-white text-[10px] rounded-full w-4 h-4 flex items-center justify-center font-bold">
                    {wishlist.length}
                  </span>
                )}
              </button>

              <button className="p-2 rounded-full hover:bg-[#f5f0eb] transition-colors duration-200 relative" title="Keranjang">
                <ShoppingBag size={19} className="text-[#2d2420]" />
                {cartCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 bg-[#2d2420] text-white text-[10px] rounded-full w-4 h-4 flex items-center justify-center font-bold">
                    {cartCount}
                  </span>
                )}
              </button>

              {/* Mobile menu toggle */}
              <button
                className="lg:hidden p-2 rounded-full hover:bg-[#f5f0eb] transition-colors duration-200"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? <X size={20} className="text-[#2d2420]" /> : <Menu size={20} className="text-[#2d2420]" />}
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="lg:hidden border-t border-[#e0d5cb] py-4 space-y-1 animate-slide-in-left">
              <div className="flex items-center bg-[#f5f0eb] rounded-full px-3 py-2 gap-2 mb-3">
                <Search size={15} className="text-[#8b7355]" />
                <input
                  type="text"
                  placeholder="Cari produk..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="bg-transparent text-sm w-full outline-none text-[#2d2420] placeholder:text-[#8b7355]"
                />
              </div>
              {['Koleksi', 'Kategori', 'Unggulan', 'Musiman', 'Testimoni'].map(item => (
                <a
                  key={item}
                  href={`#${item.toLowerCase()}`}
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-2 py-2.5 text-sm font-medium text-[#2d2420] hover:text-[#8b7355] transition-colors"
                >
                  {item}
                </a>
              ))}
            </div>
          )}
        </div>
      </header>

      {/* ── HERO ── */}
      <section className="relative h-[420px] sm:h-[520px] lg:h-[600px] overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#2d2420]/80 via-[#2d2420]/50 to-transparent z-10" />
        <div
          className="absolute inset-0 bg-cover bg-center transition-transform duration-700"
          style={{ backgroundImage: `url('/products/seasonal-autumn.png')`, backgroundPosition: 'center 30%' }}
        />

        {/* Hero Content */}
        <div className="relative z-20 h-full flex items-center">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
            <div className="max-w-xl animate-fade-in-up">
              <p className="text-[#d4a574] text-xs sm:text-sm font-semibold uppercase tracking-[0.2em] mb-3">
                Koleksi Eksklusif 2024
              </p>
              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight mb-4">
                TAMPIL PERCAYA<br />DIRI SETIAP SAAT
              </h1>
              <p className="text-white/80 text-sm sm:text-base leading-relaxed mb-8 max-w-md">
                Sewa gaun pengantin, kebaya tradisional & baju adat berkualitas premium untuk hari istimewa Anda.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => handleWhatsAppContact()}
                  className="inline-flex items-center justify-center gap-2 bg-[#8b7355] hover:bg-[#7a6448] text-white px-7 py-3 rounded-full text-sm font-semibold transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0"
                >
                  <MessageCircle size={17} />
                  Hubungi Kami
                </button>
                <a
                  href="#koleksi"
                  className="inline-flex items-center justify-center gap-2 bg-white/15 hover:bg-white/25 backdrop-blur-sm text-white border border-white/30 px-7 py-3 rounded-full text-sm font-semibold transition-all duration-300"
                >
                  Lihat Koleksi
                  <ArrowRight size={16} />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── LATEST PRODUCTS ── */}
      <section id="koleksi" className="py-16 sm:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-10">
            <div>
              <p className="text-[#8b7355] text-xs font-semibold uppercase tracking-widest mb-1">Terbaru</p>
              <h2 className="text-2xl sm:text-3xl font-bold text-[#2d2420]">Produk Terbaru</h2>
            </div>
            {searchQuery && (
              <span className="text-sm text-[#8b7355]">{filteredLatest.length} hasil</span>
            )}
          </div>

          {filteredLatest.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
              {filteredLatest.map((product, idx) => (
                <div
                  key={product.id}
                  className="group animate-fade-in-up"
                  style={{ animationDelay: `${idx * 80}ms` }}
                >
                  {/* Image */}
                  <div className="relative bg-[#f5f0eb] rounded-2xl overflow-hidden aspect-[4/5] mb-4">
                    {product.bestseller && (
                      <span className="absolute top-3 left-3 z-10 bg-[#2d2420] text-white text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wide">
                        Bestseller
                      </span>
                    )}
                    <button
                      onClick={() => toggleWishlist(product.id)}
                      className="absolute top-3 right-3 z-10 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-sm hover:shadow-md transition-all duration-200 hover:scale-110"
                    >
                      <Heart size={15} className={wishlist.includes(product.id) ? 'fill-[#8b7355] text-[#8b7355]' : 'text-[#2d2420]'} />
                    </button>
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    {/* Quick action overlay */}
                    <div className="absolute inset-x-0 bottom-0 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                      <div className="bg-[#2d2420]/90 backdrop-blur-sm p-3 flex gap-2">
                        <button
                          onClick={() => { setSelectedProduct(product); setShowProductModal(true) }}
                          className="flex-1 text-white text-xs font-semibold py-2 rounded-lg border border-white/30 hover:bg-white/10 transition-colors"
                        >
                          Lihat Detail
                        </button>
                        <button
                          onClick={() => addToCart(product)}
                          className="flex-1 bg-[#8b7355] text-white text-xs font-semibold py-2 rounded-lg hover:bg-[#7a6448] transition-colors"
                        >
                          Tanyakan
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Info */}
                  <div>
                    <h3 className="font-semibold text-[#2d2420] mb-1 group-hover:text-[#8b7355] transition-colors text-sm">{product.name}</h3>
                    <div className="flex items-center gap-1 mb-2">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} size={12} className={i < Math.floor(product.rating) ? 'fill-[#d4a574] text-[#d4a574]' : 'text-[#e0d5cb]'} />
                      ))}
                      <span className="text-xs text-[#8b7355] ml-1">({product.reviews})</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-[#8b7355] text-sm">{product.price}</span>
                      {product.originalPrice && (
                        <span className="text-xs text-[#8b7355]/60 line-through">{product.originalPrice}</span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <Search size={40} className="mx-auto text-[#e0d5cb] mb-3" />
              <p className="text-[#8b7355]">Tidak ditemukan produk untuk "{searchQuery}"</p>
            </div>
          )}
        </div>
      </section>

      {/* ── FEATURE BADGES ── */}
      <section className="py-10 sm:py-14 bg-[#faf8f6] border-y border-[#e0d5cb]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            {features.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="flex items-start gap-3 group">
                <div className="w-10 h-10 rounded-xl bg-[#8b7355]/10 flex items-center justify-center flex-shrink-0 group-hover:bg-[#8b7355] transition-colors duration-300">
                  <Icon size={18} className="text-[#8b7355] group-hover:text-white transition-colors duration-300" />
                </div>
                <div>
                  <p className="font-semibold text-[#2d2420] text-sm">{title}</p>
                  <p className="text-xs text-[#8b7355] mt-0.5 leading-relaxed">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CATEGORIES ── */}
      <section id="kategori" className="py-16 sm:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-10">
            <p className="text-[#8b7355] text-xs font-semibold uppercase tracking-widest mb-1">Jelajahi</p>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#2d2420]">Kategori</h2>
            <p className="text-sm text-[#8b7355] mt-1">Temukan koleksi yang sesuai kebutuhan dan gaya Anda</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 lg:gap-6">
            {categories.map((cat, idx) => (
              <div
                key={cat.id}
                className="relative group rounded-2xl overflow-hidden cursor-pointer"
                style={{ height: idx === 0 ? '420px' : '300px' }}
              >
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#2d2420]/80 via-[#2d2420]/20 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-5">
                  <h3 className="text-white font-bold text-lg mb-0.5">{cat.name}</h3>
                  <p className="text-white/70 text-xs">{cat.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── EXCLUSIVE OFFERS ── */}
      <section className="py-16 sm:py-20 bg-[#faf8f6]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            {/* Text */}
            <div className="space-y-6">
              <div>
                <p className="text-[#8b7355] text-xs font-semibold uppercase tracking-widest mb-2">Penawaran Spesial</p>
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#2d2420] leading-tight">
                  Penawaran Eksklusif<br />untuk Waktu Terbatas
                </h2>
              </div>
              <p className="text-[#8b7355] text-sm sm:text-base leading-relaxed">
                Dapatkan diskon hingga <span className="font-bold text-[#2d2420]">30%</span> untuk koleksi gaun pengantin premium dan kebaya eksklusif kami. Hanya untuk pemesanan bulan ini!
              </p>

              <div className="flex flex-wrap gap-3">
                {[
                  { label: 'Konsultasi', value: 'Gratis' },
                  { label: 'Pengiriman', value: 'Gratis' },
                  { label: 'Diskon', value: 'Hingga 30%' },
                ].map(item => (
                  <div key={item.label} className="bg-white rounded-xl px-4 py-3 border border-[#e0d5cb]">
                    <p className="text-[#8b7355] text-xs">{item.label}</p>
                    <p className="font-bold text-[#2d2420] text-sm">{item.value}</p>
                  </div>
                ))}
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => handleWhatsAppContact()}
                  className="inline-flex items-center justify-center gap-2 bg-[#8b7355] hover:bg-[#7a6448] text-white px-6 py-3 rounded-full text-sm font-semibold transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5"
                >
                  <MessageCircle size={16} />
                  Dapatkan Penawaran
                </button>
                <a
                  href="#koleksi"
                  className="inline-flex items-center justify-center gap-2 border border-[#8b7355] text-[#8b7355] hover:bg-[#8b7355] hover:text-white px-6 py-3 rounded-full text-sm font-semibold transition-all duration-300"
                >
                  Lihat Koleksi
                  <ArrowRight size={15} />
                </a>
              </div>
            </div>

            {/* Image collage */}
            <div className="grid grid-cols-2 gap-3 h-[360px] sm:h-[420px]">
              <div className="rounded-2xl overflow-hidden row-span-2">
                <img src="/products/gaun-pengantin-premium.png" alt="Featured 1" className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
              </div>
              <div className="rounded-2xl overflow-hidden">
                <img src="/products/kebaya-bludru.png" alt="Featured 2" className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
              </div>
              <div className="rounded-2xl overflow-hidden">
                <img src="/products/dress-adat-batak.png" alt="Featured 3" className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── BRAND MARQUEE ── */}
      <section className="py-8 bg-[#2d2420] overflow-hidden">
        <div
          ref={marqueeRef}
          className="flex gap-12 animate-marquee whitespace-nowrap"
        >
          {[...brands, ...brands].map((brand, i) => (
            <span key={i} className="text-white/50 text-sm font-semibold uppercase tracking-widest flex-shrink-0 hover:text-white/80 transition-colors cursor-default">
              ✦ {brand}
            </span>
          ))}
        </div>
      </section>

      {/* ── FEATURED PRODUCTS ── */}
      <section id="unggulan" className="py-16 sm:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-10">
            <div>
              <p className="text-[#8b7355] text-xs font-semibold uppercase tracking-widest mb-1">Pilihan Terbaik</p>
              <h2 className="text-2xl sm:text-3xl font-bold text-[#2d2420]">Produk Unggulan</h2>
            </div>
            <button
              onClick={() => handleWhatsAppContact()}
              className="hidden sm:inline-flex items-center gap-1.5 text-sm font-semibold text-[#8b7355] hover:text-[#2d2420] transition-colors group"
            >
              Lihat Semua
              <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
            {featuredProducts.map((product, idx) => (
              <div
                key={product.id}
                className="group animate-fade-in-up"
                style={{ animationDelay: `${idx * 80}ms` }}
              >
                <div
                  className="relative bg-[#f5f0eb] rounded-2xl overflow-hidden aspect-square mb-3 cursor-pointer"
                  onClick={() => { setSelectedProduct(product); setShowProductModal(true) }}
                >
                  {product.badge && (
                    <span className="absolute top-2.5 left-2.5 z-10 bg-[#8b7355] text-white text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide">
                      {product.badge}
                    </span>
                  )}
                  <button
                    onClick={e => { e.stopPropagation(); toggleWishlist(product.id) }}
                    className="absolute top-2.5 right-2.5 z-10 w-7 h-7 bg-white rounded-full flex items-center justify-center shadow-sm hover:shadow-md transition-all hover:scale-110"
                  >
                    <Heart size={13} className={wishlist.includes(product.id) ? 'fill-[#8b7355] text-[#8b7355]' : 'text-[#2d2420]'} />
                  </button>
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>

                <h3 className="font-semibold text-[#2d2420] text-xs sm:text-sm leading-snug mb-1 group-hover:text-[#8b7355] transition-colors">{product.name}</h3>
                <div className="flex items-center gap-0.5 mb-1.5">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={11} className={i < Math.floor(product.rating) ? 'fill-[#d4a574] text-[#d4a574]' : 'text-[#e0d5cb]'} />
                  ))}
                  <span className="text-[10px] text-[#8b7355] ml-1">({product.reviews})</span>
                </div>
                <p className="font-bold text-[#8b7355] text-xs sm:text-sm">{product.price}</p>

                <button
                  onClick={() => handleWhatsAppContact(product.name)}
                  className="mt-2.5 w-full text-[#8b7355] border border-[#8b7355] text-xs font-semibold py-2 rounded-full hover:bg-[#8b7355] hover:text-white transition-all duration-300"
                >
                  Pesan Sekarang
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SEASONAL COLLECTION ── */}
      <section id="musiman" className="py-16 sm:py-20 bg-[#faf8f6]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-10">
            <p className="text-[#8b7355] text-xs font-semibold uppercase tracking-widest mb-1">Tren Musim Ini</p>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#2d2420]">Koleksi Musiman</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:gap-6">
            {[
              { id: 1, title: 'Koleksi Musim Semi', sub: 'Segar & Elegan', image: '/products/seasonal-spring.png' },
              { id: 2, title: 'Koleksi Autumn', sub: 'Hangat & Berkelas', image: '/products/seasonal-autumn.png' },
            ].map(col => (
              <div
                key={col.id}
                className="relative h-64 sm:h-80 lg:h-96 rounded-2xl overflow-hidden group cursor-pointer"
              >
                <img
                  src={col.image}
                  alt={col.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#2d2420]/70 via-transparent to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6 flex items-end justify-between">
                  <div>
                    <p className="text-white/70 text-xs mb-1">{col.sub}</p>
                    <h3 className="text-white font-bold text-xl">{col.title}</h3>
                  </div>
                  <button
                    onClick={() => handleWhatsAppContact(col.title)}
                    className="bg-white/20 backdrop-blur-sm text-white text-xs font-semibold px-4 py-2 rounded-full border border-white/30 hover:bg-white hover:text-[#2d2420] transition-all duration-300"
                  >
                    Explore
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section id="testimoni" className="py-16 sm:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="text-[#8b7355] text-xs font-semibold uppercase tracking-widest mb-2">Cerita Mereka</p>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#2d2420] mb-2">Fashion Berbicara Sendiri</h2>
            <p className="text-[#8b7355] text-sm max-w-lg mx-auto">Ribuan pelanggan puas telah membuktikan kualitas layanan kami</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t, idx) => (
              <div
                key={idx}
                className="bg-[#faf8f6] rounded-2xl p-6 border border-[#e0d5cb] hover:border-[#8b7355]/40 hover:shadow-lg transition-all duration-300 animate-fade-in-up"
                style={{ animationDelay: `${idx * 100}ms` }}
              >
                <div className="flex items-center gap-0.5 mb-4">
                  {[...Array(t.rating)].map((_, i) => (
                    <Star key={i} size={15} className="fill-[#d4a574] text-[#d4a574]" />
                  ))}
                </div>
                <p className="text-[#2d2420] text-sm leading-relaxed mb-5 italic">
                  "{t.feedback}"
                </p>
                <div className="flex items-center gap-3 border-t border-[#e0d5cb] pt-4">
                  <div className="w-9 h-9 rounded-full bg-[#8b7355]/10 flex items-center justify-center text-lg flex-shrink-0">
                    {t.avatar}
                  </div>
                  <div>
                    <p className="font-semibold text-[#2d2420] text-sm">{t.name}</p>
                    <p className="text-xs text-[#8b7355]">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA BANNER ── */}
      <section className="py-16 sm:py-20 bg-[#2d2420] relative overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute -top-20 -right-20 w-96 h-96 rounded-full border-[40px] border-white" />
          <div className="absolute -bottom-20 -left-20 w-96 h-96 rounded-full border-[40px] border-white" />
        </div>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <p className="text-[#d4a574] text-xs font-semibold uppercase tracking-widest mb-3">Konsultasi Gratis</p>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4 text-balance">
            Siap Tampil Memukau?
          </h2>
          <p className="text-white/70 text-sm sm:text-base leading-relaxed mb-8 max-w-xl mx-auto">
            Hubungi kami sekarang untuk konsultasi gratis dan temukan koleksi impian Anda
          </p>
          <button
            onClick={() => handleWhatsAppContact()}
            className="inline-flex items-center gap-2.5 bg-[#8b7355] hover:bg-[#a88968] text-white px-8 py-4 rounded-full font-semibold text-sm transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 active:translate-y-0"
          >
            <MessageCircle size={18} />
            Chat WhatsApp Sekarang
          </button>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="bg-[#1a1210] text-white py-14 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 pb-10 border-b border-white/10">
            <div className="col-span-2 sm:col-span-1">
              <p className="text-xl font-bold mb-3">Ibu Siti</p>
              <p className="text-white/50 text-xs leading-relaxed mb-4">
                Penyedia sewa baju pengantin, kebaya tradisional & dekorasi pernikahan berkualitas tinggi sejak 1995.
              </p>
              <button
                onClick={() => handleWhatsAppContact()}
                className="inline-flex items-center gap-1.5 bg-[#8b7355] hover:bg-[#a88968] text-white text-xs font-semibold px-4 py-2 rounded-full transition-colors"
              >
                <MessageCircle size={13} />
                WhatsApp
              </button>
            </div>

            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-white/50 mb-4">Main Page</p>
              <ul className="space-y-2.5">
                {['Beranda', 'Koleksi', 'Kategori', 'Unggulan'].map(item => (
                  <li key={item}>
                    <a href="#" className="text-white/60 hover:text-white text-xs transition-colors">{item}</a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-white/50 mb-4">Layanan</p>
              <ul className="space-y-2.5">
                {['Sewa Baju', 'Dekorasi', 'Fotografi', 'Konsultasi'].map(item => (
                  <li key={item}>
                    <a href="#" className="text-white/60 hover:text-white text-xs transition-colors">{item}</a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-white/50 mb-4">Kontak</p>
              <ul className="space-y-2.5 text-xs text-white/60">
                <li>📧 info@ibusiti.com</li>
                <li>📍 Jakarta, Indonesia</li>
                <li>🕐 24/7 Available</li>
              </ul>
            </div>
          </div>

          <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-white/40">
            <p>© 2024 Ibu Siti Wedding & Fashion. Semua hak dilindungi.</p>
            <div className="flex gap-5">
              {['Instagram', 'Facebook', 'TikTok'].map(s => (
                <a key={s} href="#" className="hover:text-white/70 transition-colors font-medium">{s}</a>
              ))}
            </div>
          </div>
        </div>
      </footer>

      {/* ── PRODUCT MODAL ── */}
      {showProductModal && selectedProduct && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-0 sm:p-4"
          onClick={() => setShowProductModal(false)}
        >
          <div
            className="bg-white rounded-t-3xl sm:rounded-2xl w-full sm:max-w-md overflow-hidden animate-scale-up shadow-2xl"
            onClick={e => e.stopPropagation()}
          >
            <div className="relative aspect-[4/3] overflow-hidden">
              <img src={selectedProduct.image} alt={selectedProduct.name} className="w-full h-full object-cover" />
              <button
                onClick={() => setShowProductModal(false)}
                className="absolute top-4 right-4 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-sm hover:shadow-md"
              >
                <X size={16} className="text-[#2d2420]" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <h3 className="text-xl font-bold text-[#2d2420] mb-1">{selectedProduct.name}</h3>
                <div className="flex items-center gap-1.5">
                  <div className="flex items-center gap-0.5">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={14} className={i < Math.floor(selectedProduct.rating || 0) ? 'fill-[#d4a574] text-[#d4a574]' : 'text-[#e0d5cb]'} />
                    ))}
                  </div>
                  <span className="text-xs text-[#8b7355]">({selectedProduct.reviews || 0} ulasan)</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-2xl font-bold text-[#8b7355]">{selectedProduct.price}</span>
                {selectedProduct.originalPrice && (
                  <span className="text-sm text-[#8b7355]/60 line-through">{selectedProduct.originalPrice}</span>
                )}
              </div>

              <div className="text-xs text-[#8b7355]">Warna: <span className="font-semibold text-[#2d2420]">{selectedProduct.color}</span></div>

              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => toggleWishlist(selectedProduct.id)}
                  className="w-11 h-11 border border-[#e0d5cb] rounded-xl flex items-center justify-center hover:border-[#8b7355] transition-colors"
                >
                  <Heart size={18} className={wishlist.includes(selectedProduct.id) ? 'fill-[#8b7355] text-[#8b7355]' : 'text-[#2d2420]'} />
                </button>
                <button
                  onClick={() => { handleWhatsAppContact(selectedProduct.name); setShowProductModal(false) }}
                  className="flex-1 bg-[#8b7355] hover:bg-[#7a6448] text-white font-semibold py-3 rounded-xl text-sm transition-colors flex items-center justify-center gap-2"
                >
                  <MessageCircle size={16} />
                  Tanyakan di WhatsApp
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Back to Top */}
      {showBackToTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 w-11 h-11 bg-[#2d2420] text-white rounded-full shadow-lg flex items-center justify-center hover:bg-[#8b7355] transition-all duration-300 hover:-translate-y-1 z-40 animate-fade-in-up"
        >
          <ChevronUp size={20} />
        </button>
      )}
    </div>
  )
}
