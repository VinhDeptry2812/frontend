import { motion } from "motion/react";
import { Trash2, Plus, Minus, ArrowRight, ShieldCheck, Truck, RotateCcw } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";

export default function Cart() {
  const [items, setItems] = useState([
    {
      id: 1,
      name: "Verona Velvet Sofa",
      variant: "Emerald / Walnut",
      price: 4250,
      qty: 1,
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCTtGH84TuU4703QIx-a5gpZGmbHYoQDPRC6ZEsRO-CO99X3VRVHp0AzGBIkDuVcm54E5vD4puvFbi-ceFVUx-R01uYmS38MjT-eRTpIUpb0IlzGhRPE3x3TSJpNyxXPvVqNt1p02UzU9TP9ivd_yBfOBH3kq1pulWRcf-xbtO5W4HoOx7pKqtTQ0zaXM1atitgH1NxvqApRm2c_5hXG39LdW64NIKkoTuRrV7EHvjH2jvGqee2TUhE4-xG8oMWnF7pyhq3gI27XIs",
    },
    {
      id: 2,
      name: "Auric Accent Chair",
      variant: "Champagne Gold",
      price: 1450,
      qty: 2,
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCOU1MqWLLzpDKZKk1I5rWg86CUAyL9giJQsxUDSgtQbkGmsm_J0gjJlDo1e-AkepAAMV-SzG8qCP2379nr_MEln0SlW0RGn3ReanHorU-pW-Q0lwZWEB03swYjQb4GDSlOWhE2aPgmW9C2BEX5Oq3rF5CiBuIqrufSjGU38FFaDswJKL2W1KgZDrj0z4PS2kFpK6S1WzXrgZspiNwO3DFpEeaRuchfyQ-aCwJwpUxL7weJgFepDphgxZtS4FGk4GBLkvYKK6mKMYw",
    },
  ]);

  const subtotal = items.reduce((acc, item) => acc + item.price * item.qty, 0);
  const shipping = 250;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;

  const updateQty = (id: number, delta: number) => {
    setItems(items.map(item => 
      item.id === id ? { ...item, qty: Math.max(1, item.qty + delta) } : item
    ));
  };

  const removeItem = (id: number) => {
    setItems(items.filter(item => item.id !== id));
  };

  return (
    <div className="pt-32 pb-24 bg-paper min-h-screen">
      <div className="max-w-7xl mx-auto px-6">
        <h1 className="editorial-title text-5xl md:text-6xl font-bold mb-16">Shopping Bag</h1>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-20">
          {/* Cart Items */}
          <div className="lg:col-span-8 space-y-12">
            {items.length > 0 ? (
              <div className="space-y-12">
                {items.map((item) => (
                  <motion.div
                    layout
                    key={item.id}
                    className="flex flex-col sm:flex-row gap-10 pb-12 border-b border-primary/10"
                  >
                    <div className="w-full sm:w-48 aspect-square bg-primary/5 rounded-lg overflow-hidden shrink-0">
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-grow flex flex-col justify-between py-2">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="editorial-title text-2xl mb-2">{item.name}</h3>
                          <p className="micro-label text-slate-400">{item.variant}</p>
                        </div>
                        <p className="text-xl font-bold text-primary">${(item.price * item.qty).toLocaleString()}</p>
                      </div>
                      
                      <div className="flex items-center justify-between mt-8">
                        <div className="flex items-center border border-primary/20 rounded-full px-4 py-2 gap-6">
                          <button onClick={() => updateQty(item.id, -1)} className="text-slate-400 hover:text-primary transition-colors">
                            <Minus className="w-4 h-4" />
                          </button>
                          <span className="micro-label font-bold w-4 text-center">{item.qty}</span>
                          <button onClick={() => updateQty(item.id, 1)} className="text-slate-400 hover:text-primary transition-colors">
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>
                        <button 
                          onClick={() => removeItem(item.id)}
                          className="flex items-center gap-2 micro-label text-slate-400 hover:text-red-500 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                          <span>Remove</span>
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="py-20 text-center border-2 border-dashed border-primary/10 rounded-2xl">
                <p className="font-serif italic text-2xl text-slate-400 mb-8">Your bag is currently empty.</p>
                <Link to="/catalog" className="bg-primary text-espresso px-12 py-5 micro-label inline-block">
                  Continue Shopping
                </Link>
              </div>
            )}

            {/* Complete the Room */}
            <div className="pt-12">
              <h3 className="micro-label mb-10 text-slate-400">Complete the Room</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
                {[
                  { name: "Marble Coasters", price: "$85", img: "https://lh3.googleusercontent.com/aida-public/AB6AXuBpv8OJ7jDSp_aFonbZrK82TGZvekW7B-yBxP_yUnX52Sb3sUbJ0rG1F7rOq2_UE3vCxWN6jwsxhTfCLscgf4ySW8tl0uMyfGka-pZ0jxio3UQWtUVrVhKXxQvljKhAsQIpHBIf-1xZAr60zS4lu3Z9l23LV0Tkj5znUgL12pkqOAIGae_ErIAiWxKuT-4g24k_9FD6WaB9Ynra6A5MCLDsHUZ67CiNz1JrNiKuNTM8R2ejeQuO29VHzsPuIJB3kJyuPcgJak-k9lo" },
                  { name: "Silk Cushion", price: "$120", img: "https://lh3.googleusercontent.com/aida-public/AB6AXuBkKXJPOWI6aiqENEQYMuDZxCYFTmwMeIh6-f1bIM1HTzV1msI0Rt0yMXhT2zN1kUD2DKhfmzvQR4s2hG3TeFBqSMeWwwEVStoTWpURkSBjlzGHsAnwuyar21lWdrJlXdG5XWB6jQHYMRjBXHXajKxYdRve2dy40yr8zjo987Wwxa_eGPoj1iLnVXOjjxhbratrCcT1cogQQaPp41l1Kj3CCWiAJJiTYFxbJOgMZeDqbdkQDAsmn6xjmrzwXXnraQ2efQwbmZ_atH8" },
                ].map((item, i) => (
                  <div key={i} className="group cursor-pointer">
                    <div className="aspect-square bg-primary/5 rounded-lg overflow-hidden mb-4">
                      <img src={item.img} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                    </div>
                    <h4 className="font-display text-sm mb-1">{item.name}</h4>
                    <p className="text-primary font-bold text-xs">{item.price}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Summary Sidebar */}
          <aside className="lg:col-span-4">
            <div className="sticky top-32 bg-espresso text-paper p-10 rounded-2xl shadow-2xl">
              <h3 className="editorial-title text-3xl mb-10 border-b border-white/10 pb-6">Order Summary</h3>
              
              <div className="space-y-6 mb-10">
                <div className="flex justify-between micro-label text-slate-400">
                  <span>Subtotal</span>
                  <span className="text-white">${subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between micro-label text-slate-400">
                  <span>White Glove Delivery</span>
                  <span className="text-white">${shipping.toLocaleString()}</span>
                </div>
                <div className="flex justify-between micro-label text-slate-400">
                  <span>Estimated Tax</span>
                  <span className="text-white">${tax.toLocaleString()}</span>
                </div>
                <div className="pt-6 border-t border-white/10 flex justify-between items-end">
                  <span className="editorial-title text-xl">Total</span>
                  <span className="text-3xl font-bold text-primary">${total.toLocaleString()}</span>
                </div>
              </div>

              <Link 
                to="/checkout"
                className="w-full bg-primary text-espresso py-6 micro-label font-bold flex items-center justify-center gap-4 hover:brightness-110 transition-all mb-8"
              >
                Proceed to Checkout
                <ArrowRight className="w-4 h-4" />
              </Link>

              <div className="space-y-6 pt-6 border-t border-white/5">
                <div className="flex items-center gap-4 text-slate-400">
                  <ShieldCheck className="w-5 h-5 text-primary" />
                  <span className="text-[10px] uppercase tracking-widest">Secure Checkout Guaranteed</span>
                </div>
                <div className="flex items-center gap-4 text-slate-400">
                  <Truck className="w-5 h-5 text-primary" />
                  <span className="text-[10px] uppercase tracking-widest">Complimentary White Glove Setup</span>
                </div>
                <div className="flex items-center gap-4 text-slate-400">
                  <RotateCcw className="w-5 h-5 text-primary" />
                  <span className="text-[10px] uppercase tracking-widest">30-Day Bespoke Returns</span>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
