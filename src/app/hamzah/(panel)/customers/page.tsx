import { Users } from "lucide-react";
import { connectDB } from "@/lib/db";
import { User } from "@/lib/models/User";

async function getCustomers() {
  try {
    await connectDB();
    const users = await User.find().sort({ createdAt: -1 }).limit(200).lean();
    return users.map((u) => ({
      _id: String(u._id),
      name: u.name,
      email: u.email,
      createdAt: u.createdAt,
    }));
  } catch {
    return [];
  }
}

export default async function CustomersPage() {
  const customers = await getCustomers();

  return (
    <div>
      <h1 className="mb-1 text-2xl font-semibold text-foreground">Customers</h1>
      <p className="mb-6 text-sm text-grey-500">{customers.length} registered customer(s)</p>

      {customers.length === 0 ? (
        <div className="flex flex-col items-center rounded-2xl border border-dashed border-grey-300 bg-white py-16 text-center">
          <Users size={36} className="text-grey-300" />
          <p className="mt-3 text-sm font-medium text-grey-600">No customers yet</p>
          <p className="mt-1 text-xs text-grey-400">Customer accounts will appear here.</p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-grey-200 bg-white">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-grey-200 text-left text-xs uppercase tracking-wide text-grey-400">
                <th className="px-4 py-3 font-medium">Name</th>
                <th className="px-4 py-3 font-medium">Email</th>
                <th className="hidden px-4 py-3 font-medium sm:table-cell">Joined</th>
              </tr>
            </thead>
            <tbody>
              {customers.map((c) => (
                <tr key={c._id} className="border-b border-grey-100 last:border-0">
                  <td className="px-4 py-3 font-medium text-foreground">{c.name}</td>
                  <td className="px-4 py-3 text-grey-500">{c.email}</td>
                  <td className="hidden px-4 py-3 text-grey-500 sm:table-cell">
                    {new Date(c.createdAt).toLocaleDateString("en-GB")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
