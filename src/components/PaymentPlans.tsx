import React, { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Check, CreditCard, Star, Shield } from 'lucide-react';
import { toast } from 'sonner@2.0.3';

interface Plan {
  id: string;
  name: string;
  price: number;
  duration: string;
  features: string[];
  popular?: boolean;
  savings?: string;
}

interface PaymentPlansProps {
  onPaymentSuccess: (planId: string) => void;
  onBack: () => void;
}

const plans: Plan[] = [
  {
    id: 'basic',
    name: 'Basic Plan',
    price: 999,
    duration: '1 Month',
    features: [
      'Basic vendor profile',
      'Product listing (up to 50 items)',
      'Basic analytics',
      'Email support',
      'Mobile app access'
    ]
  },
  {
    id: 'premium',
    name: 'Premium Plan',
    price: 2499,
    duration: '3 Months',
    popular: true,
    savings: 'Save ₹1,498',
    features: [
      'Enhanced vendor profile',
      'Product listing (up to 200 items)',
      'Advanced analytics',
      'Priority support',
      'Mobile app access',
      'Featured shop placement',
      'Bulk product upload',
      'Customer insights'
    ]
  },
  {
    id: 'enterprise',
    name: 'Enterprise Plan',
    price: 4999,
    duration: '6 Months',
    savings: 'Save ₹3,995',
    features: [
      'Premium vendor profile',
      'Unlimited product listings',
      'Comprehensive analytics',
      '24/7 dedicated support',
      'Mobile app access',
      'Top shop placement',
      'Bulk operations',
      'Advanced customer insights',
      'Marketing tools',
      'API access',
      'Custom branding'
    ]
  }
];

export function PaymentPlans({ onPaymentSuccess, onBack }: PaymentPlansProps) {
  const [selectedPlan, setSelectedPlan] = useState<string>('premium');
  const [processing, setProcessing] = useState(false);

  const handlePayment = async (planId: string) => {
    setProcessing(true);
    
    // Simulate payment processing
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Simulate success (in real implementation, this would integrate with payment gateway)
      toast.success('Payment successful! Registration completed.');
      onPaymentSuccess(planId);
    } catch (error) {
      toast.error('Payment failed. Please try again.');
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-blue-900/20 dark:to-purple-900/20">
      <div className="p-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full mb-6 shadow-lg">
              <CreditCard className="h-8 w-8 text-white" />
            </div>
            <h2 className="text-3xl mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Choose Your Subscription Plan</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Select the plan that best fits your business needs and start selling immediately
            </p>
            <div className="mt-6 inline-flex items-center gap-2 px-4 py-2 bg-green-100 dark:bg-green-900/20 rounded-full">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-sm text-green-700 dark:text-green-300">Step 2 of 2</span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
            {plans.map((plan) => (
              <Card 
                key={plan.id} 
                className={`relative cursor-pointer transition-all duration-300 border-0 shadow-xl bg-white/90 dark:bg-gray-800/90 hover:-translate-y-2 ${
                  selectedPlan === plan.id 
                    ? 'ring-4 ring-blue-500/50 shadow-2xl scale-105' 
                    : 'hover:shadow-2xl'
                } ${plan.popular ? 'ring-2 ring-purple-500' : ''}`}
                onClick={() => setSelectedPlan(plan.id)}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg px-4 py-1">
                      <Star className="h-3 w-3 mr-1 fill-current" />
                      Most Popular
                    </Badge>
                  </div>
                )}
            
                <CardHeader className="text-center pb-4">
                  <CardTitle className="text-2xl mb-2">{plan.name}</CardTitle>
                  <div className="mt-4 mb-4">
                    <span className="text-4xl bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                      ₹{plan.price.toLocaleString()}
                    </span>
                    <span className="text-muted-foreground text-lg">/{plan.duration}</span>
                  </div>
                  {plan.savings && (
                    <Badge variant="secondary" className="bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-300">
                      {plan.savings}
                    </Badge>
                  )}
                </CardHeader>
            
                <CardContent className="pt-0">
                  <ul className="space-y-4">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <div className="w-5 h-5 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center mt-0.5 flex-shrink-0">
                          <Check className="h-3 w-3 text-white" />
                        </div>
                        <span className="text-sm leading-relaxed">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row justify-center gap-4 mb-8">
            <Button 
              variant="outline" 
              onClick={onBack}
              className="h-12 px-8 border-2 hover:bg-muted"
              size="lg"
            >
              Back to Registration
            </Button>
            <Button 
              onClick={() => handlePayment(selectedPlan)}
              disabled={processing}
              className="h-12 px-8 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-300 min-w-48"
              size="lg"
            >
              <CreditCard className="h-4 w-4 mr-2" />
              {processing ? 'Processing...' : `Pay ₹${plans.find(p => p.id === selectedPlan)?.price.toLocaleString()}`}
            </Button>
          </div>

          <div className="text-center">
            <Card className="inline-block border-0 shadow-lg bg-white/90 dark:bg-gray-800/90 p-6">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Shield className="h-5 w-5 text-green-500" />
                <span className="text-sm">100% Secure Payment</span>
              </div>
              <p className="text-xs text-muted-foreground mb-1">Powered by industry-standard encryption</p>
              <p className="text-xs text-muted-foreground">All plans include a 7-day money-back guarantee</p>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}