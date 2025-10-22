import { useState } from 'react';
import { AlertTriangle, CheckCircle, XCircle, Eye, TrendingUp, Shield, Users } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { FraudResult } from './fraud-detection-service';
import { FraudResultDisplay } from './FraudResultDisplay';

interface BankDashboardProps {
  transactions: FraudResult[];
}

export function BankDashboard({ transactions }: BankDashboardProps) {
  const [selectedTransaction, setSelectedTransaction] = useState<FraudResult | null>(null);

  const stats = {
    total: transactions.length,
    safe: transactions.filter(t => t.analysis.status === 'safe').length,
    suspicious: transactions.filter(t => t.analysis.status === 'suspicious').length,
    blocked: transactions.filter(t => t.analysis.status === 'blocked').length,
    avgRiskScore: transactions.reduce((sum, t) => sum + t.analysis.riskScore, 0) / transactions.length || 0
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'safe':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'suspicious':
        return <AlertTriangle className="h-4 w-4 text-yellow-600" />;
      case 'blocked':
        return <XCircle className="h-4 w-4 text-red-600" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const colors = {
      safe: 'bg-green-100 text-green-800',
      suspicious: 'bg-yellow-100 text-yellow-800', 
      blocked: 'bg-red-100 text-red-800'
    };
    return <Badge className={colors[status as keyof typeof colors]}>{status.toUpperCase()}</Badge>;
  };

  return (
    <div className="space-y-6">
      {/* Dashboard Header */}
      <div className="flex items-center gap-2 mb-6">
        <Shield className="h-6 w-6 text-primary" />
        <h1>Fraud Detection Dashboard</h1>
        <Badge variant="outline" className="ml-auto">Live Monitoring</Badge>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Transactions</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Safe</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.safe}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Suspicious</CardTitle>
            <AlertTriangle className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{stats.suspicious}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Blocked</CardTitle>
            <XCircle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{stats.blocked}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Risk Score</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.avgRiskScore.toFixed(1)}</div>
          </CardContent>
        </Card>
      </div>

      {/* Transactions Table */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Transactions</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Transaction ID</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Merchant</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Risk Score</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {transactions.slice(0, 10).map((result) => (
                <TableRow key={result.transaction.id}>
                  <TableCell className="font-mono text-sm">
                    {result.transaction.id.substring(0, 12)}...
                  </TableCell>
                  <TableCell>${result.transaction.amount.toFixed(2)}</TableCell>
                  <TableCell>{result.transaction.merchant}</TableCell>
                  <TableCell>{result.transaction.location}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {getStatusIcon(result.analysis.status)}
                      {getStatusBadge(result.analysis.status)}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <span>{result.analysis.riskScore}</span>
                      <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div 
                          className={`h-full ${
                            result.analysis.riskScore >= 70 ? 'bg-red-500' :
                            result.analysis.riskScore >= 30 ? 'bg-yellow-500' : 'bg-green-500'
                          }`}
                          style={{ width: `${result.analysis.riskScore}%` }}
                        />
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => setSelectedTransaction(result)}
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          Details
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl">
                        <DialogHeader>
                          <DialogTitle>Transaction Analysis Details</DialogTitle>
                          <DialogDescription>
                            Detailed fraud analysis for transaction {result.transaction.id}
                          </DialogDescription>
                        </DialogHeader>
                        <FraudResultDisplay result={result} viewType="bank" />
                      </DialogContent>
                    </Dialog>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}