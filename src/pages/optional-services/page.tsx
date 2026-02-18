
import { Link } from 'react-router-dom';

export default function OptionalServicesPage() {
  const services = [
    {
      icon: 'ri-shield-cross-line',
      title: 'Malpractice Insurance',
      description: 'Professional liability coverage tailored for locum tenens physicians. Coverage options for various specialties and assignment durations.',
      provider: 'Third-party insurance providers',
      features: [
        'Specialty-specific coverage',
        'Flexible policy terms',
        'Tail coverage options',
        'Competitive rates'
      ]
    },
    {
      icon: 'ri-passport-line',
      title: 'Immigration & Visa Coordination',
      description: 'Assistance with visa applications, work authorization, and immigration documentation for international physicians.',
      provider: 'Licensed immigration attorneys',
      features: [
        'J-1 and H-1B visa support',
        'Document preparation',
        'Application tracking',
        'Legal consultation'
      ]
    },
    {
      icon: 'ri-flight-takeoff-line',
      title: 'Travel & Lodging Services',
      description: 'Convenient travel booking and accommodation arrangements for your assignments. Streamlined logistics management.',
      provider: 'Travel management companies',
      features: [
        'Flight booking assistance',
        'Hotel reservations',
        'Ground transportation',
        'Expense tracking'
      ]
    },
    {
      icon: 'ri-file-list-3-line',
      title: 'Credentialing Support',
      description: 'Assistance with medical credentialing, license verification, and documentation management for multiple states.',
      provider: 'Credentialing service providers',
      features: [
        'Multi-state licensing support',
        'Document organization',
        'Application tracking',
        'Renewal reminders'
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center">
              <img src="https://public.readdy.ai/ai/img_res/21f47418-dbfd-45ca-9905-fafb6edcc45d.png" alt="LOCUM BNB" className="h-10" />
            </Link>
            <div className="hidden md:flex items-center space-x-8">
              <Link to="/" className="text-gray-700 hover:text-teal-600 transition-colors text-sm font-medium">Home</Link>
              <Link to="/for-physicians" className="text-gray-700 hover:text-teal-600 transition-colors text-sm font-medium">For Physicians</Link>
              <Link to="/for-facilities" className="text-gray-700 hover:text-teal-600 transition-colors text-sm font-medium">For Facilities</Link>
              <Link to="/how-it-works" className="text-gray-700 hover:text-teal-600 transition-colors text-sm font-medium">How It Works</Link>
              <Link to="/pricing" className="text-gray-700 hover:text-teal-600 transition-colors text-sm font-medium">Pricing</Link>
            </div>
            <div className="flex items-center space-x-4">
              <Link to="/login" className="text-teal-600 hover:text-teal-700 transition-colors text-sm font-medium whitespace-nowrap">Log In</Link>
              <Link to="/signup" className="bg-teal-600 text-white px-6 py-2.5 rounded-lg hover:bg-teal-700 transition-colors text-sm font-medium whitespace-nowrap">Sign Up</Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-16 px-6 bg-gradient-to-br from-green-50 to-white">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">Optional Services</h1>
          <p className="text-xl text-gray-600 leading-relaxed">Third-party services available to support your locum assignments. All services are optional and not required to use the platform.</p>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {services.map((service, index) => (
              <div key={index} className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                <div className="w-16 h-16 bg-teal-100 rounded-2xl flex items-center justify-center mb-6">
                  <i className={`${service.icon} text-3xl text-teal-600`}></i>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">{service.title}</h3>
                <p className="text-gray-600 leading-relaxed mb-6">{service.description}</p>
                
                <div className="bg-green-50 rounded-xl p-4 mb-6">
                  <div className="flex items-center gap-2">
                    <i className="ri-building-line text-teal-600"></i>
                    <p className="text-sm font-medium text-gray-700">Provided by: {service.provider}</p>
                  </div>
                </div>

                <div className="space-y-3">
                  {service.features.map((feature, idx) => (
                    <div key={idx} className="flex items-center gap-3">
                      <div className="w-5 h-5 bg-teal-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <i className="ri-check-line text-teal-600 text-xs"></i>
                      </div>
                      <span className="text-gray-700 text-sm">{feature}</span>
                    </div>
                  ))}
                </div>

                <div className="mt-6 pt-6 border-t border-gray-200">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <i className="ri-information-line text-teal-600"></i>
                    <span className="font-medium">Optional – Not required to use the platform</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Important Information */}
      <section className="py-20 px-6 bg-green-50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Important Information</h2>
          
          <div className="space-y-6">
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-teal-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <i className="ri-user-line text-2xl text-teal-600"></i>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">Independent Third-Party Providers</h3>
                  <p className="text-gray-600 leading-relaxed">All optional services are provided by independent third-party companies. The platform does not directly provide these services and acts only as a referral source.</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-teal-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <i className="ri-checkbox-line text-2xl text-teal-600"></i>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">Completely Optional</h3>
                  <p className="text-gray-600 leading-relaxed">None of these services are required to use the platform, browse assignments, or complete locum work. You are free to arrange your own services or use any provider of your choice.</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-teal-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <i className="ri-shield-line text-2xl text-teal-600"></i>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">No Guarantees or Endorsements</h3>
                  <p className="text-gray-600 leading-relaxed">The platform does not guarantee, underwrite, or endorse any third-party services. All agreements are directly between you and the service provider.</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-teal-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <i className="ri-money-dollar-circle-line text-2xl text-teal-600"></i>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">Separate Billing</h3>
                  <p className="text-gray-600 leading-relaxed">All optional services are billed separately by the third-party providers. These costs are not included in platform fees or assignment compensation.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Disclaimer */}
      <section className="py-16 px-6 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="bg-gray-50 rounded-2xl p-8 border border-gray-200">
            <div className="flex items-start gap-4">
              <i className="ri-alert-line text-3xl text-gray-600 flex-shrink-0"></i>
              <div>
                <h4 className="font-bold text-gray-900 text-lg mb-3">Platform Disclaimer</h4>
                <p className="text-gray-700 leading-relaxed mb-4">The platform does not provide, underwrite, or guarantee third-party services. All optional services are provided by independent companies. The platform is not responsible for the quality, availability, or performance of any third-party services.</p>
                <p className="text-gray-700 leading-relaxed">Physicians and facilities are solely responsible for evaluating and selecting service providers. Any agreements, payments, or disputes related to optional services are between you and the third-party provider.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 bg-gradient-to-br from-teal-600 to-teal-700">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">Ready to Get Started?</h2>
          <p className="text-xl text-teal-50 mb-10">Join our marketplace and access assignments with complete transparency.</p>
          <Link to="/signup" className="inline-block bg-white text-teal-600 px-10 py-4 rounded-xl hover:bg-gray-50 transition-colors text-lg font-semibold whitespace-nowrap shadow-lg cursor-pointer">
            Sign Up Now
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
            <div>
              <img src="https://public.readdy.ai/ai/img_res/21f47418-dbfd-45ca-9905-fafb6edcc45d.png" alt="LOCUM BNB" className="h-10 mb-4 brightness-0 invert" />
              <p className="text-gray-400 text-sm leading-relaxed">The transparent healthcare marketplace connecting physicians and facilities.</p>
            </div>
            <div>
              <h4 className="font-bold text-white mb-4">Platform</h4>
              <ul className="space-y-3">
                <li><Link to="/" className="text-gray-400 hover:text-teal-400 transition-colors text-sm">Home</Link></li>
                <li><Link to="/for-physicians" className="text-gray-400 hover:text-teal-400 transition-colors text-sm">For Physicians</Link></li>
                <li><Link to="/for-facilities" className="text-gray-400 hover:text-teal-400 transition-colors text-sm">For Facilities</Link></li>
                <li><Link to="/how-it-works" className="text-gray-400 hover:text-teal-400 transition-colors text-sm">How It Works</Link></li>
                <li><Link to="/pricing" className="text-gray-400 hover:text-teal-400 transition-colors text-sm">Pricing</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-white mb-4">Resources</h4>
              <ul className="space-y-3">
                <li><Link to="/optional-services" className="text-gray-400 hover:text-teal-400 transition-colors text-sm">Optional Services</Link></li>
                <li><Link to="/payments" className="text-gray-400 hover:text-teal-400 transition-colors text-sm">Payments</Link></li>
                <li><Link to="/legal" className="text-gray-400 hover:text-teal-400 transition-colors text-sm">Legal & Disclaimers</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-white mb-4">Legal</h4>
              <ul className="space-y-3">
                <li><Link to="/privacy" className="text-gray-400 hover:text-teal-400 transition-colors text-sm">Privacy Policy</Link></li>
                <li><Link to="/terms" className="text-gray-400 hover:text-teal-400 transition-colors text-sm">Terms of Service</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-gray-400 text-sm">© 2025 LOCUM BNB. All rights reserved.</p>
            <div className="flex items-center gap-6">
              <Link to="/privacy" className="text-gray-400 hover:text-teal-400 transition-colors text-sm">Privacy Policy</Link>
              <Link to="/terms" className="text-gray-400 hover:text-teal-400 transition-colors text-sm">Terms of Service</Link>
              <a href="https://readdy.ai/?ref=logo" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-teal-400 transition-colors text-sm">Powered by Readdy</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
