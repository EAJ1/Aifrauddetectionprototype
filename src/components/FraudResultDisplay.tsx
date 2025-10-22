import { AlertTriangle, CheckCircle, XCircle, Shield } from 'lucide-react';
import { Alert, AlertDescription } from './ui/alert';
import { Badge } from './ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Progress } from './ui/progress';
import { Button } from './ui/button';
import { FraudResult } from './fraud-detection-service';

interface FraudResultDisplayProps {
  result: FraudResult;
  onAppeal?: () => void;
  viewType?: 'bank' | 'customer';
}

export function FraudResultDisplay({ 
  result, 
  onAppeal, 
  viewType = 'bank' 
}: FraudResultDisplayProps) {
  const { transaction, analysis } = result;

  const getStatusIcon = () => {
    switch (analysis.status) {
      case 'safe':
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'suspicious':
        return <AlertTriangle className="h-5 w-5 text-yellow-600" />;
      case 'blocked':
        return <XCircle className="h-5 w-5 text-red-600" />;
    }
  };

  const getStatusColor = () => {
    switch (analysis.status) {
      case 'safe':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'suspicious':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'blocked':
        return 'bg-red-100 text-red-800 border-red-200';
    }
  };

  const getProgressColor = () => {
    if (analysis.riskScore >= 70) return 'bg-red-500';
    if (analysis.riskScore >= 30) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  if (viewType === 'customer' && analysis.status !== 'safe') {
    return (
      <Card className="w-full max-w-md border-red-200">
        <CardHeader className="text-center">
          <div className="mx-auto mb-2">
            <XCircle className="h-12 w-12 text-red-600" />
          </div>
          <CardTitle className="text-red-800">Transaction Alert</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert className="border-red-200">
            <AlertTriangle className="h-4 w-4 text-red-600" />
            <AlertDescription>
              Your transaction for <strong>${transaction.amount.toFixed(2)}</strong> at{' '}
              <strong>{transaction.merchant}</strong> has been{' '}
              {analysis.status === 'blocked' ? 'blocked' : 'flagged'} for security review.
            </AlertDescription>
          </Alert>
          
          <div className="text-center space-y-2">
            <p className="text-sm text-muted-foreground">
              This action was taken to protect your account from potential fraud.
            </p>
            {onAppeal && (
              <Button onClick={onAppeal} variant="outline" className="w-full">
                This is a legitimate transaction
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5" />
          Fraud Analysis Result
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {getStatusIcon()}
            <Badge className={getStatusColor()}>
              {analysis.status.toUpperCase()}
            </Badge>
          </div>
          <div className="text-sm text-muted-foreground">
            Confidence: {analysis.confidence.toFixed(1)}%
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Risk Score</span>
            <span>{analysis.riskScore}/100</span>
          </div>
          <Progress 
            value={analysis.riskScore} 
            className="h-2"
            style={{
              ['--progress-background' as any]: getProgressColor()
            }}
          />
        </div>

        <div className="space-y-2">
          <h4 className="font-medium">Transaction Details</h4>
          <div className="text-sm space-y-1 p-3 bg-muted rounded-md">
            <div>Amount: <strong>${transaction.amount.toFixed(2)}</strong></div>
            <div>Merchant: <strong>{transaction.merchant}</strong></div>
            <div>Location: <strong>{transaction.location}</strong></div>
            <div>Card: <strong>{transaction.cardNumber}</strong></div>
            <div>Time: <strong>{transaction.timestamp.toLocaleString()}</strong></div>
          </div>
        </div>

        <div className="space-y-2">
          <h4 className="font-medium">Analysis Factors</h4>
          <ul className="text-sm space-y-1">
            {analysis.reasons.map((reason, index) => (
              <li key={index} className="flex items-start gap-2">
                <span className="text-muted-foreground">•</span>
                <span>{reason}</span>
              </li>
            ))}
          </ul>
        </div>

        {viewType === 'customer' && onAppeal && analysis.status === 'suspicious' && (
          <Button onClick={onAppeal} variant="outline" className="w-full mt-4">
            Appeal This Decision
          </Button>
        )}
      </CardContent>
    </Card>
  );
}