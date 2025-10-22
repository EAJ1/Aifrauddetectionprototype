import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Transaction } from './fraud-detection-service';

interface TransactionFormProps {
  onSubmit: (transaction: Transaction) => void;
}

export function TransactionForm({ onSubmit }: TransactionFormProps) {
  const [formData, setFormData] = useState({
    amount: '',
    location: '',
    merchant: '',
    cardNumber: '',
    customerId: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const transaction: Transaction = {
      id: `TXN-${Date.now()}`,
      amount: parseFloat(formData.amount),
      location: formData.location,
      merchant: formData.merchant,
      timestamp: new Date(),
      cardNumber: formData.cardNumber,
      customerId: formData.customerId
    };

    onSubmit(transaction);
  };

  const updateField = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Test Transaction</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="amount">Amount ($)</Label>
            <Input
              id="amount"
              type="number"
              step="0.01"
              placeholder="100.00"
              value={formData.amount}
              onChange={(e) => updateField('amount', e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="location">Location</Label>
            <Select onValueChange={(value) => updateField('location', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select location" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="New York, NY">New York, NY</SelectItem>
                <SelectItem value="Los Angeles, CA">Los Angeles, CA</SelectItem>
                <SelectItem value="Chicago, IL">Chicago, IL</SelectItem>
                <SelectItem value="Nigeria">Nigeria (High Risk)</SelectItem>
                <SelectItem value="Romania">Romania (High Risk)</SelectItem>
                <SelectItem value="Unknown Location">Unknown Location</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="merchant">Merchant</Label>
            <Select onValueChange={(value) => updateField('merchant', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select merchant" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Amazon.com">Amazon.com</SelectItem>
                <SelectItem value="Starbucks">Starbucks</SelectItem>
                <SelectItem value="ATM Withdrawal">ATM Withdrawal</SelectItem>
                <SelectItem value="Online Gaming Site">Online Gaming Site</SelectItem>
                <SelectItem value="Cryptocurrency Exchange">Cryptocurrency Exchange</SelectItem>
                <SelectItem value="Local Grocery Store">Local Grocery Store</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="cardNumber">Card Number</Label>
            <Input
              id="cardNumber"
              placeholder="****-****-****-1234"
              value={formData.cardNumber}
              onChange={(e) => updateField('cardNumber', e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="customerId">Customer ID</Label>
            <Input
              id="customerId"
              placeholder="CUST-1234"
              value={formData.customerId}
              onChange={(e) => updateField('customerId', e.target.value)}
              required
            />
          </div>

          <Button type="submit" className="w-full">
            Process Transaction
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}