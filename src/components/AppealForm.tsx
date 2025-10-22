import { useState } from 'react';
import { CheckCircle, FileText, Send } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { Alert, AlertDescription } from './ui/alert';
import { FraudResult } from './fraud-detection-service';

interface AppealFormProps {
  transaction: FraudResult;
  onSubmit: (appealData: AppealData) => void;
  onCancel: () => void;
}

export interface AppealData {
  transactionId: string;
  reason: string;
  explanation: string;
  verificationMethod: string;
}

export function AppealForm({ transaction, onSubmit, onCancel }: AppealFormProps) {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    reason: '',
    explanation: '',
    verificationMethod: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const appealData: AppealData = {
      transactionId: transaction.transaction.id,
      reason: formData.reason,
      explanation: formData.explanation,
      verificationMethod: formData.verificationMethod
    };

    onSubmit(appealData);
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <Card className="w-full max-w-lg">
        <CardHeader className="text-center">
          <div className="mx-auto mb-2">
            <CheckCircle className="h-12 w-12 text-green-600" />
          </div>
          <CardTitle className="text-green-800">Appeal Submitted</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-center">
          <Alert className="border-green-200">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertDescription>
              Your appeal has been submitted successfully. Our security team will review your case within 2-4 business hours.
            </AlertDescription>
          </Alert>
          
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">
              Appeal Reference: <strong>APL-{transaction.transaction.id.slice(-8)}</strong>
            </p>
            <p className="text-sm text-muted-foreground">
              You will receive an email notification once the review is complete.
            </p>
          </div>

          <Button onClick={onCancel} className="w-full">
            Close
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Appeal Transaction Decision
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label>Transaction Details</Label>
            <div className="p-3 bg-muted rounded-md text-sm space-y-1">
              <div>Amount: <strong>${transaction.transaction.amount.toFixed(2)}</strong></div>
              <div>Merchant: <strong>{transaction.transaction.merchant}</strong></div>
              <div>Location: <strong>{transaction.transaction.location}</strong></div>
              <div>Date: <strong>{transaction.transaction.timestamp.toLocaleString()}</strong></div>
            </div>
          </div>

          <div className="space-y-3">
            <Label>Why was this transaction legitimate?</Label>
            <RadioGroup 
              value={formData.reason}
              onValueChange={(value) => setFormData(prev => ({ ...prev, reason: value }))}
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="authorized-purchase" id="authorized-purchase" />
                <Label htmlFor="authorized-purchase">This was an authorized purchase I made</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="family-member" id="family-member" />
                <Label htmlFor="family-member">Purchase made by authorized family member</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="business-travel" id="business-travel" />
                <Label htmlFor="business-travel">Business travel or relocation</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="recurring-payment" id="recurring-payment" />
                <Label htmlFor="recurring-payment">Recurring payment or subscription</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="other" id="other" />
                <Label htmlFor="other">Other reason</Label>
              </div>
            </RadioGroup>
          </div>

          <div className="space-y-2">
            <Label htmlFor="explanation">Additional Details</Label>
            <Textarea
              id="explanation"
              placeholder="Please provide any additional context that would help verify this transaction..."
              value={formData.explanation}
              onChange={(e) => setFormData(prev => ({ ...prev, explanation: e.target.value }))}
              rows={4}
            />
          </div>

          <div className="space-y-3">
            <Label>Verification Method</Label>
            <RadioGroup 
              value={formData.verificationMethod}
              onValueChange={(value) => setFormData(prev => ({ ...prev, verificationMethod: value }))}
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="sms" id="sms" />
                <Label htmlFor="sms">SMS verification to registered phone</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="email" id="email" />
                <Label htmlFor="email">Email verification to registered email</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="phone-call" id="phone-call" />
                <Label htmlFor="phone-call">Phone call verification</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="branch-visit" id="branch-visit" />
                <Label htmlFor="branch-visit">In-person verification at branch</Label>
              </div>
            </RadioGroup>
          </div>

          <div className="flex gap-3">
            <Button type="button" variant="outline" onClick={onCancel} className="flex-1">
              Cancel
            </Button>
            <Button 
              type="submit" 
              className="flex-1"
              disabled={!formData.reason || !formData.verificationMethod}
            >
              <Send className="h-4 w-4 mr-2" />
              Submit Appeal
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}