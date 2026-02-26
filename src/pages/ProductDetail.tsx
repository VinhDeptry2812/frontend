import { motion } from "motion/react";
import { ChevronRight, Heart, ShoppingBag, Sparkles, ShieldCheck, Ruler, Truck, ChevronDown, Rotate3d, Camera } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";

export default function ProductDetail() {
  const [selectedFabric, setSelectedFabric] = useState("Emerald");
  const [selectedFinish, setSelectedFinish] = useState("Walnut");

  const fabrics = [
    { name: "Emerald", color: "#043927" },
    { name: "Charcoal", color: "#36454F" },
    { name: "Champagne", color: "#E8D6B3" },
    { name: "Midnight", color: "#1A1A1A" },
  ];

  const finishes = [
    { name: "Walnut", color: "#3d2b1f" },
    { name: "Light Oak", color: "#b59b7c" },
  ];

  const thumbnails = [
    "https://lh3.googleusercontent.com/aida-public/AB6AXuCSBF1D_vJNaVsVVfyGRGaBUjQfj5nayT2bA0BgkwhmDl9P84r3ncgRXGwXXcTD6o6cV4_TJE_lS10aW1pPGpSmZiJWUCsqkbw4blqAfzjGWVWwtwjpS0X3vW1xrtvdDkL4DvLLQtu_BY4Cri4An9-gUceyxl3nKmtj2TbU4_O7y4HDpVkMty_RL4UP5bFxvmk_uHwNyjlZ9vntAMXnYdCeHF1q8rzwOY_VoEraeyWplmUj6GdwiO_IuxtLekpuOUS9YV8MBBTbTvQ",
    "https://lh3.googleusercontent.com/aida-public/AB6AXuDcKGQlrHq0GXaJ7o2sOEZr8DGCFeTr-JA6IQyDR47Fir2kVAShvfdg6kPMndh4sAXG442mKLzeeE8ocufiD9Lv4rd7-wmyFK7UMwU7uG88LLJrOuVPSf4eMJV4d3nZEqjao3nzXPL_2-GDjLInwjUTTd0OUNV-0B5s6umHBeO47X1Y1z6DJ_8i1VLmRZg0qNCAQsnEOl8iWE9kZXk4Hci1fAVmZrRXJ1IB62iOTklFTxBWaS2MiyQ9IDwLs8TIncd1GDLvYvAX540",
    "https://lh3.googleusercontent.com/aida-public/AB6AXuBF5fXQDH9Ar51WQF810XT5N3GW2khcLkhg5D3FsRKR3-kDhkBrWJzx-ALJ7KJD3eszIx1KCHarhAXLSp0F3sYWYCIPCmU8wP1Cp3ToNuYOLAHfXJTeYZuQiAsEV-Rm3uzTSofDy6_V88purAIBlP7wkG-UMlwgHsJEFNeJRARQY9twDKCdN8kWP4lTjplcGZhtEZO2pjJf_ewXkTyDyLfZej2PFnuDNEWcYoX8v03TqthefqxiTArvGkzhafJlr_1yfDOmJC5yNh8",
    "https://lh3.googleusercontent.com/aida-public/AB6AXuDHsull-QlQS8djBaSSnKwfNihSUAZeurU6U-FhUsDeERJv5L5b_WA4ExQQ8sL5VDK20vAIZAa8Ef14DdugtCcgXRoMeQAnkw7jZBKg1SmHi6PHRdc8cyaFMUpnldy_I5ASWEB_GBIkJGfFmT4lz0ArTZlD3o1bCcAHM4OvPyiWwMh94ckmyhPzUTnUQtU3fOsY628M7vE1UEK952q4dQWykPmR5AplnlnnvOhtnQvgowKB3PBVB9AtAhTLFgoExl-CQAzJCvtVc0M",
  ];

  return (
    <div className="pt-32 pb-24 bg-paper min-h-screen">
      <div className="max-w-7xl mx-auto px-6">
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-2 micro-label text-slate-400 mb-12">
          <Link to="/" className="hover:text-primary">Home</Link>
          <ChevronRight className="w-3 h-3" />
          <Link to="/catalog" className="hover:text-primary">Living Room</Link>
          <ChevronRight className="w-3 h-3" />
          <span className="text-espresso font-bold">Verona Velvet Sofa</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-20">
          {/* Left: Image Gallery */}
          <div className="lg:col-span-7 space-y-6">
            <div className="relative aspect-[4/5] w-full rounded-xl overflow-hidden bg-primary/5">
              <img
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCTtGH84TuU4703QIx-a5gpZGmbHYoQDPRC6ZEsRO-CO99X3VRVHp0AzGBIkDuVcm54E5vD4puvFbi-ceFVUx-R01uYmS38MjT-eRTpIUpb0IlzGhRPE3x3TSJpNyxXPvVqNt1p02UzU9TP9ivd_yBfOBH3kq1pulWRcf-xbtO5W4HoOx7pKqtTQ0zaXM1atitgH1NxvqApRm2c_5hXG39LdW64NIKkoTuRrV7EHvjH2jvGqee2TUhE4-xG8oMWnF7pyhq3gI27XIs"
                alt="Verona Velvet Sofa"
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-8 right-8 bg-white/90 backdrop-blur-md p-4 rounded-full border border-primary/30 shadow-xl cursor-pointer hover:scale-110 transition-transform group">
                <Rotate3d className="text-primary w-6 h-6 group-hover:rotate-180 transition-transform duration-700" />
              </div>
              <button className="absolute bottom-8 left-8 flex items-center gap-3 bg-white/90 backdrop-blur-md px-8 py-4 rounded-full border border-primary text-primary micro-label hover:bg-primary hover:text-white transition-all shadow-2xl group">
                <Camera className="w-5 h-5 group-hover:scale-110 transition-transform" />
                <span>View in Your Space</span>
              </button>
            </div>
            <div className="grid grid-cols-4 gap-6">
              {thumbnails.map((img, i) => (
                <div
                  key={i}
                  className={`aspect-square rounded-lg overflow-hidden cursor-pointer transition-all ${
                    i === 0 ? "ring-2 ring-primary" : "opacity-60 hover:opacity-100"
                  }`}
                >
                  <img src={img} alt={`Thumbnail ${i}`} className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
          </div>

          {/* Right: Product Information */}
          <div className="lg:col-span-5 flex flex-col space-y-10">
            <section className="space-y-6">
              <div className="inline-block px-4 py-1.5 bg-primary/10 text-primary micro-label rounded">Artisan Series</div>
              <h1 className="editorial-title text-5xl lg:text-7xl font-medium leading-tight">Verona Velvet Sofa</h1>
              <p className="text-3xl font-light text-primary/80">$4,250.00</p>
              <p className="font-serif text-slate-600 text-xl leading-relaxed italic">
                A masterpiece of contemporary design, the Verona sofa combines mid-century silhouettes with modern luxury. Handcrafted with premium upholstery and solid hardwood frames.
              </p>
            </section>

            {/* Selectors */}
            <section className="space-y-10 border-t border-primary/10 pt-10">
              <div>
                <h3 className="micro-label mb-6 flex justify-between">
                  <span>Fabric: <span className="text-primary italic font-medium ml-2">{selectedFabric} Velvet</span></span>
                  <span className="opacity-40">Premium Italian Textile</span>
                </h3>
                <div className="flex flex-wrap gap-6">
                  {fabrics.map((fabric) => (
                    <button
                      key={fabric.name}
                      onClick={() => setSelectedFabric(fabric.name)}
                      className={`group relative p-1 rounded-full border-2 transition-all ${
                        selectedFabric === fabric.name ? "border-primary" : "border-transparent"
                      }`}
                    >
                      <div
                        className="w-12 h-12 rounded-full shadow-inner"
                        style={{ backgroundColor: fabric.color }}
                      ></div>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="micro-label mb-6">Wood Finish: <span className="text-primary italic font-medium ml-2">{selectedFinish}</span></h3>
                <div className="flex flex-wrap gap-6">
                  {finishes.map((finish) => (
                    <button
                      key={finish.name}
                      onClick={() => setSelectedFinish(finish.name)}
                      className={`group relative p-1 rounded-lg border-2 transition-all ${
                        selectedFinish === finish.name ? "border-primary" : "border-transparent"
                      }`}
                    >
                      <div
                        className="w-12 h-12 rounded-md shadow-inner"
                        style={{ backgroundColor: finish.color }}
                      ></div>
                    </button>
                  ))}
                </div>
              </div>
            </section>

            {/* CTAs */}
            <div className="space-y-6 pt-6">
              <button className="w-full py-6 bg-primary text-espresso font-bold micro-label hover:brightness-110 transition-all shadow-xl shadow-primary/20">
                Add to Cart
              </button>
              <button className="w-full py-6 border border-primary/30 text-primary font-bold micro-label hover:bg-primary/5 transition-all flex items-center justify-center gap-3">
                <Sparkles className="w-4 h-4" />
                Add to Collection
              </button>
            </div>

            {/* Accordions */}
            <div className="pt-10 border-t border-primary/10 space-y-2">
              {[
                { icon: ShieldCheck, title: "Craftsmanship", content: "Each Verona sofa is hand-built by master artisans in our Italian atelier. We use sustainably sourced solid oak for the frame and traditional eight-way hand-tied springs for unparalleled comfort and durability." },
                { icon: Ruler, title: "Dimensions", content: "Width: 94 inches, Depth: 40 inches, Height: 32 inches, Seat Height: 18 inches." },
                { icon: Truck, title: "Delivery", content: "White-glove delivery included. Our professional team will deliver, unpack, and assemble your piece in the room of your choice. Lead time: 8-12 weeks." },
              ].map((item, i) => (
                <details key={i} className="group py-6 border-b border-primary/5" open={i === 0}>
                  <summary className="flex justify-between items-center cursor-pointer list-none">
                    <div className="flex items-center gap-4">
                      <item.icon className="text-primary w-5 h-5" />
                      <span className="micro-label">{item.title}</span>
                    </div>
                    <ChevronDown className="w-5 h-5 transition-transform group-open:rotate-180 text-primary" />
                  </summary>
                  <div className="mt-6 text-sm text-slate-500 leading-relaxed pl-9 font-body">
                    {item.content}
                  </div>
                </details>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
