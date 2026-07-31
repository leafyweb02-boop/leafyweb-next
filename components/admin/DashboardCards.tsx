type DashboardCardsProps = {
  totalOrders: number;
};

export default function DashboardCards({
  totalOrders,
}: DashboardCardsProps) {
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-3">

      {/* Total Orders */}
      <div className="rounded-2xl border border-white/10 bg-[#1a1a1a] p-6 shadow-lg">
        <p className="text-sm text-gray-400">
          Total Orders
        </p>

        <h2 className="mt-3 text-4xl font-bold text-white">
          {totalOrders}
        </h2>
      </div>

      {/* Pending Orders */}
      <div className="rounded-2xl border border-yellow-500/20 bg-[#1a1a1a] p-6 shadow-lg">
        <p className="text-sm text-gray-400">
          Pending Orders
        </p>

        <h2 className="mt-3 text-4xl font-bold text-yellow-400">
          —
        </h2>
      </div>

      {/* Completed Orders */}
      <div className="rounded-2xl border border-green-500/20 bg-[#1a1a1a] p-6 shadow-lg">
        <p className="text-sm text-gray-400">
          Completed Orders
        </p>

        <h2 className="mt-3 text-4xl font-bold text-green-400">
          —
        </h2>
      </div>

    </div>
  );
}