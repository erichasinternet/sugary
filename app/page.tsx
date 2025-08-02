import Link from 'next/link';
import SugaryLogo from './components/SugaryLogo';
import GradientButton from './components/GradientButton';

export default function Home() {
  return (
    <div className="min-h-screen" style={{ background: 'var(--gradient-hero)' }}>
      {/* Header */}
      <header className="glass sticky top-0 z-50 border-b border-primary/10 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <SugaryLogo size="lg" />
            <div className="flex items-center gap-4">
              <Link
                href="/auth/signin"
                className="text-muted hover:text-foreground transition-all duration-300 font-medium"
              >
                Sign In
              </Link>
              <GradientButton>
                <Link href="/auth/signup">Get Started</Link>
              </GradientButton>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-24 text-center relative">
          {/* Floating elements */}
          <div className="absolute top-20 left-10 w-20 h-20 rounded-full bg-gradient-to-r from-accent to-accent-light opacity-20 animate-float"></div>
          <div
            className="absolute top-32 right-16 w-16 h-16 rounded-full bg-gradient-to-r from-secondary to-primary opacity-30 animate-float"
            style={{ animationDelay: '1s' }}
          ></div>
          <div
            className="absolute bottom-20 left-1/4 w-12 h-12 rounded-full bg-gradient-to-r from-primary to-primary-light opacity-25 animate-float"
            style={{ animationDelay: '2s' }}
          ></div>

          <div className="max-w-5xl mx-auto relative z-10">
            {/* Badge */}
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-primary/10 to-secondary/10 border border-primary/20 mb-8">
              <span className="text-sm font-medium text-primary">
                ✨ Turn requests into engaged communities
              </span>
            </div>

            <h1 className="text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight mb-8 leading-tight">
              Sweet
              <span className="bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent animate-gradient">
                {' '}
                feature{' '}
              </span>
              tracking
            </h1>

            <p className="text-xl md:text-2xl text-muted mb-12 max-w-3xl mx-auto leading-relaxed">
              Transform scattered feature requests into organized waitlists.
              <span className="text-foreground font-medium">
                {' '}
                Share a link, capture interest, keep users updated.
              </span>
            </p>

            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <Link
                href="/auth/signup"
                className="group bg-gradient-to-r from-primary to-secondary text-white px-10 py-5 rounded-full font-semibold text-lg hover:shadow-2xl hover:scale-105 transition-all duration-500 relative overflow-hidden"
              >
                <span className="relative z-10">Start Building Waitlists</span>
                <div className="absolute inset-0 bg-white/20 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
              </Link>

              <Link
                href="#how-it-works"
                className="group bg-white/95 dark:bg-slate-800/95 hover:bg-white dark:hover:bg-slate-800 px-10 py-5 rounded-full font-semibold text-lg hover:shadow-xl transition-all duration-300 border-2 border-primary/30 hover:border-primary/50 text-foreground backdrop-blur-sm"
              >
                <span className="flex items-center gap-2">
                  See How It Works
                  <span className="group-hover:translate-x-1 transition-transform duration-300">
                    →
                  </span>
                </span>
              </Link>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div id="how-it-works" className="py-24">
          <div className="text-center mb-20">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-accent/10 to-primary/10 border border-accent/20 mb-6">
              <span className="text-sm font-medium text-primary">🍭 Sweet & Simple Process</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-foreground to-muted bg-clip-text text-transparent">
              How Sugary Works
            </h2>
            <p className="text-xl text-muted max-w-3xl mx-auto leading-relaxed">
              Transform chaotic feature requests into organized, actionable insights with our
              delightfully simple 3-step process
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-12">
            <div className="group text-center p-8 rounded-3xl bg-white/90 dark:bg-slate-800/90 hover:bg-white dark:hover:bg-slate-800 hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-primary/10 backdrop-blur-sm">
              <div className="relative mb-8">
                <div className="w-24 h-24 mx-auto rounded-full bg-gradient-to-r from-primary to-secondary flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg">
                  <span className="text-3xl">🔗</span>
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center text-sm font-bold shadow-lg">
                  1
                </div>
              </div>
              <h3 className="text-2xl font-bold mb-4 text-foreground">Create Sweet Links</h3>
              <p className="text-muted leading-relaxed mb-4">
                Generate beautiful, branded URLs for each feature idea
              </p>
              <div className="bg-neutral/50 rounded-xl p-4 font-mono text-sm text-primary border border-primary/20">
                yourcompany.sugary.dev/<span className="text-secondary">feature-name</span>
              </div>
            </div>

            <div className="group text-center p-8 rounded-3xl bg-white/90 dark:bg-slate-800/90 hover:bg-white dark:hover:bg-slate-800 hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-secondary/10 backdrop-blur-sm">
              <div className="relative mb-8">
                <div className="w-24 h-24 mx-auto rounded-full bg-gradient-to-r from-secondary to-accent flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg">
                  <span className="text-3xl">💝</span>
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-secondary text-white rounded-full flex items-center justify-center text-sm font-bold shadow-lg">
                  2
                </div>
              </div>
              <h3 className="text-2xl font-bold mb-4 text-foreground">Capture Hearts</h3>
              <p className="text-muted leading-relaxed">
                Users share their email and explain why they need your feature, creating genuine
                connections
              </p>
            </div>

            <div className="group text-center p-8 rounded-3xl bg-white/90 dark:bg-slate-800/90 hover:bg-white dark:hover:bg-slate-800 hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-accent/10 backdrop-blur-sm">
              <div className="relative mb-8">
                <div className="w-24 h-24 mx-auto rounded-full bg-gradient-to-r from-accent to-primary flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg">
                  <span className="text-3xl">📈</span>
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-r from-primary to-secondary text-white rounded-full flex items-center justify-center text-sm font-bold shadow-lg">
                  3
                </div>
              </div>
              <h3 className="text-2xl font-bold mb-4 text-foreground">Delight & Deliver</h3>
              <p className="text-muted leading-relaxed">
                Track engagement with beautiful analytics and keep your community updated as you
                build their dreams
              </p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="py-24 mb-16 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-secondary/5 to-accent/5 rounded-3xl"></div>
          <div className="relative z-10">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-primary/10 to-accent/10 border border-primary/20 mb-8">
              <span className="text-sm font-medium text-primary">🚀 Ready to Launch?</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-foreground to-primary bg-clip-text text-transparent">
              Sweet success awaits
            </h2>
            <p className="text-xl text-muted mb-12 max-w-2xl mx-auto leading-relaxed">
              Join founders who've transformed scattered requests into thriving feature communities
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <Link
                href="/auth/signup"
                className="group bg-gradient-to-r from-primary to-secondary text-white px-12 py-6 rounded-full font-bold text-xl hover:shadow-2xl hover:scale-105 transition-all duration-500 relative overflow-hidden"
              >
                <span className="relative z-10 flex items-center gap-2">
                  Get Started Free
                  <span className="group-hover:translate-x-1 transition-transform duration-300">
                    ✨
                  </span>
                </span>
                <div className="absolute inset-0 bg-white/20 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
              </Link>
              <div className="text-sm text-muted">
                <span className="font-medium">No credit card required</span> • Start in 30 seconds
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-primary/10 bg-gradient-to-r from-neutral/30 to-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <div className="mb-6">
              <SugaryLogo size="lg" className="justify-center" showText={true} href="#" />
            </div>
            <p className="text-muted mb-8 max-w-md mx-auto">
              Making feature development sweeter, one request at a time
            </p>
            <div className="flex justify-center space-x-8 mb-8 text-sm">
              <Link href="/privacy" className="text-muted hover:text-primary transition-colors">
                Privacy
              </Link>
              <Link href="/terms" className="text-muted hover:text-primary transition-colors">
                Terms
              </Link>
              <a
                href="mailto:eric@gantstreet.com"
                className="text-muted hover:text-primary transition-colors"
              >
                Contact
              </a>
            </div>
            <p className="text-muted text-sm">
              &copy; 2025 Gant Street LLC. Built with ❤️ for founders who listen to their users.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
