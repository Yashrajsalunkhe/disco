import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { 
  DownloadIcon, 
  SearchIcon, 
  RefreshCwIcon, 
  LogOutIcon,
  UsersIcon,
  TrendingUpIcon,
  IndianRupeeIcon,
  CalendarIcon,
  EyeIcon
} from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import * as fileSaver from 'file-saver';

interface TeamMember {
  name: string;
  email: string;
  mobile: string;
  college: string;
}

interface Registration {
  _id: string;
  registrationId: number;
  leaderName: string;
  leaderEmail: string;
  leaderMobile: string;
  leaderCollege: string;
  leaderDepartment: string;
  leaderYear: string;
  leaderCity: string;
  selectedEvent: string;
  paperPresentationDept?: string;
  participationType: 'solo' | 'team';
  teamSize: number;
  teamMembers: TeamMember[];
  paymentId: string;
  orderId: string;
  totalFee: number;
  createdAt: string;
}

interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  totalCount: number;
  limit: number;
}

interface AdminStats {
  overview: {
    totalRegistrations: number;
    soloRegistrations: number;
    teamRegistrations: number;
    totalRevenue: number;
  };
  eventStats: Array<{
    _id: string;
    count: number;
    totalFees: number;
  }>;
  recentRegistrations: Array<{
    _id: string;
    leaderName: string;
    selectedEvent: string;
    createdAt: string;
    totalFee: number;
  }>;
}

const AdminPanel: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [password, setPassword] = useState<string>('');
  const [token, setToken] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [pagination, setPagination] = useState<PaginationInfo>({
    currentPage: 1,
    totalPages: 1,
    totalCount: 0,
    limit: 50
  });
  const [availableEvents, setAvailableEvents] = useState<string[]>([]);
  const [stats, setStats] = useState<AdminStats | null>(null);
  
  // Filters and search
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [eventFilter, setEventFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('createdAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [currentPage, setCurrentPage] = useState<number>(1);
  
  const { toast } = useToast();

  // Use environment variable for API base URL with fallback
  const API_BASE = import.meta.env.VITE_API_BASE_URL || '/api';

  // Check if user is already authenticated
  useEffect(() => {
    const savedToken = localStorage.getItem('adminToken');
    if (savedToken) {
      setToken(savedToken);
      setIsAuthenticated(true);
    }
  }, []);

  // Fetch data when token is set and user is authenticated
  useEffect(() => {
    if (isAuthenticated && token) {
      fetchRegistrations();
      fetchStats();
    }
  }, [isAuthenticated, token]);

  // Handle authentication
  const handleLogin = async () => {
    if (!password.trim()) {
      toast({
        title: "Error",
        description: "Please enter the admin password",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    console.log('Attempting login with API_BASE:', API_BASE);
    
    try {
      const response = await fetch(`${API_BASE}/admin/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ password }),
      });

      console.log('Login response status:', response.status);
      console.log('Login response headers:', response.headers);

      const data = await response.json();
      console.log('Login response data:', data);

      if (data.success) {
        setToken(data.token);
        setIsAuthenticated(true);
        localStorage.setItem('adminToken', data.token);
        toast({
          title: "Success",
          description: "Logged in successfully!",
        });
        console.log('Login successful, fetching data...');
        // Data will be fetched automatically by useEffect when token is set
      } else {
        console.error('Login failed:', data.error);
        toast({
          title: "Error",
          description: data.error || "Invalid password",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Login error:', error);
      toast({
        title: "Error",
        description: `Failed to authenticate: ${error instanceof Error ? error.message : 'Network error'}`,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  // Handle logout
  const handleLogout = () => {
    setIsAuthenticated(false);
    setToken('');
    setPassword('');
    localStorage.removeItem('adminToken');
    setRegistrations([]);
    setStats(null);
    toast({
      title: "Logged out",
      description: "You have been logged out successfully.",
    });
  };

  // Fetch registrations with filters
  const fetchRegistrations = async () => {
    if (!token) return;

    setLoading(true);
    try {
      const params = new URLSearchParams({
        sortBy,
        sortOrder,
        page: currentPage.toString(),
        limit: '50'
      });

      if (eventFilter && eventFilter !== 'all') {
        params.append('eventFilter', eventFilter);
      }

      if (searchTerm.trim()) {
        params.append('search', searchTerm.trim());
      }

      console.log('Fetching registrations from:', `${API_BASE}/admin/registrations?${params}`);
      console.log('Using token:', token ? 'Token present' : 'No token');

      const response = await fetch(`${API_BASE}/admin/registrations?${params}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      console.log('Response status:', response.status);
      console.log('Response headers:', response.headers);

      const data = await response.json();
      console.log('Response data:', data);

      if (data.success) {
        setRegistrations(data.data.registrations);
        setPagination(data.data.pagination);
        setAvailableEvents(data.data.filters.availableEvents);
        console.log('Successfully loaded:', data.data.registrations.length, 'registrations');
      } else {
        console.error('API Error:', data.error);
        toast({
          title: "Error",
          description: data.error || "Failed to fetch registrations",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Fetch error:', error);
      toast({
        title: "Error",
        description: `Failed to fetch registrations: ${error instanceof Error ? error.message : 'Unknown error'}`,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  // Fetch statistics
  const fetchStats = async () => {
    if (!token) return;

    try {
      console.log('Fetching stats from:', `${API_BASE}/admin/stats`);
      
      const response = await fetch(`${API_BASE}/admin/stats`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      console.log('Stats response status:', response.status);
      
      const data = await response.json();
      console.log('Stats data:', data);

      if (data.success) {
        setStats(data.data);
        console.log('Successfully loaded stats');
      } else {
        console.error('Stats API Error:', data.error);
      }
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    }
  };

  // Export to Excel
  const handleExport = async () => {
    if (!token) return;

    setLoading(true);
    try {
      const params = new URLSearchParams();
      
      if (eventFilter && eventFilter !== 'all') {
        params.append('eventFilter', eventFilter);
      }

      const response = await fetch(`${API_BASE}/admin/export?${params}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const blob = await response.blob();
        const fileName = response.headers.get('Content-Disposition')?.split('filename=')[1]?.replace(/"/g, '') || 'registrations.xlsx';
        fileSaver.saveAs(blob, fileName);
        toast({
          title: "Success",
          description: "File downloaded successfully!",
        });
      } else {
        const errorData = await response.json();
        toast({
          title: "Error",
          description: errorData.error || "Failed to export data",
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to export data",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  // Effect for fetching data when filters change
  useEffect(() => {
    if (isAuthenticated && token) {
      fetchRegistrations();
    }
  }, [eventFilter, sortBy, sortOrder, currentPage, searchTerm, isAuthenticated, token]);

  // Login form
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
        {/* Background with theme colors */}
        <div className="absolute inset-0 bg-gradient-to-br from-background via-background/90 to-muted/20"></div>
        
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-20 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-secondary/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 w-80 h-80 bg-accent/10 rounded-full blur-3xl animate-pulse delay-500"></div>
        </div>

        <Card className="w-full max-w-md relative z-10 glass-card border-border/50 bg-card/90 backdrop-blur-xl">
          <CardHeader className="text-center space-y-4">
            <div className="mx-auto w-16 h-16 rounded-full bg-gradient-to-r from-primary to-secondary flex items-center justify-center">
              <UsersIcon className="h-8 w-8 text-white" />
            </div>
            <CardTitle className="text-3xl font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
              Admin Panel
            </CardTitle>
            <CardDescription className="text-muted-foreground">
              Enter admin password to access the Discovery ADCET dashboard
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Input
                type="password"
                placeholder="Admin Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
                className="h-12 bg-background/50 border-border/50 focus:border-primary/50"
              />
            </div>
            <Button 
              onClick={handleLogin} 
              className="w-full h-12 bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-white font-semibold"
              disabled={loading}
            >
              {loading ? (
                <div className="flex items-center space-x-2">
                  <RefreshCwIcon className="h-4 w-4 animate-spin" />
                  <span>Authenticating...</span>
                </div>
              ) : (
                'Access Dashboard'
              )}
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative overflow-hidden bg-background">
      {/* Background with theme colors */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-background via-background/95 to-muted/10"></div>
        
        {/* Animated background elements */}
        <div className="absolute top-10 left-10 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-10 right-10 w-80 h-80 bg-secondary/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/3 right-1/4 w-64 h-64 bg-accent/5 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      <div className="max-w-7xl mx-auto space-y-8 p-6 relative z-10">
        {/* Header */}
        <Card className="glass-card border-border/30 bg-card/90 backdrop-blur-xl">
          <CardHeader className="flex flex-row items-center justify-between">
            <div className="space-y-2">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-primary to-secondary flex items-center justify-center">
                  <UsersIcon className="h-6 w-6 text-white" />
                </div>
                <div>
                  <CardTitle className="text-3xl font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
                    Discovery ADCET
                  </CardTitle>
                  <CardDescription className="text-muted-foreground text-lg">
                    Admin Dashboard - Manage registrations and export data
                  </CardDescription>
                </div>
              </div>
            </div>
            <Button 
              onClick={handleLogout} 
              variant="outline" 
              size="lg"
              className="border-border/50 hover:bg-destructive/10 hover:border-destructive/50 hover:text-destructive"
            >
              <LogOutIcon className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </CardHeader>
        </Card>

        {/* Statistics Cards */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="glass-card border-border/30 bg-card/80 backdrop-blur-xl hover:bg-card/90 transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-muted-foreground">Total Registrations</p>
                    <p className="text-3xl font-bold text-foreground">{stats.overview.totalRegistrations}</p>
                    <p className="text-xs text-muted-foreground">All participants</p>
                  </div>
                  <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                    <UsersIcon className="h-7 w-7 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="glass-card border-border/30 bg-card/80 backdrop-blur-xl hover:bg-card/90 transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-muted-foreground">Solo Registrations</p>
                    <p className="text-3xl font-bold text-foreground">{stats.overview.soloRegistrations}</p>
                    <p className="text-xs text-muted-foreground">Individual participants</p>
                  </div>
                  <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center">
                    <TrendingUpIcon className="h-7 w-7 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="glass-card border-border/30 bg-card/80 backdrop-blur-xl hover:bg-card/90 transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-muted-foreground">Team Registrations</p>
                    <p className="text-3xl font-bold text-foreground">{stats.overview.teamRegistrations}</p>
                    <p className="text-xs text-muted-foreground">Team participants</p>
                  </div>
                  <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center">
                    <TrendingUpIcon className="h-7 w-7 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="glass-card border-border/30 bg-card/80 backdrop-blur-xl hover:bg-card/90 transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-muted-foreground">Total Revenue</p>
                    <p className="text-3xl font-bold text-foreground">₹{stats.overview.totalRevenue.toLocaleString()}</p>
                    <p className="text-xs text-muted-foreground">Registration fees</p>
                  </div>
                  <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-yellow-500 to-yellow-600 flex items-center justify-center">
                    <IndianRupeeIcon className="h-7 w-7 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Controls */}
        <Card className="glass-card border-border/30 bg-card/80 backdrop-blur-xl">
          <CardContent className="p-6">
            <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
              <div className="flex flex-col sm:flex-row gap-4 flex-1">
                <div className="relative">
                  <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search by name, email, mobile, or reg ID..."
                    className="pl-10 w-full sm:w-80 bg-background/50 border-border/50 focus:border-primary/50"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <Select value={eventFilter} onValueChange={setEventFilter}>
                  <SelectTrigger className="w-full sm:w-48 bg-background/50 border-border/50">
                    <SelectValue placeholder="Filter by event" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Events</SelectItem>
                    {availableEvents.map((event) => (
                      <SelectItem key={event} value={event}>{event}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={`${sortBy}-${sortOrder}`} onValueChange={(value) => {
                  const [field, order] = value.split('-');
                  setSortBy(field);
                  setSortOrder(order as 'asc' | 'desc');
                }}>
                  <SelectTrigger className="w-full sm:w-48 bg-background/50 border-border/50">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="createdAt-desc">Newest First</SelectItem>
                    <SelectItem value="createdAt-asc">Oldest First</SelectItem>
                    <SelectItem value="leaderName-asc">Name A-Z</SelectItem>
                    <SelectItem value="leaderName-desc">Name Z-A</SelectItem>
                    <SelectItem value="selectedEvent-asc">Event A-Z</SelectItem>
                    <SelectItem value="totalFee-desc">Highest Fee</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex gap-3">
                <Button 
                  onClick={fetchRegistrations} 
                  variant="outline" 
                  size="lg" 
                  disabled={loading}
                  className="border-border/50 hover:bg-primary/10 hover:border-primary/50"
                >
                  <RefreshCwIcon className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                  Refresh
                </Button>
                <Button 
                  onClick={handleExport} 
                  size="lg" 
                  disabled={loading}
                  className="bg-gradient-to-r from-secondary to-accent hover:from-secondary/90 hover:to-accent/90 text-white"
                >
                  <DownloadIcon className="h-4 w-4 mr-2" />
                  Export Excel
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Registrations Table */}
        <Card className="glass-card border-border/30 bg-card/80 backdrop-blur-xl">
          <CardHeader>
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-primary to-secondary flex items-center justify-center">
                <CalendarIcon className="h-4 w-4 text-white" />
              </div>
              <div>
                <CardTitle className="text-xl font-bold">Registrations ({pagination.totalCount})</CardTitle>
                <CardDescription>
                  Showing {registrations.length} of {pagination.totalCount} registrations
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {registrations.length === 0 ? (
              <Alert>
                <AlertDescription>
                  No registrations found matching your criteria.
                </AlertDescription>
              </Alert>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Reg. ID</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Leader Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Mobile</TableHead>
                      <TableHead>College</TableHead>
                      <TableHead>Event</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Team Size</TableHead>
                      <TableHead>Team Details</TableHead>
                      <TableHead>Fee</TableHead>
                      <TableHead>Payment ID</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {registrations.map((registration) => (
                      <TableRow key={registration._id}>
                        <TableCell className="font-medium text-blue-600">
                          #{registration.registrationId}
                        </TableCell>
                        <TableCell className="font-medium">
                          {new Date(registration.createdAt).toLocaleDateString('en-IN')}
                        </TableCell>
                        <TableCell>{registration.leaderName}</TableCell>
                        <TableCell className="text-sm">{registration.leaderEmail}</TableCell>
                        <TableCell>{registration.leaderMobile}</TableCell>
                        <TableCell className="text-sm">{registration.leaderCollege}</TableCell>
                        <TableCell>
                          <Badge variant="secondary" className="text-xs">
                            {registration.selectedEvent}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant={registration.participationType === 'solo' ? 'default' : 'outline'}>
                            {registration.participationType}
                          </Badge>
                        </TableCell>
                        <TableCell>{registration.teamSize}</TableCell>
                        <TableCell>
                          {registration.participationType === 'team' && registration.teamMembers.length > 0 ? (
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button variant="outline" size="sm" className="h-8 px-3">
                                  <EyeIcon className="h-4 w-4 mr-1" />
                                  View Team
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="max-w-2xl">
                                <DialogHeader>
                                  <DialogTitle className="flex items-center gap-2">
                                    <UsersIcon className="h-5 w-5" />
                                    Team Members - {registration.leaderName}'s Team
                                  </DialogTitle>
                                </DialogHeader>
                                <div className="space-y-4">
                                  <div className="bg-muted/50 p-4 rounded-lg">
                                    <h4 className="font-semibold text-sm text-muted-foreground mb-2">Team Leader</h4>
                                    <div className="grid grid-cols-2 gap-4 text-sm">
                                      <div>
                                        <span className="font-medium">Name:</span> {registration.leaderName}
                                      </div>
                                      <div>
                                        <span className="font-medium">Email:</span> {registration.leaderEmail}
                                      </div>
                                      <div>
                                        <span className="font-medium">Mobile:</span> {registration.leaderMobile}
                                      </div>
                                      <div>
                                        <span className="font-medium">College:</span> {registration.leaderCollege}
                                      </div>
                                    </div>
                                  </div>
                                  {registration.teamMembers.length > 0 && (
                                    <div>
                                      <h4 className="font-semibold text-sm text-muted-foreground mb-3">Team Members ({registration.teamMembers.length})</h4>
                                      <div className="space-y-3">
                                        {registration.teamMembers.map((member, index) => (
                                          <div key={index} className="border rounded-lg p-3 bg-card">
                                            <div className="grid grid-cols-2 gap-3 text-sm">
                                              <div>
                                                <span className="font-medium">Name:</span> {member.name}
                                              </div>
                                              <div>
                                                <span className="font-medium">Email:</span> {member.email}
                                              </div>
                                              <div>
                                                <span className="font-medium">Mobile:</span> {member.mobile}
                                              </div>
                                              <div>
                                                <span className="font-medium">College:</span> {member.college}
                                              </div>
                                            </div>
                                          </div>
                                        ))}
                                      </div>
                                    </div>
                                  )}
                                  <div className="pt-2 text-xs text-muted-foreground">
                                    Total Team Size: {registration.teamSize} members
                                  </div>
                                </div>
                              </DialogContent>
                            </Dialog>
                          ) : (
                            <Badge variant="secondary" className="text-xs">
                              Solo
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell className="font-medium">₹{registration.totalFee}</TableCell>
                        <TableCell className="text-xs font-mono">{registration.paymentId}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}

            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <div className="flex items-center justify-between mt-4">
                <p className="text-sm text-gray-600">
                  Page {pagination.currentPage} of {pagination.totalPages}
                </p>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={pagination.currentPage <= 1}
                    onClick={() => setCurrentPage(pagination.currentPage - 1)}
                  >
                    Previous
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={pagination.currentPage >= pagination.totalPages}
                    onClick={() => setCurrentPage(pagination.currentPage + 1)}
                  >
                    Next
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminPanel;