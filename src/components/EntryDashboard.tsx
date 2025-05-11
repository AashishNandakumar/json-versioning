import { Link } from "react-router-dom";
import { Button } from "./ui/button";
import {
  ArrowRight,
  Code,
  History,
  GitCompare,
  Shield,
  Zap,
  Users,
  Star,
  Clock,
  CheckCircle,
  Award,
  Sparkles,
  Rocket,
  MessageSquare,
  BarChart,
  Layers,
  Laptop,
} from "lucide-react";

export default function EntryDashboard() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100">
      {/* Hero Section with animated gradient */}
      <header className="relative overflow-hidden">
        <div className="absolute inset-0 z-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-100 via-transparent to-transparent opacity-40 animate-pulse"></div>
        <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-blue-100 opacity-20 blur-3xl"></div>
        <div className="absolute top-1/2 -left-20 h-60 w-60 rounded-full bg-indigo-100 opacity-20 blur-3xl"></div>

        <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
          <nav className="flex items-center justify-between py-4">
            <div className="flex items-center">
              <div className="relative">
                <div className="absolute -inset-1 rounded-full bg-blue-500 opacity-30 blur-sm"></div>
                <Code className="relative h-8 w-8 text-blue-600" />
              </div>
              <span className="ml-2 text-2xl font-bold text-slate-800">
                JsonVerse
                <span className="ml-1 rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-800">BETA</span>
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="outline" size="sm" className="transition-all hover:bg-blue-50 hover:text-blue-700" onClick={() => { console.log('Login clicked'); window.location.replace('/login'); }}>
                <span className="relative flex items-center">
                  Log in
                </span>
              </Button>
              <Button size="sm" className="bg-blue-600 transition-all hover:bg-blue-700" onClick={() => { console.log('Signup clicked'); window.location.replace('/register'); }}>
                <span className="relative flex items-center">
                  Sign up for free
                </span>
              </Button>
            </div>
          </nav>

          <div className="mt-16 flex flex-col items-center text-center">
            <div className="inline-block rounded-full bg-blue-100 px-4 py-1 text-sm font-medium text-blue-800">
              <span className="mr-1 inline-block h-2 w-2 animate-pulse rounded-full bg-blue-600"></span>
              Now in public beta
            </div>
            <h1 className="mt-6 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-4xl font-extrabold tracking-tight text-transparent sm:text-5xl md:text-6xl">
              <span className="block">JSON Versioning</span>
              <span className="block">Made Simple</span>
            </h1>
            <p className="mt-6 max-w-2xl text-xl text-slate-600">
              Edit, version, and collaborate on JSON documents with powerful
              visual diff tools. The Git-like experience for your structured
              data.
            </p>
            <div className="mt-10 flex flex-col space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0">
              <Button size="lg" className="group relative overflow-hidden bg-blue-600 px-8 transition-all hover:bg-blue-700" onClick={() => { console.log('Get started clicked'); window.location.replace('/register'); }}>
                <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-blue-500 to-blue-600 opacity-30 transition-transform group-hover:translate-x-0"></span>
                <span className="relative flex items-center">
                  Get started for free
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </span>
              </Button>
              <Button variant="outline" size="lg" className="px-8 transition-all hover:bg-blue-50 hover:text-blue-700" onClick={() => { console.log('Login account clicked'); window.location.replace('/login'); }}>

                <span className="relative flex items-center">
                  Log in to your account
                </span>
              </Button>
            </div>
            <div className="mt-6 flex flex-wrap justify-center gap-4 text-sm text-slate-500">
              <div className="flex items-center">
                <CheckCircle className="mr-1 h-4 w-4 text-green-500" />
                No credit card required
              </div>
              <div className="flex items-center">
                <CheckCircle className="mr-1 h-4 w-4 text-green-500" />
                14-day free trial
              </div>
              <div className="flex items-center">
                <CheckCircle className="mr-1 h-4 w-4 text-green-500" />
                Cancel anytime
              </div>
            </div>
          </div>
        </div>

        {/* Abstract JSON visualization with animation */}
        <div className="relative mx-auto mt-16 max-w-full md:max-w-5xl rounded-t-xl bg-slate-900 p-4 shadow-xl transition-all hover:shadow-2xl">
          <div className="flex items-center space-x-2">
            <div className="h-3 w-3 rounded-full bg-red-500"></div>
            <div className="h-3 w-3 rounded-full bg-yellow-500"></div>
            <div className="h-3 w-3 rounded-full bg-green-500"></div>
            <div className="ml-4 text-sm text-slate-400">
              json-document.json
            </div>
          </div>
          <pre className="mt-4 text-left text-sm whitespace-pre-wrap break-words">
            <code className="language-json">
              <span className="text-green-400">{`{`}</span>
              <div className="pl-4">
                <span className="text-yellow-300">"name"</span><span className="text-green-400">: </span><span className="text-blue-300">"JSON Versioning Editor"</span><span className="text-green-400">,</span><br/>
                <span className="text-yellow-300">"version"</span><span className="text-green-400">: </span><span className="text-blue-300">"1.0.0"</span><span className="text-green-400">,</span><br/>
                <span className="text-yellow-300">"description"</span><span className="text-green-400">: </span><span className="text-blue-300">"A web application that provides a JSON editor with versioning capabilities"</span><span className="text-green-400">,</span><br/>
                <span className="text-yellow-300">"features"</span><span className="text-green-400">: [</span><br/>
                <div className="pl-4">
                  <span className="text-blue-300">"JSON editing with syntax highlighting"</span><span className="text-green-400">,</span><br/>
                  <span className="text-blue-300">"Automatic validation"</span><span className="text-green-400">,</span><br/>
                  <span className="text-blue-300">"Version history"</span><span className="text-green-400">,</span><br/>
                  <span className="text-blue-300">"Visual diff between versions"</span><br/>
                </div>
                <span className="text-green-400">]</span><br/>
              </div>
              <span className="text-green-400">{`}`}</span>
            </code>
          </pre>
          <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-slate-900 to-transparent"></div>
        </div>
      </header>

      {/* Trusted By Section */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-lg font-medium text-slate-600">Trusted by developers from</h2>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-x-12 gap-y-6 grayscale opacity-70 transition-all hover:grayscale-0 hover:opacity-100">
              {/* Company logos */}
              <div className="flex items-center">
                <svg className="h-8" viewBox="0 0 124 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm0 4.8c1.6 0 2.88 1.28 2.88 2.88S13.6 10.56 12 10.56s-2.88-1.28-2.88-2.88S10.4 4.8 12 4.8zM14.4 19.2h-4.8v-1.2h.96v-6h-.96v-1.2h3.84v7.2h.96v1.2z" fill="#475569"/>
                </svg>
                <span className="ml-2 text-lg font-semibold text-slate-700">Acme Inc</span>
              </div>
              <div className="flex items-center">
                <svg className="h-8" viewBox="0 0 124 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M6 12h12M12 6v12" stroke="#475569" strokeWidth="2" strokeLinecap="round"/>
                  <circle cx="12" cy="12" r="11" stroke="#475569" strokeWidth="2"/>
                </svg>
                <span className="ml-2 text-lg font-semibold text-slate-700">CircleTech</span>
              </div>
              <div className="flex items-center">
                <svg className="h-8" viewBox="0 0 124 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M4 4h16v16H4z" stroke="#475569" strokeWidth="2"/>
                  <path d="M12 8v8M8 12h8" stroke="#475569" strokeWidth="2" strokeLinecap="round"/>
                </svg>
                <span className="ml-2 text-lg font-semibold text-slate-700">SquareBox</span>
              </div>
              <div className="flex items-center">
                <svg className="h-8" viewBox="0 0 124 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 4l8 16H4l8-16z" stroke="#475569" strokeWidth="2" strokeLinejoin="round"/>
                </svg>
                <span className="ml-2 text-lg font-semibold text-slate-700">TriangleWave</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section with hover effects */}
      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              Powerful Features for JSON Management
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-600">
              Everything you need to manage, version, and collaborate on your
              JSON documents.
            </p>
          </div>

          <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {/* Feature 1 */}
            <div className="group rounded-lg border border-slate-200 bg-white p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-md">
              <div className="mb-4 inline-flex rounded-full bg-blue-100 p-3 transition-all group-hover:bg-blue-200">
                <Code className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="mb-2 text-xl font-semibold text-slate-900">
                Advanced JSON Editor
              </h3>
              <p className="text-slate-600">
                Edit JSON with syntax highlighting, validation, and error
                messages. Copy/paste functionality and a clean, responsive UI.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="group rounded-lg border border-slate-200 bg-white p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-md">
              <div className="mb-4 inline-flex rounded-full bg-blue-100 p-3 transition-all group-hover:bg-blue-200">
                <History className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="mb-2 text-xl font-semibold text-slate-900">
                Automatic Versioning
              </h3>
              <p className="text-slate-600">
                Changes are automatically saved every 30 seconds. Manually save
                versions with a single click when you're ready.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="group rounded-lg border border-slate-200 bg-white p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-md">
              <div className="mb-4 inline-flex rounded-full bg-blue-100 p-3 transition-all group-hover:bg-blue-200">
                <GitCompare className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="mb-2 text-xl font-semibold text-slate-900">
                Visual Diff Comparison
              </h3>
              <p className="text-slate-600">
                Compare versions with a visual diff view similar to GitHub.
                Easily track changes and understand what was modified.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="group rounded-lg border border-slate-200 bg-white p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-md">
              <div className="mb-4 inline-flex rounded-full bg-blue-100 p-3 transition-all group-hover:bg-blue-200">
                <Shield className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="mb-2 text-xl font-semibold text-slate-900">
                Secure Storage
              </h3>
              <p className="text-slate-600">
                Your JSON documents are securely stored and accessible only to
                you. We prioritize the security of your data.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="group rounded-lg border border-slate-200 bg-white p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-md">
              <div className="mb-4 inline-flex rounded-full bg-blue-100 p-3 transition-all group-hover:bg-blue-200">
                <Zap className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="mb-2 text-xl font-semibold text-slate-900">
                Fast Performance
              </h3>
              <p className="text-slate-600">
                Lightning-fast editing and version management, even for large
                JSON documents. No lag, no waiting.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="group rounded-lg border border-slate-200 bg-white p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-md">
              <div className="mb-4 inline-flex rounded-full bg-blue-100 p-3 transition-all group-hover:bg-blue-200">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="mb-2 text-xl font-semibold text-slate-900">
                Collaboration Ready
              </h3>
              <p className="text-slate-600">
                Share your JSON documents with team members and collaborate in
                real-time. Perfect for team projects.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Coming Soon Features */}
      <section className="bg-slate-50 py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="inline-block rounded-full bg-indigo-100 px-4 py-1 text-sm font-medium text-indigo-800">
              <Sparkles className="mr-1 inline h-4 w-4" />
              Coming Soon
            </div>
            <h2 className="mt-4 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              New Features on the Horizon
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-600">
              We're constantly improving JsonVerse. Here's what's coming next on our roadmap.
            </p>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {/* Coming Soon Feature 1 */}
            <div className="rounded-lg border border-indigo-100 bg-white p-6 shadow-sm">
              <div className="mb-4 inline-flex rounded-full bg-indigo-100 p-3">
                <Rocket className="h-6 w-6 text-indigo-600" />
              </div>
              <h3 className="mb-2 text-xl font-semibold text-slate-900">
                AI-Powered Suggestions
              </h3>
              <p className="text-slate-600">
                Get intelligent suggestions for your JSON structure based on common patterns and best practices.
              </p>
              <div className="mt-4 inline-block rounded-full bg-indigo-100 px-3 py-1 text-xs font-medium text-indigo-800">
                Q3 2023
              </div>
            </div>

            {/* Coming Soon Feature 2 */}
            <div className="rounded-lg border border-indigo-100 bg-white p-6 shadow-sm">
              <div className="mb-4 inline-flex rounded-full bg-indigo-100 p-3">
                <MessageSquare className="h-6 w-6 text-indigo-600" />
              </div>
              <h3 className="mb-2 text-xl font-semibold text-slate-900">
                In-line Comments
              </h3>
              <p className="text-slate-600">
                Add comments directly to your JSON documents for better team communication and documentation.
              </p>
              <div className="mt-4 inline-block rounded-full bg-indigo-100 px-3 py-1 text-xs font-medium text-indigo-800">
                Q4 2023
              </div>
            </div>

            {/* Coming Soon Feature 3 */}
            <div className="rounded-lg border border-indigo-100 bg-white p-6 shadow-sm">
              <div className="mb-4 inline-flex rounded-full bg-indigo-100 p-3">
                <BarChart className="h-6 w-6 text-indigo-600" />
              </div>
              <h3 className="mb-2 text-xl font-semibold text-slate-900">
                Advanced Analytics
              </h3>
              <p className="text-slate-600">
                Gain insights into your JSON data with powerful analytics and visualization tools.
              </p>
              <div className="mt-4 inline-block rounded-full bg-indigo-100 px-3 py-1 text-xs font-medium text-indigo-800">
                Q1 2024
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              Simple, Transparent Pricing
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-600">
              Choose the plan that's right for you. All plans include a 14-day free trial.
            </p>
          </div>

          <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {/* Free Plan */}
            <div className="rounded-lg border border-slate-200 bg-white p-8 shadow-sm transition-all hover:shadow-md">
              <h3 className="text-2xl font-bold text-slate-900">Free</h3>
              <p className="mt-2 text-slate-600">Perfect for getting started</p>
              <div className="mt-6">
                <span className="text-4xl font-bold text-slate-900">$0</span>
                <span className="text-slate-600">/month</span>
              </div>
              <ul className="mt-6 space-y-4">
                <li className="flex items-center">
                  <CheckCircle className="mr-2 h-5 w-5 text-green-500" />
                  <span>Up to 5 JSON documents</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="mr-2 h-5 w-5 text-green-500" />
                  <span>Basic version history</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="mr-2 h-5 w-5 text-green-500" />
                  <span>JSON validation</span>
                </li>
              </ul>
              <Button className="w-full mt-8" variant="outline" onClick={() => window.location.href = '/register'}>
                Get started
              </Button>
            </div>

            {/* Pro Plan */}
            <div className="relative rounded-lg border-2 border-blue-600 bg-white p-8 shadow-md">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 rounded-full bg-blue-600 px-4 py-1 text-sm font-medium text-white">
                Most Popular
              </div>
              <h3 className="text-2xl font-bold text-slate-900">Pro</h3>
              <p className="mt-2 text-slate-600">For professionals and teams</p>
              <div className="mt-6">
                <span className="text-4xl font-bold text-slate-900">$19</span>
                <span className="text-slate-600">/month</span>
              </div>
              <ul className="mt-6 space-y-4">
                <li className="flex items-center">
                  <CheckCircle className="mr-2 h-5 w-5 text-green-500" />
                  <span>Unlimited JSON documents</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="mr-2 h-5 w-5 text-green-500" />
                  <span>Advanced version history</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="mr-2 h-5 w-5 text-green-500" />
                  <span>Team collaboration</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="mr-2 h-5 w-5 text-green-500" />
                  <span>Visual diff comparison</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="mr-2 h-5 w-5 text-green-500" />
                  <span>Priority support</span>
                </li>
              </ul>
              <Button className="w-full mt-8 bg-blue-600 hover:bg-blue-700" onClick={() => window.location.href = '/register'}>
                Start free trial
              </Button>
            </div>

            {/* Enterprise Plan */}
            <div className="rounded-lg border border-slate-200 bg-white p-8 shadow-sm transition-all hover:shadow-md">
              <h3 className="text-2xl font-bold text-slate-900">Enterprise</h3>
              <p className="mt-2 text-slate-600">For large organizations</p>
              <div className="mt-6">
                <span className="text-4xl font-bold text-slate-900">$99</span>
                <span className="text-slate-600">/month</span>
              </div>
              <ul className="mt-6 space-y-4">
                <li className="flex items-center">
                  <CheckCircle className="mr-2 h-5 w-5 text-green-500" />
                  <span>Everything in Pro</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="mr-2 h-5 w-5 text-green-500" />
                  <span>SSO authentication</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="mr-2 h-5 w-5 text-green-500" />
                  <span>Advanced permissions</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="mr-2 h-5 w-5 text-green-500" />
                  <span>Dedicated support</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="mr-2 h-5 w-5 text-green-500" />
                  <span>Custom integrations</span>
                </li>
              </ul>
              <Button className="w-full mt-8" variant="outline" onClick={() => window.location.href = '/contact'}>
                Contact sales
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="bg-slate-50 py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              What Our Users Say
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-600">
              Don't just take our word for it. Here's what our users have to say about JsonVerse.
            </p>
          </div>

          <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {/* Testimonial 1 */}
            <div className="rounded-lg bg-white p-6 shadow-sm">
              <div className="flex items-center">
                <div className="h-12 w-12 overflow-hidden rounded-full bg-blue-100">
                  <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Alex" alt="User avatar" className="h-full w-full object-cover" />
                </div>
                <div className="ml-4">
                  <h4 className="text-lg font-semibold text-slate-900">Alex Johnson</h4>
                  <p className="text-sm text-slate-600">Frontend Developer</p>
                </div>
              </div>
              <div className="mt-4 flex">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 text-yellow-400 fill-yellow-400" />
                ))}
              </div>
              <p className="mt-4 text-slate-700">
                "JsonVerse has completely transformed how our team manages configuration files. The visual diff is a game-changer for tracking changes."
              </p>
            </div>

            {/* Testimonial 2 */}
            <div className="rounded-lg bg-white p-6 shadow-sm">
              <div className="flex items-center">
                <div className="h-12 w-12 overflow-hidden rounded-full bg-blue-100">
                  <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah" alt="User avatar" className="h-full w-full object-cover" />
                </div>
                <div className="ml-4">
                  <h4 className="text-lg font-semibold text-slate-900">Sarah Miller</h4>
                  <p className="text-sm text-slate-600">CTO, TechStart</p>
                </div>
              </div>
              <div className="mt-4 flex">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 text-yellow-400 fill-yellow-400" />
                ))}
              </div>
              <p className="mt-4 text-slate-700">
                "We've reduced errors in our JSON configurations by 90% since switching to JsonVerse. The automatic validation alone is worth the price."
              </p>
            </div>

            {/* Testimonial 3 */}
            <div className="rounded-lg bg-white p-6 shadow-sm">
              <div className="flex items-center">
                <div className="h-12 w-12 overflow-hidden rounded-full bg-blue-100">
                  <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Michael" alt="User avatar" className="h-full w-full object-cover" />
                </div>
                <div className="ml-4">
                  <h4 className="text-lg font-semibold text-slate-900">Michael Chen</h4>
                  <p className="text-sm text-slate-600">Backend Engineer</p>
                </div>
              </div>
              <div className="mt-4 flex">
                {[...Array(4)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 text-yellow-400 fill-yellow-400" />
                ))}
                <Star className="h-5 w-5 text-slate-300" />
              </div>
              <p className="mt-4 text-slate-700">
                "The version history feature has saved me countless hours of debugging. Being able to roll back to previous versions is incredibly valuable."
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section with gradient background */}
      <section className="bg-gradient-to-r from-blue-600 to-indigo-700 py-16">
        <div className="container mx-auto px-4 text-center sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Ready to simplify your JSON workflow?
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-blue-100">
            Join thousands of developers who trust JsonVerse for their JSON
            versioning needs.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0">
            <Button size="lg" variant="secondary" className="group relative overflow-hidden px-8" onClick={() => window.location.href = '/register'}>
              <span className="absolute inset-0 -translate-x-full bg-white opacity-10 transition-transform group-hover:translate-x-0"></span>
              <span className="relative flex items-center">
                Start for free
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </span>
            </Button>
            <Button size="lg" variant="outline" className="border-white bg-transparent text-white hover:bg-white/10" onClick={() => window.location.href = '/demo'}>
              Watch demo
            </Button>
          </div>
          <p className="mt-6 text-sm text-blue-200">
            No credit card required. 14-day free trial. Cancel anytime.
          </p>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              Frequently Asked Questions
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-600">
              Have questions? We've got answers.
            </p>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-2">
            {/* FAQ Item 1 */}
            <div className="rounded-lg border border-slate-200 bg-white p-6">
              <h3 className="text-lg font-semibold text-slate-900">How secure is my data?</h3>
              <p className="mt-2 text-slate-600">
                Your data is encrypted both in transit and at rest. We use industry-standard security practices and regular security audits to ensure your data remains protected.
              </p>
            </div>

            {/* FAQ Item 2 */}
            <div className="rounded-lg border border-slate-200 bg-white p-6">
              <h3 className="text-lg font-semibold text-slate-900">Can I export my JSON documents?</h3>
              <p className="mt-2 text-slate-600">
                Yes, you can export your JSON documents at any time. We support various export formats including plain JSON, minified JSON, and even CSV for tabular data.
              </p>
            </div>

            {/* FAQ Item 3 */}
            <div className="rounded-lg border border-slate-200 bg-white p-6">
              <h3 className="text-lg font-semibold text-slate-900">How many team members can I add?</h3>
              <p className="mt-2 text-slate-600">
                The Pro plan allows up to 10 team members. For larger teams, our Enterprise plan offers unlimited team members with advanced permission controls.
              </p>
            </div>

            {/* FAQ Item 4 */}
            <div className="rounded-lg border border-slate-200 bg-white p-6">
              <h3 className="text-lg font-semibold text-slate-900">Do you offer discounts for startups or non-profits?</h3>
              <p className="mt-2 text-slate-600">
                Yes, we offer special pricing for startups, non-profits, and educational institutions. Contact our sales team to learn more about our discount programs.
              </p>
            </div>
          </div>

          <div className="mt-8 text-center">
            <Button variant="link" className="text-blue-600 hover:text-blue-800" onClick={() => window.location.href = '/faq'}>
              View all FAQs
              <ArrowRight className="ml-1 h-4 w-4" />
            </Button>
          </div>
        </div>
      </section>

      {/* Footer with improved layout */}
      <footer className="bg-slate-900 py-12 text-slate-400">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            <div>
              <div className="flex items-center">
                <Code className="h-6 w-6 text-blue-500" />
                <span className="ml-2 text-xl font-bold text-white">
                  JsonVerse
                </span>
              </div>
              <p className="mt-4 max-w-xs">
                The Git-like experience for your structured data. Edit, version, and collaborate on JSON documents.
              </p>
              <div className="mt-6 flex space-x-4">
                <a href="#" className="text-slate-400 hover:text-white">
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                  </svg>
                </a>
                <a href="#" className="text-slate-400 hover:text-white">
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                  </svg>
                </a>
                <a href="#" className="text-slate-400 hover:text-white">
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                  </svg>
                </a>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wider text-white">Product</h3>
              <ul className="mt-4 space-y-2">
                <li><a href="#" className="hover:text-white">Features</a></li>
                <li><a href="#" className="hover:text-white">Pricing</a></li>
                <li><a href="#" className="hover:text-white">Changelog</a></li>
                <li><a href="#" className="hover:text-white">Roadmap</a></li>
              </ul>
            </div>

            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wider text-white">Resources</h3>
              <ul className="mt-4 space-y-2">
                <li><a href="#" className="hover:text-white">Documentation</a></li>
                <li><a href="#" className="hover:text-white">Tutorials</a></li>
                <li><a href="#" className="hover:text-white">Blog</a></li>
                <li><a href="#" className="hover:text-white">Support</a></li>
              </ul>
            </div>

            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wider text-white">Company</h3>
              <ul className="mt-4 space-y-2">
                <li><a href="#" className="hover:text-white">About</a></li>
                <li><a href="#" className="hover:text-white">Careers</a></li>
                <li><a href="#" className="hover:text-white">Contact</a></li>
                <li><a href="#" className="hover:text-white">Privacy Policy</a></li>
              </ul>
            </div>
          </div>

          <div className="mt-12 border-t border-slate-800 pt-8">
            <p>
              &copy; {new Date().getFullYear()} JsonVerse. All rights
              reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
