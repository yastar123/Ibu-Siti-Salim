import { useState, useEffect } from 'react'
import { Heart, Search, Menu, X, MessageCircle, Star, Clock, ChevronUp } from 'lucide-react'

export default function LandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [wishlist, setWishlist] = useState<number[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedProduct, setSelectedProduct] = useState<typeof products[0] | null>(null)
  const [showProductModal, setShowProductModal] = useState(false)
  const [scrollY, setScrollY] = useState(0)
  const [showBackToTop, setShowBackToTop] = useState(false)

  const whatsappNumber = '62812345678'

  useEffect(() => {
    const saved = localStorage.getItem('wishlist')
    if (saved) setWishlist(JSON.parse(saved))
  }, [])

  useEffect(() => {
    localStorage.setItem('wishlist', JSON.stringify(wishlist))
  }, [wishlist])

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY)
      setShowBackToTop(window.scrollY > 500)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleWhatsAppContact = (productName?: string) => {
    const message = productName
      ? `Halo, saya ingin menanyakan tentang ${productName}`
      : `Halo, saya ingin mengetahui lebih lanjut tentang koleksi baju Anda`
    const encodedMessage = encodeURIComponent(message)
    window.open(`https://wa.me/${whatsappNumber}?text=${encodedMessage}`, '_blank')
  }

  const toggleWishlist = (productId: number) => {
    setWishlist(prev =>
      prev.includes(productId)
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    )
  }

  const handleProductClick = (product: typeof products[0]) => {
    setSelectedProduct(product)
    setShowProductModal(true)
  }

  const closeMobileMenu = () => setMobileMenuOpen(false)

  const products = [
    { id: 1, name: 'Gaun Pengantin Premium', price: 'Rp 2.500.000', color: 'Putih Bersih', image: '/products/gaun-pengantin-premium.png', rating: 5, reviews: 24, bestseller: true },
    { id: 2, name: 'Kebaya Bludru Modern', price: 'Rp 1.200.000', color: 'Marun', image: '/products/kebaya-bludru.png', rating: 4.8, reviews: 18, bestseller: false },
    { id: 3, name: 'Dress Adat Batak', price: 'Rp 800.000', color: 'Hitam Emas', image: '/products/dress-adat-batak.png', rating: 4.9, reviews: 22, bestseller: true },
  ]

  const filteredProducts = products.filter(p =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const categories = [
    { id: 1, name: 'Gaun Pengantin', image: '/products/category-gaun-pengantin.png' },
    { id: 2, name: 'Kebaya Tradisional', image: '/products/category-kebaya.png' },
    { id: 3, name: 'Baju Adat', image: '/products/category-baju-adat.png' },
    { id: 4, name: 'Baju Profesi', image: '/products/category-baju-profesi.png' },
  ]

  const seasonalCollections = [
    { id: 1, title: 'Koleksi Musim Semi', image: '/products/seasonal-spring.png' },
    { id: 2, title: 'Koleksi Autumn', image: '/products/seasonal-autumn.png' },
  ]

  const featuredProducts = [
    { id: 101, name: 'Gaun Pink Premium', price: 'Rp 2.000.000', color: 'Pink Soft', image: '/products/gaun-pink-premium.png', rating: 5, reviews: 32 },
    { id: 102, name: 'Jaket Brown Elegan', price: 'Rp 900.000', color: 'Brown Cream', image: '/products/jaket-brown-elegan.png', rating: 4.7, reviews: 15 },
    { id: 103, name: 'Dress Hijau Mewah', price: 'Rp 1.500.000', color: 'Hijau Sage', image: '/products/dress-hijau-mewah.png', rating: 4.9, reviews: 28 },
    { id: 104, name: 'Gaun Silver Eksklusif', price: 'Rp 2.200.000', color: 'Silver Shimmer', image: '/products/gaun-silver-eksklusif.png', rating: 5, reviews: 19 },
  ]

  return (
    <div className="min-h-screen bg-background">
      {/* Header/Navigation */}
      <header className="sticky top-0 z-50 bg-white border-b border-border shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between gap-4">
            <div className="text-2xl font-bold text-primary flex-shrink-0">Ibu Siti</div>

            <nav className="hidden lg:flex gap-8 flex-1 justify-center">
              <a href="#products" className="text-foreground hover:text-primary transition-smooth text-sm font-medium">
                Koleksi
              </a>
              <a href="#categories" className="text-foreground hover:text-primary transition-smooth text-sm font-medium">
                Kategori
              </a>
              <a href="#featured" className="text-foreground hover:text-primary transition-smooth text-sm font-medium">
                Unggulan
              </a>
              <a href="#testimonials" className="text-foreground hover:text-primary transition-smooth text-sm font-medium">
                Testimoni
              </a>
            </nav>

            <div className="flex items-center gap-2 sm:gap-4">
              <div className="hidden sm:flex items-center bg-muted rounded-lg px-3 py-2 w-40 lg:w-48">
                <Search size={18} className="text-muted-foreground flex-shrink-0" />
                <input
                  type="text"
                  placeholder="Cari..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-transparent ml-2 w-full outline-none text-sm placeholder-muted-foreground"
                />
              </div>

              <button className="p-2 hover:bg-muted rounded-lg transition-smooth relative group" title="Wishlist">
                <Heart size={20} className={wishlist.length > 0 ? 'fill-primary text-primary' : 'text-foreground'} />
                {wishlist.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                    {wishlist.length}
                  </span>
                )}
              </button>

              <button
                className="lg:hidden p-2 hover:bg-muted rounded-lg transition-smooth"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                aria-label="Toggle menu"
              >
                {mobileMenuOpen ? (
                  <X size={24} className="text-foreground" />
                ) : (
                  <Menu size={24} className="text-foreground" />
                )}
              </button>
            </div>
          </div>

          {mobileMenuOpen && (
            <nav className="lg:hidden pt-4 border-t border-border flex flex-col gap-3 animate-slide-in-left">
              <div className="flex items-center bg-muted rounded-lg px-3 py-2">
                <Search size={18} className="text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Cari produk..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-transparent ml-2 w-full outline-none text-sm placeholder-muted-foreground"
                />
              </div>

              <a href="#products" onClick={closeMobileMenu} className="text-foreground hover:text-primary transition-smooth py-2 font-medium">
                Koleksi
              </a>
              <a href="#categories" onClick={closeMobileMenu} className="text-foreground hover:text-primary transition-smooth py-2 font-medium">
                Kategori
              </a>
              <a href="#featured" onClick={closeMobileMenu} className="text-foreground hover:text-primary transition-smooth py-2 font-medium">
                Unggulan
              </a>
              <a href="#testimonials" onClick={closeMobileMenu} className="text-foreground hover:text-primary transition-smooth py-2 font-medium">
                Testimoni
              </a>
            </nav>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary/5 via-background to-secondary/5 py-16 sm:py-32 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 right-10 w-72 h-72 bg-secondary rounded-full blur-3xl" style={{ transform: `translateY(${scrollY * 0.5}px)` }} />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-accent rounded-full blur-3xl" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            <div className="relative h-96 sm:h-[450px] rounded-2xl overflow-hidden bg-muted shadow-premium group">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/30 to-accent/20 flex items-center justify-center">
                <div className="text-center text-white">
                  <p className="text-sm font-medium opacity-75 uppercase tracking-widest">Koleksi Eksklusif</p>
                  <p className="text-5xl sm:text-6xl font-bold mt-4">Baju Impian</p>
                </div>
              </div>
            </div>

            <div className="space-y-6 animate-fade-in-up">
              <div>
                <p className="text-primary font-semibold uppercase tracking-widest text-sm mb-2">Selamat Datang</p>
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground text-balance leading-tight">
                  Tampil Memukau di Hari Istimewa Anda
                </h1>
              </div>

              <p className="text-lg text-muted-foreground leading-relaxed max-w-lg">
                Kami menyediakan koleksi lengkap gaun pengantin, kebaya tradisional, baju adat, dan layanan dekorasi pernikahan dengan tren terbaru yang modern dan stylish.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <button
                  onClick={() => handleWhatsAppContact()}
                  className="bg-primary text-primary-foreground px-8 py-3 rounded-xl font-semibold hover:bg-primary/90 hover:shadow-lg transition-smooth flex items-center justify-center gap-2 group active:scale-95"
                >
                  <MessageCircle size={20} className="group-hover:animate-pulse-soft" />
                  Hubungi WhatsApp
                </button>
                <a href="#products" className="border-2 border-primary text-primary px-8 py-3 rounded-xl font-semibold hover:bg-primary/5 transition-smooth text-center">
                  Lihat Koleksi
                </a>
              </div>

              <div className="flex flex-wrap gap-4 pt-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Star size={16} className="text-secondary" />
                  <span>Rating 4.9/5</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock size={16} className="text-secondary" />
                  <span>Proses Cepat</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Latest Products */}
      <section id="products" className="py-16 sm:py-32 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 mb-12">
            <div>
              <h2 className="text-3xl sm:text-5xl font-bold text-foreground mb-2">Produk Terbaru</h2>
              <p className="text-muted-foreground">Koleksi baju terbaru yang trending</p>
            </div>
            {searchQuery && (
              <div className="text-sm text-muted-foreground">
                Ditemukan {filteredProducts.length} produk
              </div>
            )}
          </div>

          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((product, idx) => (
                <div
                  key={product.id}
                  className="group cursor-pointer animate-fade-in-up"
                  style={{ animationDelay: `${idx * 100}ms` }}
                >
                  <div className="relative bg-muted rounded-2xl overflow-hidden h-80 mb-4 flex items-center justify-center shadow-sm group-hover:shadow-premium transition-smooth">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-accent/10 group-hover:from-primary/20 group-hover:to-accent/20 transition-smooth" />

                    <button
                      onClick={() => toggleWishlist(product.id)}
                      className="absolute top-4 right-4 z-10 bg-white/90 backdrop-blur-sm p-2 rounded-full hover:bg-white transition-smooth shadow-sm group-hover:scale-110"
                      title={wishlist.includes(product.id) ? "Hapus dari wishlist" : "Tambah ke wishlist"}
                    >
                      <Heart
                        size={20}
                        className={wishlist.includes(product.id) ? 'fill-primary text-primary' : 'text-foreground'}
                      />
                    </button>

                    {product.bestseller && (
                      <div className="absolute top-4 left-4 bg-primary text-primary-foreground px-3 py-1 rounded-full text-xs font-bold">
                        Bestseller
                      </div>
                    )}

                    <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                  </div>

                  <h3 className="font-semibold text-foreground mb-1 group-hover:text-primary transition-smooth">{product.name}</h3>

                  <div className="flex items-center gap-2 mb-2">
                    <div className="flex items-center gap-0.5">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          size={14}
                          className={i < Math.floor(product.rating) ? 'fill-secondary text-secondary' : 'text-border'}
                        />
                      ))}
                    </div>
                    <span className="text-xs text-muted-foreground">({product.reviews})</span>
                  </div>

                  <p className="text-sm text-muted-foreground mb-3">{product.color}</p>
                  <p className="text-lg font-bold text-primary mb-4">{product.price}</p>

                  <button
                    onClick={() => handleWhatsAppContact(product.name)}
                    className="w-full bg-muted text-primary rounded-xl py-2.5 font-semibold hover:bg-primary hover:text-primary-foreground transition-smooth active:scale-95"
                  >
                    Tanyakan
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Search size={48} className="mx-auto text-muted mb-4" />
              <p className="text-muted-foreground">Tidak ada produk yang sesuai dengan pencarian "{searchQuery}"</p>
            </div>
          )}
        </div>
      </section>

      {/* Categories */}
      <section id="categories" className="py-16 sm:py-32 bg-background relative overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-20 left-10 w-64 h-64 bg-primary rounded-full blur-3xl" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="mb-16">
            <h2 className="text-3xl sm:text-5xl font-bold text-foreground mb-2">Kategori</h2>
            <p className="text-muted-foreground">Pilih kategori sesuai gaya dan kebutuhan Anda</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((category, idx) => (
              <div
                key={category.id}
                className="relative h-64 rounded-2xl overflow-hidden cursor-pointer group shadow-sm hover:shadow-premium transition-smooth"
                style={{ animationDelay: `${idx * 100}ms` }}
              >
                <img src={category.image} alt={category.name} className="w-full h-full object-cover group-hover:scale-105 transition-smooth duration-300" />
                <div className="absolute inset-0 bg-gradient-to-br from-primary/40 via-accent/30 to-secondary/40 group-hover:from-primary/50 group-hover:via-accent/40 group-hover:to-secondary/50 transition-smooth" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <h3 className="text-white font-bold text-center text-lg px-4 text-balance group-hover:scale-110 transition-smooth">
                    {category.name}
                  </h3>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Seasonal Collection */}
      <section className="py-16 sm:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-2">Koleksi Musiman</h2>
            <p className="text-muted-foreground">Temukan tren terbaru untuk setiap musim</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {seasonalCollections.map((collection, idx) => (
              <div
                key={collection.id}
                className="relative h-80 rounded-2xl overflow-hidden cursor-pointer group shadow-sm hover:shadow-premium transition-smooth animate-fade-in-up"
                style={{ animationDelay: `${idx * 100}ms` }}
              >
                <img src={collection.image} alt={collection.title} className="w-full h-full object-cover group-hover:scale-105 transition-smooth duration-300" />
                <div className="absolute inset-0 bg-gradient-to-br from-secondary/30 to-accent/20 group-hover:from-secondary/40 group-hover:to-accent/30 transition-smooth" />
                <div className="absolute inset-0 flex items-end justify-start p-6">
                  <h3 className="text-white font-bold text-2xl">{collection.title}</h3>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section id="featured" className="py-16 sm:py-32 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-16">
            <div>
              <h2 className="text-3xl sm:text-5xl font-bold text-foreground mb-2">Produk Unggulan</h2>
              <p className="text-muted-foreground">Koleksi pilihan dengan rating terbaik</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product, idx) => (
              <div
                key={product.id}
                className="group animate-fade-in-up"
                style={{ animationDelay: `${idx * 100}ms` }}
              >
                <div
                  className="relative bg-muted rounded-2xl overflow-hidden h-64 mb-4 flex items-center justify-center shadow-sm group-hover:shadow-premium transition-smooth cursor-pointer"
                  onClick={() => handleProductClick(product)}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-accent/10 group-hover:from-primary/20 group-hover:to-accent/20 transition-smooth" />

                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      toggleWishlist(product.id)
                    }}
                    className="absolute top-3 right-3 z-10 bg-white/90 backdrop-blur-sm p-2 rounded-full hover:bg-white transition-smooth shadow-sm group-hover:scale-110"
                  >
                    <Heart
                      size={18}
                      className={wishlist.includes(product.id) ? 'fill-primary text-primary' : 'text-foreground'}
                    />
                  </button>

                  <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                </div>

                <h3 className="font-semibold text-foreground mb-1 group-hover:text-primary transition-smooth">{product.name}</h3>

                <div className="flex items-center gap-2 mb-2">
                  <div className="flex items-center gap-0.5">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        size={13}
                        className={i < Math.floor(product.rating) ? 'fill-secondary text-secondary' : 'text-border'}
                      />
                    ))}
                  </div>
                  <span className="text-xs text-muted-foreground">({product.reviews})</span>
                </div>

                <p className="text-sm text-muted-foreground mb-3">{product.color}</p>
                <p className="text-lg font-bold text-primary mb-4">{product.price}</p>

                <button
                  onClick={() => handleWhatsAppContact(product.name)}
                  className="w-full text-primary border border-primary rounded-xl py-2.5 font-semibold hover:bg-primary hover:text-primary-foreground transition-smooth active:scale-95"
                >
                  Pesan Sekarang
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-16 sm:py-32 bg-gradient-to-br from-background to-background relative overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute bottom-0 right-0 w-80 h-80 bg-secondary rounded-full blur-3xl" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-5xl font-bold text-foreground mb-2">
              Kepuasan Pelanggan
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Ribuan pelanggan puas telah membuktikan kualitas layanan kami
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                name: 'Ibu Khalim',
                role: 'Pengantin Tahun 1995',
                feedback: 'Gaun pengantin ini sangat indah dan nyaman dipakai. Terima kasih Ibu Siti!',
                rating: 5,
              },
              {
                name: 'Keluarga Aprilia',
                role: 'Pengantin Modern',
                feedback: 'Layanan dekorasi dan baju yang luar biasa profesional. Hari spesial kami sempurna!',
                rating: 5,
              },
              {
                name: 'Ibu Siti Salim',
                role: 'Rias Pengantin',
                feedback: 'Koleksi baju adat kami sangat lengkap dan berkualitas tinggi. Rekomendasi terbaik!',
                rating: 5,
              },
            ].map((testimonial, idx) => (
              <div
                key={idx}
                className="bg-white rounded-2xl p-6 sm:p-8 border border-border shadow-sm hover:shadow-premium transition-smooth animate-fade-in-up"
                style={{ animationDelay: `${idx * 100}ms` }}
              >
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} size={18} className="fill-secondary text-secondary" />
                  ))}
                </div>
                <p className="text-foreground mb-6 leading-relaxed italic">
                  &quot;{testimonial.feedback}&quot;
                </p>
                <div className="border-t border-border pt-4">
                  <p className="font-semibold text-foreground">{testimonial.name}</p>
                  <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 sm:py-32 bg-gradient-to-r from-primary via-accent to-primary text-primary-foreground relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-10 w-80 h-80 bg-primary-foreground rounded-full blur-3xl" />
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h2 className="text-3xl sm:text-5xl lg:text-6xl font-bold mb-6 text-balance">
            Siap Tampil Memukau?
          </h2>
          <p className="text-lg opacity-90 mb-10 max-w-2xl mx-auto leading-relaxed">
            Hubungi kami hari ini untuk konsultasi gratis dan menemukan koleksi impian Anda
          </p>
          <button
            onClick={() => handleWhatsAppContact()}
            className="bg-primary-foreground text-primary px-10 py-4 rounded-xl font-bold hover:shadow-lg transition-smooth flex items-center justify-center gap-2 mx-auto text-lg group active:scale-95"
          >
            <MessageCircle size={24} className="group-hover:animate-pulse-soft" />
            Chat WhatsApp Sekarang
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-foreground text-primary-foreground py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
            <div>
              <h3 className="text-2xl font-bold mb-4">Ibu Siti</h3>
              <p className="text-sm opacity-75 leading-relaxed">
                Penyedia terpercaya layanan sewa baju pengantin, kebaya tradisional, baju adat, dan dekorasi pernikahan berkualitas tinggi sejak 1995.
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-4 text-primary-foreground">Kategori</h4>
              <ul className="space-y-3 text-sm opacity-75">
                <li><a href="#categories" onClick={closeMobileMenu} className="hover:opacity-100 transition-smooth">Gaun Pengantin</a></li>
                <li><a href="#categories" onClick={closeMobileMenu} className="hover:opacity-100 transition-smooth">Kebaya Tradisional</a></li>
                <li><a href="#categories" onClick={closeMobileMenu} className="hover:opacity-100 transition-smooth">Baju Adat</a></li>
                <li><a href="#categories" onClick={closeMobileMenu} className="hover:opacity-100 transition-smooth">Baju Profesi</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4 text-primary-foreground">Layanan</h4>
              <ul className="space-y-3 text-sm opacity-75">
                <li><a href="#products" onClick={closeMobileMenu} className="hover:opacity-100 transition-smooth">Sewa Baju</a></li>
                <li><a href="#categories" onClick={closeMobileMenu} className="hover:opacity-100 transition-smooth">Dekorasi Pernikahan</a></li>
                <li><a href="#" className="hover:opacity-100 transition-smooth">Fotografi</a></li>
                <li><a href="#" className="hover:opacity-100 transition-smooth">Konsultasi Gratis</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4 text-primary-foreground">Hubungi Kami</h4>
              <ul className="space-y-3 text-sm opacity-75">
                <li className="flex items-center gap-2 hover:opacity-100 transition-smooth cursor-pointer" onClick={() => handleWhatsAppContact()}>
                  <MessageCircle size={16} />
                  <span>WhatsApp</span>
                </li>
                <li>📧 info@ibusiti.com</li>
                <li>📍 Jakarta, Indonesia</li>
                <li className="flex items-center gap-2">
                  <Clock size={16} />
                  <span>24/7 Available</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-primary-foreground/20 pt-8">
            <div className="flex flex-col sm:flex-row items-center justify-between text-sm opacity-75 gap-6">
              <p>&copy; 2024 Ibu Siti Wedding & Fashion. Semua hak dilindungi.</p>
              <div className="flex gap-6">
                <a href="#" className="hover:opacity-100 transition-smooth font-medium">Instagram</a>
                <a href="#" className="hover:opacity-100 transition-smooth font-medium">Facebook</a>
                <a href="#" className="hover:opacity-100 transition-smooth font-medium">TikTok</a>
              </div>
            </div>
          </div>
        </div>
      </footer>

      {/* Product Modal */}
      {showProductModal && selectedProduct && (
        <div
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          onClick={() => setShowProductModal(false)}
        >
          <div
            className="bg-white rounded-2xl max-w-md w-full shadow-premium animate-scale-up"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative bg-muted rounded-t-2xl h-80 flex items-center justify-center overflow-hidden">
              <img src={selectedProduct.image} alt={selectedProduct.name} className="w-full h-full object-cover" />
              <button
                onClick={() => setShowProductModal(false)}
                className="absolute top-4 right-4 bg-white/90 p-2 rounded-full hover:bg-white"
              >
                <X size={20} className="text-foreground" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <h3 className="text-2xl font-bold text-foreground mb-2">{selectedProduct.name}</h3>
                <div className="flex items-center gap-2 mb-3">
                  <div className="flex items-center gap-0.5">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        size={16}
                        className={i < Math.floor(selectedProduct.rating || 0) ? 'fill-secondary text-secondary' : 'text-border'}
                      />
                    ))}
                  </div>
                  <span className="text-sm text-muted-foreground">({selectedProduct.reviews || 0} reviews)</span>
                </div>
              </div>

              <div>
                <p className="text-sm text-muted-foreground mb-1">Warna</p>
                <p className="text-foreground font-semibold">{selectedProduct.color}</p>
              </div>

              <div className="border-t border-border pt-4">
                <p className="text-3xl font-bold text-primary">{selectedProduct.price}</p>
              </div>

              <button
                onClick={() => {
                  handleWhatsAppContact(selectedProduct.name)
                  setShowProductModal(false)
                }}
                className="w-full bg-primary text-primary-foreground px-6 py-3 rounded-xl font-semibold hover:bg-primary/90 transition-smooth"
              >
                Tanyakan di WhatsApp
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Back to Top Button */}
      {showBackToTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 bg-primary text-primary-foreground p-3 rounded-full shadow-lg hover:bg-primary/90 transition-smooth animate-fade-in-up z-40"
          aria-label="Back to top"
        >
          <ChevronUp size={24} />
        </button>
      )}
    </div>
  )
}
