export interface Transaction {
  id: string;
  amount: number;
  location: string;
  merchant: string;
  timestamp: Date;
  cardNumber: string;
  customerId: string;
}

export interface FraudAnalysis {
  riskScore: number;
  status: 'safe' | 'suspicious' | 'blocked';
  reasons: string[];
  confidence: number;
}

export interface FraudResult {
  transaction: Transaction;
  analysis: FraudAnalysis;
}

// Mock AI fraud detection logic
export function analyzeFraudRisk(transaction: Transaction): FraudAnalysis {
  const reasons: string[] = [];
  let riskScore = 0;

  // High amount transactions
  if (transaction.amount > 5000) {
    riskScore += 30;
    reasons.push('High transaction amount');
  }

  // Unusual location patterns (mock logic)
  const unusualLocations = ['Nigeria', 'Romania', 'Unknown Location'];
  if (unusualLocations.some(loc => transaction.location.toLowerCase().includes(loc.toLowerCase()))) {
    riskScore += 40;
    reasons.push('Transaction from high-risk location');
  }

  // Rapid transactions (mock - checking if amount is very high)
  if (transaction.amount > 10000) {
    riskScore += 25;
    reasons.push('Unusually large transaction');
  }

  // Time-based risk (mock - very late/early hours)
  const hour = transaction.timestamp.getHours();
  if (hour < 6 || hour > 23) {
    riskScore += 15;
    reasons.push('Transaction during unusual hours');
  }

  // Merchant type risk
  const highRiskMerchants = ['ATM', 'Gas Station', 'Online Gaming', 'Cryptocurrency'];
  if (highRiskMerchants.some(merchant => 
    transaction.merchant.toLowerCase().includes(merchant.toLowerCase()))) {
    riskScore += 20;
    reasons.push('High-risk merchant category');
  }

  // Multiple small transactions pattern
  if (transaction.amount < 50 && transaction.merchant.includes('ATM')) {
    riskScore += 15;
    reasons.push('Small ATM withdrawal pattern');
  }

  // Determine status based on risk score
  let status: 'safe' | 'suspicious' | 'blocked';
  if (riskScore >= 70) {
    status = 'blocked';
  } else if (riskScore >= 30) {
    status = 'suspicious';
  } else {
    status = 'safe';
  }

  const confidence = Math.min(95, 60 + (riskScore * 0.5));

  return {
    riskScore,
    status,
    reasons: reasons.length > 0 ? reasons : ['Normal transaction pattern'],
    confidence
  };
}

// Generate mock transactions
export function generateMockTransactions(): Transaction[] {
  const merchants = [
    'Amazon.com', 'Walmart', 'Starbucks', 'Shell Gas Station', 'ATM Withdrawal',
    'McDonald\'s', 'Target', 'Best Buy', 'Online Gaming Site', 'Cryptocurrency Exchange',
    'Local Grocery Store', 'Hotel Booking', 'Airline Tickets'
  ];

  const locations = [
    'New York, NY', 'Los Angeles, CA', 'Chicago, IL', 'Houston, TX',
    'Nigeria', 'Romania', 'London, UK', 'Unknown Location',
    'Miami, FL', 'Seattle, WA', 'Denver, CO'
  ];

  const transactions: Transaction[] = [];

  for (let i = 0; i < 10; i++) {
    const transaction: Transaction = {
      id: `TXN-${Date.now()}-${i}`,
      amount: Math.random() < 0.3 ? 
        Math.floor(Math.random() * 15000) + 1000 : // Some high-risk amounts
        Math.floor(Math.random() * 500) + 10,      // Normal amounts
      location: locations[Math.floor(Math.random() * locations.length)],
      merchant: merchants[Math.floor(Math.random() * merchants.length)],
      timestamp: new Date(Date.now() - Math.floor(Math.random() * 24 * 60 * 60 * 1000)),
      cardNumber: `****-****-****-${Math.floor(Math.random() * 9000) + 1000}`,
      customerId: `CUST-${Math.floor(Math.random() * 10000)}`
    };
    transactions.push(transaction);
  }

  return transactions;
}