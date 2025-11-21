import { useState, useEffect } from "react";
// (FIX) Import API và các Enums/DTOs
import { adminhApi } from "./api"; 
import type { OrderDto, UpdateOrderStatusRequestDto } from "@/types/order";
import { OrderStatus, PaymentStatus } from "@/types/order";

const ORDER_STATUS_STYLES = {
  Pending: { text: "Chờ xác nhận", color: "yellow" },
  Confirmed: { text: "Đã xác nhận", color: "blue" },
  Processing: { text: "Đang xử lý", color: "indigo" },
  Shipped: { text: "Đang giao", color: "cyan" },
  Delivered: { text: "Đã giao", color: "green" },
  Cancelled: { text: "Đã hủy", color: "red" },
  Returned: { text: "Đã hoàn", color: "gray" },
};

const ORDER_STATUSES_LIST = [
  "Pending",
  "Confirmed",
  "Processing",
  "Shipped",
  "Delivered",
  "Cancelled",
  "Returned"
];

const PAYMENT_STATUSES = {
  Unpaid: { text: "Chưa thanh toán", color: "yellow" }, 
  Paid: { text: "Đã thanh toán", color: "green" },
  Failed: { text: "Thất bại", color: "red" },
  Refunded: { text: "Đã hoàn tiền", color: "blue" },
};

const getPaymentStatusStyle = (status: PaymentStatus) => {
  const statusString = PaymentStatus[status];
  return PAYMENT_STATUSES[statusString as keyof typeof PAYMENT_STATUSES] || { text: statusString, color: "stone" };
};

const getOrderStatusStyle = (status: OrderStatus) => {
  const statusString = OrderStatus[status]; 
  return ORDER_STATUS_STYLES[statusString as keyof typeof ORDER_STATUS_STYLES] || { text: statusString, color: "stone" };
};

const AdminOrders = () => {
  const [orders, setOrders] = useState<OrderDto[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<OrderDto | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [newStatus, setNewStatus] = useState("");

  const fetchOrders = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await adminhApi.getAllOrders();
      setOrders(data);
    } catch (err) {
      setError("Không thể tải danh sách đơn hàng.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleViewDetails = async (orderId: string) => {
    setIsLoading(true);
    try {
      const data = await adminhApi.getOrderDetails(orderId);
      setSelectedOrder(data);
      setNewStatus(OrderStatus[data.status]); 
    } catch (err) {
      setError("Không thể tải chi tiết đơn hàng.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCloseModal = () => {
    setSelectedOrder(null);
    setNewStatus("");
  };

  const handleUpdateStatus = async () => {
    if (!selectedOrder || !newStatus) return;

    setIsLoading(true);
    try {
      const statusEnumToUpdate = OrderStatus[newStatus as keyof typeof OrderStatus];
      const payload: UpdateOrderStatusRequestDto = {
        orderId: selectedOrder.id, 
        newStatus: statusEnumToUpdate
      };

      await adminhApi.updateOrderStatus(payload);
      await fetchOrders(); 
      handleCloseModal(); 
    } catch (err) {
      setError("Cập nhật trạng thái thất bại.");
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString: string) => new Date(dateString).toLocaleString("vi-VN");
  const formatCurrency = (amount: number) => new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(amount);

  // Hàm truncate email (vd: dài quá 20 ký tự)
  const truncate = (str: string, max = 20) => str.length > max ? str.slice(0, max) + "..." : str;

  return (
    <div className="p-8 bg-stone-50 min-h-screen font-sans">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-stone-800">Quản lý Đơn hàng</h1>
      </div>

      {isLoading && <p>Đang tải...</p>}
      {error && <p className="text-red-500">{error}</p>}

      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-stone-200">
          <thead className="bg-stone-100">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-stone-500 uppercase tracking-wider">Mã Đơn Hàng</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-stone-500 uppercase tracking-wider">Khách hàng</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-stone-500 uppercase tracking-wider">Email</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-stone-500 uppercase tracking-wider">Ngày đặt</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-stone-500 uppercase tracking-wider">Tổng tiền</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-stone-500 uppercase tracking-wider">TT Đơn hàng</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-stone-500 uppercase tracking-wider">TT Thanh toán</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-stone-500 uppercase tracking-wider">Hành động</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-stone-200">
            {orders.map((order) => {
              const paymentStyle = getPaymentStatusStyle(order.paymentStatus);
              const orderStyle = getOrderStatusStyle(order.status);

              return (
                <tr key={order.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-stone-900">{order.id.substring(0, 8)}...</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-stone-700">{order.customerName}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-stone-700" title={order.customerEmail}>
                    {truncate(order.customerEmail)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-stone-700">{formatDate(order.orderDate)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-stone-700">{formatCurrency(order.totalPrice)}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                      bg-${orderStyle.color}-100 text-${orderStyle.color}-800`}>
                      {orderStyle.text}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                      bg-${paymentStyle.color}-100 text-${paymentStyle.color}-800`}>
                      {paymentStyle.text}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => handleViewDetails(order.id)}
                      className="text-indigo-600 hover:text-indigo-900"
                    >
                      Xem chi tiết
                    </button>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-6 border-b">
              <h2 className="text-2xl font-bold">Chi tiết Đơn hàng: {selectedOrder.id}</h2>
              <button onClick={handleCloseModal} className="text-stone-500 hover:text-stone-800 text-3xl">&times;</button>
            </div>
            
            <div className="p-6 grid grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold mb-2">Thông tin Khách hàng</h3>
                <p><strong>Tên:</strong> {selectedOrder.customerName}</p>
                <p><strong>Email:</strong> {selectedOrder.customerEmail}</p>
                <p><strong>Số điện thoại:</strong> {selectedOrder.phoneNumber}</p>
                <p><strong>Địa chỉ giao hàng:</strong> {selectedOrder.shippingAddress}</p>
                <p><strong>Ngày đặt:</strong> {formatDate(selectedOrder.orderDate)}</p>
                <p><strong>TT Thanh toán:</strong> {getPaymentStatusStyle(selectedOrder.paymentStatus).text}</p>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-2">Trạng thái Đơn hàng</h3>
                <p className="mb-4"><strong>Trạng thái hiện tại:</strong> {getOrderStatusStyle(selectedOrder.status).text}</p>
                <label htmlFor="statusSelect" className="block text-sm font-medium text-stone-700">Cập nhật trạng thái:</label>
                <select
                  id="statusSelect"
                  value={newStatus} 
                  onChange={(e) => setNewStatus(e.target.value)}
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-stone-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                >
                  {ORDER_STATUSES_LIST.map(status => (
                    <option key={status} value={status}>{status}</option>
                  ))}
                </select>
                <button
                  onClick={handleUpdateStatus}
                  disabled={isLoading || newStatus === OrderStatus[selectedOrder.status]}
                  className="mt-4 w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 disabled:bg-stone-400"
                >
                  {isLoading ? "Đang cập nhật..." : "Cập nhật"}
                </button>
              </div>
            </div>

            <div className="p-6 border-t">
              <h3 className="text-lg font-semibold mb-4">Các sản phẩm trong đơn</h3>
              <div className="space-y-4">
                {selectedOrder.items.map(item => (
                  <div key={item.id} className="flex items-center space-x-4 p-2 border rounded-md">
                    <img 
                      src={item.productVariantSnapshotImageUrl || 'https://via.placeholder.com/100'} 
                      alt={item.productSnapshotName}
                      className="w-20 h-20 object-cover rounded"
                    />
                    <div className="flex-1">
                      <p className="font-bold">{item.productSnapshotName}</p>
                      <p className="text-sm text-stone-600">
                        {item.productVariantSnapshotColor} / {item.productVariantSnapshotSize}
                      </p>
                    </div>
                    <div className="text-right">
                      <p>{formatCurrency(item.unitPrice)} x {item.quantity}</p>
                      <p className="font-bold">{formatCurrency(item.unitPrice * item.quantity)}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="text-right mt-6">
                <h3 className="text-2xl font-bold">Tổng cộng: {formatCurrency(selectedOrder.totalPrice)}</h3>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminOrders;
