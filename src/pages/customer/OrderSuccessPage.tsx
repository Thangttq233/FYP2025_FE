import { useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { customerApi } from './api';
import { CheckCircle, XCircle, Home, FileText } from 'lucide-react';

const OrderSuccessPage = () => {
  const [searchParams] = useSearchParams();
  const resCode = searchParams.get("vnp_ResponseCode");
  const tmnCode = searchParams.get("vnp_TmnCode");
  const orderId = searchParams.get("vnp_TxnRef");

  const handleReturn = async (resCode: string | null, orderId: string | null) => {
    if (!resCode || !orderId) return;

    try {
      const res = await customerApi.handleReturnVNPAY(resCode, orderId);
      console.log("Return result:", res);
    } catch (error) {
      console.error("Error handling return:", error);
    }
  };

  useEffect(() => {
    handleReturn(resCode, orderId);
  }, [resCode, orderId]);

  const isSuccess = resCode === "00";

  return (
    <div className="bg-gray-50 min-h-screen flex justify-center items-center p-4">
      <div className="bg-white max-w-md w-full rounded-2xl shadow-lg overflow-hidden border border-gray-100">
        <div className={`p-8 flex flex-col items-center justify-center ${isSuccess ? 'bg-green-50' : 'bg-red-50'}`}>
          <div className={`rounded-full p-3 mb-4 ${isSuccess ? 'bg-green-100' : 'bg-red-100'}`}>
            {isSuccess ? (
              <CheckCircle className="w-12 h-12 text-green-600" />
            ) : (
              <XCircle className="w-12 h-12 text-red-600" />
            )}
          </div>
          <h2 className={`text-2xl font-bold text-center mb-2 ${isSuccess ? 'text-green-700' : 'text-red-700'}`}>
            {isSuccess ? "Thanh toán thành công!" : "Thanh toán thất bại!"}
          </h2>
          <p className="text-center text-gray-600 text-sm max-w-xs">
            {isSuccess
              ? "Cảm ơn bạn đã mua sắm. Đơn hàng của bạn đã được ghi nhận."
              : "Giao dịch bị hủy hoặc có lỗi xảy ra trong quá trình thanh toán."}
          </p>
        </div>

        <div className="p-6">
          <div className="bg-gray-50 rounded-xl p-4 mb-6 border border-gray-100">
            <h3 className="font-semibold text-gray-900 mb-4 flex items-center text-sm uppercase tracking-wide">
                <FileText size={16} className="mr-2" /> Thông tin giao dịch
            </h3>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between items-center pb-2 border-b border-gray-200 border-dashed">
                 <span className="text-gray-500">Mã đơn hàng</span>
                 <span className="font-medium text-gray-900">{orderId || "N/A"}</span>
              </div>
              <div className="flex justify-between items-center pb-2 border-b border-gray-200 border-dashed">
                 <span className="text-gray-500">Mã phản hồi</span>
                 <span className={`font-medium ${isSuccess ? 'text-green-600' : 'text-red-600'}`}>{resCode || "N/A"}</span>
              </div>
              <div className="flex justify-between items-center">
                 <span className="text-gray-500">Mã cổng TT</span>
                 <span className="font-medium text-gray-900">{tmnCode || "N/A"}</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <Link
              to="/"
              className="w-full flex items-center justify-center px-6 py-3 bg-blue-600 text-white font-bold rounded-xl shadow-md shadow-blue-200 hover:bg-blue-700 transition-all active:scale-95"
            >
              <Home size={18} className="mr-2" />
              Quay lại trang chủ
            </Link>
            
            {isSuccess && (
                <Link
                    to="/profile/orders"
                    className="w-full flex items-center justify-center px-6 py-3 bg-white text-gray-700 font-medium rounded-xl border border-gray-200 hover:bg-gray-50 transition-all"
                >
                    Xem lịch sử đơn hàng
                </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccessPage;