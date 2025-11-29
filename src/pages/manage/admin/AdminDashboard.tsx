import React from 'react';

// --- DEFINING TYPES (Định nghĩa kiểu dữ liệu) ---
interface StatItem {
  label: string;
  value: string;
  increase: string;
  isPositive: boolean;
}

interface OrderItem {
  id: string;
  customer: string;
  product: string;
  amount: string;
  status: 'Đã giao' | 'Đang xử lý' | 'Chờ thanh toán' | 'Đã hủy'; // Giới hạn các giá trị cho phép
  date: string;
}

interface ProductItem {
  name: string;
  sales: number;
  revenue: string;
}

// --- FAKE DATA ---
const statsData: StatItem[] = [
  { label: 'Tổng doanh thu', value: '120.500.000 ₫', increase: '+12.5%', isPositive: true },
  { label: 'Đơn hàng', value: '1,240', increase: '+4.3%', isPositive: true },
  { label: 'Khách hàng mới', value: '85', increase: '-2.1%', isPositive: false },
  { label: 'Sản phẩm tồn kho', value: '430', increase: 'Ổn định', isPositive: true },
];

const recentOrders: OrderItem[] = [
  { id: '#ORD-001', customer: 'Nguyễn Văn A', product: 'Áo thun Basic Tee (Đen)', amount: '250.000 ₫', status: 'Đã giao', date: '29/11/2025' },
  { id: '#ORD-002', customer: 'Trần Thị B', product: 'Quần Jean Slim Fit', amount: '550.000 ₫', status: 'Đang xử lý', date: '29/11/2025' },
  { id: '#ORD-003', customer: 'Lê Văn C', product: 'Áo Khoác Bomber', amount: '890.000 ₫', status: 'Chờ thanh toán', date: '28/11/2025' },
  { id: '#ORD-004', customer: 'Phạm Thị D', product: 'Váy Floral Summer', amount: '420.000 ₫', status: 'Đã hủy', date: '28/11/2025' },
  { id: '#ORD-005', customer: 'Hoàng Văn E', product: 'Giày Sneaker White', amount: '1.200.000 ₫', status: 'Đã giao', date: '27/11/2025' },
];

const topProducts: ProductItem[] = [
  { name: 'Áo Thun Oversized', sales: 120, revenue: '30.000.000 ₫' },
  { name: 'Quần Baggy Jeans', sales: 98, revenue: '44.100.000 ₫' },
  { name: 'Áo Sơ mi Oxford', sales: 75, revenue: '26.250.000 ₫' },
  { name: 'Hoodie Unisex', sales: 60, revenue: '21.000.000 ₫' },
];

// --- COMPONENTS ---

// Fix lỗi ở đây: Khai báo status là string (hoặc cụ thể hơn là union type của status)
const getStatusColor = (status: string): string => {
  switch (status) {
    case 'Đã giao': return 'bg-green-100 text-green-700';
    case 'Đang xử lý': return 'bg-blue-100 text-blue-700';
    case 'Chờ thanh toán': return 'bg-yellow-100 text-yellow-700';
    case 'Đã hủy': return 'bg-red-100 text-red-700';
    default: return 'bg-gray-100 text-gray-700';
  }
};

const AdminDashboard: React.FC = () => {
  return (
    <div className="p-6 bg-stone-50 min-h-screen font-sans text-stone-800">
      
      {/* HEADER */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-stone-900">Dashboard</h1>
          <p className="text-sm text-stone-500">Xin chào, đây là tổng quan cửa hàng ngày hôm nay.</p>
        </div>
        <button className="bg-stone-900 text-white px-4 py-2 rounded-lg text-sm hover:bg-stone-800 transition">
          + Thêm sản phẩm
        </button>
      </div>

      {/* STATS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statsData.map((item, index) => (
          <div key={index} className="bg-white p-6 rounded-xl shadow-sm border border-stone-100">
            <p className="text-sm font-medium text-stone-500 mb-1">{item.label}</p>
            <div className="flex items-end justify-between">
              <h3 className="text-2xl font-bold text-stone-900">{item.value}</h3>
              <span className={`text-xs font-medium px-2 py-1 rounded-full ${item.isPositive ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
                {item.increase}
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* RECENT ORDERS TABLE */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-stone-100 overflow-hidden">
          <div className="p-6 border-b border-stone-100 flex justify-between items-center">
            <h2 className="font-bold text-lg">Đơn hàng gần đây</h2>
            <a href="#" className="text-sm text-blue-600 hover:underline">Xem tất cả</a>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-stone-50 text-stone-500 uppercase">
                <tr>
                  <th className="px-6 py-3 font-medium">Mã Đơn</th>
                  <th className="px-6 py-3 font-medium">Sản phẩm</th>
                  <th className="px-6 py-3 font-medium">Tổng tiền</th>
                  <th className="px-6 py-3 font-medium">Trạng thái</th>
                  <th className="px-6 py-3 font-medium text-right">Ngày</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {recentOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-stone-50 transition">
                    <td className="px-6 py-4 font-medium text-stone-900">{order.id}</td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="font-medium text-stone-800">{order.product}</span>
                        <span className="text-xs text-stone-500">{order.customer}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-semibold">{order.amount}</td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right text-stone-500">{order.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* TOP PRODUCTS */}
        <div className="bg-white rounded-xl shadow-sm border border-stone-100">
          <div className="p-6 border-b border-stone-100">
            <h2 className="font-bold text-lg">Top Sản phẩm</h2>
          </div>
          <div className="p-6 space-y-6">
            {topProducts.map((product, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded bg-stone-200 flex items-center justify-center text-stone-500 font-bold text-xs">
                    IMG
                  </div>
                  <div>
                    <p className="font-medium text-stone-900 text-sm">{product.name}</p>
                    <p className="text-xs text-stone-500">{product.sales} đã bán</p>
                  </div>
                </div>
                <span className="text-sm font-semibold text-stone-900">{product.revenue}</span>
              </div>
            ))}
          </div>
          <div className="p-4 border-t border-stone-100 text-center">
             <button className="text-sm text-stone-500 hover:text-stone-900 font-medium">Xem báo cáo kho</button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default AdminDashboard;