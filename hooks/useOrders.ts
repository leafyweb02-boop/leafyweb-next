import { useCallback, useEffect, useState } from "react";
import { Order } from "@/types/order";
import { getOrders } from "@/services/orderService";

export function useOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    setLoading(true);
    const data = await getOrders();
    setOrders(data);
    setLoading(false);
  }, []);

  useEffect(() => {
    async function reloadOrders() {
      await refresh();
    }

    void reloadOrders();
  }, [refresh]);

  return {
    orders,
    loading,
    refresh,
  };
}