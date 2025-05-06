# Seneca Homework Helper

A comprehensive tool for helping students with their Seneca and Sparx homework assignments.

## Features

- Seneca homework assistance
- Sparx reader with text selection capability
- User authentication system (Google & GitHub login)
- Free and Premium subscription tiers
- Admin dashboard for monitoring usage
- Usage analytics and tracking

## Tech Stack

- React with TypeScript
- Vite for building
- Tailwind CSS for styling
- Firebase Authentication
- Firestore for database
- Firebase Analytics for user tracking
- Stripe for payment processing (integration to be completed)

## Setup Instructions

### Prerequisites

- Node.js 14+ and npm/yarn
- Firebase account
- Stripe account (for premium subscriptions)

### Development Setup

1. Clone the repository
   ```bash
   git clone <repository-url>
   cd seneca-homework-helper
   ```

2. Install dependencies
   ```bash
   npm install
   ```

3. Configure Firebase
   - Create a Firebase project at [https://console.firebase.google.com/](https://console.firebase.google.com/)
   - Enable Authentication, Firestore, and Analytics
   - Add Google and GitHub auth providers in the Firebase console
   - Copy your Firebase config to `src/lib/firebase.ts`
   - Enable the admin accounts in the Firebase console

4. Start the development server
   ```bash
   npm run dev
   ```

### Deployment

1. Build the application
   ```bash
   npm run build
   ```

2. Deploy to Firebase
   ```bash
   npm install -g firebase-tools
   firebase login
   firebase init
   firebase deploy
   ```

3. Configure Firestore Security Rules
   ```bash
   firebase deploy --only firestore:rules
   ```

## User Tiers

### Free Tier
- 8 questions per week
- Basic access to Sparx reader

### Premium Tier ($5.99/month)
- Unlimited questions
- Priority support
- Enhanced features
- No weekly limits

### Admin Access
- Admin accounts have unlimited access
- Can view all user data
- Can modify user plans
- Current admin emails:
  - tom.business.purposes@gmail.com
  - thomas.barrett.22@sandon.essex.sch.uk

## Stripe Integration

To complete the Stripe integration:

1. Create a Stripe account at [https://stripe.com](https://stripe.com)
2. Get your API keys from the Stripe dashboard
3. Update the `.env` file with your Stripe keys
4. Implement the Stripe checkout functionality in the `handleUpgrade` function in `UserSettingsDialog.tsx`
5. Create webhook endpoints for handling subscription events

## License

[MIT](LICENSE)
