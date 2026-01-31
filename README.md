# Surat District Court Advocate Welfare Portal

A modern web application for managing advocate welfare fund deposits and financial assistance requests, built with Next.js, Radix UI, and Tailwind CSS.

## 🚀 Recent Refactoring

This project has been completely refactored to use modern UI libraries:

### ✨ What's New
- **Radix UI Components**: Replaced custom CSS components with accessible, unstyled Radix UI primitives
- **Tailwind CSS**: Migrated from custom CSS to utility-first Tailwind CSS framework
- **Modern Design System**: Consistent spacing, typography, and color schemes
- **Improved Accessibility**: Better keyboard navigation, screen reader support, and ARIA attributes
- **Responsive Design**: Mobile-first approach with better responsive layouts
- **Component Architecture**: Reusable UI components following modern React patterns

### 🎨 UI Components Refactored
- ✅ **Button**: Multiple variants (default, gold, hero, outline, ghost, destructive)
- ✅ **Card**: Header, content, footer with consistent styling
- ✅ **Input & Label**: Form controls with proper validation states
- ✅ **Textarea**: Multi-line text input with consistent styling
- ✅ **Navigation Menu**: Dropdown navigation with smooth animations
- ✅ **DateRangePicker**: Calendar component using Radix UI Popover

### 📱 Pages Refactored
- ✅ **Home Page**: Hero section with gradient backgrounds and feature cards
- ✅ **Deposit Page**: Form layout with proper validation and error states
- ✅ **Help Request Page**: Clean form design with textarea support
- ✅ **Admin Dashboard**: Stats cards and quick action buttons
- ✅ **Layout**: Modern header with navigation menu and responsive design

## 🛠 Tech Stack

- **Framework**: Next.js 16.1.4
- **UI Library**: Radix UI primitives
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT with jose
- **Notifications**: Twilio SMS
- **Language**: TypeScript

## 🎯 Features

- **Welfare Fee Deposits**: ₹2,000 annual fee collection
- **Financial Assistance**: Up to ₹5 Lakh emergency support requests
- **Admin Dashboard**: Member management and request processing
- **SMS Notifications**: Automated updates via Twilio
- **Responsive Design**: Works on all devices
- **Accessibility**: WCAG compliant components

## 🚀 Getting Started

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Environment Setup**
   Create a `.env.local` file with:
   ```env
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   TWILIO_ACCOUNT_SID=your_twilio_sid
   TWILIO_AUTH_TOKEN=your_twilio_token
   TWILIO_PHONE_NUMBER=your_twilio_phone
   ```

3. **Run Development Server**
   ```bash
   npm run dev
   ```

4. **Seed Database** (Optional)
   ```bash
   npm run seed
   ```

## 📁 Project Structure

```
├── app/                    # Next.js app directory
│   ├── admin/             # Admin pages
│   ├── api/               # API routes
│   ├── deposit/           # Deposit form page
│   ├── help/              # Help request page
│   └── globals.css        # Global styles with Tailwind
├── components/            # Reusable components
│   ├── ui/                # UI component library
│   └── DateRangePicker.tsx
├── lib/                   # Utility libraries
│   ├── auth.ts           # Authentication utilities
│   ├── db.ts             # Database connection
│   ├── utils.ts          # Tailwind class utilities
│   └── twilio.ts         # SMS service
└── models/               # Database models
```

## 🎨 Design System

### Colors
- **Primary**: Blue gradient for main actions
- **Secondary**: Red for urgent/important items  
- **Gold**: Special accent for payment buttons
- **Muted**: Subtle backgrounds and text

### Typography
- **Headings**: Bold, clear hierarchy
- **Body**: Readable line heights and spacing
- **Labels**: Consistent form labeling

### Components
- **Cards**: Elevated surfaces with hover effects
- **Buttons**: Multiple variants for different contexts
- **Forms**: Consistent validation and error states
- **Navigation**: Accessible dropdown menus

## 🔧 Development

### Adding New Components
1. Create component in `components/ui/`
2. Use Radix UI primitives when possible
3. Style with Tailwind CSS utilities
4. Export from component file

### Styling Guidelines
- Use Tailwind utility classes
- Leverage CSS custom properties for theming
- Follow mobile-first responsive design
- Maintain consistent spacing scale

### Component Patterns
```tsx
// Example component structure
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

export function MyComponent({ className, ...props }) {
  return (
    <div className={cn("base-styles", className)} {...props}>
      <Button variant="default">Action</Button>
    </div>
  )
}
```

## 📱 Responsive Breakpoints

- **Mobile**: < 640px
- **Tablet**: 640px - 1024px  
- **Desktop**: > 1024px

## ♿ Accessibility

- Keyboard navigation support
- Screen reader compatibility
- ARIA labels and descriptions
- Focus management
- Color contrast compliance

## 🚀 Deployment

The application is ready for deployment on platforms like Vercel, Netlify, or any Node.js hosting service.

## 📄 License

This project is licensed under the MIT License.

---

**Note**: This refactoring maintains all existing functionality while providing a modern, accessible, and maintainable codebase using industry-standard tools and practices.
