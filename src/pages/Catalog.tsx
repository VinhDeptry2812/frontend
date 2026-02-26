import { motion } from "motion/react";
import { ChevronRight, Filter, ChevronDown } from "lucide-react";
import { Link } from "react-router-dom";

export default function Catalog() {
  const products = [
    {
      id: 1,
      name: "Aurelius Velvet Sofa",
      desc: "Midnight Charcoal / Walnut Legs",
      price: "$4,250",
      badge: "New Collection",
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuC_q0_inXP8ujhXFIH8gpgBOQRsahgGnoTDGFWAAv4qnr8u_6RTae_T6539Zka9FqMu5TegO2Pnbcjw0Jw6UYaGdcY0GkqE43o5nFmwHTpdM-oz8pcE4sa3gJj13IntlBo9NV4xxwWtcV-kVqnUGOOvp7ehch-qroJ2794lFICDTNPOTLKXnRu5fm_38-37xlHhx1bacfh8n0RThihba9_7pV87SBsecyrUlXjTAAhs1YY2RNuvYyfSV9J_xqwKoUUcBzZuK05DUbg",
    },
    {
      id: 2,
      name: "Eleanor Marble Table",
      desc: "Carrara Marble / Brushed Gold",
      price: "$1,890",
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDwGyeqRXpNf8ha6tUfx0MF7-J0X_WEsF_RZdD3NkDkkHWPMA3k7bnHFF3O7Xh10k6kcQ0MoEUl11hPwuMgYPyVLBwl_cM9Q9G_JHl5lZhbcsZnUqajCy2VG-1eiaJirD3ENCMmxGV8UDhNeXy_kwZt7-9cZejEcgW4n7vOqInjlQvwg5jJcFy3udJpEacwQhsoxQtBNyzN5glJZWwmkbqHzJ8-6V-a176xOhCpt8RQVAPB_vNfgrqtN9MM-bOb7fAUkAg4AL6fFa4",
    },
    {
      id: 3,
      name: "Lucca Cognac Lounge",
      desc: "Hand-finished Leather",
      price: "$2,400",
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDcuAjG1HpZ30q7OUuFtxDqgQri0e91f8AJ4I_ZqJGdk45H_Cmo8KJhbkw4h4sfuBCKdC4oIGglaliFVxwZFn_aHifpXlgplH1alrvv47hBaVlgp9CrzuMW0AGTnG73mnUfj5F7jQePQspCofvqeHZ_B1uRSZQ3r-308SuxnuOe82Qcg71WkkcrgJHOIgGrNJyo34-G63JitZgJdTZlcXPoTicrU0hrLjqr-g9H-1CgoQGh6abVVS_EiKdQlAiSCtOO86K8URzMBgc",
    },
    {
      id: 4,
      name: "Vesper Walnut Credenza",
      desc: "Solid Black Walnut",
      price: "$3,100",
      badge: "Limited Edition",
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuD3leoyC10b0GlEQ_H5olf5o4BmXZKJ7FYMZt4ZRb80eEoAluErpb3ixJU8GR4SzupKFIt8JKd3g_iag3ehCE0crgEo7mdk0865XMI98NvRsWEohFrrNfHzhCcFlftj1c4L07pMFeWMYa67eddnFYs1XrZQ7dio6WNydKIZ4NTPblVVdxiRLiYUZskODNA-2mjBjBQpmsV0KCD6Vqx50WrAztxOs3ZdWdAFZBNf12Stp3m6pnnkkj19U-iqIncQEo88Y4ysmcMyk70",
    },
  ];

  return (
    <div className="pt-32 pb-24 bg-paper min-h-screen">
      <div className="max-w-7xl mx-auto px-6">
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-2 micro-label text-slate-400 mb-12">
          <Link to="/" className="hover:text-primary">Home</Link>
          <ChevronRight className="w-3 h-3" />
          <span className="hover:text-primary cursor-pointer">Furniture</span>
          <ChevronRight className="w-3 h-3" />
          <span className="text-espresso font-bold">Living Room</span>
        </nav>

        <div className="flex flex-col lg:flex-row gap-16">
          {/* Sidebar Filters */}
          <aside className="w-full lg:w-72 shrink-0">
            <div className="sticky top-32 space-y-12">
              <div>
                <h3 className="editorial-title text-2xl font-bold border-b border-primary/20 pb-6 mb-8 uppercase tracking-wider">Filters</h3>
                
                {/* Collection Filter */}
                <div className="mb-10">
                  <p className="micro-label mb-6">Collection</p>
                  <div className="space-y-4">
                    {["The Heritage Line", "Modern Minimalist", "Art Deco Revival"].map((item) => (
                      <label key={item} className="flex items-center gap-4 cursor-pointer group">
                        <input
                          type="checkbox"
                          defaultChecked={item === "Modern Minimalist"}
                          className="rounded-none border-primary/30 text-primary focus:ring-primary h-4 w-4"
                        />
                        <span className="font-body text-sm group-hover:text-primary transition-colors">{item}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Material Filter */}
                <div className="mb-10">
                  <p className="micro-label mb-6">Material</p>
                  <div className="space-y-4">
                    {["Carrara Marble", "Italian Velvet", "Black Walnut", "Polished Brass"].map((item) => (
                      <label key={item} className="flex items-center gap-4 cursor-pointer group">
                        <input
                          type="checkbox"
                          className="rounded-none border-primary/30 text-primary focus:ring-primary h-4 w-4"
                        />
                        <span className="font-body text-sm group-hover:text-primary transition-colors">{item}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Color Filter */}
                <div>
                  <p className="micro-label mb-6">Color Palette</p>
                  <div className="flex flex-wrap gap-4">
                    {["#2C2C2C", "#E5D3B3", "#F5F5F5", "#4A5D4E", "#1A2E44"].map((color) => (
                      <button
                        key={color}
                        className="w-8 h-8 rounded-full border border-espresso/10 ring-offset-2 ring-primary focus:ring-2 transition-all"
                        style={{ backgroundColor: color }}
                        title={color}
                      ></button>
                    ))}
                  </div>
                </div>
              </div>
              <button className="w-full bg-primary text-espresso py-5 micro-label hover:bg-espresso hover:text-white transition-all">
                Update Catalog
              </button>
            </div>
          </aside>

          {/* Product Listing Area */}
          <div className="flex-grow">
            <div className="flex flex-col sm:flex-row justify-between items-baseline gap-6 mb-16">
              <div>
                <h2 className="editorial-title text-5xl md:text-6xl font-bold mb-4">Living Room</h2>
                <p className="font-serif text-slate-500 italic text-lg">Curated essentials for the sophisticated home.</p>
              </div>
              <div className="flex items-center gap-6">
                <span className="micro-label">Sort By:</span>
                <div className="relative">
                  <select className="appearance-none bg-transparent border border-primary/40 rounded-none py-3 pl-6 pr-12 micro-label focus:ring-primary focus:border-primary cursor-pointer">
                    <option>Featured Selection</option>
                    <option>Newest Arrivals</option>
                    <option>Price: High to Low</option>
                    <option>Price: Low to High</option>
                  </select>
                  <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-primary w-4 h-4 pointer-events-none" />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-20">
              {products.map((product) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="group cursor-pointer"
                >
                  <Link to={`/product/${product.id}`}>
                    <div className="relative aspect-[4/5] overflow-hidden bg-primary/5 mb-8">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                      />
                      {product.badge && (
                        <div className={`absolute ${product.badge === "New Collection" ? "top-6 left-6 bg-white" : "bottom-6 right-6 bg-primary text-espresso"} px-4 py-2 micro-label border border-primary/20 shadow-lg`}>
                          {product.badge}
                        </div>
                      )}
                    </div>
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="editorial-title text-2xl mb-2 group-hover:text-primary transition-colors">{product.name}</h3>
                        <p className="micro-label text-slate-400">{product.desc}</p>
                      </div>
                      <span className="text-xl font-bold text-primary">{product.price}</span>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>

            {/* Pagination */}
            <div className="mt-32 flex justify-center items-center gap-10 border-t border-primary/20 pt-16">
              <button className="flex items-center gap-3 micro-label text-slate-400 hover:text-primary disabled:opacity-30" disabled>
                Previous
              </button>
              <div className="flex gap-8 items-center">
                <span className="text-primary font-bold micro-label">01</span>
                <span className="text-slate-400 hover:text-primary cursor-pointer micro-label">02</span>
                <span className="text-slate-400 hover:text-primary cursor-pointer micro-label">03</span>
                <span className="text-slate-400 micro-label">...</span>
                <span className="text-slate-400 hover:text-primary cursor-pointer micro-label">12</span>
              </div>
              <button className="flex items-center gap-3 micro-label hover:text-primary">
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
