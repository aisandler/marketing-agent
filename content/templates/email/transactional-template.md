# Transactional Email Templates

## Service Confirmation Email

### Subject Line
"Service Confirmation: {{SERVICE_TYPE}} Scheduled for {{APPOINTMENT_DATE}}"

### Template
```
Hi {{FIRST_NAME}},

Your {{SERVICE_TYPE}} service has been confirmed!

📅 Service Details:
• Date: {{APPOINTMENT_DATE}}
• Time: {{APPOINTMENT_TIME}}
• Address: {{SERVICE_ADDRESS}}
• Technician: {{TECHNICIAN_NAME}}
• Estimated Duration: {{SERVICE_DURATION}}

📋 Before Your Service:
• Ensure easy access to [relevant areas]
• Remove [specific items] if applicable
• Secure pets in a safe area
• [Additional preparation steps]

📞 Questions or Changes?
Call us at {{PHONE_NUMBER}} or reply to this email.

We look forward to serving you!

{{CLIENT_NAME}} Team
{{PHONE_NUMBER}} | {{WEBSITE_URL}}
```

## Appointment Reminder Email

### Subject Line
"Reminder: {{SERVICE_TYPE}} Tomorrow at {{APPOINTMENT_TIME}}"

### Template
```
Hi {{FIRST_NAME}},

Just a friendly reminder about your service tomorrow:

🔔 Tomorrow's Service:
• {{SERVICE_TYPE}}
• {{APPOINTMENT_DATE}} at {{APPOINTMENT_TIME}}
• {{SERVICE_ADDRESS}}
• Technician: {{TECHNICIAN_NAME}}

✅ Quick Preparation Checklist:
□ Clear access to service areas
□ Secure pets safely
□ [Service-specific preparation]
□ Someone available for any questions

Need to reschedule? Call {{PHONE_NUMBER}} at least 2 hours before your appointment.

See you tomorrow!

{{CLIENT_NAME}} Team
```

## Service Completion Follow-Up

### Subject Line
"Service Complete: Your {{SERVICE_TYPE}} Summary & Next Steps"

### Template
```
Hi {{FIRST_NAME}},

Your {{SERVICE_TYPE}} service is complete! Here's your summary:

✅ Service Summary:
• Date: {{SERVICE_DATE}}
• Technician: {{TECHNICIAN_NAME}}
• Services Performed: {{SERVICES_COMPLETED}}
• Materials Used: {{MATERIALS_USED}}
• Warranty Period: {{WARRANTY_PERIOD}}

📋 Technician Notes:
{{TECHNICIAN_NOTES}}

🔮 What's Next:
• [Post-service expectations]
• [Follow-up service timing]
• [Maintenance recommendations]

💭 How Did We Do?
Please take a moment to leave a review: {{REVIEW_LINK}}

Questions? Call {{PHONE_NUMBER}} or reply to this email.

Thank you for trusting {{CLIENT_NAME}}!

{{CLIENT_NAME}} Team
```

## Payment Confirmation Email

### Subject Line
"Payment Received: Thank You for Your Business"

### Template
```
Hi {{FIRST_NAME}},

Thank you! Your payment has been processed successfully.

💳 Payment Details:
• Amount: ${{PAYMENT_AMOUNT}}
• Date: {{PAYMENT_DATE}}
• Method: {{PAYMENT_METHOD}}
• Reference: {{TRANSACTION_ID}}
• Service: {{SERVICE_DESCRIPTION}}

📧 Your Receipt:
A detailed receipt is attached to this email for your records.

🛡️ Service Warranty:
Your {{SERVICE_TYPE}} includes a {{WARRANTY_PERIOD}} warranty. Keep this email for your records.

🗓️ Next Service:
Your next scheduled service is {{NEXT_SERVICE_DATE}}. We'll send a reminder closer to the date.

Thank you for choosing {{CLIENT_NAME}}!

{{CLIENT_NAME}} Team
{{PHONE_NUMBER}} | {{WEBSITE_URL}}
```

## Service Reminder Email (Recurring Services)

### Subject Line
"Time for Your Scheduled {{SERVICE_TYPE}} Service"

### Template
```
Hi {{FIRST_NAME}},

It's time for your regular {{SERVICE_TYPE}} service!

📅 Scheduling Your Service:
• Service Due: {{DUE_DATE}}
• Last Service: {{LAST_SERVICE_DATE}}
• Recommended Frequency: {{SERVICE_FREQUENCY}}

🎯 Why Regular Service Matters:
• [Benefit 1 - prevention]
• [Benefit 2 - early detection]
• [Benefit 3 - cost savings]
• [Benefit 4 - peace of mind]

📞 Schedule Today:
• Call {{PHONE_NUMBER}}
• Book online at {{BOOKING_URL}}
• Reply to this email with preferred dates

🏆 Loyalty Benefits:
As a valued customer, you receive:
• Priority scheduling
• [Discount percentage]% service discount
• Extended warranty coverage

Ready to schedule? We have availability {{AVAILABLE_DATES}}.

{{CLIENT_NAME}} Team
```

## Emergency Service Confirmation

### Subject Line
"Emergency Service: We're On Our Way to {{SERVICE_ADDRESS}}"

### Template
```
Hi {{FIRST_NAME}},

We've received your emergency service request and help is on the way!

🚨 Emergency Service Details:
• Technician: {{TECHNICIAN_NAME}}
• Estimated Arrival: {{ETA}}
• Phone: {{TECHNICIAN_PHONE}}
• Service Address: {{SERVICE_ADDRESS}}

📱 Technician Update:
{{TECHNICIAN_NAME}} will call when they're 15 minutes away.

⚠️ Before They Arrive:
• [Safety instructions if applicable]
• [Preparation steps]
• Ensure clear access to the problem area

💰 Emergency Service Rates:
Emergency services are billed at ${{EMERGENCY_RATE}}/hour with a {{MINIMUM_CHARGE}} minimum charge.

Questions? Call our emergency line: {{EMERGENCY_PHONE}}

{{CLIENT_NAME}} Emergency Response Team
```

## Quality Assurance Survey Email

### Subject Line
"How Was Your {{SERVICE_TYPE}} Experience with {{CLIENT_NAME}}?"

### Template
```
Hi {{FIRST_NAME}},

Thank you for choosing {{CLIENT_NAME}} for your {{SERVICE_TYPE}} needs!

⭐ Quick Feedback Request:
We'd love to hear about your experience. This 2-minute survey helps us continue providing excellent service.

{{SURVEY_LINK}}

🎁 Survey Reward:
Complete the survey and receive {{REWARD_OFFER}} off your next service!

📈 How We Use Your Feedback:
• Improve our service quality
• Recognize outstanding team members
• Ensure consistent customer satisfaction
• Develop better processes

🏆 Loved Our Service?
Please consider leaving a review:
• Google: {{GOOGLE_REVIEW_LINK}}
• Facebook: {{FACEBOOK_REVIEW_LINK}}
• Yelp: {{YELP_REVIEW_LINK}}

Your feedback shapes our service. Thank you!

{{CLIENT_NAME}} Team
```

## Template Guidelines

### Timing Specifications
- **Confirmation:** Within 15 minutes of booking
- **Reminder:** 24 hours before service
- **Completion:** Within 2 hours of service completion
- **Payment:** Immediately after payment processing
- **Recurring Reminder:** 7-14 days before due date
- **Emergency:** Immediately upon dispatch
- **Survey:** 24-48 hours after service completion

### Personalization Variables
```
{{CLIENT_NAME}} - Company name
{{FIRST_NAME}} - Customer first name
{{SERVICE_TYPE}} - Specific service booked
{{APPOINTMENT_DATE}} - Service date
{{APPOINTMENT_TIME}} - Service time
{{SERVICE_ADDRESS}} - Customer address
{{TECHNICIAN_NAME}} - Assigned technician
{{SERVICE_DURATION}} - Expected service length
{{PHONE_NUMBER}} - Company phone
{{WEBSITE_URL}} - Company website
{{BOOKING_URL}} - Online booking link
{{REVIEW_LINK}} - Review platform link
{{TRANSACTION_ID}} - Payment reference
{{WARRANTY_PERIOD}} - Service warranty length
{{EMERGENCY_PHONE}} - Emergency contact
{{ETA}} - Estimated arrival time
{{SURVEY_LINK}} - Feedback survey link
```

### Mobile Optimization
- Single column layout
- Large, tappable phone numbers and links
- Clear action buttons
- Scannable information formatting
- Fast-loading design

### Compliance Requirements
- CAN-SPAM footer (even for transactional emails)
- Clear unsubscribe option
- Physical address
- Privacy policy link

### Automation Triggers
- **Booking System Integration:** Automatic confirmation sends
- **Calendar Integration:** Reminder scheduling
- **Payment Processing:** Receipt generation
- **Service Completion:** Follow-up automation
- **CRM Integration:** Customer lifecycle tracking

### Performance Metrics
- **Open Rates:** 70-90% (higher for transactional)
- **Click Rates:** 15-30% (for actionable emails)
- **Survey Completion:** 25-40%
- **Review Generation:** 10-20% of completions
- **Booking Conversion:** 60-80% for reminders

### A/B Testing Opportunities
- Subject line clarity vs. personality
- Reminder timing (24h vs. 48h)
- Survey incentive amounts
- Review platform presentation order
- CTA button text and placement

### Integration Requirements
- **Scheduling Software:** Service confirmations and reminders
- **Payment Processing:** Receipt automation
- **CRM System:** Customer communication history
- **Review Management:** Survey and review requests
- **Mobile App:** Push notification coordination