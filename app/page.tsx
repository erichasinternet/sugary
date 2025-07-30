import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-background/80">
      {/* Header */}
      <header className="border-b border-foreground/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold">FeatureLoop</h1>
            </div>
            <div className="flex items-center gap-4">
              <Link
                href="/auth/signin"
                className="text-foreground/70 hover:text-foreground transition-colors"
              >
                Sign In
              </Link>
              <Link
                href="/auth/signup"
                className="bg-foreground text-background px-4 py-2 rounded-lg hover:bg-foreground/90 transition-colors"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-20 text-center">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-6xl font-bold tracking-tight mb-6">
              Turn feature requests into
              <span className="text-blue-600 dark:text-blue-400"> engaged waitlists</span>
            </h1>
            <p className="text-xl text-foreground/70 mb-8 max-w-2xl mx-auto">
              When users request features on Reddit, Twitter, or support - share a unique link to track interest and keep them updated as you build.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/auth/signup"
                className="bg-foreground text-background px-8 py-4 rounded-lg hover:bg-foreground/90 transition-colors font-medium text-lg"
              >
                Start Building Waitlists
              </Link>
              <Link
                href="#demo"
                className="border border-foreground/20 px-8 py-4 rounded-lg hover:border-foreground/40 transition-colors font-medium text-lg"
              >
                See How It Works
              </Link>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div id="demo" className="py-20">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">How FeatureLoop Works</h2>
            <p className="text-xl text-foreground/70 max-w-2xl mx-auto">
              Simple workflow to capture, track, and nurture feature interest
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🔗</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Create Feature Links</h3>
              <p className="text-foreground/70">
                Create unique URLs for each feature like <code className="bg-foreground/10 px-2 py-1 rounded">yourcompany.featureloop.com/api-webhooks</code>
              </p>
            </div>
            
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">📧</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Capture Interest</h3>
              <p className="text-foreground/70">
                Users click your link, enter their email and context about why they need the feature
              </p>
            </div>
            
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">📊</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Track & Update</h3>
              <p className="text-foreground/70">
                View real-time metrics on your dashboard and send updates to subscribers as you build
              </p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="py-20 text-center border-t border-foreground/10">
          <h2 className="text-3xl font-bold mb-4">Ready to build better features?</h2>
          <p className="text-xl text-foreground/70 mb-8">
            Start capturing feature interest today
          </p>
          <Link
            href="/auth/signup"
            className="bg-foreground text-background px-8 py-4 rounded-lg hover:bg-foreground/90 transition-colors font-medium text-lg inline-block"
          >
            Get Started Free
          </Link>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-foreground/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center text-foreground/60">
            <p>&copy; 2024 FeatureLoop. Built for founders who listen to their users.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
