
export type Timeframe = '1D' | '1W' | '1M' | '3M' | '6M' | '1Y' | '5Y' | 'ALL';

export const timeframeOptions: Timeframe[] = ['1D', '1W', '1M', '3M', '6M', '1Y', '5Y', 'ALL'];

export const getTimeframeLabel = (timeframe: Timeframe): string => {
  const labels: Record<Timeframe, string> = {
    '1D': 'Today',
    '1W': 'Week',
    '1M': 'Month',
    '3M': '3 Months',
    '6M': '6 Months',
    '1Y': 'Year',
    '5Y': '5 Years',
    'ALL': 'All Time'
  };
  
  return labels[timeframe];
};

// Generate mock data based on timeframe
export const generateTimeframeData = (timeframe: Timeframe, baseValue: number = 4850, volatility: number = 0.02) => {
  let dataPoints: {time: string, value: number}[] = [];
  let currentValue = baseValue;
  
  switch(timeframe) {
    case '1D':
      // Hourly data points for one day
      for (let i = 9; i <= 16; i++) {
        const hour = i > 12 ? `${i-12}:00 PM` : `${i}:00 AM`;
        currentValue = currentValue * (1 + (Math.random() * volatility * 2 - volatility));
        dataPoints.push({ time: hour, value: Math.round(currentValue) });
      }
      break;
    case '1W':
      // Daily data points for one week
      const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];
      days.forEach(day => {
        currentValue = currentValue * (1 + (Math.random() * volatility * 2 - volatility));
        dataPoints.push({ time: day, value: Math.round(currentValue) });
      });
      break;
    case '1M':
      // Weekly data points for one month
      for (let i = 1; i <= 4; i++) {
        currentValue = currentValue * (1 + (Math.random() * volatility * 2 - volatility));
        dataPoints.push({ time: `Week ${i}`, value: Math.round(currentValue) });
      }
      break;
    case '3M':
      // Monthly data for three months
      const threeMonths = ['Jan', 'Feb', 'Mar'];
      threeMonths.forEach(month => {
        currentValue = currentValue * (1 + (Math.random() * volatility * 2 - volatility));
        dataPoints.push({ time: month, value: Math.round(currentValue) });
      });
      break;
    case '6M':
      // Monthly data for six months
      const sixMonths = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
      sixMonths.forEach(month => {
        currentValue = currentValue * (1 + (Math.random() * volatility * 2 - volatility));
        dataPoints.push({ time: month, value: Math.round(currentValue) });
      });
      break;
    case '1Y':
      // Monthly data for one year
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      months.forEach(month => {
        currentValue = currentValue * (1 + (Math.random() * volatility * 2 - volatility));
        dataPoints.push({ time: month, value: Math.round(currentValue) });
      });
      break;
    case '5Y':
      // Yearly data for five years
      const currentYear = new Date().getFullYear();
      for (let i = 4; i >= 0; i--) {
        currentValue = currentValue * (1 + (Math.random() * volatility * 2 - volatility));
        dataPoints.push({ time: `${currentYear - i}`, value: Math.round(currentValue) });
      }
      break;
    case 'ALL':
      // Data for last 10 years
      const thisYear = new Date().getFullYear();
      for (let i = 9; i >= 0; i--) {
        currentValue = currentValue * (1 + (Math.random() * volatility * 2 - volatility));
        dataPoints.push({ time: `${thisYear - i}`, value: Math.round(currentValue) });
      }
      break;
  }
  
  return dataPoints;
};
