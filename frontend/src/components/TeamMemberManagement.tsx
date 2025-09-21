// Enhanced team member management component for admin panel
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  MoreHorizontal,
  Eye,
  Download,
  Search,
  Filter,
  Users,
  Phone,
  Mail,
  MapPin,
  GraduationCap,
  Building
} from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { 
  Team,
  ExtendedTeamMember,
  TeamMemberStatistics
} from "@/data/teamMembers";
import {
  searchTeamMembers,
  filterTeamsByEvent,
  filterTeamsByDepartment,
  filterTeamsByPaymentStatus,
  calculateTeamMemberStatistics,
  exportTeamMembersToCSV,
  transformRegistrationToTeam,
  formatTeamMemberDetails,
  formatMobileNumber
} from "@/utils/teamMemberUtils";

interface TeamMemberManagementProps {
  registrations: any[]; // Raw registration data from API
  availableEvents: string[];
  onExportData?: (csvData: string) => void;
}

export const TeamMemberManagement: React.FC<TeamMemberManagementProps> = ({
  registrations,
  availableEvents,
  onExportData
}) => {
  const [teams, setTeams] = useState<Team[]>([]);
  const [filteredTeams, setFilteredTeams] = useState<Team[]>([]);
  const [statistics, setStatistics] = useState<TeamMemberStatistics | null>(null);
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);
  
  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [eventFilter, setEventFilter] = useState('all');
  const [departmentFilter, setDepartmentFilter] = useState('all');
  const [paymentFilter, setPaymentFilter] = useState('all');

  // Transform registrations to teams on component mount or when registrations change
  useEffect(() => {
    const transformedTeams = registrations.map(reg => transformRegistrationToTeam(reg));
    setTeams(transformedTeams);
    
    // Calculate statistics
    const stats = calculateTeamMemberStatistics(transformedTeams);
    setStatistics(stats);
  }, [registrations]);

  // Apply filters whenever teams or filter values change
  useEffect(() => {
    let filtered = teams;
    
    // Apply search filter
    filtered = searchTeamMembers(filtered, searchTerm);
    
    // Apply event filter
    filtered = filterTeamsByEvent(filtered, eventFilter);
    
    // Apply department filter
    filtered = filterTeamsByDepartment(filtered, departmentFilter);
    
    // Apply payment status filter
    filtered = filterTeamsByPaymentStatus(filtered, paymentFilter);
    
    setFilteredTeams(filtered);
  }, [teams, searchTerm, eventFilter, departmentFilter, paymentFilter]);

  const handleExportCSV = () => {
    const csvData = exportTeamMembersToCSV(filteredTeams);
    if (onExportData) {
      onExportData(csvData);
    } else {
      // Default download behavior
      const blob = new Blob([csvData], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `team-members-${new Date().toISOString().split('T')[0]}.csv`;
      a.click();
      window.URL.revokeObjectURL(url);
    }
  };

  const handleViewDetails = (team: Team) => {
    setSelectedTeam(team);
    setShowDetailsDialog(true);
  };

  const getAvailableDepartments = () => {
    const departments = new Set(teams.map(team => team.leader.department));
    return Array.from(departments);
  };

  const formatPaymentStatus = (status: string) => {
    const statusColors = {
      pending: 'bg-yellow-500',
      paid: 'bg-green-500',
      failed: 'bg-red-500',
      refunded: 'bg-gray-500'
    };
    return (
      <Badge className={`${statusColors[status as keyof typeof statusColors] || 'bg-gray-500'} text-white`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  const formatTeamStatus = (status: string) => {
    const statusColors = {
      forming: 'bg-blue-500',
      complete: 'bg-green-500',
      registered: 'bg-purple-500',
      cancelled: 'bg-red-500'
    };
    return (
      <Badge className={`${statusColors[status as keyof typeof statusColors] || 'bg-gray-500'} text-white`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  return (
    <div className="space-y-6">
      {/* Statistics Cards */}
      {statistics && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Participants</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{statistics.totalMembers}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Team Registrations</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{statistics.teamParticipations}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Solo Registrations</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{statistics.soloParticipations}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg Team Size</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{statistics.averageTeamSize}</div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Filters and Search */}
      <Card>
        <CardHeader>
          <CardTitle>Team Member Management</CardTitle>
          <CardDescription>
            Manage and view detailed information about team members and registrations
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 mb-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search teams, members, events..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>
            
            <Select value={eventFilter} onValueChange={setEventFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by event" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Events</SelectItem>
                {availableEvents.map((event) => (
                  <SelectItem key={event} value={event}>
                    {event}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by department" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Departments</SelectItem>
                {getAvailableDepartments().map((dept) => (
                  <SelectItem key={dept} value={dept}>
                    {dept}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Select value={paymentFilter} onValueChange={setPaymentFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Payment status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Payments</SelectItem>
                <SelectItem value="paid">Paid</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="failed">Failed</SelectItem>
                <SelectItem value="refunded">Refunded</SelectItem>
              </SelectContent>
            </Select>
            
            <Button onClick={handleExportCSV} variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Export CSV
            </Button>
          </div>

          {/* Teams Table */}
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Team Leader</TableHead>
                  <TableHead>Event</TableHead>
                  <TableHead>Team Size</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead>Payment Status</TableHead>
                  <TableHead>Team Status</TableHead>
                  <TableHead>Registration Date</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTeams.map((team) => (
                  <TableRow key={team.id}>
                    <TableCell>
                      <div className="font-medium">{team.leader.name}</div>
                      <div className="text-sm text-muted-foreground">{team.leader.email}</div>
                    </TableCell>
                    <TableCell>{team.event}</TableCell>
                    <TableCell>{team.currentSize}</TableCell>
                    <TableCell>{team.leader.department}</TableCell>
                    <TableCell>{formatPaymentStatus(team.paymentStatus)}</TableCell>
                    <TableCell>{formatTeamStatus(team.status)}</TableCell>
                    <TableCell>{team.registrationDate.toLocaleDateString()}</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleViewDetails(team)}>
                            <Eye className="h-4 w-4 mr-2" />
                            View Details
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Team Details Dialog */}
      <Dialog open={showDetailsDialog} onOpenChange={setShowDetailsDialog}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Team Details</DialogTitle>
            <DialogDescription>
              Complete information about the team and its members
            </DialogDescription>
          </DialogHeader>
          
          {selectedTeam && (
            <Tabs defaultValue="leader" className="space-y-4">
              <TabsList>
                <TabsTrigger value="leader">Team Leader</TabsTrigger>
                <TabsTrigger value="members">Team Members ({selectedTeam.members.length})</TabsTrigger>
                <TabsTrigger value="event">Event Details</TabsTrigger>
              </TabsList>
              
              <TabsContent value="leader" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <GraduationCap className="h-5 w-5" />
                      Team Leader Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-muted-foreground">Name</label>
                        <p className="font-medium">{selectedTeam.leader.name}</p>
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-muted-foreground">Student ID</label>
                        <p>{selectedTeam.leader.studentId || 'Not provided'}</p>
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-muted-foreground">Email</label>
                        <p className="flex items-center gap-2">
                          <Mail className="h-4 w-4" />
                          {selectedTeam.leader.email}
                        </p>
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-muted-foreground">Mobile</label>
                        <p className="flex items-center gap-2">
                          <Phone className="h-4 w-4" />
                          {formatMobileNumber(selectedTeam.leader.mobile)}
                        </p>
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-muted-foreground">College</label>
                        <p className="flex items-center gap-2">
                          <Building className="h-4 w-4" />
                          {selectedTeam.leader.college}
                        </p>
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-muted-foreground">Department</label>
                        <p>{selectedTeam.leader.department}</p>
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-muted-foreground">Year</label>
                        <p>{selectedTeam.leader.year}</p>
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-muted-foreground">City</label>
                        <p className="flex items-center gap-2">
                          <MapPin className="h-4 w-4" />
                          {selectedTeam.leader.city}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="members" className="space-y-4">
                {selectedTeam.members.length > 0 ? (
                  selectedTeam.members.map((member, index) => (
                    <Card key={index}>
                      <CardHeader>
                        <CardTitle className="text-lg">Member {index + 1}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <label className="text-sm font-medium text-muted-foreground">Name</label>
                            <p className="font-medium">{member.name}</p>
                          </div>
                          <div className="space-y-2">
                            <label className="text-sm font-medium text-muted-foreground">Email</label>
                            <p className="flex items-center gap-2">
                              <Mail className="h-4 w-4" />
                              {member.email}
                            </p>
                          </div>
                          <div className="space-y-2">
                            <label className="text-sm font-medium text-muted-foreground">Mobile</label>
                            <p className="flex items-center gap-2">
                              <Phone className="h-4 w-4" />
                              {formatMobileNumber(member.mobile)}
                            </p>
                          </div>
                          <div className="space-y-2">
                            <label className="text-sm font-medium text-muted-foreground">College</label>
                            <p className="flex items-center gap-2">
                              <Building className="h-4 w-4" />
                              {member.college}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                ) : (
                  <Card>
                    <CardContent className="text-center py-8">
                      <p className="text-muted-foreground">This is a solo registration - no team members.</p>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>
              
              <TabsContent value="event" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Event & Registration Details</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-muted-foreground">Event</label>
                        <p className="font-medium">{selectedTeam.event}</p>
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-muted-foreground">Participation Type</label>
                        <p>{selectedTeam.currentSize === 1 ? 'Solo' : 'Team'}</p>
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-muted-foreground">Team Size</label>
                        <p>{selectedTeam.currentSize}</p>
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-muted-foreground">Total Fee</label>
                        <p className="font-medium">₹{selectedTeam.totalFee}</p>
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-muted-foreground">Payment Status</label>
                        <div>{formatPaymentStatus(selectedTeam.paymentStatus)}</div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-muted-foreground">Team Status</label>
                        <div>{formatTeamStatus(selectedTeam.status)}</div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-muted-foreground">Registration Date</label>
                        <p>{selectedTeam.registrationDate.toLocaleDateString()}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TeamMemberManagement;