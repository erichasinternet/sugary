import Link from 'next/link';
import MobileNav from './components/MobileNav';
import SugaryLogo from './components/SugaryLogo';

export default function Home() {
  return (
    <div className="min-h-screen" style={{ background: 'var(--gradient-hero)' }}>
      <MobileNav />

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-12 sm:py-16 md:py-20 lg:py-24 text-center relative">
          <div className="max-w-5xl mx-auto relative z-10">
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold tracking-tight mb-6 sm:mb-8 leading-tight px-2">
              Validate demand
              <span className="bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent animate-gradient">
                {' '}
                before you build{' '}
              </span>
            </h1>

            <p className="text-lg sm:text-xl md:text-2xl text-muted mb-8 sm:mb-12 max-w-3xl mx-auto leading-relaxed px-4">
              <span className="text-foreground font-medium">
                {' '}
                Share a link, capture interest, build what matters.
              </span>
            </p>

            <div className="flex flex-col items-center gap-3 sm:gap-4 px-4">
              <Link
                href="/auth/signup"
                className="group bg-gradient-to-r from-primary to-secondary text-white px-8 py-4 sm:px-10 sm:py-5 md:px-12 md:py-6 rounded-full font-semibold text-lg sm:text-xl hover:shadow-2xl hover:scale-105 transition-all duration-500 relative overflow-hidden w-full sm:w-auto max-w-sm"
              >
                <span className="relative z-10">Get Started</span>
                <div className="absolute inset-0 bg-white/20 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
              </Link>
              <p className="text-xs sm:text-sm text-muted text-center">
                <span className="font-medium text-foreground">Free to start</span> • No credit card
                required
              </p>
            </div>
          </div>
        </div>

        {/* Demo Section */}
        <div className="py-12 sm:py-16 md:py-20 lg:py-24 relative overflow-hidden">
          <div className="glass-card rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 mx-2 sm:mx-4 md:mx-8">
            <div className="text-center mb-8 sm:mb-12 md:mb-16">
              <div className="inline-flex items-center px-3 py-1.5 sm:px-4 sm:py-2 rounded-full bg-gradient-to-r from-secondary/10 to-accent/10 border border-secondary/20 mb-4 sm:mb-6">
                <span className="text-xs sm:text-sm font-medium text-primary">
                  See It In Action
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6 bg-gradient-to-r from-foreground to-muted bg-clip-text text-transparent px-2">
                From scattered to
                <span className="bg-primary bg-clip-text text-transparent"> sweet</span>
              </h2>
              <p className="text-base sm:text-lg md:text-xl text-muted max-w-3xl mx-auto leading-relaxed px-4">
                See how Sugary transforms chaotic feature requests into organized, trackable
                waitlists that
                <span className="text-foreground font-medium"> build genuine excitement</span>
              </p>
            </div>

            <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 md:gap-12 items-stretch">
              {/* Before: Traditional Social Media */}
              <div className="flex flex-col">
                <div className="bg-gradient-to-br from-red-50 to-orange-50 dark:from-red-950/30 dark:to-orange-950/30 p-6 rounded-2xl border border-red-200 dark:border-red-800 h-full flex flex-col">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <h3 className="font-bold text-foreground">Before: Scattered & Forgotten</h3>
                  </div>

                  <div className="space-y-4 flex-1">
                    {/* User request */}
                    <div
                      className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-gray-200 dark:border-slate-700 shadow-sm animate-fadeInUp opacity-0"
                      style={{ animationDelay: '0.5s', animationFillMode: 'forwards' }}
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 bg-gradient-to-r from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                          U
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="font-medium text-sm text-muted mb-1">@sarah_dev • 2h</div>
                          <p className="text-foreground leading-relaxed mb-3">
                            Hey @founder, any chance we could get dark mode support? My eyes are
                            dying over here 😅
                          </p>
                          <div className="flex items-center gap-4 text-sm text-muted">
                            <span className="flex items-center gap-1">❤️ 23</span>
                            <span className="flex items-center gap-1">💬 8</span>
                            <span className="flex items-center gap-1">🔄 2</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* More scattered requests */}
                    <div
                      className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-gray-200 dark:border-slate-700 shadow-sm animate-fadeInUp opacity-0"
                      style={{ animationDelay: '1s', animationFillMode: 'forwards' }}
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 bg-gradient-to-r from-green-400 to-green-600 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                          M
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="font-medium text-sm text-muted mb-1">
                            @mike_codes • 45m
                          </div>
                          <p className="text-foreground leading-relaxed">
                            +1 for dark mode! Been waiting forever
                          </p>
                        </div>
                      </div>
                    </div>

                    <div
                      className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-gray-200 dark:border-slate-700 shadow-sm animate-fadeInUp opacity-0"
                      style={{ animationDelay: '1.5s', animationFillMode: 'forwards' }}
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 bg-gradient-to-r from-purple-400 to-purple-600 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                          A
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="font-medium text-sm text-muted mb-1">
                            @alex_builds • 12m
                          </div>
                          <p className="text-foreground leading-relaxed">
                            Dark mode would be amazing! When can we expect this?
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Founder's struggle */}
                    <div
                      className="bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-950/30 dark:to-orange-950/30 p-4 rounded-xl border border-yellow-200 dark:border-yellow-800 shadow-sm animate-fadeInUp opacity-0"
                      style={{ animationDelay: '2s', animationFillMode: 'forwards' }}
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 bg-gradient-to-r from-primary to-secondary rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                          F
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="font-medium text-sm text-muted mb-2">@founder • 5m</div>
                          <p className="text-foreground leading-relaxed mb-3">
                            Noted! I'll add it to our backlog. Hard to track all these requests
                            though... 😅
                          </p>
                          <div className="bg-red-50 dark:bg-red-950/50 p-3 rounded-lg border border-red-200 dark:border-red-800">
                            <div className="flex items-start gap-2">
                              <div className="w-5 h-5 rounded-full bg-red-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                                <span className="text-white text-xs">!</span>
                              </div>
                              <div className="text-sm text-red-700 dark:text-red-300">
                                <strong>Problem:</strong> Requests vanish into the void, users
                                frustrated, founders miss opportunities
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* After: With Sugary */}
              <div className="flex flex-col">
                <div className="bg-gradient-to-br from-green-50 to-blue-50 dark:from-green-950/30 dark:to-blue-950/30 p-6 rounded-2xl border border-green-200 dark:border-green-800 h-full flex flex-col">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <h3 className="font-bold text-foreground">After: Organized & Actionable</h3>
                  </div>

                  <div className="space-y-4 flex-1">
                    {/* User request */}
                    <div
                      className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-gray-200 dark:border-slate-700 shadow-sm animate-fadeInUp opacity-0"
                      style={{ animationDelay: '2.5s', animationFillMode: 'forwards' }}
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 bg-gradient-to-r from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                          U
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="font-medium text-sm text-muted mb-1">@sarah_dev • 2h</div>
                          <p className="text-foreground leading-relaxed">
                            Hey @founder, any chance we could get dark mode support?
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Founder's smart response */}
                    <div
                      className="bg-gradient-to-r from-primary/5 to-secondary/5 p-4 rounded-xl border border-primary/20 shadow-sm animate-fadeInUp opacity-0"
                      style={{ animationDelay: '3s', animationFillMode: 'forwards' }}
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 bg-gradient-to-r from-primary to-secondary rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                          F
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="font-medium text-sm text-muted mb-2">@founder • 1h</div>
                          <p className="text-foreground leading-relaxed mb-4">
                            Great idea! I've set up a feature page to track interest in dark mode 🌙
                          </p>

                          {/* Sugary link card */}
                          <div className="bg-white dark:bg-slate-900 p-4 rounded-lg border border-primary/30 shadow-sm">
                            <div className="flex items-start gap-3">
                              <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-primary to-secondary flex items-center justify-center flex-shrink-0">
                                <span className="text-white text-sm font-bold">S</span>
                              </div>
                              <div className="min-w-0 flex-1">
                                <div className="text-sm text-primary font-semibold mb-1">
                                  Dark Mode Feature Request
                                </div>
                                <div className="text-sm text-muted mb-2 break-all">
                                  sugary.dev/yourcompany/dark-mode
                                </div>
                                <div className="text-xs text-muted">
                                  Sign up to get notified when it's ready!
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Community engagement - separate card */}
                    <div
                      className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-green-200 dark:border-green-700 shadow-sm animate-fadeInUp opacity-0"
                      style={{ animationDelay: '3.5s', animationFillMode: 'forwards' }}
                    >
                      <div className="space-y-3">
                        {/* User engagement indicators */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="flex -space-x-2">
                              <div className="w-7 h-7 bg-gradient-to-r from-blue-400 to-blue-600 rounded-full border-2 border-white dark:border-slate-800 flex items-center justify-center">
                                <span className="text-xs text-white font-medium">S</span>
                              </div>
                              <div className="w-7 h-7 bg-gradient-to-r from-green-400 to-green-600 rounded-full border-2 border-white dark:border-slate-800 flex items-center justify-center">
                                <span className="text-xs text-white font-medium">M</span>
                              </div>
                              <div className="w-7 h-7 bg-gradient-to-r from-purple-400 to-purple-600 rounded-full border-2 border-white dark:border-slate-800 flex items-center justify-center">
                                <span className="text-xs text-white font-medium">A</span>
                              </div>
                              <div className="w-7 h-7 bg-gradient-to-r from-orange-400 to-orange-600 rounded-full border-2 border-white dark:border-slate-800 flex items-center justify-center text-xs text-white font-medium">
                                +9
                              </div>
                            </div>
                            <span className="text-sm font-medium text-foreground">
                              12 interested users
                            </span>
                          </div>
                          <div className="text-xs text-muted">30 min ago</div>
                        </div>

                        {/* Result highlight */}
                        <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/50 dark:to-emerald-950/50 p-3 rounded-lg border border-green-200 dark:border-green-800">
                          <div className="flex items-start gap-2">
                            <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                              <span className="text-white text-xs">✓</span>
                            </div>
                            <div className="text-sm text-green-700 dark:text-green-300">
                              <strong>Sweet Result:</strong> Demand validated, community engaged,
                              founder builds features users actually crave 🎯
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* How It Works Section */}
        <div id="how-it-works" className="py-12 sm:py-16 md:py-20 lg:py-24">
          <div className="glass-card rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 mx-2 sm:mx-4 md:mx-8">
            <div className="text-center mb-12 sm:mb-16 md:mb-20">
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6 bg-gradient-to-r from-foreground to-primary bg-clip-text text-transparent px-2">
                How Sugary Works
              </h2>
              <p className="text-base sm:text-lg md:text-xl text-muted max-w-3xl mx-auto leading-relaxed px-4">
                Turn scattered feature requests into organized, trackable waitlists that
                <span className="text-foreground font-medium">
                  {' '}
                  drive product development and build community
                </span>
              </p>
            </div>

            <div className="max-w-7xl mx-auto space-y-12 sm:space-y-16 md:space-y-20 lg:space-y-24">
              {/* Step 1 */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 lg:gap-16 items-center">
                <div className="order-2 lg:order-1">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
                    <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-full bg-gradient-to-r from-primary to-secondary flex items-center justify-center shadow-lg flex-shrink-0">
                      <span className="text-lg sm:text-xl md:text-2xl">🎯</span>
                    </div>
                    <div>
                      <div className="text-xs sm:text-sm font-semibold text-primary mb-1">
                        STEP 1
                      </div>
                      <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-foreground">
                        Create Feature Pages
                      </h3>
                    </div>
                  </div>
                  <p className="text-base sm:text-lg text-muted mb-4 sm:mb-6 leading-relaxed">
                    Instead of letting requests disappear in social media threads, create dedicated
                    pages for each feature idea. Each page gets a beautiful, branded URL that's easy
                    to share.
                  </p>
                  <div className="space-y-3 sm:space-y-4">
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-sm sm:text-base text-foreground">
                        30-second setup with custom company branding
                      </span>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-sm sm:text-base text-foreground">
                        SEO-friendly URLs that build your brand presence
                      </span>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-sm sm:text-base text-foreground">
                        Professional pages that make requests feel official
                      </span>
                    </div>
                  </div>
                </div>
                <div className="order-1 lg:order-2">
                  <div className="bg-gradient-to-br from-primary/5 to-secondary/5 p-4 sm:p-6 md:p-8 rounded-2xl sm:rounded-3xl border border-primary/20">
                    <div className="bg-white dark:bg-slate-900 p-4 sm:p-6 rounded-xl sm:rounded-2xl shadow-xl">
                      <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                        <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-lg bg-gradient-to-r from-primary to-secondary flex items-center justify-center">
                          <span className="text-white text-xs sm:text-sm font-bold">S</span>
                        </div>
                        <div className="text-xs sm:text-sm font-medium text-muted truncate">
                          sugary.dev/yourcompany
                        </div>
                      </div>
                      <div className="space-y-2 sm:space-y-3">
                        <div className="h-2 sm:h-3 bg-gradient-to-r from-primary/20 to-secondary/20 rounded w-3/4"></div>
                        <div className="h-2 sm:h-3 bg-muted/30 rounded w-1/2"></div>
                        <div className="bg-gradient-to-r from-primary/10 to-secondary/10 p-3 sm:p-4 rounded-lg sm:rounded-xl border border-primary/20">
                          <div className="font-mono text-xs sm:text-sm text-primary">
                            <span className="break-all">sugary.dev/yourcompany/</span>
                            <span className="text-secondary font-semibold break-all">
                              dark-mode
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Step 2 */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 lg:gap-16 items-center">
                <div>
                  <div className="bg-gradient-to-br from-primary/5 to-secondary/5 p-4 sm:p-6 md:p-8 rounded-2xl sm:rounded-3xl border border-primary/20">
                    <div className="bg-white dark:bg-slate-900 p-4 sm:p-6 rounded-xl sm:rounded-2xl shadow-xl">
                      <div className="text-center space-y-3 sm:space-y-4">
                        <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 mx-auto rounded-full bg-gradient-to-r from-primary to-secondary flex items-center justify-center">
                          <span className="text-lg sm:text-xl md:text-2xl">🌑</span>
                        </div>
                        <div>
                          <h4 className="font-bold text-foreground text-base sm:text-lg mb-1 sm:mb-2">
                            Dark Mode Support
                          </h4>
                          <p className="text-xs sm:text-sm text-muted">
                            Help us prioritize this feature by sharing why you need it
                          </p>
                        </div>
                        <div className="space-y-2 sm:space-y-3">
                          <input
                            className="w-full p-2 sm:p-3 rounded-lg border border-primary/20 dark:border-primary/30 bg-background text-sm"
                            placeholder="your@email.com"
                            disabled
                          />
                          <textarea
                            className="w-full p-2 sm:p-3 rounded-lg border border-primary/20 dark:border-primary/30 bg-background resize-none text-sm"
                            placeholder="Why do you need this feature?"
                            rows={3}
                            disabled
                          />
                          <button className="w-full bg-gradient-to-r from-primary to-secondary text-white py-2 sm:py-3 rounded-lg font-semibold text-sm sm:text-base">
                            Count Me In!
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div>
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
                    <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-full bg-gradient-to-r from-primary to-secondary flex items-center justify-center shadow-lg flex-shrink-0">
                      <span className="text-lg sm:text-xl md:text-2xl">💝</span>
                    </div>
                    <div>
                      <div className="text-xs sm:text-sm font-semibold text-primary mb-1">
                        STEP 2
                      </div>
                      <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-foreground">
                        Capture Meaningful Interest
                      </h3>
                    </div>
                  </div>
                  <p className="text-base sm:text-lg text-muted mb-4 sm:mb-6 leading-relaxed">
                    Users don't just click "like" - they provide their email and explain why they
                    need the feature. This creates qualified leads and valuable insights about user
                    needs.
                  </p>
                  <div className="space-y-3 sm:space-y-4">
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-sm sm:text-base text-foreground">
                        Collect emails for direct communication when ready
                      </span>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-sm sm:text-base text-foreground">
                        Understand user motivations and use cases
                      </span>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-sm sm:text-base text-foreground">
                        Build a community around your upcoming features
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Step 3 */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 lg:gap-16 items-center">
                <div className="order-2 lg:order-1">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
                    <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-full bg-gradient-to-r from-primary to-secondary flex items-center justify-center shadow-lg flex-shrink-0">
                      <span className="text-lg sm:text-xl md:text-2xl">📊</span>
                    </div>
                    <div>
                      <div className="text-xs sm:text-sm font-semibold text-primary mb-1">
                        STEP 3
                      </div>
                      <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-foreground">
                        Build with Confidence
                      </h3>
                    </div>
                  </div>
                  <p className="text-base sm:text-lg text-muted mb-4 sm:mb-6 leading-relaxed">
                    Track real demand with beautiful analytics. Send updates to engaged users as you
                    build. Launch to a community that's already excited about your feature.
                  </p>
                  <div className="space-y-3 sm:space-y-4">
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-sm sm:text-base text-foreground">
                        See which features have real demand vs. nice-to-haves
                      </span>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-sm sm:text-base text-foreground">
                        Keep subscribers engaged with development updates
                      </span>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-sm sm:text-base text-foreground">
                        Launch to users who are guaranteed to use your feature
                      </span>
                    </div>
                  </div>
                </div>
                <div className="order-1 lg:order-2">
                  <div className="bg-gradient-to-br from-primary/5 to-secondary/5 p-4 sm:p-6 md:p-8 rounded-2xl sm:rounded-3xl border border-primary/20">
                    <div className="bg-white dark:bg-slate-900 p-4 sm:p-6 rounded-xl sm:rounded-2xl shadow-xl">
                      <div className="space-y-4 sm:space-y-6">
                        <div className="flex justify-between items-center">
                          <h4 className="font-semibold text-foreground text-sm sm:text-base">
                            Dark Mode Interest
                          </h4>
                          <span className="text-xs sm:text-sm bg-primary/10 dark:bg-primary/20 text-primary px-2 sm:px-3 py-1 rounded-full">
                            Hot 🔥
                          </span>
                        </div>

                        <div className="grid grid-cols-2 gap-3 sm:gap-4">
                          <div className="text-center p-3 sm:p-4 bg-primary/10 rounded-lg sm:rounded-xl">
                            <div className="text-xl sm:text-2xl font-bold text-primary">47</div>
                            <div className="text-xs sm:text-sm text-muted">Subscribers</div>
                          </div>
                          <div className="text-center p-3 sm:p-4 bg-secondary/10 rounded-lg sm:rounded-xl">
                            <div className="text-xl sm:text-2xl font-bold text-secondary">89%</div>
                            <div className="text-xs sm:text-sm text-muted">Open Rate</div>
                          </div>
                        </div>

                        <div className="space-y-2 sm:space-y-3">
                          <div className="text-xs sm:text-sm font-medium text-foreground">
                            Recent Activity
                          </div>
                          <div className="space-y-1 sm:space-y-2 text-xs sm:text-sm">
                            <div className="flex justify-between">
                              <span className="text-muted">New subscriber</span>
                              <span className="text-primary">2 min ago</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-muted">Update sent</span>
                              <span className="text-primary">1 hour ago</span>
                            </div>
                          </div>
                        </div>

                        <button className="w-full bg-gradient-to-r from-primary to-secondary text-white py-2 sm:py-3 rounded-lg font-semibold text-sm sm:text-base">
                          Send Update to 47 Users
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="py-12 sm:py-16 md:py-20 lg:py-24 mb-8 sm:mb-12 md:mb-16 text-center relative overflow-hidden">
          <div className="glass-card rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 mx-2 sm:mx-4 md:mx-8 relative">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-secondary/5 to-accent/5 rounded-2xl sm:rounded-3xl"></div>
            <div className="relative z-10">
              <div className="inline-flex items-center px-3 py-1.5 sm:px-4 sm:py-2 rounded-full bg-gradient-to-r from-primary/10 to-accent/10 border border-primary/20 mb-6 sm:mb-8">
                <span className="text-xs sm:text-sm font-medium text-primary">
                  Ready to impress your users?
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6 bg-gradient-to-r from-foreground to-primary bg-clip-text text-transparent px-2">
                Sweet success awaits
              </h2>
              <p className="text-base sm:text-lg md:text-xl text-muted mb-8 sm:mb-10 md:mb-12 max-w-2xl mx-auto leading-relaxed px-4">
                Validate demand, build community, and launch features users want.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center items-center px-4">
                <Link
                  href="/auth/signup"
                  className="group bg-gradient-to-r from-primary to-secondary text-white px-8 py-4 sm:px-10 sm:py-5 md:px-12 md:py-6 rounded-full font-bold text-lg sm:text-xl hover:shadow-2xl hover:scale-105 transition-all duration-500 relative overflow-hidden w-full sm:w-auto max-w-sm"
                >
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    Get Started Free
                  </span>
                  <div className="absolute inset-0 bg-white/20 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
                </Link>
                <div className="text-xs sm:text-sm text-muted text-center">
                  <span className="font-medium">No credit card required</span> • Start in 30 seconds
                </div>
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
              Helping founders build products users actually want, one feature at a time.
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
            <p className="text-muted text-sm">© 2025 Gant Street LLC. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
