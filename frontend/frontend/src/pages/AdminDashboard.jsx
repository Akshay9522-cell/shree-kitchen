import { useEffect, useState } from "react";
import { getDashboardStats } from "../services/adminService";
import { getAllProducts, deleteProduct, createProduct } from "../services/adminProductService"; // Combined imports
import SalesChart from "../components/SalesCharts";
import RecentOrders from "./RecentOrder";
import TopProduct from "./TopProduct";
import LowStockAlert from "../pages/LowStockAlert";
import { toast, Toaster } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

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
  Layers,
  Plus,
  Trash2,
  Edit3,
  ArrowLeft
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
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState("Dashboard");

  // Sub-view management inside the Products tab ("list", "add")
  const [productView, setProductView] = useState("list");
  const [products, setProducts] = useState([]);
  const [image, setImage] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    originalPrice: "",
    category: "",
    stock: "",
    capacity: "",
    material: "",
  });

  useEffect(() => {
    loadDashboard();
    loadProducts();
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

  // --- PRODUCT MANAGEMENT OPERATIONS ---
  const loadProducts = async () => {
    try {
      const res = await getAllProducts();
      setProducts(res.data?.products || []);
    } catch (error) {
      console.error("Failed to load products:", error);
    }
  };

  const handleDeleteProduct = async (id) => {
    if (!window.confirm("Are you absolutely sure you want to delete this product?")) return;
    try {
      await deleteProduct(id);
      toast.success("Product removed successfully");
      loadProducts();
      loadDashboard(); // Update count stats dynamically
    } catch (error) {
      toast.error("Failed to delete product");
    }
  };

  const handleFormChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAddProductSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = new FormData();
      Object.keys(formData).forEach((key) => {
        data.append(key, formData[key]);
      });
      if (image) data.append("image", image);

      await createProduct(data);
      toast.success("Product Added Successfully 🎉");
      
      // Reset form variables and go back to product grid layout view
      setFormData({ name: "", description: "", price: "", originalPrice: "", category: "", stock: "", capacity: "", material: "" });
      setImage(null);
      setProductView("list");
      loadProducts();
      loadDashboard();
    } catch (error) {
      toast.error("Failed to append product asset data ❌");
      console.error(error);
    }
  };

  const handleLogout = () => {
    toast.success("Logout Successful ✅");
    navigate("/login");
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
      <Toaster position="top-center" />
      
      {/* BACKGROUND GRAPHICS */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-indigo-600/10 blur-[120px]" />
        <div className="absolute bottom-[10%] right-[-5%] w-[600px] h-[600px] rounded-full bg-purple-600/10 blur-[140px]" />
      </div>

      {/* MOBILE BACKDROP OVERLAY */}
      {isSidebarOpen && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs z-40 lg:hidden" onClick={() => setIsSidebarOpen(false)} />
      )}

      {/* SIDEBAR NAVIGATION */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-72 bg-slate-900/40 backdrop-blur-xl border-r border-slate-800/60 p-6 flex flex-col justify-between transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:h-screen ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="space-y-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl shadow-lg shadow-indigo-500/20">
                <Layers className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-lg font-bold tracking-tight text-white">Nexus Admin</h2>
                <span className="text-xs text-indigo-400/80 font-medium uppercase tracking-widest">Enterprise</span>
              </div>
            </div>
            <button onClick={() => setIsSidebarOpen(false)} className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:bg-slate-800/50 hover:text-white">
              <X className="w-5 h-5" />
            </button>
          </div>

          <nav className="space-y-1.5">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeMenu === item.name;
              return (
                <button
                  key={item.name}
                  onClick={() => { setActiveMenu(item.name); setProductView("list"); setIsSidebarOpen(false); }}
                  className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 group ${isActive ? "bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 shadow-inner" : "text-slate-400 hover:bg-slate-800/40 hover:text-slate-200 border border-transparent"}`}
                >
                  <Icon className={`w-5 h-5 ${isActive ? "text-indigo-400" : "text-slate-400 group-hover:text-slate-300"}`} />
                  {item.name}
                </button>
              );
            })}
          </nav>
        </div>

        <button onClick={handleLogout} className="w-full flex items-center gap-3.5 px-4 py-3 rounded-xl text-sm font-medium text-rose-400 hover:bg-rose-500/10 border border-transparent hover:border-rose-500/20 transition-all duration-200">
          <LogOut className="w-5 h-5" />
          Logout Session
        </button>
      </aside>

      {/* CORE VIEWPORT WINDOW */}
      <div className="flex-1 min-w-0 flex flex-col h-screen overflow-y-auto z-10">
        <header className="sticky top-0 z-30 bg-slate-950/50 backdrop-blur-md border-b border-slate-900/80 px-4 md:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={() => setIsSidebarOpen(true)} className="lg:hidden p-2 rounded-xl bg-slate-900/60 border border-slate-800/80 text-slate-300"><Menu className="w-5 h-5" /></button>
            <div>
              <h1 className="text-xl md:text-2xl font-bold text-white">{activeMenu}</h1>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="flex h-2.5 w-2.5 relative"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" /><span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" /></span>
            <span className="text-xs font-semibold text-slate-300 bg-slate-900/80 px-3 py-1.5 rounded-lg border border-slate-800/80">Live Monitor</span>
          </div>
        </header>

        <main className="p-4 md:p-8 space-y-8 max-w-[1600px] w-full mx-auto">
          
          {/* VIEW 1: COMPLETE DASHBOARD OVERVIEW */}
          {activeMenu === "Dashboard" && (
            <>
              <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
                <div className="rounded-2xl bg-slate-900/40 backdrop-blur-md border border-slate-800/50 p-5 shadow-xl">
                  <div className="flex items-center justify-between">
                    <div><p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Products</p><p className="text-3xl font-extrabold mt-2 text-white">{stats.totalProducts}</p></div>
                    <div className="p-3 bg-blue-500/10 text-blue-400 rounded-xl border border-blue-500/20"><ShoppingBag className="w-6 h-6" /></div>
                  </div>
                </div>
                <div className="rounded-2xl bg-slate-900/40 backdrop-blur-md border border-slate-800/50 p-5 shadow-xl">
                  <div className="flex items-center justify-between">
                    <div><p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Orders</p><p className="text-3xl font-extrabold mt-2 text-white">{stats.totalOrders}</p></div>
                    <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded-xl border border-emerald-500/20"><ShoppingCart className="w-6 h-6" /></div>
                  </div>
                </div>
                <div className="rounded-2xl bg-slate-900/40 backdrop-blur-md border border-slate-800/50 p-5 shadow-xl">
                  <div className="flex items-center justify-between">
                    <div><p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Gross Revenue</p><p className="text-3xl font-extrabold mt-2 text-emerald-400">₹{(stats.totalRevenue || 0).toLocaleString("en-IN")}</p></div>
                    <div className="p-3 bg-indigo-500/10 text-indigo-400 rounded-xl border border-indigo-500/20"><DollarSign className="w-6 h-6" /></div>
                  </div>
                </div>
                <div className="rounded-2xl bg-slate-900/40 backdrop-blur-md border border-slate-800/50 p-5 shadow-xl">
                  <div className="flex items-center justify-between">
                    <div><p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Pending Tasks</p><p className="text-3xl font-extrabold mt-2 text-amber-400">{stats.pendingOrders}</p></div>
                    <div className="p-3 bg-amber-500/10 text-amber-400 rounded-xl border border-amber-500/20"><Clock className="w-6 h-6" /></div>
                  </div>
                </div>
                <div className="rounded-2xl bg-slate-900/40 backdrop-blur-md border border-slate-800/50 p-5 shadow-xl">
                  <div className="flex items-center justify-between">
                    <div><p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Active Profiles</p><p className="text-3xl font-extrabold mt-2 text-white">{stats.totalUsers}</p></div>
                    <div className="p-3 bg-purple-500/10 text-purple-400 rounded-xl border border-purple-500/20"><Users className="w-6 h-6" /></div>
                  </div>
                </div>
              </section>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
                <div className="lg:col-span-2 space-y-6">
                  <div className="rounded-2xl bg-slate-900/30 backdrop-blur-md border border-slate-800/50 p-6 shadow-xl">
                    <div className="flex items-center gap-2.5 mb-6"><TrendingUp className="w-5 h-5 text-indigo-400" /><h3 className="text-lg font-bold text-white">Sales Distribution Trend</h3></div>
                    <SalesChart />
                  </div>
                </div>
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

          {/* VIEW 2: PRODUCTS SUB-ROUTING MATRIX (FIXED) */}
          {activeMenu === "Products" && (
            <div className="space-y-6 animate-fade-in">
              <LowStockAlert />
              
              {/* Product Grid Repository Table View */}
              {productView === "list" && (
                <div className="rounded-2xl bg-slate-900/30 backdrop-blur-md border border-slate-800/50 p-6 shadow-xl">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                    <div>
                      <h3 className="text-lg font-bold text-white">Inventory Listings</h3>
                      <p className="text-xs text-slate-400">Manage, edit settings, or drop active merchandise lines.</p>
                    </div>
                    <button 
                      onClick={() => setProductView("add")}
                      className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2.5 rounded-xl font-medium text-sm transition shadow-lg shadow-indigo-600/10 cursor-pointer"
                    >
                      <Plus className="w-4 h-4" /> Add New Product
                    </button>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="border-b border-slate-800 text-slate-400 text-xs font-bold uppercase tracking-wider">
                          <th className="py-4 px-4">Product Details</th>
                          <th className="py-4 px-4">Category</th>
                          <th className="py-4 px-4">Price</th>
                          <th className="py-4 px-4 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800/60 text-sm">
                        {products.map((p) => (
                          <tr key={p._id} className="hover:bg-slate-900/20 transition group">
                            <td className="py-4 px-4 font-medium text-slate-200">{p.name}</td>
                            <td className="py-4 px-4 text-slate-400">{p.category || "General"}</td>
                            <td className="py-4 px-4 text-emerald-400 font-semibold">₹{p.price}</td>
                            <td className="py-4 px-4 text-right space-x-2">
                              <button 
                                onClick={() => navigate(`/admin/edit-product/${p._id}`)}
                                className="inline-flex p-2 text-slate-400 hover:text-indigo-400 hover:bg-indigo-500/10 rounded-lg transition"
                                title="Edit Product"
                              >
                                <Edit3 className="w-4 h-4" />
                              </button>
                              <button 
                                onClick={() => handleDeleteProduct(p._id)}
                                className="inline-flex p-2 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition"
                                title="Delete Product"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </td>
                          </tr>
                        ))}
                        {products.length === 0 && (
                          <tr>
                            <td colSpan="4" className="text-center py-8 text-slate-500 text-xs">No active assets setup found in storage records.</td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Dynamic Inline Registration Form */}
              {productView === "add" && (
                <div className="rounded-2xl bg-slate-900/30 backdrop-blur-md border border-slate-800/50 p-6 md:p-8 shadow-xl max-w-4xl mx-auto">
                  <div className="flex items-center gap-3 mb-6">
                    <button 
                      onClick={() => setProductView("list")}
                      className="p-2 text-slate-400 hover:text-white bg-slate-900/60 border border-slate-800 rounded-xl transition"
                    >
                      <ArrowLeft className="w-4 h-4" />
                    </button>
                    <div>
                      <h3 className="text-lg font-bold text-white">Create New Merchandise Asset</h3>
                      <p className="text-xs text-slate-400">Populate fields to commit a new item instance to global storefront routes.</p>
                    </div>
                  </div>

                  <form onSubmit={handleAddProductSubmit} className="space-y-5 text-sm">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-xs text-slate-400 font-medium">Product Name *</label>
                        <input name="name" required placeholder="E.g. Stainless Steel Cookware" onChange={handleFormChange} className="w-full bg-slate-950/60 border border-slate-800 focus:border-indigo-500 rounded-xl p-3 text-slate-200 outline-none transition" />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs text-slate-400 font-medium">Category *</label>
                        <input name="category" required placeholder="E.g. Kitchenware" onChange={handleFormChange} className="w-full bg-slate-950/60 border border-slate-800 focus:border-indigo-500 rounded-xl p-3 text-slate-200 outline-none transition" />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs text-slate-400 font-medium">Description</label>
                      <textarea name="description" rows="3" placeholder="Describe premium characteristics..." onChange={handleFormChange} className="w-full bg-slate-950/60 border border-slate-800 focus:border-indigo-500 rounded-xl p-3 text-slate-200 outline-none transition resize-none" />
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="space-y-1">
                        <label className="text-xs text-slate-400 font-medium">Sale Price (₹) *</label>
                        <input name="price" required type="number" placeholder="1200" onChange={handleFormChange} className="w-full bg-slate-950/60 border border-slate-800 focus:border-indigo-500 rounded-xl p-3 text-slate-200 outline-none transition" />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs text-slate-400 font-medium">Original Price (₹)</label>
                        <input name="originalPrice" type="number" placeholder="1800" onChange={handleFormChange} className="w-full bg-slate-950/60 border border-slate-800 focus:border-indigo-500 rounded-xl p-3 text-slate-200 outline-none transition" />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs text-slate-400 font-medium">Stock Units *</label>
                        <input name="stock" required type="number" placeholder="50" onChange={handleFormChange} className="w-full bg-slate-950/60 border border-slate-800 focus:border-indigo-500 rounded-xl p-3 text-slate-200 outline-none transition" />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs text-slate-400 font-medium">Capacity / Size</label>
                        <input name="capacity" placeholder="5 Liters" onChange={handleFormChange} className="w-full bg-slate-950/60 border border-slate-800 focus:border-indigo-500 rounded-xl p-3 text-slate-200 outline-none transition" />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-xs text-slate-400 font-medium">Material Configuration</label>
                        <input name="material" placeholder="Tri-ply Stainless Steel" onChange={handleFormChange} className="w-full bg-slate-950/60 border border-slate-800 focus:border-indigo-500 rounded-xl p-3 text-slate-200 outline-none transition" />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs text-slate-400 font-medium">Display Cover Image</label>
                        <input type="file" accept="image/*" onChange={(e) => setImage(e.target.files[0])} className="w-full text-xs text-slate-400 file:mr-4 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-slate-800 file:text-slate-200 hover:file:bg-slate-700 transition file:cursor-pointer" />
                      </div>
                    </div>

                    <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-3.5 rounded-xl transition shadow-lg shadow-indigo-600/10 cursor-pointer mt-2">
                      Commit Product Setup
                    </button>
                  </form>
                </div>
              )}
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