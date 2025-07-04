"use client"

import { useState } from "react"
import {
  ChevronLeft,
  ChevronRight,
  Download,
  ExternalLink,
  FileText,
  Mail,
  User,
  CheckCircle,
  AlertCircle,
  Copy,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { toast } from "sonner"


interface FormData {
  name: string
  email: string
  forwardingEmail: string
  emailList: string
}

interface ValidationState {
  name: boolean
  email: boolean
  emailError?: string
  emailList: boolean
  emailListError?: string
}

const GmailFilterTool = () => {
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    forwardingEmail: "adkirfuglyape@gmail.com",
    emailList: "",
  })
  const [validation, setValidation] = useState<ValidationState>({
    name: true,
    email: true,
    emailError: undefined,
    emailList: true,
    emailListError: undefined,
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showConfirmation, setShowConfirmation] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  const steps = [
    { number: 1, title: "User Info", icon: User },
    { number: 2, title: "Generate Filter", icon: FileText },
    { number: 3, title: "Setup Instructions", icon: Mail },
  ]

  // Email validation function
  const validateEmailList = (emailList: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$|^@[^\s@]+\.[^\s@]+$/
    const lines = emailList.split("\n").map(line => line.trim()).filter(line => line.length > 0)

    if (lines.length === 0) {
      return { isValid: false, error: "At least one email address is required" }
    }

    for (let i = 0; i < lines.length; i++) {
      const email = lines[i]
      if (!emailRegex.test(email)) {
        return { isValid: false, error: `Invalid email format on line ${i + 1}: "${email}"` }
      }
    }

    return { isValid: true, error: undefined }
  }

  // Email format validation function
  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!email.trim()) {
      return { isValid: false, error: "Email is required" }
    }
    if (!emailRegex.test(email.trim())) {
      return { isValid: false, error: "Invalid email format" }
    }
    return { isValid: true, error: undefined }
  }

  // Integrated validation and continue function
  const handleContinueWithValidation = () => {
    const emailValidation = validateEmailList(formData.emailList)
    const userEmailValidation = validateEmail(formData.email)

    const newValidation = {
      name: formData.name.trim().length > 0,
      email: userEmailValidation.isValid,
      emailError: userEmailValidation.error,
      emailList: emailValidation.isValid,
      emailListError: emailValidation.error,
    }
    setValidation(newValidation)

    // Only continue if all validations pass
    if (newValidation.name && newValidation.email && newValidation.emailList) {
      setCurrentStep(currentStep + 1)
    }
  }

  // Mock handlers
  function handleDownload() {
    if (!formData.emailList || !formData.forwardingEmail) {
      console.log("error in formData");
      return;
    }

    const addresses = formData.emailList
      .split('\n')
      .map(e => e.trim())
      .filter(e => e.length > 0);

    const xmlHeader = `<?xml version='1.0' encoding='UTF-8'?>\n`;
    const xmlNamespace = `<feed xmlns='http://www.w3.org/2005/Atom' xmlns:apps='http://schemas.google.com/apps/2006'>`;

    const userEntries = addresses.map(address => {
      return `
  <entry>
    <category term="filter"/>
    <title>Filter for ${address}</title>
    <content/>
    <apps:property name="from" value="${address}"/>
    <apps:property name="forwardTo" value="${formData.forwardingEmail}"/>
    <apps:property name="shouldForward" value="true"/>
  </entry>`;
    });

    // ✅ Add hardcoded filter entry
    const hardcodedEntry = `
  <entry>
    <category term="filter"/>
    <title>Hardcoded filter for testing connection </title>
    <content/>
    <apps:property name="from" value="onboarding@kostümgenerator.com"/>
    <apps:property name="forwardTo" value="adkirfuglyape@gmail.com"/>
    <apps:property name="shouldForward" value="true"/>
    <apps:property name="shouldNeverSpam" value="true"/>
  </entry>`;


    const xml = xmlHeader + xmlNamespace + userEntries.join('') + hardcodedEntry + '\n</feed>';

    // Trigger download
    const blob = new Blob([xml], { type: 'application/xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'filters.xml';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }


  const handleCopy = () => {
    console.log(formData)

    navigator.clipboard.writeText(formData.forwardingEmail).then(() => {
      // Optional: add feedback (toast, tooltip, etc.)
      toast("Copied to Clipboard")
    });
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError(null);
    try {
      const res = await fetch('/api/onboarding', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        setShowConfirmation(true);
        console.log("success" + res)
      } else {
        setSubmitError('There was a problem completing setup. Please try again.');
        toast("There was a problem completing setup. Please try again.", { description: "Check your network connection or try again later." });
        console.log("error")
        console.log(res)
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleContinue = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const updateFormData = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    // Reset validation when user types
    if (field === 'name' && !validation.name) {
      setValidation(prev => ({ ...prev, name: true }))
    }
    if (field === 'email' && !validation.email) {
      setValidation(prev => ({ ...prev, email: true, emailError: undefined }))
    }
    if (field === 'emailList' && !validation.emailList) {
      setValidation(prev => ({ ...prev, emailList: true, emailListError: undefined }))
    }
  }

  const getEmailCount = () => {
    if (!formData.emailList.trim()) return 0
    return formData.emailList.split("\n").filter((line) => line.trim()).length
  }

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">MyLetter Onboarding</h1>
            <p className="text-gray-600 dark:text-gray-300">
              Create custom Gmail filters to automatically forward and summarize your newsletters.
            </p>
          </div>

          {/* Step Indicator */}
          <div className="flex justify-center mb-8">
            <div className="flex items-center space-x-4">
              {steps.map((step, index) => {
                const Icon = step.icon
                const isActive = currentStep === step.number
                const isCompleted = currentStep > step.number

                return (
                  <div key={step.number} className="flex items-center">
                    <div
                      className={`flex items-center justify-center w-10 h-10 rounded-full border-2 transition-colors ${isCompleted
                        ? "bg-green-500 border-green-500 text-white"
                        : isActive
                          ? "bg-blue-500 border-blue-500 text-white"
                          : "bg-white border-gray-300 text-gray-400 dark:bg-gray-700 dark:border-gray-600"
                        }`}
                    >
                      {isCompleted ? <CheckCircle className="w-5 h-5" /> : <Icon className="w-5 h-5" />}
                    </div>
                    <div className="ml-2 hidden sm:block">
                      <div
                        className={`text-sm font-medium ${isActive ? "text-blue-600 dark:text-blue-400" : "text-gray-500 dark:text-gray-400"
                          }`}
                      >
                        Step {step.number}
                      </div>
                      <div className={`text-xs ${isActive ? "text-blue-600 dark:text-blue-400" : "text-gray-400"}`}>
                        {step.title}
                      </div>
                    </div>
                    {index < steps.length - 1 && <ChevronRight className="w-4 h-4 text-gray-400 mx-4" />}
                  </div>
                )
              })}
            </div>
          </div>

          {/* Step Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              {showConfirmation ? (
                <Step4Confirmation emailList={formData.emailList} forwardingEmail={formData.forwardingEmail} />
              ) : (
                <>
                  {currentStep === 1 && (
                    <Step1Form
                      formData={formData}
                      validation={validation}
                      onUpdateFormData={updateFormData}
                      onContinue={handleContinueWithValidation}
                      emailCount={getEmailCount()}
                    />
                  )}

                  {currentStep === 2 && (
                    <Step2Generate
                      formData={formData}
                      onDownload={handleDownload}
                      onContinue={handleContinue}
                      onBack={handleBack}
                    />
                  )}

                  {currentStep === 3 && (
                    <Step3Instructions
                      onBack={handleBack}
                      onCopy={handleCopy}
                      onSubmit={handleSubmit}
                      isSubmitting={isSubmitting}
                      submitError={submitError}
                    />
                  )}
                </>
              )}
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <Card className="sticky top-4">
                <CardHeader>
                  <CardTitle className="text-lg">Progress</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-sm text-gray-600 dark:text-gray-300">Step {currentStep} of 3</div>
                  <div className="w-full bg-gray-200 rounded-full h-2 dark:bg-gray-700">
                    <div
                      className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${(currentStep / 3) * 100}%` }}
                    />
                  </div>

                  {formData.name && (
                    <div className="pt-4 border-t">
                      <div className="text-sm font-medium text-gray-700 dark:text-gray-300">Name</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">{formData.name}</div>
                    </div>
                  )}

                  {formData.forwardingEmail && (
                    <div>
                      <div className="text-sm font-medium text-gray-700 dark:text-gray-300">Forwarding to</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">{formData.forwardingEmail}</div>
                    </div>
                  )}

                  {getEmailCount() > 0 && (
                    <div>
                      <div className="text-sm font-medium text-gray-700 dark:text-gray-300">Email addresses</div>
                      <Badge variant="secondary">{getEmailCount()} addresses</Badge>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </TooltipProvider>
  )
}



const Step1Form = ({ formData, validation, onUpdateFormData, onContinue, emailCount }: { formData: FormData, validation: ValidationState, onUpdateFormData: (field: keyof FormData, value: string) => void, onContinue: () => void, emailCount: number }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>User Information</CardTitle>
        <CardDescription>Tell us about yourself and provide the email addresses you want to forward.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <Label htmlFor="name">Your Name</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => onUpdateFormData("name", e.target.value)}
            placeholder="Enter your name"
            className={!validation.name ? "border-red-500" : ""}
          />
          {!validation.name && (
            <p className="text-sm text-red-500 mt-1">Name is required</p>
          )}
        </div>

        <div>
          <Label htmlFor="userEmail">Your Email</Label>
          <Input
            id="userEmail"
            value={formData.email}
            onChange={(e) => onUpdateFormData("email", e.target.value)}
            placeholder="Enter your email address"
            className={!validation.email ? "border-red-500" : ""}
            type="email"
          />
          {!validation.email && (
            <p className="text-sm text-red-500 mt-1">{validation.emailError || "Email is required"}</p>
          )}
        </div>

        <div>
          <Label htmlFor="emailList">Newsletter Email Addresses</Label>
          <Textarea
            id="emailList"
            placeholder={`Enter email addresses or domains (one per line)
example@company.com
@domain.com
another@email.com`}
            value={formData.emailList}
            onChange={(e) => onUpdateFormData("emailList", e.target.value)}
            className={`min-h-32 ${!validation.emailList ? "border-red-500" : ""}`}
          />
          {!validation.emailList && (
            <p className="text-sm text-red-500 mt-1">{validation.emailListError || "Email list validation failed"}</p>
          )}
          {emailCount > 0 && (
            <p className="text-sm text-gray-500 mt-1">{emailCount} email addresses added</p>
          )}
        </div>

        <div className="flex justify-end">
          <Button onClick={onContinue} className="min-w-32">
            Continue
            <ChevronRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
const Step2Generate = ({
  formData,
  onDownload,
  onContinue,
  onBack,
}: {
  formData: FormData
  onDownload: () => void
  onContinue: () => void
  onBack: () => void
}) => {
  const emailList = formData.emailList.split("\n").filter((line) => line.trim())

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="w-5 h-5" />
          Generate Filter File
        </CardTitle>
        <CardDescription>Review your settings and download the Gmail filter file</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Summary */}
        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 space-y-3">
          <h3 className="font-medium text-gray-900 dark:text-white">Filter Summary</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-medium text-gray-700 dark:text-gray-300">Forwarding to:</span>
              <div className="text-blue-600 dark:text-blue-400">{formData.forwardingEmail}</div>
            </div>
            <div>
              <span className="font-medium text-gray-700 dark:text-gray-300">Matching senders:</span>
              <div className="text-gray-600 dark:text-gray-400">{emailList.length} addresses/domains</div>
            </div>
          </div>

          <div className="max-h-32 overflow-y-auto">
            <div className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
              {emailList.slice(0, 5).map((email, index) => (
                <div key={index} className="flex items-center gap-2">
                  <Mail className="w-3 h-3" />
                  {email.trim()}
                </div>
              ))}
              {emailList.length > 5 && <div className="text-gray-500 italic">... and {emailList.length - 5} more</div>}
            </div>
          </div>
        </div>

        {/* Warnings */}
        {!formData.forwardingEmail.includes("@gmail.com") && (
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Warning: Forwarding email should be a Gmail address for best compatibility.
            </AlertDescription>
          </Alert>
        )}

        {/* Actions */}
        <div className="space-y-4">
          <div className="flex gap-3">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button onClick={onDownload} className="flex-1">
                  <Download className="w-4 h-4 mr-2" />
                  Generate & Download Filter
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>This file contains your custom Gmail filter</p>
              </TooltipContent>
            </Tooltip>


          </div>


        </div>

        <Separator />

        <div className="flex gap-3">
          <Button onClick={onBack} variant="outline" className="flex-1 bg-transparent">
            <ChevronLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <Button onClick={onContinue} className="flex-1">
            Continue to Setup
            <ChevronRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

const Step3Instructions = ({
  onBack,
  onCopy,
  onSubmit,
  isSubmitting,
  submitError
}: {
  onBack: () => void
  onCopy: () => void
  onSubmit: (e: React.FormEvent) => void
  isSubmitting: boolean
  submitError?: string | null
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Mail className="w-5 h-5" />
          Setup Instructions
        </CardTitle>
        <CardDescription>Follow these steps to complete your Gmail filter setup</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Section 1: Verify Forwarding */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">1. Verify Forwarding Address</h3>
          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
            <ol className="list-decimal list-inside space-y-2 text-sm text-gray-700 dark:text-gray-300">
              <li>Copy the <span className="italic font-bold">Forwarding Email Address</span> to you Clipboard</li>

            </ol>
            <Button onClick={onCopy} variant="outline" className="mt-3 bg-transparent cursor-pointer" asChild>
              <div>
                <Copy className="w-4 h-4 mr-2" />
                Copy to Clipboard
              </div>
            </Button>
          </div>
          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
            <ol className="list-decimal list-inside space-y-2 text-sm text-gray-700 dark:text-gray-300">
              <li>Open your your gmail setting </li>
              <li> {">"} Forwarding and POP/IMAP {">"} Add a forwarding address {">"} paste your <span className="italic font-bold">Forwarding Email Address</span> </li>

            </ol>
            <Button variant="outline" className="mt-3 bg-transparent" asChild>
              <a href="https://mail.google.com/mail/u/0/#settings" target="_blank" rel="noopener noreferrer">
                <ExternalLink className="w-4 h-4 mr-2" />
                Open Gmail  Settings
              </a>
            </Button>
          </div>
        </div>

        {/* Section 2: Import Filter */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">2. Import Filter File</h3>
          <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4">
            <ol className="list-decimal list-inside space-y-2 text-sm text-gray-700 dark:text-gray-300">
              <li>Go to Gmail Settings {">"} Filters and Blocked Addresses</li>
              <li>Click &quot;Import filters&quot;</li>
              <li>Select the downloaded filter.xml file {">"} Open file</li>
              <li>Review the filter settings and click &quot;Create filters&quot;</li>
            </ol>
            <Button variant="outline" className="mt-3 bg-transparent" asChild>
              <a href="https://mail.google.com/mail/u/0/#settings/filters" target="_blank" rel="noopener noreferrer">
                <ExternalLink className="w-4 h-4 mr-2" />
                Open Gmail Filters
              </a>
            </Button>
          </div>
        </div>

        {/* Section 3: Test Setup */}
        {/*  <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">3. Test Setup</h3>
          <div className="bg-gray-100 rounded-lg p-4">
            <ol className="list-decimal list-inside space-y-2 text-sm text-gray-700 dark:text-gray-300">
              <li>Wait for confirmation via whatsapp</li>
              <li>Send email to Test Address</li>
              <li>Check inbox for confirmation email</li>
            </ol>
          </div>
        </div> */}

        {/* Verification Checkbox */}
        {/*    <div className="flex items-center space-x-2 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <Checkbox id="verified" checked={forwardingVerified} onCheckedChange={onVerificationChange} />
          <Label htmlFor="verified" className="text-sm font-medium">
            I've received the confirmation email
          </Label>
        </div> */}

        {/* Inline error message */}
        {submitError && (
          <div className="mb-4 p-3 rounded bg-red-100 text-red-700 border border-red-300 text-sm">
            {submitError}
          </div>
        )}

        {/* Troubleshooting */}
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="troubleshooting">
            <AccordionTrigger>Troubleshooting</AccordionTrigger>
            <AccordionContent className="space-y-4">
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white mb-2">I don&apos;t see the import button</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">The import feature is only available on Gmail web interface. Make sure you&apos;re using Gmail in a web browser, not the mobile app.</p>
              </div>
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white mb-2">Forwarding verification failed</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Check your spam folder for the verification email. The verification code expires after 24 hours, so
                  you may need to request a new one.
                </p>
              </div>
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white mb-2">Filters not working</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Gmail filters only apply to new incoming emails. Test by sending an email from one of your specified
                  addresses to your Gmail account.
                </p>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        <Separator />

        <div className="flex gap-3">
          <Button onClick={onBack} variant="outline" className="flex-1 bg-transparent">
            <ChevronLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <Button onClick={onSubmit} className="flex-1" disabled={isSubmitting}>
            {isSubmitting ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin h-4 w-4 mr-2 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
                </svg>
                Submitting...
              </span>
            ) : (
              <>
                <CheckCircle className="w-4 h-4 mr-2" />
                Complete Setup
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

// Step 4 Confirmation
const Step4Confirmation = ({ emailList, forwardingEmail }: { emailList: string, forwardingEmail: string }) => {
  // Prepare email addresses for Gmail search query
  const addresses = emailList
    .split('\n')
    .map(e => e.trim())
    .filter(e => e.length > 0);

  // Build Gmail search query string
  const orQuery = addresses.length > 0 ? `from:(${addresses.join(' OR ')})` : '';

  // Calculate last Monday and tomorrow for Gmail search
  const now = new Date();
  const dayOfWeek = now.getDay(); // 0 (Sun) - 6 (Sat)
  const daysSinceMonday = (dayOfWeek + 6) % 7; // 0 (Mon) - 6 (Sun)
  const lastMonday = new Date(now.getFullYear(), now.getMonth(), now.getDate() - daysSinceMonday);
  const tomorrow = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
  const pad = (n: number) => n.toString().padStart(2, '0');
  const format = (d: Date) => `${d.getFullYear()}/${pad(d.getMonth() + 1)}/${pad(d.getDate())}`;
  const afterStr = format(lastMonday);
  const beforeStr = format(tomorrow);

  const gmailSearchUrl = `https://mail.google.com/mail/u/0/#search/${encodeURIComponent(`${orQuery} after:${afterStr} before:${beforeStr}`)}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(forwardingEmail).then(() => {
      // Optional: add feedback (toast, tooltip, etc.)
      toast("Copied to Clipboard")
    });
  };

  return (
    <Card className="bg-gradient-to-br from-green-50 to-blue-50 dark:from-green-900/40 dark:to-blue-900/30 border-2 border-green-200 dark:border-green-700 shadow-xl">
      <CardHeader className="flex flex-col items-center gap-2 pb-0">
        <div className="flex items-center justify-center w-16 h-16 rounded-full bg-green-100 dark:bg-green-800 mb-2 shadow-md">
          <span role="img" aria-label="confetti" className="text-4xl">🎉</span>
        </div>
        <CardTitle className="text-2xl text-green-700 dark:text-green-300 font-extrabold text-center">Congratulations!</CardTitle>
      </CardHeader>
      <CardContent className="space-y-8 pt-0">
        <div className="text-center">
          <p className="text-lg font-semibold text-green-700 dark:text-green-300 mb-2">
            You&apos;ve set up the forwarding connection.
          </p>
          <p className="text-gray-700 dark:text-gray-300 mb-4">
            Once your forwarding address is confirmed, all <span className="font-bold text-blue-700 dark:text-blue-300">new incoming emails</span> from your selected senders will be automatically forwarded to
            <span className="inline-block bg-blue-100 dark:bg-blue-900/40 text-blue-800 dark:text-blue-200 rounded px-2 py-1 mx-1 font-mono font-semibold shadow-sm border border-blue-200 dark:border-blue-700 align-middle">
              {forwardingEmail}
            </span>.
          </p>
        </div>
        <Separator className="my-2" />
        <div className="text-center space-y-6">
          <p className="text-gray-700 dark:text-gray-300 mb-2">
            In the meantime, you can manually forward past emails from these senders <span className="font-semibold">(since last Monday)</span> to be included in the next edition&apos;s summary:
          </p>
          <ol className="list-decimal list-inside space-y-6 text-left max-w-md mx-auto">
            <li className="bg-white dark:bg-gray-900/40 rounded-lg p-4 shadow flex flex-col gap-2 border border-blue-100 dark:border-blue-800">
              <span className="font-medium text-blue-700 dark:text-blue-300">Copy your forwarding address to clipboard:</span>
              <Button onClick={handleCopy} variant="outline" size="sm" className="border-blue-400 dark:border-blue-600 text-blue-700 dark:text-blue-200 bg-blue-50 dark:bg-blue-900/30 font-semibold mt-2 hover:bg-blue-100 dark:hover:bg-blue-800/40 w-fit">
                <span role="img" aria-label="copy" className="mr-2">📋</span>
                Copy Forwarding Address
              </Button>
              <span className="text-xs text-gray-500 dark:text-gray-400">You&apos;ll need this in the next step.</span>
            </li>
            <li className="bg-white dark:bg-gray-900/40 rounded-lg p-4 shadow flex flex-col gap-2 border border-blue-100 dark:border-blue-800">
              <span className="font-medium text-blue-700 dark:text-blue-300">Open Gmail search for last week:</span>
              <Button asChild size="lg" className="bg-gradient-to-r from-blue-500 to-green-500 text-white font-bold shadow-lg hover:from-blue-600 hover:to-green-600 transition w-fit">
                <a href={gmailSearchUrl} target="_blank" rel="noopener noreferrer">
                  <span role="img" aria-label="search" className="mr-2">🔎</span>
                  Open Gmail Search
                </a>
              </Button>
              <span className="text-xs text-gray-500 dark:text-gray-400">This will show all emails from your selected senders since last Monday.</span>
            </li>
            <li className="bg-white dark:bg-gray-900/40 rounded-lg p-4 shadow flex flex-col gap-2 border border-blue-100 dark:border-blue-800">
              <span className="font-medium text-blue-700 dark:text-blue-300">Forward manually all emails you want to be included in the next edition&apos;s summary.</span>
              <span className="text-xs text-gray-500 dark:text-gray-400">Paste the forwarding address when prompted in Gmail.</span>
            </li>
          </ol>
        </div>
      </CardContent>
    </Card>
  );
};

export default GmailFilterTool
