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

        {/* Demo Section */}
        <div className="py-24 relative overflow-hidden">
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-secondary/10 to-accent/10 border border-secondary/20 mb-6">
              <span className="text-sm font-medium text-primary">💬 See It In Action</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-foreground to-muted bg-clip-text text-transparent">
              From chaos to clarity
            </h2>
            <p className="text-xl text-muted max-w-3xl mx-auto leading-relaxed">
              Watch how Sugary transforms scattered feature requests into organized, trackable interest
            </p>
          </div>

          <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
            {/* Before: Traditional Social Media */}
            <div className="space-y-6">
              <div className="bg-gradient-to-br from-red-50 to-orange-50 dark:from-red-950/30 dark:to-orange-950/30 p-6 rounded-2xl border border-red-200 dark:border-red-800">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <h3 className="font-bold text-foreground">Before: Lost in the noise</h3>
                </div>
                
                {/* Simulated Reddit/Twitter conversation */}
                <div className="space-y-4">
                  {/* User request */}
                  <div className="bg-white dark:bg-slate-800 p-4 rounded-lg border border-gray-200 dark:border-slate-700 animate-fadeInUp opacity-0" style={{animationDelay: '0.5s', animationFillMode: 'forwards'}}>
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 bg-gradient-to-r from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
                        U
                      </div>
                      <div>
                        <div className="font-medium text-sm text-muted mb-1">@sarah_dev • 2h</div>
                        <p className="text-foreground">Hey @founder, any chance we could get dark mode support? My eyes are dying over here 😅</p>
                        <div className="flex items-center gap-4 mt-2 text-sm text-muted">
                          <span>❤️ 23</span>
                          <span>💬 8</span>
                          <span>🔄 2</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* More scattered requests */}
                  <div className="bg-white dark:bg-slate-800 p-4 rounded-lg border border-gray-200 dark:border-slate-700 animate-fadeInUp opacity-0" style={{animationDelay: '1s', animationFillMode: 'forwards'}}>
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 bg-gradient-to-r from-green-400 to-green-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
                        M
                      </div>
                      <div>
                        <div className="font-medium text-sm text-muted mb-1">@mike_codes • 45m</div>
                        <p className="text-foreground">+1 for dark mode! Been waiting forever</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white dark:bg-slate-800 p-4 rounded-lg border border-gray-200 dark:border-slate-700 animate-fadeInUp opacity-0" style={{animationDelay: '1.5s', animationFillMode: 'forwards'}}>
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 bg-gradient-to-r from-purple-400 to-purple-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
                        A
                      </div>
                      <div>
                        <div className="font-medium text-sm text-muted mb-1">@alex_builds • 12m</div>
                        <p className="text-foreground">Dark mode would be amazing! When can we expect this?</p>
                      </div>
                    </div>
                  </div>

                  {/* Founder's struggle */}
                  <div className="bg-yellow-50 dark:bg-yellow-950/30 p-4 rounded-lg border border-yellow-200 dark:border-yellow-800 animate-fadeInUp opacity-0" style={{animationDelay: '2s', animationFillMode: 'forwards'}}>
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 bg-gradient-to-r from-primary to-secondary rounded-full flex items-center justify-center text-white text-sm font-bold">
                        F
                      </div>
                      <div>
                        <div className="font-medium text-sm text-muted mb-1">@founder • 5m</div>
                        <p className="text-foreground">Noted! I'll add it to our backlog. Hard to track all these requests though... 😅</p>
                        <div className="text-sm text-muted mt-2 italic">*Request gets lost in the thread*</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* After: With Sugary */}
            <div className="space-y-6">
              <div className="bg-gradient-to-br from-green-50 to-blue-50 dark:from-green-950/30 dark:to-blue-950/30 p-6 rounded-2xl border border-green-200 dark:border-green-800">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <h3 className="font-bold text-foreground">After: Organized & actionable</h3>
                </div>

                {/* User request */}
                <div className="bg-white dark:bg-slate-800 p-4 rounded-lg border border-gray-200 dark:border-slate-700 animate-fadeInUp opacity-0" style={{animationDelay: '2.5s', animationFillMode: 'forwards'}}>
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-gradient-to-r from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
                      U
                    </div>
                    <div>
                      <div className="font-medium text-sm text-muted mb-1">@sarah_dev • 2h</div>
                      <p className="text-foreground">Hey @founder, any chance we could get dark mode support?</p>
                    </div>
                  </div>
                </div>

                {/* Founder's smart response */}
                <div className="bg-gradient-to-r from-primary/5 to-secondary/5 p-4 rounded-lg border border-primary/20 animate-fadeInUp opacity-0" style={{animationDelay: '3s', animationFillMode: 'forwards'}}>
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-gradient-to-r from-primary to-secondary rounded-full flex items-center justify-center text-white text-sm font-bold">
                      F
                    </div>
                    <div>
                      <div className="font-medium text-sm text-muted mb-1">@founder • 1m</div>
                      <p className="text-foreground mb-3">Great idea! I've set up a feature page to track interest in dark mode 🌙</p>
                      <div className="bg-white dark:bg-slate-800 p-3 rounded-lg border border-primary/30">
                        <div className="text-sm text-primary font-medium mb-1">yourcompany.sugary.dev/dark-mode</div>
                        <div className="text-xs text-muted">Sign up to get notified when it's ready!</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Community engagement */}
                <div className="space-y-3 animate-fadeInUp opacity-0" style={{animationDelay: '3.5s', animationFillMode: 'forwards'}}>
                  <div className="flex items-center gap-2 text-sm">
                    <div className="flex -space-x-2">
                      <div className="w-6 h-6 bg-gradient-to-r from-blue-400 to-blue-600 rounded-full border-2 border-white dark:border-slate-800"></div>
                      <div className="w-6 h-6 bg-gradient-to-r from-green-400 to-green-600 rounded-full border-2 border-white dark:border-slate-800"></div>
                      <div className="w-6 h-6 bg-gradient-to-r from-purple-400 to-purple-600 rounded-full border-2 border-white dark:border-slate-800"></div>
                      <div className="w-6 h-6 bg-gradient-to-r from-orange-400 to-orange-600 rounded-full border-2 border-white dark:border-slate-800"></div>
                    </div>
                    <span className="text-green-600 dark:text-green-400 font-medium">+12 people signed up</span>
                  </div>
                  <div className="bg-green-50 dark:bg-green-950/50 p-3 rounded-lg border border-green-200 dark:border-green-800">
                    <div className="text-sm text-green-700 dark:text-green-300">
                      ✨ <strong>Result:</strong> Clear demand validated, users stay engaged, founder builds with confidence
                    </div>
                  </div>
                </div>
              </div>
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
