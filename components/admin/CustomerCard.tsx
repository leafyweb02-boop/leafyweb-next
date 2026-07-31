interface OrderProps {
  order: {
    business_name: string;
    contact_person: string;
    whatsapp: string;
    email: string;
    business_type: string;
    package_name?: string;
    amount?: number;
    status?: string;
  };
}

export default function CustomerCard({ order }: OrderProps) {
  return (
    <div className="bg-[#1d1d1d] rounded-3xl p-8 text-white">
      <h2 className="text-3xl font-bold mb-6">
        Customer Details
      </h2>

      <div className="grid grid-cols-2 gap-6">

        <div>
          <p className="text-gray-400">Business Name</p>
          <p className="text-xl">
            {order.business_name}
          </p>
        </div>

        <div>
          <p className="text-gray-400">Contact Person</p>
          <p className="text-xl">
            {order.contact_person}
          </p>
        </div>

        <div>
          <p className="text-gray-400">WhatsApp</p>
          <p className="text-xl">
            {order.whatsapp}
          </p>
        </div>

        <div>
          <p className="text-gray-400">Email</p>
          <p className="text-xl">
            {order.email}
          </p>
        </div>

        <div>
          <p className="text-gray-400">Business Type</p>
          <p className="text-xl">
            {order.business_type}
          </p>
        </div>

        <div>
          <p className="text-gray-400">Package</p>
          <p className="text-xl">
            {order.package_name || "Not selected"}
          </p>
        </div>

        <div>
          <p className="text-gray-400">Amount</p>
          <p className="text-xl">
            {order.amount != null
              ? `₹${order.amount}`
              : "Not set"}
          </p>
        </div>

        <div>
          <p className="text-gray-400">Status</p>
          <p className="text-xl">
            {order.status || "Pending"}
          </p>
        </div>

      </div>
    </div>
  );
}