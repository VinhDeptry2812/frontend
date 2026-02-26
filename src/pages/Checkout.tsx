import { motion } from "motion/react";
import { ChevronRight, ShieldCheck, CreditCard, Truck, CheckCircle2 } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";

export default function Checkout() {
  const [step, setStep] = useState(1);

  return (
    <div className="pt-32 pb-24 bg-paper min-h-screen">
      <div className="max-w-7xl mx-auto px-6">
        {/* Progress Bar */}
        <div className="flex justify-center mb-20">
          <div className="flex items-center gap-12 max-w-2xl w-full">
            {[
              { id: 1, label: "Shipping" },
              { id: 2, label: "Payment" },
              { id: 3, label: "Review" },
            ].map((s) => (
              <div key={s.id} className="flex-1 flex flex-col items-center gap-4 relative">
                <div 
                  className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-500 z-10 ${
                    step >= s.id ? "bg-primary border-primary text-espresso" : "bg-white border-primary/20 text-slate-300"
                  }`}
                >
                  {step > s.id ? <CheckCircle2 className="w-5 h-5" /> : <span className="micro-label font-bold">{s.id}</span>}
                </div>
                <span className={`micro-label ${step >= s.id ? "text-espresso" : "text-slate-400"}`}>{s.label}</span>
                {s.id < 3 && (
                  <div className="absolute top-5 left-[calc(50%+20px)] w-[calc(100%-40px)] h-0.5 bg-primary/10">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: step > s.id ? "100%" : "0%" }}
                      className="h-full bg-primary"
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-20">
          {/* Main Form Area */}
          <div className="lg:col-span-8">
            {step === 1 && (
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-12"
              >
                <h2 className="editorial-title text-4xl mb-10">Delivery Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="micro-label text-slate-400">First Name</label>
                    <input type="text" className="w-full bg-primary/5 border border-primary/20 p-4 focus:outline-none focus:border-primary font-body" placeholder="Alexander" />
                  </div>
                  <div className="space-y-2">
                    <label className="micro-label text-slate-400">Last Name</label>
                    <input type="text" className="w-full bg-primary/5 border border-primary/20 p-4 focus:outline-none focus:border-primary font-body" placeholder="Vance" />
                  </div>
                  <div className="md:col-span-2 space-y-2">
                    <label className="micro-label text-slate-400">Street Address</label>
                    <input type="text" className="w-full bg-primary/5 border border-primary/20 p-4 focus:outline-none focus:border-primary font-body" placeholder="725 Fifth Avenue" />
                  </div>
                  <div className="space-y-2">
                    <label className="micro-label text-slate-400">City</label>
                    <input type="text" className="w-full bg-primary/5 border border-primary/20 p-4 focus:outline-none focus:border-primary font-body" placeholder="New York" />
                  </div>
                  <div className="grid grid-cols-2 gap-8">
                    <div className="space-y-2">
                      <label className="micro-label text-slate-400">State</label>
                      <input type="text" className="w-full bg-primary/5 border border-primary/20 p-4 focus:outline-none focus:border-primary font-body" placeholder="NY" />
                    </div>
                    <div className="space-y-2">
                      <label className="micro-label text-slate-400">ZIP Code</label>
                      <input type="text" className="w-full bg-primary/5 border border-primary/20 p-4 focus:outline-none focus:border-primary font-body" placeholder="10022" />
                    </div>
                  </div>
                </div>

                <div className="pt-12 border-t border-primary/10">
                  <h3 className="micro-label mb-8">Delivery Method</h3>
                  <div className="grid grid-cols-1 gap-6">
                    <label className="flex items-center justify-between p-6 border-2 border-primary bg-primary/5 cursor-pointer">
                      <div className="flex items-center gap-6">
                        <Truck className="text-primary w-6 h-6" />
                        <div>
                          <p className="font-display text-lg">White Glove Delivery</p>
                          <p className="text-xs text-slate-500 font-body">Professional setup in your room of choice.</p>
                        </div>
                      </div>
                      <span className="font-bold text-primary">$250.00</span>
                    </label>
                  </div>
                </div>

                <button 
                  onClick={() => setStep(2)}
                  className="bg-espresso text-paper w-full py-6 micro-label font-bold hover:bg-primary hover:text-espresso transition-all"
                >
                  Continue to Payment
                </button>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-12"
              >
                <h2 className="editorial-title text-4xl mb-10">Secure Payment</h2>
                <div className="space-y-8">
                  <div className="p-8 border-2 border-primary bg-primary/5 rounded-xl">
                    <div className="flex items-center justify-between mb-10">
                      <div className="flex items-center gap-4">
                        <CreditCard className="text-primary w-6 h-6" />
                        <span className="micro-label">Credit or Debit Card</span>
                      </div>
                      <div className="flex gap-2">
                        <div className="w-10 h-6 bg-slate-200 rounded"></div>
                        <div className="w-10 h-6 bg-slate-200 rounded"></div>
                      </div>
                    </div>
                    <div className="space-y-6">
                      <div className="space-y-2">
                        <label className="micro-label text-slate-400">Card Number</label>
                        <input type="text" className="w-full bg-white border border-primary/20 p-4 focus:outline-none focus:border-primary font-mono tracking-widest" placeholder="•••• •••• •••• ••••" />
                      </div>
                      <div className="grid grid-cols-2 gap-8">
                        <div className="space-y-2">
                          <label className="micro-label text-slate-400">Expiry Date</label>
                          <input type="text" className="w-full bg-white border border-primary/20 p-4 focus:outline-none focus:border-primary font-mono" placeholder="MM / YY" />
                        </div>
                        <div className="space-y-2">
                          <label className="micro-label text-slate-400">CVV</label>
                          <input type="text" className="w-full bg-white border border-primary/20 p-4 focus:outline-none focus:border-primary font-mono" placeholder="•••" />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="p-8 border border-primary/10 rounded-xl flex items-center justify-between cursor-pointer hover:bg-primary/5 transition-all">
                    <div className="flex items-center gap-4">
                      <div className="w-6 h-6 rounded-full border border-primary/30"></div>
                      <span className="micro-label">PayPal</span>
                    </div>
                    <div className="w-20 h-6 bg-slate-100 rounded"></div>
                  </div>
                </div>

                <div className="flex gap-6">
                  <button 
                    onClick={() => setStep(1)}
                    className="flex-1 py-6 border border-primary/20 micro-label text-slate-400 hover:text-espresso transition-all"
                  >
                    Back to Shipping
                  </button>
                  <button 
                    onClick={() => setStep(3)}
                    className="flex-[2] bg-espresso text-paper py-6 micro-label font-bold hover:bg-primary hover:text-espresso transition-all"
                  >
                    Review Order
                  </button>
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-12 text-center py-20"
              >
                <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-10">
                  <CheckCircle2 className="w-12 h-12 text-primary" />
                </div>
                <h2 className="editorial-title text-5xl mb-6">Ready to Finalize?</h2>
                <p className="font-serif italic text-xl text-slate-500 max-w-lg mx-auto mb-12">
                  Please review your details on the right before confirming your bespoke order.
                </p>
                <button 
                  className="bg-primary text-espresso px-20 py-6 micro-label font-bold hover:brightness-110 transition-all shadow-2xl shadow-primary/30"
                >
                  Confirm & Place Order
                </button>
              </motion.div>
            )}
          </div>

          {/* Sidebar Summary */}
          <aside className="lg:col-span-4">
            <div className="sticky top-32 bg-white border border-primary/10 p-10 rounded-2xl shadow-xl">
              <h3 className="micro-label mb-10 text-slate-400">Your Selection</h3>
              <div className="space-y-8 mb-10">
                {[
                  { name: "Verona Sofa", price: "$4,250", img: "https://lh3.googleusercontent.com/aida-public/AB6AXuCTtGH84TuU4703QIx-a5gpZGmbHYoQDPRC6ZEsRO-CO99X3VRVHp0AzGBIkDuVcm54E5vD4puvFbi-ceFVUx-R01uYmS38MjT-eRTpIUpb0IlzGhRPE3x3TSJpNyxXPvVqNt1p02UzU9TP9ivd_yBfOBH3kq1pulWRcf-xbtO5W4HoOx7pKqtTQ0zaXM1atitgH1NxvqApRm2c_5hXG39LdW64NIKkoTuRrV7EHvjH2jvGqee2TUhE4-xG8oMWnF7pyhq3gI27XIs" },
                  { name: "Auric Chair", price: "$1,450", img: "https://lh3.googleusercontent.com/aida-public/AB6AXuCOU1MqWLLzpDKZKk1I5rWg86CUAyL9giJQsxUDSgtQbkGmsm_J0gjJlDo1e-AkepAAMV-SzG8qCP2379nr_MEln0SlW0RGn3ReanHorU-pW-Q0lwZWEB03swYjQb4GDSlOWhE2aPgmW9C2BEX5Oq3rF5CiBuIqrufSjGU38FFaDswJKL2W1KgZDrj0z4PS2kFpK6S1WzXrgZspiNwO3DFpEeaRuchfyQ-aCwJwpUxL7weJgFepDphgxZtS4FGk4GBLkvYKK6mKMYw" },
                ].map((item, i) => (
                  <div key={i} className="flex gap-6">
                    <div className="w-16 h-16 bg-primary/5 rounded overflow-hidden shrink-0">
                      <img src={item.img} alt={item.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-grow">
                      <p className="font-display text-sm">{item.name}</p>
                      <p className="text-primary font-bold text-xs">{item.price}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="space-y-4 pt-8 border-t border-primary/10">
                <div className="flex justify-between text-xs font-body text-slate-500">
                  <span>Subtotal</span>
                  <span>$5,700.00</span>
                </div>
                <div className="flex justify-between text-xs font-body text-slate-500">
                  <span>Delivery</span>
                  <span>$250.00</span>
                </div>
                <div className="flex justify-between text-lg font-display pt-4">
                  <span>Total</span>
                  <span className="text-primary font-bold">$5,950.00</span>
                </div>
              </div>

              <div className="mt-10 pt-10 border-t border-primary/10 flex items-center gap-4 text-slate-400">
                <ShieldCheck className="w-5 h-5 text-primary" />
                <span className="text-[10px] uppercase tracking-widest leading-tight">Encrypted & Secure Transaction</span>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
