// Enhanced registration form for team members with extended data collection
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  FormField, 
  FormItem, 
  FormLabel, 
  FormControl, 
  FormMessage,
  Form 
} from "@/components/ui/form";
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  GraduationCap, 
  Building, 
  Users,
  AlertCircle,
  Plus,
  Trash2,
  Info
} from "lucide-react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { 
  DEPARTMENTS, 
  ACADEMIC_YEARS, 
  TSHIRT_SIZES, 
  DIETARY_RESTRICTIONS,
  EMERGENCY_CONTACT_RELATIONS,
  ExtendedTeamMember 
} from "@/data/teamMembers";
import { 
  validateExtendedTeamMember,
  formatMobileNumber 
} from "@/utils/teamMemberUtils";

// Enhanced validation schemas
const emergencyContactSchema = z.object({
  name: z.string().min(2, "Emergency contact name must be at least 2 characters"),
  mobile: z.string().regex(/^\d{10,15}$/, "Mobile number should contain only digits"),
  relation: z.string().min(1, "Please select relation")
});

const enhancedTeamMemberSchema = z.object({
  // Basic fields
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  mobile: z.string().regex(/^\d{10,15}$/, "Mobile number should contain only digits"),
  college: z.string().min(2, "Please enter college name"),
  
  // Enhanced fields
  department: z.enum(DEPARTMENTS as any),
  year: z.enum(ACADEMIC_YEARS as any),
  city: z.string().min(2, "Please enter city name"),
  studentId: z.string().optional(),
  
  // Optional extended fields
  emergencyContact: emergencyContactSchema.optional(),
  dietaryRestrictions: z.array(z.enum(DIETARY_RESTRICTIONS as any)).optional(),
  tshirtSize: z.enum(TSHIRT_SIZES as any).optional(),
  accommodationNeeded: z.boolean().optional(),
  previousParticipation: z.array(z.string()).optional(),
  
  // Special requirements
  specialRequirements: z.string().optional()
});

export type EnhancedTeamMemberFormData = z.infer<typeof enhancedTeamMemberSchema>;

interface EnhancedTeamMemberFormProps {
  initialData?: Partial<ExtendedTeamMember>;
  onSubmit: (data: EnhancedTeamMemberFormData) => void;
  onCancel?: () => void;
  isLeader?: boolean;
  showExtendedFields?: boolean;
  maxTeamSize?: number;
  eventId?: string;
}

export const EnhancedTeamMemberForm: React.FC<EnhancedTeamMemberFormProps> = ({
  initialData,
  onSubmit,
  onCancel,
  isLeader = false,
  showExtendedFields = false,
  maxTeamSize = 4,
  eventId
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showEmergencyContact, setShowEmergencyContact] = useState(false);
  
  const form = useForm<EnhancedTeamMemberFormData>({
    resolver: zodResolver(enhancedTeamMemberSchema),
    defaultValues: {
      name: initialData?.name || "",
      email: initialData?.email || "",
      mobile: initialData?.mobile || "",
      college: initialData?.college || "",
      department: initialData?.department || undefined,
      year: initialData?.year || undefined,
      city: initialData?.city || "",
      studentId: initialData?.studentId || "",
      emergencyContact: initialData?.emergencyContact || undefined,
      dietaryRestrictions: initialData?.dietaryRestrictions || [],
      tshirtSize: initialData?.tshirtSize || undefined,
      accommodationNeeded: initialData?.accommodationNeeded || false,
      previousParticipation: initialData?.previousParticipation || [],
      specialRequirements: ""
    }
  });

  const handleSubmit = async (data: EnhancedTeamMemberFormData) => {
    try {
      setIsSubmitting(true);
      await onSubmit(data);
    } catch (error) {
      console.error("Form submission error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {isLeader ? <GraduationCap className="h-5 w-5" /> : <User className="h-5 w-5" />}
          {isLeader ? "Team Leader Information" : "Team Member Information"}
        </CardTitle>
        <CardDescription>
          {showExtendedFields 
            ? "Please provide detailed information for enhanced event management"
            : "Please provide basic information for registration"
          }
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            
            {/* Basic Information Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <User className="h-4 w-4" />
                Basic Information
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name *</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter full name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="studentId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Student ID</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter student ID" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email Address *</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="Enter email address" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="mobile"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Mobile Number *</FormLabel>
                      <FormControl>
                        <Input 
                          type="tel" 
                          placeholder="9876543210" 
                          {...field}
                          onChange={(e) => {
                            // Remove non-digits
                            const value = e.target.value.replace(/\D/g, '');
                            field.onChange(value);
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <Separator />

            {/* Academic Information Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <GraduationCap className="h-4 w-4" />
                Academic Information
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="college"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>College/Institution *</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter college name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="department"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Department *</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select department" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {DEPARTMENTS.map((dept) => (
                            <SelectItem key={dept} value={dept}>
                              {dept}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="year"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Academic Year *</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select year" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {ACADEMIC_YEARS.map((year) => (
                            <SelectItem key={year} value={year}>
                              {year}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="city"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>City *</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter city" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Extended Fields Section (Optional) */}
            {showExtendedFields && (
              <>
                <Separator />
                
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <Info className="h-4 w-4" />
                    Additional Information
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="tshirtSize"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>T-Shirt Size</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select size" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {TSHIRT_SIZES.map((size) => (
                                <SelectItem key={size} value={size}>
                                  {size}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="accommodationNeeded"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel>
                              Accommodation Required
                            </FormLabel>
                            <p className="text-xs text-muted-foreground">
                              Check if you need accommodation arrangements
                            </p>
                          </div>
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Dietary Restrictions */}
                  <FormField
                    control={form.control}
                    name="dietaryRestrictions"
                    render={() => (
                      <FormItem>
                        <div className="mb-4">
                          <FormLabel className="text-base">Dietary Restrictions</FormLabel>
                          <p className="text-xs text-muted-foreground">
                            Select any dietary restrictions or allergies
                          </p>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                          {DIETARY_RESTRICTIONS.map((restriction) => (
                            <FormField
                              key={restriction}
                              control={form.control}
                              name="dietaryRestrictions"
                              render={({ field }) => {
                                return (
                                  <FormItem
                                    key={restriction}
                                    className="flex flex-row items-start space-x-3 space-y-0"
                                  >
                                    <FormControl>
                                      <Checkbox
                                        checked={field.value?.includes(restriction)}
                                        onCheckedChange={(checked) => {
                                          return checked
                                            ? field.onChange([...(field.value || []), restriction])
                                            : field.onChange(
                                                field.value?.filter(
                                                  (value) => value !== restriction
                                                )
                                              );
                                        }}
                                      />
                                    </FormControl>
                                    <FormLabel className="text-sm font-normal">
                                      {restriction}
                                    </FormLabel>
                                  </FormItem>
                                );
                              }}
                            />
                          ))}
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Special Requirements */}
                  <FormField
                    control={form.control}
                    name="specialRequirements"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Special Requirements</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Any special requirements or notes..."
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Emergency Contact Section */}
                <Separator />
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold flex items-center gap-2">
                      <Phone className="h-4 w-4" />
                      Emergency Contact
                    </h3>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => setShowEmergencyContact(!showEmergencyContact)}
                    >
                      {showEmergencyContact ? "Hide" : "Add"} Emergency Contact
                    </Button>
                  </div>
                  
                  {showEmergencyContact && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <FormField
                        control={form.control}
                        name="emergencyContact.name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Contact Name</FormLabel>
                            <FormControl>
                              <Input placeholder="Emergency contact name" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="emergencyContact.mobile"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Contact Mobile</FormLabel>
                            <FormControl>
                              <Input 
                                type="tel" 
                                placeholder="Emergency contact mobile" 
                                {...field}
                                onChange={(e) => {
                                  const value = e.target.value.replace(/\D/g, '');
                                  field.onChange(value);
                                }}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="emergencyContact.relation"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Relation</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select relation" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {EMERGENCY_CONTACT_RELATIONS.map((relation) => (
                                  <SelectItem key={relation} value={relation}>
                                    {relation}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  )}
                </div>
              </>
            )}

            {/* Form Actions */}
            <Separator />
            
            <div className="flex gap-4 pt-4">
              {onCancel && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={onCancel}
                  className="flex-1"
                >
                  Cancel
                </Button>
              )}
              <Button
                type="submit"
                disabled={isSubmitting}
                className="flex-1"
              >
                {isSubmitting ? "Submitting..." : (isLeader ? "Save Leader Details" : "Add Team Member")}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default EnhancedTeamMemberForm;