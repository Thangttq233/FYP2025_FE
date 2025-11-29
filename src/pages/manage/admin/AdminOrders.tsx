import { useState, useEffect } from "react";
import { adminhApi } from "./api";
import type { OrderDto, UpdateOrderStatusRequestDto } from "@/types/order";
import { OrderStatus, PaymentStatus } from "@/types/order";
import { Eye, X, Calendar, DollarSign, User, Mail, CreditCard, Package } from "lucide-react";

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
      // Cập nhật lại selectedOrder để UI phản hồi ngay lập tức nếu không đóng modal
      // Tuy nhiên ở đây logic là đóng modal luôn
      handleCloseModal();
    } catch (err) {
      setError("Cập nhật trạng thái thất bại.");
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString: string) => new Date(dateString).toLocaleString("vi-VN", {
      day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit'
  });
  const formatCurrency = (amount: number) => new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(amount);

  const truncate = (str: string, max = 20) => str.length > max ? str.slice(0, max) + "..." : str;

  return (
    <div className="p-4 md:p-8 bg-stone-50 min-h-screen font-sans max-w-[1600px] mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <h1 className="text-2xl md:text-3xl font-bold text-stone-800">Quản lý Đơn hàng</h1>
        <div className="text-sm text-stone-500">Tổng số đơn: {orders.length}</div>
      </div>

      {isLoading && !selectedOrder && (
        <div className="text-center py-8"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto"></div></div>
      )}
      {error && <p className="text-red-500 mb-4 bg-red-50 p-3 rounded">{error}</p>}

      <div className="bg-white shadow-md rounded-xl overflow-hidden border border-stone-200">
        <table className="w-full divide-y divide-stone-200">
          <thead className="bg-stone-100 hidden md:table-header-group">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-bold text-stone-500 uppercase tracking-wider">Mã Đơn</th>
              <th className="px-6 py-3 text-left text-xs font-bold text-stone-500 uppercase tracking-wider">Khách hàng</th>
              <th className="px-6 py-3 text-left text-xs font-bold text-stone-500 uppercase tracking-wider">Ngày đặt</th>
              <th className="px-6 py-3 text-left text-xs font-bold text-stone-500 uppercase tracking-wider">Tổng tiền</th>
              <th className="px-6 py-3 text-center text-xs font-bold text-stone-500 uppercase tracking-wider">Trạng thái</th>
              <th className="px-6 py-3 text-center text-xs font-bold text-stone-500 uppercase tracking-wider">Thanh toán</th>
              <th className="px-6 py-3 text-right text-xs font-bold text-stone-500 uppercase tracking-wider">Hành động</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-stone-200 block md:table-row-group">
            {orders.map((order) => {
              const paymentStyle = getPaymentStatusStyle(order.paymentStatus);
              const orderStyle = getOrderStatusStyle(order.status);

              return (
                <tr key={order.id} className="block md:table-row hover:bg-stone-50 transition-colors">
                  
                  {/* Mobile: Card Header with ID & Status */}
                  <td className="block md:table-cell px-4 py-3 md:px-6 md:py-4 border-b md:border-b-0 border-stone-100">
                     <div className="flex justify-between items-center md:block">
                        <span className="font-bold text-stone-900 text-sm md:text-base">#{order.id.substring(0, 8).toUpperCase()}</span>
                        <span className={`md:hidden px-2 py-1 text-xs font-semibold rounded-full bg-${orderStyle.color}-100 text-${orderStyle.color}-800`}>
                            {orderStyle.text}
                        </span>
                     </div>
                  </td>

                  <td className="block md:table-cell px-4 py-2 md:px-6 md:py-4">
                     <div className="flex items-center gap-2">
                        <User size={16} className="text-stone-400 md:hidden" />
                        <div>
                            <div className="text-sm font-medium text-stone-900">{order.customerName}</div>
                            <div className="text-xs text-stone-500 hidden md:block">{truncate(order.customerEmail)}</div>
                        </div>
                     </div>
                  </td>

                  <td className="block md:table-cell px-4 py-2 md:px-6 md:py-4 text-sm text-stone-700">
                     <div className="flex justify-between md:block">
                        <span className="text-stone-500 md:hidden text-xs uppercase font-semibold">Ngày đặt:</span>
                        <span>{formatDate(order.orderDate)}</span>
                     </div>
                  </td>

                  <td className="block md:table-cell px-4 py-2 md:px-6 md:py-4 text-sm font-medium text-stone-900">
                      <div className="flex justify-between md:block">
                        <span className="text-stone-500 md:hidden text-xs uppercase font-semibold">Tổng tiền:</span>
                        <span>{formatCurrency(order.totalPrice)}</span>
                     </div>
                  </td>

                  {/* Desktop Status Column */}
                  <td className="hidden md:table-cell px-6 py-4 whitespace-nowrap text-center">
                    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-${orderStyle.color}-100 text-${orderStyle.color}-800`}>
                      {orderStyle.text}
                    </span>
                  </td>

                  <td className="block md:table-cell px-4 py-2 md:px-6 md:py-4 text-center">
                     <div className="flex justify-between items-center md:justify-center">
                        <span className="text-stone-500 md:hidden text-xs uppercase font-semibold">Thanh toán:</span>
                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-${paymentStyle.color}-100 text-${paymentStyle.color}-800`}>
                        {paymentStyle.text}
                        </span>
                     </div>
                  </td>

                  <td className="block md:table-cell px-4 py-4 md:px-6 md:py-4 md:text-right text-sm font-medium border-t md:border-t-0 border-stone-100 mt-2 md:mt-0">
                    <button
                      onClick={() => handleViewDetails(order.id)}
                      className="w-full md:w-auto flex items-center justify-center gap-2 bg-indigo-50 text-indigo-600 hover:bg-indigo-100 hover:text-indigo-900 px-4 py-2 rounded-lg transition-colors"
                    >
                      <Eye size={16} /> Xem chi tiết
                    </button>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
        {orders.length === 0 && !isLoading && (
            <div className="text-center py-12 text-stone-500">Không có đơn hàng nào.</div>
        )}
      </div>

      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-3xl my-auto relative flex flex-col max-h-[90vh]">
            
            <div className="flex justify-between items-center p-4 md:p-6 border-b border-stone-100 sticky top-0 bg-white rounded-t-xl z-10">
              <h2 className="text-lg md:text-2xl font-bold text-stone-800 flex items-center gap-2">
                <Package className="text-indigo-600" />
                Chi tiết Đơn hàng <span className="text-stone-400 text-base">#{selectedOrder.id.substring(0, 8)}</span>
              </h2>
              <button onClick={handleCloseModal} className="p-2 hover:bg-stone-100 rounded-full text-stone-500 transition-colors">
                <X size={24} />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4 md:p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                {/* Cột trái: Thông tin khách hàng */}
                <div className="bg-stone-50 p-4 rounded-lg border border-stone-100">
                    <h3 className="text-sm font-bold text-stone-500 uppercase tracking-wider mb-4 border-b border-stone-200 pb-2">Thông tin Khách hàng</h3>
                    <div className="space-y-3 text-sm">
                        <p className="flex items-start gap-3"><User size={16} className="text-stone-400 mt-0.5 shrink-0" /> <span className="font-medium text-stone-900">{selectedOrder.customerName}</span></p>
                        <p className="flex items-start gap-3"><Mail size={16} className="text-stone-400 mt-0.5 shrink-0" /> <span className="text-stone-700 break-all">{selectedOrder.customerEmail}</span></p>
                        <p className="flex items-start gap-3"><CreditCard size={16} className="text-stone-400 mt-0.5 shrink-0" /> <span>Thanh toán: <span className="font-medium text-indigo-600">{getPaymentStatusStyle(selectedOrder.paymentStatus).text}</span></span></p>
                        <p className="flex items-start gap-3"><Calendar size={16} className="text-stone-400 mt-0.5 shrink-0" /> <span>Ngày đặt: {formatDate(selectedOrder.orderDate)}</span></p>
                        <div className="mt-2 pt-2 border-t border-stone-200">
                            <p className="text-xs text-stone-500 uppercase mb-1">Địa chỉ giao hàng:</p>
                            <p className="text-stone-800 font-medium">{selectedOrder.shippingAddress}</p>
                        </div>
                    </div>
                </div>

                {/* Cột phải: Cập nhật trạng thái */}
                <div className="bg-indigo-50 p-4 rounded-lg border border-indigo-100">
                    <h3 className="text-sm font-bold text-indigo-800 uppercase tracking-wider mb-4 border-b border-indigo-200 pb-2">Quản lý Trạng thái</h3>
                    <div className="mb-4">
                        <span className="text-sm text-indigo-600 block mb-1">Trạng thái hiện tại:</span>
                        <span className={`px-3 py-1 rounded-full text-sm font-bold bg-white border border-indigo-200 text-indigo-700 inline-block`}>
                            {getOrderStatusStyle(selectedOrder.status).text}
                        </span>
                    </div>
                    
                    <div className="space-y-2">
                        <label htmlFor="statusSelect" className="block text-sm font-medium text-indigo-900">Cập nhật trạng thái mới:</label>
                        <select
                        id="statusSelect"
                        value={newStatus}
                        onChange={(e) => setNewStatus(e.target.value)}
                        className="block w-full px-3 py-2 text-base border-indigo-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md bg-white"
                        >
                        {ORDER_STATUSES_LIST.map(status => (
                            <option key={status} value={status}>{ORDER_STATUS_STYLES[status as keyof typeof ORDER_STATUS_STYLES]?.text || status}</option>
                        ))}
                        </select>
                        <button
                        onClick={handleUpdateStatus}
                        disabled={isLoading || newStatus === OrderStatus[selectedOrder.status]}
                        className="w-full mt-2 bg-indigo-600 text-white py-2.5 px-4 rounded-lg font-medium hover:bg-indigo-700 disabled:bg-stone-400 disabled:cursor-not-allowed transition-colors shadow-sm"
                        >
                        {isLoading ? "Đang xử lý..." : "Lưu thay đổi"}
                        </button>
                    </div>
                </div>
                </div>

                <div className="border-t border-stone-200 pt-6">
                    <h3 className="text-lg font-bold text-stone-800 mb-4 flex items-center gap-2">
                        <Package size={20} className="text-stone-500" /> Danh sách sản phẩm
                    </h3>
                    <div className="space-y-3">
                        {selectedOrder.items.map(item => (
                        <div key={item.id} className="flex items-start sm:items-center gap-4 p-3 border border-stone-100 rounded-lg hover:bg-stone-50 transition-colors">
                            <div className="w-16 h-16 shrink-0 bg-stone-200 rounded-md overflow-hidden">
                                <img
                                src={item.productVariantSnapshotImageUrl || 'https://via.placeholder.com/100'}
                                alt={item.productSnapshotName}
                                className="w-full h-full object-cover"
                                />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="font-bold text-stone-900 text-sm sm:text-base truncate">{item.productSnapshotName}</p>
                                <p className="text-xs sm:text-sm text-stone-500 mt-0.5">
                                    Phân loại: {item.productVariantSnapshotColor} / {item.productVariantSnapshotSize}
                                </p>
                                <div className="sm:hidden mt-1 font-medium text-indigo-600">
                                   {formatCurrency(item.unitPrice)} x {item.quantity}
                                </div>
                            </div>
                            <div className="text-right hidden sm:block">
                                <p className="text-sm text-stone-500">{formatCurrency(item.unitPrice)} x {item.quantity}</p>
                                <p className="font-bold text-stone-900">{formatCurrency(item.unitPrice * item.quantity)}</p>
                            </div>
                        </div>
                        ))}
                    </div>
                    <div className="mt-6 flex justify-end items-center gap-4 pt-4 border-t border-stone-100">
                        <span className="text-stone-500 font-medium">Tổng thanh toán:</span>
                        <span className="text-2xl font-bold text-indigo-700">{formatCurrency(selectedOrder.totalPrice)}</span>
                    </div>
                </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminOrders;