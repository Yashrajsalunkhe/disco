import { useState, useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { Loader2, CheckCircle, UserPlus, Award, IndianRupee, Users, User, Trash2 } from "lucide-react";
import { getAllEvents, type Event } from "@/data/events";

// Team member schema
const teamMemberSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  mobile: z.string().regex(/^\d{10,15}$/, "Mobile number should contain only digits"),
  email: z.string().email("Please enter a valid email address"),
  college: z.string().min(2, "Please enter college name"),
});

// Function to create dynamic registration schema based on event
const createRegistrationSchema = (maxTeamSize: number = 4, isPaperPresentation: boolean = false) => z.object({
  // Leader details
  leaderName: z.string().min(2, "Name must be at least 2 characters"),
  leaderCollege: z.string().min(2, "Please enter your college name"),
  leaderEmail: z.string().email("Please enter a valid email address"),
  leaderMobile: z.string().regex(/^\d{10,15}$/, "Mobile number should contain only digits"),
  leaderDepartment: z.string().min(1, "Please select your department"),
  leaderYear: z.string().min(1, "Please select your year of study"),
  leaderCity: z.string().min(2, "Please enter your city"),
  
  // Event selection
  selectedEvent: z.string().min(1, "Please select an event"),
  paperPresentationDept: isPaperPresentation 
    ? z.string().min(1, "Please select a department for paper presentation")
    : z.string().optional(),
  
  // Team details
  participationType: z.enum(["solo", "team"], {
    required_error: "Please select participation type",
  }),
  teamSize: z.number().min(1).max(maxTeamSize).optional(),
  
  // Team members (conditional)
  teamMembers: z.array(teamMemberSchema).optional(),
});

// Default schema
const defaultRegistrationSchema = createRegistrationSchema();

type RegistrationFormValues = z.infer<typeof defaultRegistrationSchema>;

const departments = [
  "Aeronautical Engineering",
  "Mechanical Engineering", 
  "Electrical Engineering",
  "Civil Engineering",
  "Computer Science Engineering",
  "AI & Data Science",
  "IoT & Cyber Security",
  "Business Administration",
  "Food Technology",
  "Other"
];

// Departments that have paper presentation events
const paperPresentationDepartments = [
  "Aeronautical Engineering",
  "Mechanical Engineering", 
  "Electrical Engineering",
  "Civil Engineering",
  "Computer Science Engineering",
  "AI & Data Science",
  "IoT & Cyber Security",
  "Business Administration"
];

const years = ["1st Year", "2nd Year", "3rd Year", "4th Year", "Graduate", "Post Graduate"];

interface RegistrationFormProps {
  eventTitle?: string;
  onBack?: () => void;
}

export const RegistrationForm = ({ eventTitle, onBack }: RegistrationFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [participationType, setParticipationType] = useState<"solo" | "team">("solo");
  const [teamSize, setTeamSize] = useState<number>(1);
  const [totalFee, setTotalFee] = useState<number>(0);
  const [showPaperPresentationDept, setShowPaperPresentationDept] = useState(false);
  const { toast } = useToast();

  const allEvents = getAllEvents();

  // Filter events to show only one Paper Presentation option
  const filteredEvents = allEvents.filter((event, index, arr) => {
    if (event.name === "Paper Presentation") {
      // Only show the first Paper Presentation event
      return arr.findIndex(e => e.name === "Paper Presentation") === index;
    }
    return true;
  }).map(event => {
    // Rename the Paper Presentation to be generic
    if (event.name === "Paper Presentation") {
      return {
        ...event,
        department: "All Departments"
      };
    }
    return event;
  });

  // Create dynamic schema based on selected event
  const currentSchema = selectedEvent 
    ? createRegistrationSchema(selectedEvent.maxTeamSize, selectedEvent.name === "Paper Presentation")
    : defaultRegistrationSchema;

  const form = useForm<RegistrationFormValues>({
    resolver: zodResolver(currentSchema),
    defaultValues: {
      leaderName: "",
      leaderCollege: "",
      leaderEmail: "",
      leaderMobile: "",
      leaderDepartment: "",
      leaderYear: "",
      leaderCity: "",
      selectedEvent: "",
      paperPresentationDept: "",
      participationType: "solo",
      teamSize: 1,
      teamMembers: [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "teamMembers",
  });

  // Calculate total fee based on participation type and team size
  useEffect(() => {
    if (participationType === "solo") {
      setTotalFee(100);
      setTeamSize(1);
      form.setValue("teamSize", 1);
      form.setValue("teamMembers", []);
    } else {
      const fee = teamSize * 100;
      setTotalFee(fee);
      form.setValue("teamSize", teamSize);
      
      // Adjust team members array
      const currentMembers = form.getValues("teamMembers") || [];
      const targetMemberCount = teamSize - 1; // -1 because leader is separate
      
      if (currentMembers.length < targetMemberCount) {
        // Add empty members
        for (let i = currentMembers.length; i < targetMemberCount; i++) {
          append({ name: "", mobile: "", email: "", college: "" });
        }
      } else if (currentMembers.length > targetMemberCount) {
        // Remove excess members
        for (let i = currentMembers.length - 1; i >= targetMemberCount; i--) {
          remove(i);
        }
      }
    }
  }, [participationType, teamSize, form, append, remove]);

  const handleEventChange = (eventId: string) => {
    const event = allEvents.find(e => e.id === eventId);
    setSelectedEvent(event || null);
    form.setValue("selectedEvent", eventId);
    
    // Check if it's a Paper Presentation event
    const isPaperPresentation = event?.name === "Paper Presentation";
    setShowPaperPresentationDept(isPaperPresentation);
    
    if (!isPaperPresentation) {
      form.setValue("paperPresentationDept", "");
    }

    // Handle participation type based on event's maxTeamSize
    if (event) {
      if (event.maxTeamSize === 1) {
        // Force solo participation for events with maxTeamSize 1
        setParticipationType("solo");
        form.setValue("participationType", "solo");
        setTeamSize(1);
        form.setValue("teamSize", 1);
      } else {
        // Reset team size if current size exceeds event's max
        if (teamSize > event.maxTeamSize) {
          const newTeamSize = Math.min(teamSize, event.maxTeamSize);
          setTeamSize(newTeamSize);
          form.setValue("teamSize", newTeamSize);
          
          // If in team mode, ensure we don't exceed max
          if (participationType === "team" && newTeamSize < 2) {
            setParticipationType("solo");
            form.setValue("participationType", "solo");
            setTeamSize(1);
            form.setValue("teamSize", 1);
          }
        }
      }
    }
  };

  const handleParticipationTypeChange = (type: "solo" | "team") => {
    // Don't allow team participation for events with maxTeamSize 1
    if (type === "team" && selectedEvent?.maxTeamSize === 1) {
      toast({
        title: "Team participation not allowed",
        description: "This event only allows solo participation.",
        variant: "destructive",
      });
      return;
    }

    setParticipationType(type);
    form.setValue("participationType", type);
    
    if (type === "solo") {
      setTeamSize(1);
    } else {
      // Set default team size to 2, but respect event's maxTeamSize
      const defaultTeamSize = selectedEvent ? Math.min(2, selectedEvent.maxTeamSize) : 2;
      setTeamSize(defaultTeamSize);
    }
  };

  const handleTeamSizeChange = (size: number) => {
    // Validate against event's maxTeamSize
    if (selectedEvent && size > selectedEvent.maxTeamSize) {
      toast({
        title: "Team size too large",
        description: `This event allows maximum ${selectedEvent.maxTeamSize} team members.`,
        variant: "destructive",
      });
      return;
    }
    setTeamSize(size);
  };

  const onSubmit = async (values: RegistrationFormValues) => {
    setIsSubmitting(true);
    try {
      // If Paper Presentation is selected, find the correct event based on department
      let finalEventDetails = selectedEvent;
      if (selectedEvent?.name === "Paper Presentation" && values.paperPresentationDept) {
        const paperPresentationEvent = allEvents.find(event => 
          event.name === "Paper Presentation" && 
          event.department === values.paperPresentationDept
        );
        if (paperPresentationEvent) {
          finalEventDetails = paperPresentationEvent;
        }
      }

      const registrationData = {
        leaderName: values.leaderName,
        leaderEmail: values.leaderEmail,
        leaderMobile: values.leaderMobile,
        leaderCollege: values.leaderCollege,
        leaderDepartment: values.leaderDepartment,
        leaderYear: values.leaderYear,
        leaderCity: values.leaderCity,
        selectedEvent: finalEventDetails?.name || values.selectedEvent,
        paperPresentationDept: values.paperPresentationDept || '',
        participationType: values.participationType,
        teamSize: values.teamSize || 1,
        teamMembers: values.teamMembers || [],
        totalFee
      };

      // Create Razorpay order
      const orderRes = await fetch("/api/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          amount: totalFee * 100, // Convert to paise
          currency: "INR", 
          receipt: `receipt_${Date.now()}` 
        })
      });

      const orderResult = await orderRes.json();
      if (!orderResult.success) {
        throw new Error('Order creation failed');
      }

      const orderId = orderResult.order?.id;
      if (!orderId) {
        throw new Error('Order creation failed');
      }

      // Razorpay payment options
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: totalFee * 100,
        currency: "INR",
        name: "Discovery ADCET 2025",
        description: `Registration for ${registrationData.selectedEvent}`,
        image: window.location.origin + "/temp_icon.png", // Your logo
        order_id: orderId,
        prefill: {
          name: registrationData.leaderName,
          email: registrationData.leaderEmail,
          contact: registrationData.leaderMobile,
        },
        handler: async (razorpayResponse: any) => {
          try {
            // Submit registration after successful payment
            const registerRes = await fetch("/api/register", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                ...registrationData,
                paymentId: razorpayResponse.razorpay_payment_id,
                orderId: razorpayResponse.razorpay_order_id,
                signature: razorpayResponse.razorpay_signature
              })
            });

            const result = await registerRes.json();
            if (result.success) {
              setIsSubmitted(true);
              toast({
                title: "Registration Successful!",
                description: "Your registration has been submitted. You will receive a confirmation email shortly.",
              });
            } else {
              toast({
                title: "Registration Failed",
                description: result.error || "There was an error submitting your registration.",
                variant: "destructive",
              });
            }
          } catch (err) {
            console.error('Registration error:', err);
            toast({
              title: "Registration Failed",
              description: "There was an error submitting your registration. Please try again.",
              variant: "destructive",
            });
          } finally {
            setIsSubmitting(false);
          }
        },
        modal: {
          ondismiss: () => {
            setIsSubmitting(false);
            toast({
              title: "Payment Required",
              description: "Payment is mandatory to complete registration. Please try again.",
              variant: "destructive",
            });
          }
        },
        theme: {
          color: "#3b82f6"
        }
      };

      // Create Razorpay instance and open payment modal
      const razorpay = new (window as any).Razorpay(options);
      razorpay.on('payment.failed', (response: any) => {
        setIsSubmitting(false);
        toast({
          title: "Payment Failed",
          description: response.error?.description || 'Payment failed. Please try again.',
          variant: "destructive",
        });
      });
      
      razorpay.open();
      
    } catch (error) {
      console.error('Error:', error);
      setIsSubmitting(false);
      toast({
        title: "Error",
        description: "There was an error processing your request. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="w-full max-w-md text-center">
          <CardContent className="pt-6">
            <CheckCircle className="mx-auto h-16 w-16 text-green-500 mb-4" />
            <h2 className="text-2xl font-bold text-green-600 mb-2">Registration Successful!</h2>
            <p className="text-muted-foreground mb-4">
              Thank you for registering{eventTitle ? ` for ${eventTitle}` : ""}. 
            </p>
            <div className="bg-gradient-to-r from-primary/10 to-secondary/10 p-4 rounded-lg border border-primary/30 mb-6">
              <p className="text-lg font-semibold flex items-center justify-center gap-1">
                <IndianRupee className="h-5 w-5" />
                Total Fee: ₹{totalFee}/-
              </p>
            </div>
            <p className="text-sm text-muted-foreground mb-6">
              You will receive a confirmation email with payment details and further instructions shortly.
            </p>
            <div className="space-y-2">
              <Button onClick={() => setIsSubmitted(false)} variant="outline" className="w-full">
                Register Another Participant
              </Button>
              {onBack && (
                <Button onClick={onBack} className="w-full">
                  Back to Events
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <Card>
          <CardHeader className="text-center">
            <div className="flex items-center justify-center mb-4">
              <UserPlus className="h-8 w-8 text-primary mr-2" />
              <CardTitle className="text-3xl font-bold">Event Registration</CardTitle>
            </div>
            {eventTitle && (
              <CardDescription className="text-lg">
                Register for: <span className="font-semibold text-primary">{eventTitle}</span>
              </CardDescription>
            )}
            <CardDescription>
              Fill out the registration form step by step to complete your registration.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                
                {/* Leader Details Section */}
                <div className="bg-muted/30 p-6 rounded-lg border-2 border-primary/20">
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <User className="h-5 w-5 text-primary" />
                    Leader (Main Registrant) Details
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="leaderName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Full Name *</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter your full name" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="leaderCollege"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>College *</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter your college name" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="leaderEmail"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email *</FormLabel>
                          <FormControl>
                            <Input type="email" placeholder="your.email@example.com" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="leaderMobile"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Mobile Number *</FormLabel>
                          <FormControl>
                            <Input type="tel" placeholder="9876543210" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="leaderDepartment"
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
                              {departments.map((dept) => (
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
                      name="leaderYear"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Year of Study *</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select year" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {years.map((year) => (
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
                      name="leaderCity"
                      render={({ field }) => (
                        <FormItem className="md:col-span-2">
                          <FormLabel>City *</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter your city" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                {/* Event Selection Section */}
                <div className="bg-muted/30 p-6 rounded-lg border-2 border-primary/20">
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <Award className="h-5 w-5 text-primary" />
                    Event Selection
                  </h3>
                  
                  <div className="space-y-4">
                    <FormField
                      control={form.control}
                      name="selectedEvent"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Select Event *</FormLabel>
                          <Select onValueChange={handleEventChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Choose an event" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent className="max-h-60">
                              {filteredEvents.map((event) => (
                                <SelectItem key={event.id} value={event.id}>
                                  <div className="flex flex-col">
                                    <span className="font-medium">{event.name}</span>
                                    <span className="text-xs text-muted-foreground">{event.department}</span>
                                  </div>
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {showPaperPresentationDept && (
                      <FormField
                        control={form.control}
                        name="paperPresentationDept"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Select Department for Paper Presentation *</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Choose department" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {paperPresentationDepartments.map((dept) => (
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
                    )}
                  </div>
                </div>

                {/* Team Size & Fees Section */}
                <div className="bg-muted/30 p-6 rounded-lg border-2 border-primary/20">
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <Users className="h-5 w-5 text-primary" />
                    Team Size & Fees
                  </h3>
                  
                  <div className="space-y-6">
                    <FormField
                      control={form.control}
                      name="participationType"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Do you want to participate solo or as a team? *</FormLabel>
                          <FormControl>
                            <RadioGroup
                              onValueChange={(value) => {
                                field.onChange(value);
                                handleParticipationTypeChange(value as "solo" | "team");
                              }}
                              defaultValue={field.value}
                              className="flex gap-6"
                            >
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="solo" id="solo" />
                                <Label htmlFor="solo" className="cursor-pointer">
                                  Solo (₹100)
                                </Label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem 
                                  value="team" 
                                  id="team" 
                                  disabled={selectedEvent?.maxTeamSize === 1}
                                />
                                <Label 
                                  htmlFor="team" 
                                  className={`cursor-pointer ${selectedEvent?.maxTeamSize === 1 ? 'opacity-50 cursor-not-allowed' : ''}`}
                                >
                                  Team (₹100 per member)
                                  {selectedEvent?.maxTeamSize === 1 && (
                                    <span className="text-xs text-muted-foreground block">
                                      Not available for this event
                                    </span>
                                  )}
                                </Label>
                              </div>
                            </RadioGroup>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {participationType === "team" && selectedEvent && (
                      <div className="space-y-4">
                        <div>
                          <Label className="text-sm font-medium">Select Team Size *</Label>
                          <div className="flex gap-2 mt-2 flex-wrap">
                            {Array.from({ length: selectedEvent.maxTeamSize - 1 }, (_, i) => i + 2).map((size) => (
                              <Button
                                key={size}
                                type="button"
                                variant={teamSize === size ? "default" : "outline"}
                                size="sm"
                                onClick={() => handleTeamSizeChange(size)}
                                disabled={size > selectedEvent.maxTeamSize}
                              >
                                {size} Members (₹{size * 100})
                              </Button>
                            ))}
                          </div>
                          {selectedEvent.maxTeamSize === 1 && (
                            <p className="text-sm text-muted-foreground mt-2">
                              This event only allows solo participation.
                            </p>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Fee Display */}
                    <div className="bg-gradient-to-r from-primary/10 to-secondary/10 p-4 rounded-lg border border-primary/30">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">
                            Participation: {participationType === "solo" ? "Solo" : `Team of ${teamSize}`}
                          </p>
                          {selectedEvent && (
                            <p className="text-sm text-muted-foreground">Event: {selectedEvent.name}</p>
                          )}
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-bold text-primary flex items-center gap-1">
                            <IndianRupee className="h-5 w-5" />
                            {totalFee}/-
                          </p>
                          <p className="text-xs text-muted-foreground">
                            ₹100/- per member
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Payment Notice */}
                    <div className="bg-orange-50 border border-orange-200 p-4 rounded-lg">
                      <div className="flex items-start gap-3">
                        <div className="flex-shrink-0">
                          <svg className="h-5 w-5 text-orange-600" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <div>
                          <h4 className="text-sm font-semibold text-orange-800">Payment Required</h4>
                          <p className="text-sm text-orange-700 mt-1">
                            Registration will only be confirmed after successful payment. You will be redirected to a secure payment gateway to complete the transaction.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Team Members Section - Only show if team is selected */}
                {participationType === "team" && teamSize > 1 && (
                  <div className="bg-muted/30 p-6 rounded-lg border-2 border-primary/20">
                    <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                      <Users className="h-5 w-5 text-primary" />
                      Team Member Details
                    </h3>
                    
                    <div className="space-y-6">
                      {fields.map((field, index) => (
                        <div key={field.id} className="p-4 border rounded-lg space-y-4">
                          <div className="flex items-center justify-between">
                            <h4 className="font-medium">Member {index + 2}</h4>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FormField
                              control={form.control}
                              name={`teamMembers.${index}.name`}
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Name *</FormLabel>
                                  <FormControl>
                                    <Input placeholder="Enter member name" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />

                            <FormField
                              control={form.control}
                              name={`teamMembers.${index}.mobile`}
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Mobile Number *</FormLabel>
                                  <FormControl>
                                    <Input type="tel" placeholder="9876543210" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />

                            <FormField
                              control={form.control}
                              name={`teamMembers.${index}.email`}
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Email *</FormLabel>
                                  <FormControl>
                                    <Input type="email" placeholder="member@example.com" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />

                            <FormField
                              control={form.control}
                              name={`teamMembers.${index}.college`}
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>College *</FormLabel>
                                  <FormControl>
                                    <Input placeholder="Enter college name" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <Separator />

                <div className="flex space-x-4 pt-4">
                  {onBack && (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={onBack}
                      className="flex-1"
                    >
                      Back
                    </Button>
                  )}
                  <Button
                    type="submit"
                    disabled={isSubmitting || !selectedEvent}
                    className="flex-1"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      <>
                        <UserPlus className="mr-2 h-4 w-4" />
                        Proceed to Payment (₹{totalFee}/-)
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
