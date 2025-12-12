export const dynamic = 'force-dynamic';

const InventoryManagementPage = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-linear-to-br from-amber-50 to-orange-100 p-4">
      <div className="max-w-2xl text-center space-y-8">
        <div className="space-y-4">
          <h1 className="text-6xl font-black text-gray-900">
            INVENTORY MANAGEMENT
          </h1>
          <p className="text-3xl font-bold text-gray-600">
            WAREHOUSE SYSTEM
          </p>
        </div>
        
        <div className="bg-blue-50 border-l-4 border-blue-500 p-6 rounded-r-lg">
          <div className="flex items-center justify-center space-x-3">
            <span className="text-3xl">📊</span>
            <p className="text-xl font-semibold text-blue-700">
              Inventory Control Dashboard Under Development
            </p>
            <span className="text-3xl">📊</span>
          </div>
        </div>

        <div className="bg-white p-8 rounded-xl shadow-lg border">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Planned Inventory Features:
          </h2>
          <ul className="text-gray-600 space-y-2 text-left max-w-md mx-auto">
            <li className="flex items-center">
              <span className="mr-2">📦</span>
              Real-time stock tracking
            </li>
            <li className="flex items-center">
              <span className="mr-2">⚠️</span>
              Low stock alerts and notifications
            </li>
            <li className="flex items-center">
              <span className="mr-2">📈</span>
              Inventory analytics and reporting
            </li>
            <li className="flex items-center">
              <span className="mr-2">🔍</span>
              Batch and expiry date tracking
            </li>
            <li className="flex items-center">
              <span className="mr-2">📝</span>
              Purchase order management
            </li>
            <li className="flex items-center">
              <span className="mr-2">🏪</span>
              Multi-warehouse support
            </li>
            <li className="flex items-center">
              <span className="mr-2">📱</span>
              Barcode/QR code scanning
            </li>
            <li className="flex items-center">
              <span className="mr-2">📊</span>
              Stock movement history
            </li>
          </ul>
        </div>

        <div className="grid grid-cols-3 gap-4 max-w-md mx-auto">
          <div className="bg-green-50 px-4 py-2 rounded-lg">
            <p className="text-green-700 font-medium text-sm">Stock Tracking</p>
          </div>
          <div className="bg-blue-50 px-4 py-2 rounded-lg">
            <p className="text-blue-700 font-medium text-sm">Reorder Alerts</p>
          </div>
          <div className="bg-purple-50 px-4 py-2 rounded-lg">
            <p className="text-purple-700 font-medium text-sm">Analytics</p>
          </div>
        </div>

        <p className="text-gray-400 text-sm italic">
          Development in progress • ETA: December 2024
        </p>
      </div>
    </div>
  );
};

export default InventoryManagementPage;