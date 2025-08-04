# Sugary 🍭

**Validate demand before you build**

Sugary transforms chaotic feature requests into organized, trackable waitlists that drive product development and build genuine community excitement.

## 🎯 What is Sugary?

Sugary is a feature request and demand validation platform that helps founders and product teams:

- **Stop building features nobody wants** - Validate real demand before investing development time
- **Turn scattered requests into organized waitlists** - No more lost feature requests in social media threads
- **Build engaged communities** - Create anticipation and excitement around upcoming features
- **Make data-driven product decisions** - See which features have genuine demand vs. nice-to-haves

## 🌟 Key Features

### 🎨 Beautiful Feature Pages
- **30-second setup** with custom company branding
- **SEO-friendly URLs** that build your brand presence (`sugary.dev/yourcompany/feature-name`)
- **Professional pages** that make feature requests feel official

### 💝 Meaningful Interest Capture
- **Email collection** for direct communication when features are ready
- **User motivation insights** - understand why users need specific features
- **Qualified leads** instead of simple likes or upvotes

### 📊 Analytics & Community Management
- **Real demand tracking** with beautiful analytics
- **Development updates** to keep subscribers engaged
- **Launch to excited users** who are guaranteed to use your features

## 🛠️ Tech Stack

- **Frontend**: Next.js 15 with React 19 and TypeScript
- **Styling**: Tailwind CSS with custom design system
- **Backend**: Convex for real-time database and serverless functions
- **Authentication**: Convex Auth
- **Email**: Resend for transactional emails
- **UI Components**: Radix UI primitives with custom styling
- **Analytics**: PostHog for user analytics
- **Charts**: Recharts for data visualization

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm, yarn, pnpm, or bun

### Installation

1. Clone the repository
```bash
git clone https://github.com/your-username/sugary.git
cd sugary
```

2. Install dependencies
```bash
npm install
# or
yarn install
# or
pnpm install
# or
bun install
```

3. Set up environment variables
```bash
cp .env.example .env.local
```

4. Start the development server
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## 📁 Project Structure

```
sugary/
├── app/                    # Next.js App Router
│   ├── components/         # App-specific components
│   ├── dashboard/          # Dashboard pages and layouts
│   ├── auth/              # Authentication pages
│   └── [company]/         # Dynamic company feature pages
├── components/            # Reusable UI components
│   └── ui/               # Base UI components (shadcn/ui)
├── convex/               # Convex backend functions and schema
├── hooks/                # Custom React hooks
├── lib/                  # Utility functions and configurations
└── public/              # Static assets
```

## 🎨 Design System

Sugary uses a custom design system built on Tailwind CSS with:
- **Gradient-based color scheme** with primary, secondary, and accent colors
- **Glass morphism effects** for modern UI elements
- **Responsive design** with mobile-first approach
- **Dark mode support** with next-themes

## 🔧 Development

### Code Quality
- **Biome** for linting and formatting
- **TypeScript** for type safety
- **Strict ESLint configuration**

### Scripts
```bash
npm run dev          # Start development server with Turbopack
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Check code quality
npm run lint:fix     # Fix auto-fixable linting issues
```

## 🚢 Deployment

Sugary is optimized for deployment on Vercel:

1. Connect your GitHub repository to Vercel
2. Configure environment variables in Vercel dashboard
3. Deploy automatically on every push to main branch

For other platforms, build the application and serve the static files:

```bash
npm run build
npm run start
```

## 🏢 About

Sugary is built by [Gant Street LLC](mailto:eric@gantstreet.com) to help founders build products users actually want, one feature at a time.

---

**Ready to validate your next feature idea?** [Get started with Sugary today!](https://sugary.dev)
