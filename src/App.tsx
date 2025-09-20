import React, { useState } from "react";
import { VendorRegistrationForm } from "./components/VendorRegistrationForm";
import { PaymentPlans } from "./components/PaymentPlans";
import { AdminLogin } from "./components/AdminLogin";
import { AdminDashboard } from "./components/AdminDashboard";
import { SuccessPage } from "./components/SuccessPage";
import { Button } from "./components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "./components/ui/card";
import { Building, Shield, Users } from "lucide-react";
import { Toaster } from "./components/ui/sonner";

type AppState =
  | "home"
  | "registration"
  | "payment"
  | "success"
  | "admin-login"
  | "admin-dashboard";

interface VendorFormData {
  name: string;
  shopName: string;
  phone: string;
  email: string;
  aadhaarNumber: string;
  panNumber: string;
  gstNumber: string;
  address: string;
  location: {
    latitude: number;
    longitude: number;
  } | null;
  manualLatitude: string;
  manualLongitude: string;
  aadhaarImage: File | null;
  panImage: File | null;
  shopImage: File | null;
}

export default function App() {
  const [currentState, setCurrentState] =
    useState<AppState>("home");
  const [vendorData, setVendorData] =
    useState<VendorFormData | null>(null);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);

  const handleVendorRegistration = (data: VendorFormData) => {
    setVendorData(data);
    setCurrentState("payment");
  };

  const handlePaymentSuccess = (planId: string) => {
    if (vendorData) {
      // Save vendor data to localStorage (simulating database)
      const vendorRecord = {
        id: Date.now().toString(),
        ...vendorData,
        plan: planId,
        registrationDate: new Date().toLocaleDateString(),
        status: "pending" as const,
      };

      const existingVendors = JSON.parse(
        localStorage.getItem("registeredVendors") || "[]",
      );
      const updatedVendors = [...existingVendors, vendorRecord];
      localStorage.setItem(
        "registeredVendors",
        JSON.stringify(updatedVendors),
      );

      // Simulate sending email notification (in real app, this would be handled by backend)
      console.log(
        `Email notification sent to: ${vendorData.email}`,
      );

      setCurrentState("success");
    }
  };

  const handleAdminLogin = () => {
    setIsAdminLoggedIn(true);
    setCurrentState("admin-dashboard");
  };

  const handleAdminLogout = () => {
    setIsAdminLoggedIn(false);
    setCurrentState("home");
  };

  const renderCurrentView = () => {
    switch (currentState) {
      case "registration":
        return (
          <VendorRegistrationForm
            onSubmit={handleVendorRegistration}
          />
        );

      case "payment":
        return (
          <PaymentPlans
            onPaymentSuccess={handlePaymentSuccess}
            onBack={() => setCurrentState("registration")}
          />
        );

      case "success":
        return (
          <SuccessPage
            vendorEmail={vendorData?.email || ""}
            onBackToHome={() => setCurrentState("home")}
          />
        );

      case "admin-login":
        return <AdminLogin onLogin={handleAdminLogin} />;

      case "admin-dashboard":
        return <AdminDashboard onLogout={handleAdminLogout} />;

      default:
        return (
          <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-blue-900/20 dark:to-purple-900/20">
            <div className="min-h-screen flex items-center justify-center p-6">
              <div className="max-w-6xl mx-auto">
                {/* Hero Section */}
                <div className="text-center mb-16">
                  <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full mb-8 shadow-lg">
                    <Building className="h-10 w-10 text-white" />
                  </div>
                  <h1 className="text-4xl md:text-6xl mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    Vendor Registration Portal
                  </h1>
                  <p className="text-muted-foreground text-xl mb-8 max-w-2xl mx-auto leading-relaxed">
                    Join our marketplace and grow your business
                    with our comprehensive vendor platform. Get
                    started in minutes and reach thousands of
                    customers.
                  </p>
                </div>

                {/* Action Cards */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
                  <Card className="group relative overflow-hidden border-0 shadow-xl bg-white/90 dark:bg-gray-800/90 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
                    <CardHeader className="pb-4">
                      <div className="relative mb-6">
                        <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow duration-300">
                          <Building className="h-8 w-8 text-white" />
                        </div>
                      </div>
                      <CardTitle className="text-2xl mb-2">
                        Vendor Registration
                      </CardTitle>
                      <p className="text-muted-foreground leading-relaxed">
                        Register your business and start selling
                        on our platform. Complete the
                        registration process, upload your
                        documents, and choose your subscription
                        plan.
                      </p>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <Button
                        onClick={() =>
                          setCurrentState("registration")
                        }
                        className="w-full h-12 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-lg hover:shadow-xl transition-all duration-300"
                        size="lg"
                      >
                        Start Registration
                      </Button>
                    </CardContent>
                  </Card>

                  <Card className="group relative overflow-hidden border-0 shadow-xl bg-white/90 dark:bg-gray-800/90 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
                    <CardHeader className="pb-4">
                      <div className="relative mb-6">
                        <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-purple-700 rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow duration-300">
                          <Shield className="h-8 w-8 text-white" />
                        </div>
                      </div>
                      <CardTitle className="text-2xl mb-2">
                        Admin Dashboard
                      </CardTitle>
                      <p className="text-muted-foreground leading-relaxed">
                        Access the admin panel to manage
                        vendors, view registrations, monitor
                        platform activity, and control vendor
                        approvals.
                      </p>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <Button
                        variant="outline"
                        onClick={() =>
                          setCurrentState("admin-login")
                        }
                        className="w-full h-12 border-2 border-purple-600 text-purple-600 hover:bg-purple-600 hover:text-white shadow-lg hover:shadow-xl transition-all duration-300"
                        size="lg"
                      >
                        Admin Login
                      </Button>
                    </CardContent>
                  </Card>
                </div>

                {/* Features Section */}
                <Card className="border-0 shadow-xl bg-white/90 dark:bg-gray-800/90 overflow-hidden">
                  <CardContent className="relative p-8">
                    <div className="text-center mb-8">
                      <h3 className="text-2xl mb-2 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                        Platform Features
                      </h3>
                      <p className="text-muted-foreground">
                        Everything you need to succeed in our
                        marketplace
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                      <div className="text-center group">
                        <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                          <Users className="h-6 w-6 text-white" />
                        </div>
                        <h4 className="mb-2">
                          Multi-vendor marketplace
                        </h4>
                        <p className="text-sm text-muted-foreground">
                          Connect with thousands of customers on
                          our thriving platform
                        </p>
                      </div>

                      <div className="text-center group">
                        <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                          <Building className="h-6 w-6 text-white" />
                        </div>
                        <h4 className="mb-2">
                          Business analytics
                        </h4>
                        <p className="text-sm text-muted-foreground">
                          Get detailed insights to grow your
                          business effectively
                        </p>
                      </div>

                      <div className="text-center group">
                        <div className="w-12 h-12 bg-gradient-to-r from-pink-500 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                          <Shield className="h-6 w-6 text-white" />
                        </div>
                        <h4 className="mb-2">
                          Secure payment processing
                        </h4>
                        <p className="text-sm text-muted-foreground">
                          Safe and reliable transactions with
                          industry-standard security
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {renderCurrentView()}
      <Toaster />
    </div>
  );
}