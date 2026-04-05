export interface Order {
  order_id: string;
  channel: string;
  order_status: string;
  buyer_user_id: string;
  pay_time: string;
  create_time: string;
  ship_by_date: string;
  synced_at: string;
  gross_amount: number;
  net_amount: number;
  discount_amount: number;
  shipping_fee_amount: number;
  buyer_count: number;
  item_count: number;
}

export async function parseCSV(csvText: string): Promise<Order[]> {
  const lines = csvText.trim().split('\n');
  const headers = lines[0].split(',').map(h => h.trim());
  const orders: Order[] = [];

  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(',').map(v => v.trim());
    const order: any = {};

    headers.forEach((header, index) => {
      let value: any = values[index];
      
      // Convert to appropriate type
      if (['gross_amount', 'net_amount', 'discount_amount', 'shipping_fee_amount', 'buyer_count', 'item_count'].includes(header)) {
        value = parseFloat(value) || 0;
      }
      
      order[header] = value;
    });

    if (order.order_id) {
      orders.push(order);
    }
  }

  return orders;
}

export function calculateKPIs(orders: Order[]) {
  const totalRevenue = orders.reduce((sum, order) => sum + (order.net_amount || 0), 0);
  const totalOrders = orders.length;
  const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;
  
  // Calculate revenue leakage (discount_amount + shipping_fee_amount)
  const totalLeakage = orders.reduce((sum, order) => {
    return sum + ((order.discount_amount || 0) + (order.shipping_fee_amount || 0));
  }, 0);
  
  const leakagePercentage = totalRevenue > 0 ? (totalLeakage / (totalRevenue + totalLeakage)) * 100 : 0;

  return {
    totalRevenue,
    totalOrders,
    averageOrderValue,
    totalLeakage,
    leakagePercentage
  };
}

export function groupByChannel(orders: Order[]) {
  const grouped: { [key: string]: number } = {};
  
  orders.forEach(order => {
    const channel = order.channel || 'Unknown';
    grouped[channel] = (grouped[channel] || 0) + (order.net_amount || 0);
  });

  return Object.entries(grouped).map(([name, value]) => ({
    name,
    value: parseFloat(value.toFixed(2))
  }));
}

export function groupByStatus(orders: Order[]) {
  const grouped: { [key: string]: number } = {};
  
  orders.forEach(order => {
    const status = order.order_status || 'Unknown';
    grouped[status] = (grouped[status] || 0) + 1;
  });

  return Object.entries(grouped).map(([name, value]) => ({
    name,
    value
  }));
}

export function getTrendData(orders: Order[]) {
  const grouped: { [key: string]: number } = {};
  
  orders.forEach(order => {
    const date = order.create_time?.split(' ')[0] || 'Unknown';
    grouped[date] = (grouped[date] || 0) + (order.net_amount || 0);
  });

  return Object.entries(grouped)
    .sort(([dateA], [dateB]) => dateA.localeCompare(dateB))
    .map(([date, revenue]) => ({
      date,
      revenue: parseFloat(revenue.toFixed(2))
    }));
}
