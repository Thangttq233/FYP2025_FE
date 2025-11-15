import { useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { customerApi } from './api';
import { CheckCircle, XCircle } from 'lucide-react';

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
    <div className="bg-gray-100 min-h-screen flex justify-center items-center px-4">
      <div className="bg-white max-w-lg w-full rounded-2xl p-8 shadow-xl">

        {/* ICON */}
        <div className="flex justify-center mb-4">
          {isSuccess ? (
            <CheckCircle className="w-20 h-20 text-green-500" />
          ) : (
            <XCircle className="w-20 h-20 text-red-500" />
          )}
        </div>

        {/* TITLE */}
        <h2 className="text-3xl font-bold text-center mb-3">
          {isSuccess ? "Thanh toán thành công!" : "Thanh toán thất bại!"}
        </h2>

        <p className="text-center text-gray-600 mb-6">
          {isSuccess
            ? "Cảm ơn bạn đã thanh toán qua VNPay."
            : "Rất tiếc, giao dịch của bạn không thành công. Vui lòng thử lại."}
        </p>

        {/* INFORMATION CARD */}
        <div className="bg-gray-50 rounded-xl p-5 mb-6 border">
          <h3 className="font-semibold text-lg mb-3">Thông tin giao dịch</h3>

          <div className="space-y-2 text-gray-700">
            <p><span className="font-medium">Mã phản hồi:</span> {resCode}</p>
            <p><span className="font-medium">Mã cửa hàng:</span> {tmnCode}</p>
            <p><span className="font-medium">Mã đơn hàng:</span> {orderId}</p>
          </div>
        </div>

        {/* BUTTON */}
        <div className="flex justify-center">
          <Link
            to="/"
            className="px-6 py-3 bg-blue-600 text-white font-medium rounded-xl shadow hover:bg-blue-700 transition"
          >
            Quay lại trang chủ
          </Link>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccessPage;
