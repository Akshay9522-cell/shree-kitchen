// 1. Fetch 5 most recent orders
const recentOrders = await Order.find()
  .sort({ createdAt: -1 })
  .limit(5)
  .select("_id totalAmount orderStatus createdAt");

// 2. Aggregate the top 5 best-selling products
const topProducts = await Order.aggregate([
  // Unwind the items array so each purchased item is its own document
  { $unwind: "$items" },

  // Group by product ID and sum up the quantities sold
  {
    $group: {
      _id: "$items.product",
      totalSold: { $sum: "$items.quantity" },
    },
  },

  // Sort descending (highest sales first)
  { $sort: { totalSold: -1 } },

  // Grab the top 5
  { $limit: 5 },

  // Pull in the product details from the products collection
  {
    $lookup: {
      from: "products", // Double-check this matches your exact MongoDB collection name
      localField: "_id",
      foreignField: "_id",
      as: "product",
    },
  },

  // Flatten the array resulting from the lookup
  { $unwind: "$product" },

  // Project only the necessary fields for your dashboard charts
  {
    $project: {
      _id: 1,
      name: "$product.name",
      totalSold: 1,
    },
  },
]);

// 3. Send the structured dashboard summary data back to the client
res.json({
  success: true,
  totalProducts,
  totalOrders,
  totalUsers,
  pendingOrders,
  totalRevenue,
  recentOrders,
  topProducts, // FIXED: Now properly attached to the response payload!
});