import { useEffect, useState } from "react";
import { getRecentOrders } from "../services/adminService";
import { ArrowUpRight, ShoppingCart } from "lucide-react";

export default function RecentOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await getRecentOrders();
      setOrders(res.data?.orders || []);
    } catch (error) {
      console.error("Error pulling recent orders list:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="rounded-2xl bg-slate-900/40 backdrop-blur-md border border-slate-800/50 p-6 flex items-center justify-center min-h-[200px]">
        <div className="animate-pulse flex space-x-3 items-center text-slate-400 text-sm">
          <div className="w-2 h-2 rounded-full bg-indigo-500 animate-bounce" />
          <span>Syncing Live Order Registry...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl bg-slate-900/30 backdrop-blur-md border border-slate-800/50 p-6 shadow-xl relative overflow-hidden group">
      
      {/* Decorative inner ambient glow split */}
      <div className="absolute top-0 right-0 w-[150px] h-[150px] rounded-full bg-emerald-500/5 blur-[40px] pointer-events-none" />

      {/* Header Row */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-emerald-500/10 text-emerald-400 rounded-lg border border-emerald-500/20">
            <ShoppingCart className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-lg font-bold tracking-tight text-white">Recent Orders</h2>
            <p className="text-xs text-slate-400 mt-0.5">Latest transactional updates across your storefront.</p>
          </div>
        </div>
        
        <button className="flex items-center gap-1 text-xs font-semibold text-indigo-400 hover:text-indigo-300 bg-indigo-500/5 hover:bg-indigo-500/10 px-3 py-1.5 rounded-lg border border-indigo-500/10 transition-all duration-200">
          View Ledger
          <ArrowUpRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Overflow wrapper to prevent page breakage on tiny mobile viewports */}
      <div className="w-full overflow-x-auto rounded-xl border border-slate-800/40 bg-slate-950/20">
        <table className="w-full border-collapse text-left min-w-[500px]">
          <thead>
            <tr className="border-b border-slate-800/80 bg-slate-900/40">
              <th className="p-3.5 text-xs font-bold text-slate-400 uppercase tracking-wider pl-5">Customer Account</th>
              <th className="p-3.5 text-xs font-bold text-slate-400 uppercase tracking-wider">Gross Total</th>
              <th className="p-3.5 text-xs font-bold text-slate-400 uppercase tracking-wider pr-5">Processing State</th>
            </tr>
          </thead>
          
          <tbody className="divide-y divide-slate-800/40">
            {orders.length === 0 ? (
              <tr>
                <td colSpan="3" className="text-center text-slate-500 text-sm py-10">
                  No active sales entries captured in current frame.
                </td>
              </tr>
            ) : (
              orders.map((order) => {
                const status = (order.orderStatus || "Pending").toLowerCase();
                const isCompleted = status === "completed" || status === "delivered";
                
                return (
                  <tr key={order._id} className="hover:bg-slate-900/30 transition-colors duration-150 group/row">
                    {/* User profile identifier block */}
                    <td className="p-4 pl-5">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700/50 flex items-center justify-center font-bold text-xs text-slate-300 group-hover/row:border-slate-600 transition-colors">
                          {(order.user?.name || "A")[0].toUpperCase()}
                        </div>
                        <span className="text-sm font-medium text-slate-200 group-hover/row:text-white transition-colors">
                          {order.user?.name || "Anonymous Guest"}
                        </span>
                      </div>
                    </td>
                    
                    {/* Clean formatted currency metrics column */}
                    <td className="p-4 font-bold text-sm text-emerald-400">
                      ₹{(order.totalAmount || 0).toLocaleString("en-IN")}
                    </td>
                    
                    {/* Dynamic color capsule pills */}
                    <td className="p-4 pr-5">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-bold tracking-wide border uppercase ${
                        isCompleted
                          ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                          : status === "pending"
                          ? "bg-amber-500/10 text-amber-400 border-amber-500/20"
                          : "bg-indigo-500/10 text-indigo-400 border-indigo-500/20"
                      }`}>
                        {order.orderStatus || "Processing"}
                      </span>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}