export const isStatusOnline = (val: number): boolean => val === 1;

export const getMetricValue = (metrics: Array<{ name: string; value: number }>, bindName?: string) => {
  if (!bindName) {
    return null;
  }
  return metrics.find(m => m.name === bindName);
};
