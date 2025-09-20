import React, { useState, useEffect } from "react";
import { Button } from "./ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Badge } from "./ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import {
  Users,
  Search,
  Filter,
  Download,
  Eye,
  LogOut,
  Building,
  Phone,
  Mail,
  MapPin,
  Calendar,
} from "lucide-react";
import { toast } from "sonner@2.0.3";

interface VendorData {
  id: string;
  name: string;
  shopName: string;
  phone: string;
  email: string;
  gstNumber: string;
  address: string;
  location: { latitude: number; longitude: number } | null;
  plan: string;
  registrationDate: string;
  status: "active" | "pending" | "suspended";
}

interface AdminDashboardProps {
  onLogout: () => void;
}

export function AdminDashboard({
  onLogout,
}: AdminDashboardProps) {
  const [vendors, setVendors] = useState<VendorData[]>([]);
  const [filteredVendors, setFilteredVendors] = useState<
    VendorData[]
  >([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] =
    useState<string>("all");
  const [selectedVendor, setSelectedVendor] =
    useState<VendorData | null>(null);

  useEffect(() => {
    // Load vendors from localStorage (simulating database)
    const storedVendors = localStorage.getItem(
      "registeredVendors",
    );
    if (storedVendors) {
      const vendorList = JSON.parse(storedVendors);
      setVendors(vendorList);
      setFilteredVendors(vendorList);
    }
  }, []);

  useEffect(() => {
    // Filter vendors based on search and status
    let filtered = vendors;

    if (searchTerm) {
      filtered = filtered.filter(
        (vendor) =>
          vendor.name
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          vendor.shopName
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          vendor.email
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          vendor.phone.includes(searchTerm),
      );
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter(
        (vendor) => vendor.status === statusFilter,
      );
    }

    setFilteredVendors(filtered);
  }, [searchTerm, statusFilter, vendors]);

  const exportToCSV = () => {
    const headers = [
      "Name",
      "Shop Name",
      "Phone",
      "Email",
      "GST Number",
      "Plan",
      "Status",
      "Registration Date",
    ];
    const csvContent = [
      headers.join(","),
      ...filteredVendors.map((vendor) =>
        [
          vendor.name,
          vendor.shopName,
          vendor.phone,
          vendor.email,
          vendor.gstNumber,
          vendor.plan,
          vendor.status,
          vendor.registrationDate,
        ].join(","),
      ),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "vendors.csv";
    a.click();
    window.URL.revokeObjectURL(url);
    toast.success("Vendor data exported successfully!");
  };

  const updateVendorStatus = (
    vendorId: string,
    newStatus: "active" | "pending" | "suspended",
  ) => {
    const updatedVendors = vendors.map((vendor) =>
      vendor.id === vendorId
        ? { ...vendor, status: newStatus }
        : vendor,
    );
    setVendors(updatedVendors);
    localStorage.setItem(
      "registeredVendors",
      JSON.stringify(updatedVendors),
    );
    toast.success(`Vendor status updated to ${newStatus}`);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-500";
      case "pending":
        return "bg-yellow-500";
      case "suspended":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="flex items-center justify-between p-6">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 bg-primary rounded-full flex items-center justify-center">
              <Users className="h-4 w-4 text-primary-foreground" />
            </div>
            <h1>Vendor Management Dashboard</h1>
          </div>
          <Button variant="outline" onClick={onLogout}>
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </div>
      </header>

      <div className="p-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">
                    Total Vendors
                  </p>
                  <p className="text-2xl">{vendors.length}</p>
                </div>
                <Users className="h-8 w-8 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">
                    Active Vendors
                  </p>
                  <p className="text-2xl">
                    {
                      vendors.filter(
                        (v) => v.status === "active",
                      ).length
                    }
                  </p>
                </div>
                <div className="h-3 w-3 bg-green-500 rounded-full"></div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">
                    Pending Approval
                  </p>
                  <p className="text-2xl">
                    {
                      vendors.filter(
                        (v) => v.status === "pending",
                      ).length
                    }
                  </p>
                </div>
                <div className="h-3 w-3 bg-yellow-500 rounded-full"></div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">
                    Suspended
                  </p>
                  <p className="text-2xl">
                    {
                      vendors.filter(
                        (v) => v.status === "suspended",
                      ).length
                    }
                  </p>
                </div>
                <div className="h-3 w-3 bg-red-500 rounded-full"></div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Search */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Vendor List</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4 mb-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search vendors..."
                    value={searchTerm}
                    onChange={(e) =>
                      setSearchTerm(e.target.value)
                    }
                    className="pl-10"
                  />
                </div>
              </div>

              <Select
                value={statusFilter}
                onValueChange={setStatusFilter}
              >
                <SelectTrigger className="w-48">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">
                    All Status
                  </SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="pending">
                    Pending
                  </SelectItem>
                  <SelectItem value="suspended">
                    Suspended
                  </SelectItem>
                </SelectContent>
              </Select>

              <Button onClick={exportToCSV} variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Export CSV
              </Button>
            </div>

            {/* Vendors Table */}
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Vendor</TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead>Plan</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Registration Date</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredVendors.map((vendor) => (
                    <TableRow key={vendor.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">
                            {vendor.name}
                          </div>
                          <div className="text-sm text-muted-foreground flex items-center gap-1">
                            <Building className="h-3 w-3" />
                            {vendor.shopName}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="text-sm flex items-center gap-1">
                            <Phone className="h-3 w-3" />
                            {vendor.phone}
                          </div>
                          <div className="text-sm flex items-center gap-1">
                            <Mail className="h-3 w-3" />
                            {vendor.email}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary">
                          {vendor.plan}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Select
                          value={vendor.status}
                          onValueChange={(value) =>
                            updateVendorStatus(
                              vendor.id,
                              value as any,
                            )
                          }
                        >
                          <SelectTrigger className="w-32">
                            <div className="flex items-center gap-2">
                              <div
                                className={`h-2 w-2 rounded-full ${getStatusColor(vendor.status)}`}
                              ></div>
                              <SelectValue />
                            </div>
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="active">
                              Active
                            </SelectItem>
                            <SelectItem value="pending">
                              Pending
                            </SelectItem>
                            <SelectItem value="suspended">
                              Suspended
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1 text-sm">
                          <Calendar className="h-3 w-3" />
                          {vendor.registrationDate}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            setSelectedVendor(vendor)
                          }
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {filteredVendors.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                No vendors found matching your criteria.
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Vendor Detail Modal */}
      {selectedVendor && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Vendor Details</CardTitle>
                <Button
                  variant="outline"
                  onClick={() => setSelectedVendor(null)}
                >
                  Close
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Name</Label>
                  <p className="text-sm">
                    {selectedVendor.name}
                  </p>
                </div>
                <div>
                  <Label>Shop Name</Label>
                  <p className="text-sm">
                    {selectedVendor.shopName}
                  </p>
                </div>
                <div>
                  <Label>Phone</Label>
                  <p className="text-sm">
                    {selectedVendor.phone}
                  </p>
                </div>
                <div>
                  <Label>Email</Label>
                  <p className="text-sm">
                    {selectedVendor.email}
                  </p>
                </div>
                <div>
                  <Label>GST Number</Label>
                  <p className="text-sm">
                    {selectedVendor.gstNumber}
                  </p>
                </div>
                <div>
                  <Label>Plan</Label>
                  <Badge>{selectedVendor.plan}</Badge>
                </div>
              </div>

              <div>
                <Label>Address</Label>
                <p className="text-sm">
                  {selectedVendor.address}
                </p>
              </div>

              {selectedVendor.location && (
                <div>
                  <Label className="flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    Location Coordinates
                  </Label>
                  <p className="text-sm">
                    Latitude: {selectedVendor.location.latitude}
                    , Longitude:{" "}
                    {selectedVendor.location.longitude}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}