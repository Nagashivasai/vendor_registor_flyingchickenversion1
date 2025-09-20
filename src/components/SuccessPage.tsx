import React from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { CheckCircle, Mail, Home } from 'lucide-react';

interface SuccessPageProps {
  vendorEmail: string;
  onBackToHome: () => void;
}

export function SuccessPage({ vendorEmail, onBackToHome }: SuccessPageProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 dark:from-gray-900 dark:via-green-900/20 dark:to-purple-900/20">
      <div className="min-h-screen flex items-center justify-center p-6">
        <Card className="w-full max-w-lg text-center border-0 shadow-2xl bg-white/95 dark:bg-gray-800/95">
          <CardHeader className="pb-6">
            <div className="mx-auto mb-6 h-20 w-20 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center shadow-lg animate-pulse">
              <CheckCircle className="h-10 w-10 text-white" />
            </div>
            <CardTitle className="text-2xl bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
              Registration Successful!
            </CardTitle>
          </CardHeader>
        
          <CardContent className="space-y-6 pt-0">
            <p className="text-muted-foreground text-lg leading-relaxed">
              Thank you for registering with us. Your vendor account has been created successfully and is now under review.
            </p>
            
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 p-6 rounded-xl border border-blue-200/50 dark:border-blue-800/50">
              <div className="flex items-center justify-center gap-2 mb-3">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                  <Mail className="h-4 w-4 text-white" />
                </div>
                <span className="text-lg">Confirmation Email Sent</span>
              </div>
              <p className="text-sm text-muted-foreground mb-2">
                A confirmation email with your registration details has been sent to:
              </p>
              <p className="text-blue-600 dark:text-blue-400 break-all">{vendorEmail}</p>
            </div>
            
            <div className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 p-6 rounded-xl border border-green-200/50 dark:border-green-800/50">
              <h4 className="mb-4 flex items-center gap-2">
                <div className="w-6 h-6 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center">
                  <CheckCircle className="h-3 w-3 text-white" />
                </div>
                What's Next?
              </h4>
              <ul className="text-sm text-muted-foreground space-y-2">
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  Check your email for confirmation details
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  Admin will review your application within 24 hours
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                  You'll receive activation notification via email
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                  Start selling once your account is approved
                </li>
              </ul>
            </div>
            
            <Button 
              onClick={onBackToHome} 
              className="w-full h-12 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-300"
              size="lg"
            >
              <Home className="h-4 w-4 mr-2" />
              Back to Home
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}