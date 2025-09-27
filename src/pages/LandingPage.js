import React from 'react';
import { 
  Building, 
  Plus, 
  Search, 
  FileText, 
  Eye, 
  BarChart, 
  ArrowRight,
  Phone,
  Mail,
  MapPin as MapPinIcon
} from 'lucide-react';

const LandingPage = ({ onNavigate }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <Building className="w-8 h-8 text-blue-600" />
              <div>
                <h1 className="text-xl font-bold text-gray-900">Citizen Portal</h1>
                <p className="text-sm text-gray-600">Government Services</p>
              </div>
            </div>
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-4 text-sm text-gray-600">
                <div className="flex items-center space-x-1">
                  <Phone className="w-4 h-4" />
                  <span>1800-123-4567</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Mail className="w-4 h-4" />
                  <span>help@citizenportal.gov</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Your Voice,
              <span className="text-blue-600"> Our Action</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
              Report civic issues, track progress, and help build a better community. 
              Your complaints reach the right authorities instantly.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => onNavigate('complaint-form')}
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-lg font-semibold text-lg flex items-center justify-center space-x-2 transition-all transform hover:scale-105"
              >
                <Plus className="w-5 h-5" />
                <span>Report an Issue</span>
              </button>
              <button
                onClick={() => onNavigate('track-complaint')}
                className="bg-white hover:bg-gray-50 text-gray-900 border-2 border-gray-300 px-8 py-4 rounded-lg font-semibold text-lg flex items-center justify-center space-x-2 transition-all transform hover:scale-105"
              >
                <Search className="w-5 h-5" />
                <span>Track Status</span>
              </button>
            </div>
          </div>

          {/* Service Cards */}
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <div className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-shadow">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mb-6">
                <FileText className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-4">Report Issues</h3>
              <p className="text-gray-600 mb-6">
                Submit complaints about roads, sanitation, utilities, and public services with photo evidence.
              </p>
              <button
                onClick={() => onNavigate('complaint-form')}
                className="text-blue-600 font-semibold flex items-center space-x-2 hover:text-blue-700"
              >
                <span>Get Started</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            <div className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-shadow">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mb-6">
                <Eye className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold mb-4">Track Progress</h3>
              <p className="text-gray-600 mb-6">
                Monitor the status of your complaints in real-time and receive updates on resolution.
              </p>
              <button
                onClick={() => onNavigate('track-complaint')}
                className="text-green-600 font-semibold flex items-center space-x-2 hover:text-green-700"
              >
                <span>Track Now</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            <div className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-shadow">
              <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mb-6">
                <BarChart className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold mb-4">Official Access</h3>
              <p className="text-gray-600 mb-6">
                Government officials and administrators can manage and respond to citizen complaints.
              </p>
              <button
                onClick={() => onNavigate('admin-login')}
                className="text-purple-600 font-semibold flex items-center space-x-2 hover:text-purple-700"
              >
                <span>Login</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Statistics */}
          <div className="bg-white rounded-xl p-8 shadow-lg">
            <h3 className="text-2xl font-bold text-center mb-8">Our Impact</h3>
            <div className="grid md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600 mb-2">1,247</div>
                <div className="text-gray-600">Issues Reported</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600 mb-2">892</div>
                <div className="text-gray-600">Issues Resolved</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-yellow-600 mb-2">3.2 days</div>
                <div className="text-gray-600">Avg. Resolution</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600 mb-2">4.8★</div>
                <div className="text-gray-600">Satisfaction Rating</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <Building className="w-8 h-8 text-blue-400" />
                <div>
                  <h3 className="font-bold">Citizen Portal</h3>
                  <p className="text-sm text-gray-400">Government Services</p>
                </div>
              </div>
              <p className="text-gray-400">
                Connecting citizens with their government for better community services.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-gray-400">
                <li><button onClick={() => onNavigate('complaint-form')} className="hover:text-white">Report Issue</button></li>
                <li><button onClick={() => onNavigate('track-complaint')} className="hover:text-white">Track Status</button></li>
                <li><button className="hover:text-white">FAQ</button></li>
                <li><button className="hover:text-white">Guidelines</button></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Categories</h4>
              <ul className="space-y-2 text-gray-400">
                <li>Roads & Infrastructure</li>
                <li>Sanitation & Cleanliness</li>
                <li>Utilities & Services</li>
                <li>Public Safety</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Contact</h4>
              <div className="space-y-2 text-gray-400">
                <div className="flex items-center space-x-2">
                  <Phone className="w-4 h-4" />
                  <span>1800-123-4567</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Mail className="w-4 h-4" />
                  <span>help@citizenportal.gov</span>
                </div>
                <div className="flex items-center space-x-2">
                  <MapPinIcon className="w-4 h-4" />
                  <span>City Hall, Main Street</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 Citizen Portal. All rights reserved. | Privacy Policy | Terms of Service</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;