import { motion } from "motion/react";
import { User, Package, Heart, Settings, LogOut, ChevronRight, Truck, Hammer, PackageCheck, MapPin, CreditCard, CheckCircle2 } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";

export default function Account() {
  const [activeTab, setActiveTab] = useState("orders");

  const orders = [
    { id: "LX-90234", date: "Oct 12, 2024", status: "In Transit", total: "$4,250", items: 1 },
    { id: "LX-88120", date: "Aug 24, 2024", status: "Delivered", total: "$1,890", items: 2 },
  ];

  return (
    <div className="pt-32 pb-24 bg-paper min-h-screen">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col lg:flex-row gap-20">
          {/* Sidebar Nav */}
          <aside className="w-full lg:w-80 shrink-0">
            <div className="bg-white border border-primary/10 p-10 rounded-2xl shadow-xl">
              <div className="flex items-center gap-6 mb-12">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center text-primary font-display text-2xl font-bold">
                  AV
                </div>
                <div>
                  <h2 className="font-display text-xl">Alexander Vance</h2>
                  <p className="micro-label text-slate-400">Platinum Member</p>
                </div>
              </div>

              <nav className="space-y-4">
                {[
                  { id: "profile", icon: User, label: "My Profile" },
                  { id: "orders", icon: Package, label: "Order History" },
                  { id: "wishlist", icon: Heart, label: "My Wishlist" },
                  { id: "settings", icon: Settings, label: "Preferences" },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full flex items-center justify-between p-4 rounded-lg transition-all group ${
                      activeTab === item.id ? "bg-primary/10 text-primary" : "hover:bg-primary/5 text-slate-500"
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <item.icon className="w-5 h-5" />
                      <span className="micro-label">{item.label}</span>
                    </div>
                    <ChevronRight className={`w-4 h-4 transition-transform ${activeTab === item.id ? "translate-x-1" : "opacity-0 group-hover:opacity-100"}`} />
                  </button>
                ))}
                <button className="w-full flex items-center gap-4 p-4 text-red-400 hover:bg-red-50 rounded-lg transition-all mt-12">
                  <LogOut className="w-5 h-5" />
                  <span className="micro-label">Sign Out</span>
                </button>
              </nav>
            </div>
          </aside>

          {/* Main Content Area */}
          <main className="flex-grow">
            {activeTab === "orders" && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-12"
              >
                <div className="flex justify-between items-end border-b border-primary/10 pb-10">
                  <div>
                    <h1 className="editorial-title text-5xl mb-4">Order History</h1>
                    <p className="font-serif italic text-slate-500">Tracking your bespoke collection.</p>
                  </div>
                </div>

                <div className="space-y-8">
                  {orders.map((order) => (
                    <div key={order.id} className="bg-white border border-primary/10 p-8 rounded-2xl hover:shadow-2xl transition-all group">
                      <div className="flex flex-col md:flex-row justify-between gap-8 mb-10">
                        <div className="flex flex-wrap gap-12">
                          <div>
                            <p className="micro-label text-slate-400 mb-2">Order ID</p>
                            <p className="font-display text-lg font-bold">{order.id}</p>
                          </div>
                          <div>
                            <p className="micro-label text-slate-400 mb-2">Date Placed</p>
                            <p className="font-body text-sm">{order.date}</p>
                          </div>
                          <div>
                            <p className="micro-label text-slate-400 mb-2">Total Amount</p>
                            <p className="font-body text-sm font-bold text-primary">{order.total}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <span className={`px-4 py-1.5 rounded-full micro-label ${
                            order.status === "Delivered" ? "bg-green-50 text-green-600" : "bg-primary/10 text-primary"
                          }`}>
                            {order.status}
                          </span>
                          <Link to={`/account/order/${order.id}`} className="p-3 border border-primary/20 rounded-full hover:bg-primary transition-all group-hover:border-primary">
                            <ChevronRight className="w-5 h-5" />
                          </Link>
                        </div>
                      </div>

                      {/* Mini Tracker for active orders */}
                      {order.status !== "Delivered" && (
                        <div className="pt-10 border-t border-primary/5">
                          <div className="flex justify-between mb-8">
                            {[
                              { label: "Placed", icon: CheckCircle2, active: true },
                              { label: "Crafting", icon: Hammer, active: true },
                              { label: "Transit", icon: Truck, active: true },
                              { label: "Home", icon: PackageCheck, active: false },
                            ].map((s, i) => (
                              <div key={i} className="flex flex-col items-center gap-3 relative flex-1">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center z-10 ${s.active ? "bg-primary text-espresso" : "bg-slate-100 text-slate-300"}`}>
                                  <s.icon className="w-4 h-4" />
                                </div>
                                <span className={`text-[9px] uppercase tracking-widest font-bold ${s.active ? "text-espresso" : "text-slate-300"}`}>{s.label}</span>
                                {i < 3 && (
                                  <div className="absolute top-4 left-[calc(50%+16px)] w-[calc(100%-32px)] h-0.5 bg-slate-100">
                                    <div className={`h-full bg-primary transition-all duration-1000 ${s.active && i < 2 ? "w-full" : "w-0"}`} />
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {activeTab === "profile" && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-12"
              >
                <h1 className="editorial-title text-5xl mb-12">My Profile</h1>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                  <div className="space-y-8 p-10 bg-white border border-primary/10 rounded-2xl">
                    <h3 className="micro-label text-primary border-b border-primary/10 pb-4">Personal Details</h3>
                    <div className="space-y-6">
                      <div>
                        <p className="micro-label text-slate-400 mb-1">Full Name</p>
                        <p className="font-display text-xl">Alexander Vance</p>
                      </div>
                      <div>
                        <p className="micro-label text-slate-400 mb-1">Email Address</p>
                        <p className="font-body">a.vance@atelier.com</p>
                      </div>
                      <div>
                        <p className="micro-label text-slate-400 mb-1">Phone Number</p>
                        <p className="font-body">+1 (212) 555-0198</p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-8 p-10 bg-white border border-primary/10 rounded-2xl">
                    <h3 className="micro-label text-primary border-b border-primary/10 pb-4">Primary Address</h3>
                    <div className="flex gap-6">
                      <MapPin className="text-primary w-6 h-6 shrink-0" />
                      <div>
                        <p className="font-display text-lg mb-2">Manhattan Residence</p>
                        <p className="font-body text-slate-500 text-sm leading-relaxed">
                          725 Fifth Avenue, Apt 42C<br />
                          New York, NY 10022<br />
                          United States
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="md:col-span-2 p-10 bg-espresso text-paper rounded-2xl flex flex-col md:flex-row justify-between items-center gap-8">
                    <div className="flex items-center gap-8">
                      <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center">
                        <CreditCard className="text-primary w-8 h-8" />
                      </div>
                      <div>
                        <h3 className="font-display text-xl mb-1">Default Payment</h3>
                        <p className="micro-label text-slate-400">Visa ending in •••• 9012</p>
                      </div>
                    </div>
                    <button className="bg-primary text-espresso px-10 py-4 micro-label font-bold hover:bg-white transition-all">
                      Manage Wallet
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}

// Helper for Order Details (could be a separate file, but for demo brevity)
export function OrderDetail() {
  return (
    <div className="pt-32 pb-24 bg-paper min-h-screen">
      <div className="max-w-4xl mx-auto px-6">
        <Link to="/account" className="flex items-center gap-2 micro-label text-slate-400 hover:text-primary mb-12 group">
          <ChevronRight className="w-4 h-4 rotate-180 group-hover:-translate-x-1 transition-transform" />
          Back to History
        </Link>

        <div className="bg-white border border-primary/10 p-12 rounded-3xl shadow-2xl space-y-16">
          <div className="flex flex-col md:flex-row justify-between items-baseline gap-8">
            <div>
              <h1 className="editorial-title text-5xl mb-4">Order LX-90234</h1>
              <p className="micro-label text-primary font-bold">Status: In Transit — Expected Oct 28</p>
            </div>
            <button className="border border-primary/30 px-8 py-4 micro-label hover:bg-primary/5 transition-all">
              Download Invoice
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 border-y border-primary/5 py-16">
            <div className="space-y-6">
              <h3 className="micro-label text-slate-400">Shipping To</h3>
              <div className="flex gap-4">
                <MapPin className="text-primary w-5 h-5 shrink-0" />
                <p className="font-body text-sm leading-relaxed">
                  Alexander Vance<br />
                  725 Fifth Avenue, Apt 42C<br />
                  New York, NY 10022
                </p>
              </div>
            </div>
            <div className="space-y-6">
              <h3 className="micro-label text-slate-400">Payment Method</h3>
              <div className="flex gap-4">
                <CreditCard className="text-primary w-5 h-5 shrink-0" />
                <p className="font-body text-sm leading-relaxed">
                  Visa ending in 9012<br />
                  Billed to Manhattan Residence
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-10">
            <h3 className="micro-label text-slate-400">Order Items</h3>
            <div className="flex gap-10 pb-10 border-b border-primary/5">
              <div className="w-32 h-32 bg-primary/5 rounded-xl overflow-hidden shrink-0">
                <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuCTtGH84TuU4703QIx-a5gpZGmbHYoQDPRC6ZEsRO-CO99X3VRVHp0AzGBIkDuVcm54E5vD4puvFbi-ceFVUx-R01uYmS38MjT-eRTpIUpb0IlzGhRPE3x3TSJpNyxXPvVqNt1p02UzU9TP9ivd_yBfOBH3kq1pulWRcf-xbtO5W4HoOx7pKqtTQ0zaXM1atitgH1NxvqApRm2c_5hXG39LdW64NIKkoTuRrV7EHvjH2jvGqee2TUhE4-xG8oMWnF7pyhq3gI27XIs" alt="Verona Sofa" className="w-full h-full object-cover" />
              </div>
              <div className="flex-grow flex flex-col justify-center">
                <h4 className="editorial-title text-2xl mb-2">Verona Velvet Sofa</h4>
                <p className="micro-label text-slate-400 mb-4">Emerald / Walnut Finish</p>
                <p className="text-primary font-bold">$4,250.00</p>
              </div>
            </div>
          </div>

          <div className="flex flex-col md:flex-row justify-between items-center gap-8 pt-10">
            <div className="flex items-center gap-4 text-slate-400">
              <Truck className="w-6 h-6 text-primary" />
              <p className="text-xs uppercase tracking-widest">White Glove Delivery Scheduled</p>
            </div>
            <div className="text-right">
              <p className="micro-label text-slate-400 mb-2">Total Paid</p>
              <p className="editorial-title text-4xl text-primary font-bold">$4,500.00</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
