import { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './components/ui/card';
import { Button } from './components/ui/button';
import { Badge } from './components/ui/badge';
import { Shield, BarChart3, UserCheck, Zap, TrendingDown, AlertTriangle } from 'lucide-react';
import { TransactionForm } from './components/TransactionForm';
import { FraudResultDisplay } from './components/FraudResultDisplay';
import { BankDashboard } from './components/BankDashboard';
import { AppealForm, AppealData } from './components/AppealForm';
import { 
  Transaction, 
  FraudResult, 
  analyzeFraudRisk, 
  generateMockTransactions 
} from './components/fraud-detection-service';

export default function App() {
  const [currentTransaction, setCurrentTransaction] = useState<FraudResult | null>(null);
  const [transactionHistory, setTransactionHistory] = useState<FraudResult[]>([]);
  const [showAppeal, setShowAppeal] = useState(false);
  const [activeTab, setActiveTab] = useState('demo');

  // Generate mock transaction history on component mount
  useEffect(() => {
    const mockTransactions = generateMockTransactions();
    const mockResults = mockTransactions.map(transaction => ({
      transaction,
      analysis: analyzeFraudRisk(transaction)
    }));
    setTransactionHistory(mockResults);
  }, []);

  const handleTransactionSubmit = (transaction: Transaction) => {
    const analysis = analyzeFraudRisk(transaction);
    const result: FraudResult = { transaction, analysis };
    
    setCurrentTransaction(result);
    setTransactionHistory(prev => [result, ...prev]);
    setShowAppeal(false);
  };

  const handleAppealSubmit = (appealData: AppealData) => {
    console.log('Appeal submitted:', appealData);
    // In a real application, this would be sent to the backend
    setShowAppeal(false);
  };

  const stats = {
    totalTransactions: transactionHistory.length,
    fraudPrevented: transactionHistory.filter(t => t.analysis.status === 'blocked').length,
    falsePositiveRate: 8.2, // Mock data
    avgProcessingTime: 0.3 // Mock data in seconds
  };

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-3">
            <Shield className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold">AI Fraud Detection System</h1>
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Advanced machine learning prototype for real-time financial fraud detection and prevention
          </p>
          <div className="flex flex-wrap justify-center gap-2">
            <Badge variant="outline" className="gap-1">
              <Zap className="h-3 w-3" />
              Real-time Processing
            </Badge>
            <Badge variant="outline" className="gap-1">
              <TrendingDown className="h-3 w-3" />
              Reduced False Positives
            </Badge>
            <Badge variant="outline" className="gap-1">
              <AlertTriangle className="h-3 w-3" />
              Advanced Risk Scoring
            </Badge>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Transactions Processed</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalTransactions.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">+20.1% from last month</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Fraud Prevented</CardTitle>
              <Shield className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{stats.fraudPrevented}</div>
              <p className="text-xs text-muted-foreground">-15% false positives</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">False Positive Rate</CardTitle>
              <TrendingDown className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{stats.falsePositiveRate}%</div>
              <p className="text-xs text-muted-foreground">Target: &lt;10%</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg Processing Time</CardTitle>
              <Zap className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{stats.avgProcessingTime}s</div>
              <p className="text-xs text-muted-foreground">Real-time detection</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="demo">Live Demo</TabsTrigger>
            <TabsTrigger value="dashboard">Bank Dashboard</TabsTrigger>
            <TabsTrigger value="customer">Customer View</TabsTrigger>
          </TabsList>

          <TabsContent value="demo" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>AI Fraud Detection Demo</CardTitle>
                <CardDescription>
                  Test the fraud detection system by submitting sample transactions. 
                  The AI will analyze transaction patterns and provide real-time fraud assessment.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <TransactionForm onSubmit={handleTransactionSubmit} />
                  {currentTransaction && (
                    <FraudResultDisplay 
                      result={currentTransaction} 
                      onAppeal={() => setShowAppeal(true)}
                      viewType="bank"
                    />
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="dashboard" className="space-y-6">
            <BankDashboard transactions={transactionHistory} />
          </TabsContent>

          <TabsContent value="customer" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Customer Experience</CardTitle>
                <CardDescription>
                  How customers see fraud alerts and can appeal false positives
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {currentTransaction && (
                    <>
                      <FraudResultDisplay 
                        result={currentTransaction} 
                        onAppeal={() => setShowAppeal(true)}
                        viewType="customer"
                      />
                      {showAppeal && (
                        <AppealForm 
                          transaction={currentTransaction}
                          onSubmit={handleAppealSubmit}
                          onCancel={() => setShowAppeal(false)}
                        />
                      )}
                    </>
                  )}
                  {!currentTransaction && (
                    <div className="col-span-2 text-center py-12 text-muted-foreground">
                      <UserCheck className="h-12 w-12 mx-auto mb-4" />
                      <p>Submit a transaction in the Live Demo tab to see the customer experience</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Technical Details */}
        <Card>
          <CardHeader>
            <CardTitle>AI Model Features</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <h4 className="font-medium">Risk Factors Analyzed</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Transaction amount patterns</li>
                  <li>• Geographic location analysis</li>
                  <li>• Merchant category risk assessment</li>
                  <li>• Time-based anomaly detection</li>
                  <li>• Historical behavior analysis</li>
                </ul>
              </div>
              <div className="space-y-2">
                <h4 className="font-medium">Real-time Processing</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Sub-second response time</li>
                  <li>• Confidence scoring (60-95%)</li>
                  <li>• Dynamic risk thresholds</li>
                  <li>• Multi-factor authentication</li>
                  <li>• Appeal mechanism integration</li>
                </ul>
              </div>
              <div className="space-y-2">
                <h4 className="font-medium">Ethical Considerations</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Bias-aware training data</li>
                  <li>• Transparent decision making</li>
                  <li>• Customer appeal process</li>
                  <li>• Privacy protection (GDPR/POPIA)</li>
                  <li>• Accessibility compliance</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}