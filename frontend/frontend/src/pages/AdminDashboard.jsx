import { useEffect, useState } from "react";
import { getDashboardStats } from "../services/adminService";
import SalesChart from "../components/SalesCharts";
import RecentOrders from "./RecentOrder";
import TopProduct from "./TopProduct";
import LowStockAlert from "../pages/LowStockAlert";
import { Toaster } from "react-hot-toast";

// Premium Icon Asset System
import { 
  LayoutDashboard, 
  ShoppingBag, 
  ShoppingCart, 
  Users, 
  DollarSign, 
  Clock, 
  LogOut, 
  Menu, 
  X, 
  TrendingUp, 
  Layers 
} from "lucide-react";

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalOrders: 0,
    totalUsers: 0,
    pendingOrders: 0,
    totalRevenue: 0,
    recentOrders: [],
    topProducts: [],
  });

  const [loading, setLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState("Dashboard");

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      setLoading(true);
      const res = await getDashboardStats();
      setStats({
        totalProducts: res.data?.totalProducts || 0,
        totalOrders: res.data?.totalOrders || 0,
        totalUsers: res.data?.totalUsers || 0,
        pendingOrders: res.data?.pendingOrders || 0,
        totalRevenue: res.data?.totalRevenue || 0,
        recentOrders: res.data?.recentOrders || [],
        topProducts: res.data?.topProducts || [],
      });
    } catch (error) {
      console.error("Dashboard metric fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    toast.success("Logout Successful ✅");
    // localStorage.clear(); window.location.href = "/login"
  };

  const navigationItems = [
    { name: "Dashboard", icon: LayoutDashboard },
    { name: "Products", icon: ShoppingBag },
    { name: "Orders", icon: ShoppingCart },
    { name: "Customers", icon: Users },
  ];

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen bg-slate-900 text-white">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500 mb-4"></div>
        <h2 className="text-sm font-medium text-slate-400 tracking-wide">Assembling Core Metrics...</h2>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex font-sans antialiased selection:bg-indigo-500/30">
      
      {/* BACKGROUND GRAPHICS: Adds depth below the glass layers */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-indigo-600/10 blur-[120px]" />
        <div className="absolute bottom-[10%] right-[-5%] w-[600px] h-[600px] rounded-full bg-purple-600/10 blur-[140px]" />
      </div>

      {/* MOBILE BACKDROP OVERLAY */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs z-40 lg:hidden transition-opacity duration-300"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* SIDEBAR NAVIGATION (Ultra-Premium Glass Effect) */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-72 
        bg-slate-900/40 backdrop-blur-xl border-r border-slate-800/60 
        p-6 flex flex-col justify-between 
        transform transition-transform duration-300 ease-in-out
        lg:translate-x-0 lg:static lg:h-screen
        ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
      `}>
        <div className="space-y-8">
          {/* Sidebar Branding Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl shadow-lg shadow-indigo-500/20">
                <Layers className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-lg font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-200 to-slate-400">
                  Nexus Admin
                </h2>
                <span className="text-xs text-indigo-400/80 font-medium uppercase tracking-widest">Enterprise</span>
              </div>
            </div>
            {/* Close Mobile Sidebar Trigger */}
            <button onClick={() => setIsSidebarOpen(false)} className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:bg-slate-800/50 hover:text-white">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Links Mapping */}
          <nav className="space-y-1.5">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeMenu === item.name;
              return (
                <button
                  key={item.name}
                  onClick={() => { setActiveMenu(item.name); setIsSidebarOpen(false); }}
                  className={`
                    w-full flex items-center gap-3.5 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 group
                    ${isActive 
                      ? "bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 shadow-inner" 
                      : "text-slate-400 hover:bg-slate-800/40 hover:text-slate-200 border border-transparent"}
                  `}
                >
                  <Icon className={`w-5 h-5 transition-transform group-hover:scale-105 ${isActive ? "text-indigo-400" : "text-slate-400 group-hover:text-slate-300"}`} />
                  {item.name}
                </button>
              );
            })}
          </nav>
        </div>

        {/* System Sign-Out Interface */}
        <button 
          onClick={handleLogout}
          className="w-full flex items-center gap-3.5 px-4 py-3 rounded-xl text-sm font-medium text-rose-400 hover:bg-rose-500/10 border border-transparent hover:border-rose-500/20 transition-all duration-200 group"
        >
          <LogOut className="w-5 h-5 transition-transform group-hover:translate-x-0.5" />
          Logout Session
        </button>
      </aside>

      {/* CORE VIEWPORT SCROLL WINDOW */}
      <div className="flex-1 min-w-0 flex flex-col h-screen overflow-y-auto z-10">
        
        {/* TOP HEADER */}
        <header className="sticky top-0 z-30 bg-slate-950/50 backdrop-blur-md border-b border-b-slate-900/80 px-4 md:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsSidebarOpen(true)}
              className="lg:hidden p-2 rounded-xl bg-slate-900/60 border border-slate-800/80 text-slate-300 hover:text-white"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-xl md:text-2xl font-bold tracking-tight text-white">{activeMenu}</h1>
              <p className="text-xs text-slate-400 hidden sm:block mt-0.5">Real-time control desk portal.</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <span className="flex h-2.5 w-2.5 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
            </span>
            <span className="text-xs font-semibold tracking-wide text-slate-300 bg-slate-900/80 px-3 py-1.5 rounded-lg border border-slate-800/80">
              Live Monitor
            </span>
          </div>
        </header>

        {/* PRIMARY MAIN DASHBOARD CONTENT (Changes dynamically based on activeMenu) */}
        <main className="p-4 md:p-8 space-y-8 max-w-[1600px] w-full mx-auto">
          
          {/* VIEW 1: COMPLETE DASHBOARD OVERVIEW */}
          {activeMenu === "Dashboard" && (
            <>
              {/* TOP ANALYTICS COUNTERS */}
              <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
                <div className="rounded-2xl bg-slate-900/40 backdrop-blur-md border border-slate-800/50 p-5 shadow-xl group">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Products</p>
                      <p className="text-3xl font-extrabold mt-2 text-white">{stats.totalProducts}</p>
                    </div>
                    <div className="p-3 bg-blue-500/10 text-blue-400 rounded-xl border border-blue-500/20">
                      <ShoppingBag className="w-6 h-6" />
                    </div>
                  </div>
                </div>

                <div className="rounded-2xl bg-slate-900/40 backdrop-blur-md border border-slate-800/50 p-5 shadow-xl group">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Orders</p>
                      <p className="text-3xl font-extrabold mt-2 text-white">{stats.totalOrders}</p>
                    </div>
                    <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded-xl border border-emerald-500/20">
                      <ShoppingCart className="w-6 h-6" />
                    </div>
                  </div>
                </div>

                <div className="rounded-2xl bg-slate-900/40 backdrop-blur-md border border-slate-800/50 p-5 shadow-xl group">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Gross Revenue</p>
                      <p className="text-3xl font-extrabold mt-2 text-emerald-400">₹{(stats.totalRevenue || 0).toLocaleString("en-IN")}</p>
                    </div>
                    <div className="p-3 bg-indigo-500/10 text-indigo-400 rounded-xl border border-indigo-500/20">
                      <DollarSign className="w-6 h-6" />
                    </div>
                  </div>
                </div>

                <div className="rounded-2xl bg-slate-900/40 backdrop-blur-md border border-slate-800/50 p-5 shadow-xl group">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Pending Tasks</p>
                      <p className="text-3xl font-extrabold mt-2 text-amber-400">{stats.pendingOrders}</p>
                    </div>
                    <div className="p-3 bg-amber-500/10 text-amber-400 rounded-xl border border-amber-500/20">
                      <Clock className="w-6 h-6" />
                    </div>
                  </div>
                </div>

                <div className="rounded-2xl bg-slate-900/40 backdrop-blur-md border border-slate-800/50 p-5 shadow-xl group">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Active Profiles</p>
                      <p className="text-3xl font-extrabold mt-2 text-white">{stats.totalUsers}</p>
                    </div>
                    <div className="p-3 bg-purple-500/10 text-purple-400 rounded-xl border border-purple-500/20">
                      <Users className="w-6 h-6" />
                    </div>
                  </div>
                </div>
              </section>

              {/* GRAPHS AND FEED SEGMENTS */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
                <div className="lg:col-span-2 space-y-6">
                  <div className="rounded-2xl bg-slate-900/30 backdrop-blur-md border border-slate-800/50 p-6 shadow-xl">
                    <div className="flex items-center gap-2.5 mb-6">
                      <TrendingUp className="w-5 h-5 text-indigo-400" />
                      <h3 className="text-lg font-bold text-white">Sales Distribution Trend</h3>
                    </div>
                    <SalesChart />
                  </div>

                  <div className="rounded-2xl bg-slate-900/30 backdrop-blur-md border border-slate-800/50 p-6 shadow-xl">
                    <h3 className="text-lg font-bold text-white mb-4">Functional System Metrics</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                      <div className="p-4 rounded-xl bg-slate-950/40 border border-slate-800/60 flex justify-between items-center">
                        <span className="text-slate-400">Active Listings</span>
                        <span className="font-bold text-white bg-slate-800 px-2.5 py-1 rounded-md text-xs">{stats.totalProducts} Units</span>
                      </div>
                      <div className="p-4 rounded-xl bg-slate-950/40 border border-slate-800/60 flex justify-between items-center">
                        <span className="text-slate-400">Invoices Processed</span>
                        <span className="font-semibold text-white bg-slate-800 px-2.5 py-1 rounded-md text-xs">{stats.totalOrders} Docs</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* SIDEBAR ANALYTICS FEEDS */}
                <div className="space-y-6">
                  <LowStockAlert />
                  
                  <div className="rounded-2xl bg-slate-900/30 backdrop-blur-md border border-slate-800/50 p-6 shadow-xl">
                    <h3 className="text-base font-bold text-indigo-400 mb-4 pb-2 border-b border-slate-800/80">Recent Orders Stream</h3>
                    <div className="space-y-3">
                      {stats.recentOrders.slice(0, 3).map((order) => (
                        <div key={order._id} className="flex justify-between items-center bg-slate-950/30 p-3 rounded-xl border border-slate-800/40">
                          <p className="text-sm font-semibold">#{order._id.slice(-6).toUpperCase()}</p>
                          <span className="text-sm font-bold text-emerald-400">₹{order.totalAmount}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* VIEW 2: PRODUCTS PAGE */}
          {activeMenu === "Products" && (
            <div className="space-y-6 animate-fade-in">
              <LowStockAlert />
              <div className="rounded-2xl bg-slate-900/30 backdrop-blur-md border border-slate-800/50 p-6 shadow-xl">
                <TopProduct />
              </div>
            </div>
          )}

          {/* VIEW 3: ORDERS PAGE */}
          {activeMenu === "Orders" && (
            <div className="rounded-2xl bg-slate-900/30 backdrop-blur-md border border-slate-800/50 p-6 shadow-xl animate-fade-in">
              <RecentOrders />
            </div>
          )}

          {/* VIEW 4: CUSTOMERS PAGE */}
          {activeMenu === "Customers" && (
            <div className="rounded-2xl bg-slate-900/30 backdrop-blur-md border border-slate-800/50 p-6 shadow-xl p-8 text-center text-slate-400 animate-fade-in">
              <Users className="w-12 h-12 mx-auto mb-3 text-indigo-400 opacity-80" />
              <h3 className="text-xl font-bold text-white mb-1">Ecosystem Accounts</h3>
              <p className="text-sm mb-4">Total accounts registered: <span className="text-indigo-400 font-bold">{stats.totalUsers} profiles</span></p>
              <div className="text-xs bg-slate-950/40 border border-slate-800/60 p-4 rounded-xl max-w-md mx-auto">
                Integrate your custom `<CustomersList />` table module right here.
              </div>
            </div>
          )}

        </main>
      </div>
    </div>
  );
}