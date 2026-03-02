import { motion } from "motion/react";
import { ArrowRight, Hammer, Leaf, Clock, ShieldCheck, Import } from "lucide-react";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";


export default function Home() {
  const [products, setProducts] = useState([]);

  const apiproducts = 'http://127.0.0.1:8000/api/products';

  useEffect(() => {
    axios.get(apiproducts)
      .then(res => {
        setProducts(res.data);
      })
      .catch(err => console.log(err));
  }, []);

  if (!products.length) {
  return <div className="text-center py-20">Loading products...</div>;
  }

  return (

    

    <div className="overflow-hidden">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-black/40 z-10"></div>
          <img
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuChprg_r7qYpTp3j8TcWIdT61CLkKFwnaT6bV_GxnyBAWxDO3bXv4xe8mWmoJQ-cw2SFfz7ZwIHb0uipWmpio4Il1ks1MSal-dn5R6x2CZNdlkB8wX7jCOUu1LyO-bGGWdnsM4NTGVvJMqbsWs4Kdqb3-FSTGjYFtY8rEmaOOCXz_2mQgziFxqiN2eYTHqomHRq7Lhhru1Sph14Ye3Ipwmd6NRWT0zkoQfI0LZbG0PuNN4WAHBVnyChvMb0LSUzrLIQEacTaKW_X3k"
            alt="Luxury Living"
            className="w-full h-full object-cover"
          />
        </div>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="relative z-20 text-center px-4 max-w-5xl"
        >
          <span className="micro-label text-primary mb-6 block">Artisanal Excellence</span>
          <h2 className="editorial-title text-5xl md:text-8xl text-white mb-8 leading-tight">
            Elevated Living Through Refined Design
          </h2>
          <p className="font-body text-slate-300 text-lg max-w-2xl mx-auto mb-12 font-light leading-relaxed">
            Experience the intersection of modern aesthetics and timeless craftsmanship with our curated furniture collection.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <Link
              to="/catalog"
              className="bg-primary hover:bg-white text-espresso px-12 py-5 micro-label transition-all"
            >
              Explore the Collection
            </Link>
            <button className="border border-white/30 hover:border-primary text-white px-12 py-5 micro-label transition-all backdrop-blur-sm">
              View Lookbook
            </button>
          </div>
        </motion.div>
        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-4">
          <span className="micro-label text-slate-400">Scroll</span>
          <motion.div
            animate={{ height: [0, 48, 0], opacity: [0, 1, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-px bg-primary"
          ></motion.div>
        </div>
      </section>

      {/* Curated Collection */}
      <section className="py-32 bg-paper">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-20 gap-8">
            <div>
              <h3 className="editorial-title text-4xl md:text-5xl mb-6">The Curated Collection</h3>
              <div className="h-1 w-24 bg-primary"></div>
            </div>
            <p className="font-sans text-slate-500 max-w-md text-xs uppercase tracking-widest font-light leading-loose">
              Hand-selected pieces from world-renowned designers, defined by material purity and structural grace.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
            {products.map((product) => (
              <motion.div
                key={product.id}
                whileHover={{ y: -10 }}
                className="group cursor-pointer"
              >
                <Link to={`/product/${product.id}`}>
                  <div className="relative aspect-[3/4] overflow-hidden mb-8 bg-primary/5">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-espresso/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center">
                      <span className="text-white border border-white px-8 py-3 micro-label backdrop-blur-sm">
                        View Details
                      </span>
                    </div>
                  </div>
                  <h4 className="font-display text-xl mb-2">{product.name}</h4>
                  <p className="micro-label text-slate-400 mb-3">{product.color}</p>
                  <p className="text-primary font-body font-bold">{product.price}</p>
                </Link>
              </motion.div>
            ))}
          </div>

          <div className="mt-24 text-center">
            <Link
              to="/catalog"
              className="inline-flex items-center gap-4 text-primary micro-label group"
            >
              View Entire Collection
              <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform" />
            </Link>
          </div>
        </div>
      </section>

      {/* Philosophy Section */}
      <section className="py-32 bg-espresso text-paper relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-primary/5 -skew-x-12 translate-x-20 pointer-events-none"></div>
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
          <div className="relative">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="relative z-10 aspect-video overflow-hidden border-8 border-white/5"
            >
              <img
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuA6z93LYaT6exiIFTM0qLvIXr2pgw0S_57HLsWc_keZ6sMDzurqPW9uSg83-ccxue_zz8sHjc25s2tK5_m9XJnaIrKYgp-Kly-6I0eELP11X0oIMW_iC9uiiBQYBAfAuk7afF1OdrfJKeSwDLXbJZt_fBWlAQPdMnQTHb3MHwjc_VpJKN7r72Kyu1W9wEsivRS6bEn1I5ekV2EZWOHnW__4PFSqG9SGthEWD8gEzGO_mscQoapaJpcBHldzN6e8CSP13FRvqNnQifo"
                alt="Craftsmanship"
                className="w-full h-full object-cover"
              />
            </motion.div>
            <div className="absolute -bottom-12 -left-12 w-64 h-64 border border-primary/20 -z-0"></div>
          </div>

          <div className="flex flex-col gap-12">
            <div>
              <span className="micro-label text-primary mb-6 block">Our Story</span>
              <h3 className="editorial-title text-4xl md:text-6xl mb-8">Design Philosophy</h3>
              <p className="font-body text-slate-400 text-lg font-light leading-relaxed">
                Our approach is rooted in the belief that luxury is found in the details. We prioritize sustainable materials and artisanal techniques to create pieces that last generations.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-12">
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <Hammer className="text-primary w-6 h-6" />
                  <h5 className="font-display text-xl">Artisanal Craft</h5>
                </div>
                <p className="font-body text-sm text-slate-500 leading-relaxed">Every piece is handmade by master craftsmen in our boutique studios.</p>
              </div>
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <Leaf className="text-primary w-6 h-6" />
                  <h5 className="font-display text-xl">Sustainable Luxury</h5>
                </div>
                <p className="font-body text-sm text-slate-500 leading-relaxed">Sustainably sourced premium materials with a zero-waste commitment.</p>
              </div>
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <Clock className="text-primary w-6 h-6" />
                  <h5 className="font-display text-xl">Timeless Aesthetic</h5>
                </div>
                <p className="font-body text-sm text-slate-500 leading-relaxed">Designed to transcend passing trends and age with character.</p>
              </div>
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <ShieldCheck className="text-primary w-6 h-6" />
                  <h5 className="font-display text-xl">Certified Quality</h5>
                </div>
                <p className="font-body text-sm text-slate-500 leading-relaxed">Lifetime warranty on all structural components and hardwoods.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quote Section */}
      <section className="py-40 bg-paper">
        <div className="max-w-7xl mx-auto px-6">
          <div className="relative w-full h-[600px] overflow-hidden">
            <img
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuCXIDTLycHTUCyDfG5sRAO3AyQU2lSBOaHKo8kGFihCwGHmEs-8Xv1T5IJ_cL-6SPZWaLzAmxSWdL1cVPfNhDKeq9G83euLakKJD3PhYoI1FNM3AkB2xeRRRynOoMGYZlWXEOmqmqViJak05_t_RZSrAKWIwGa6jJwssQidfDcWCXak9AGuKhTgmSMZkYLM3M34e7A2CAB6i4BY4KqtB0PwDsGPkqh6S5jXZGNeBr-B-Xv9Nx37UXE2sZ7oVKcXlOYsIoc0fTJuKqI"
              alt="Interior"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-espresso/40 flex flex-col items-center justify-center p-12 text-center backdrop-blur-[2px]">
              <motion.h3
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                className="font-serif text-4xl md:text-6xl text-white mb-10 italic max-w-4xl"
              >
                "Design is not just what it looks like, but how it feels."
              </motion.h3>
              <p className="micro-label text-primary">— Pierre Dupont, Lead Designer</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
