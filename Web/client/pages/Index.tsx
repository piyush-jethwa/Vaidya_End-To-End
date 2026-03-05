import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Calendar,
  Clock,
  Heart,
  Shield,
  Star,
  Users,
  Phone,
  Mail,
  MapPin,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Stethoscope,
  UserPlus,
  ClipboardList,
  CheckCircle,
  Bot,
  Brain,
  Building2,
} from "lucide-react";

export default function Index() {
  const [contactForm, setContactForm] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle contact form submission
    console.log("Contact form submitted:", contactForm);
    // Reset form
    setContactForm({ name: "", email: "", message: "" });
  };

  const reviews = [
    {
      name: "Sarah",
      rating: 5,
      review:
        "Excellent service! The online booking system made it so easy to schedule my appointment. Dr. Smith was very professional and thorough.",
      date: "2 weeks ago",
    },
    {
      name: "Michael",
      rating: 5,
      review:
        "The AI symptom checker helped me understand my condition better before my appointment. Great technology integration!",
      date: "1 month ago",
    },
    {
      name: "Emily",
      rating: 4,
      review:
        "Very convenient platform. The appointment reminders and status updates kept me informed throughout the process.",
      date: "3 weeks ago",
    },
  ];

  const features = [
    {
      icon: Calendar,
      title: "AI-Powered Booking",
      description:
        "Smart appointment scheduling with AI recommendations for optimal doctor-patient matching",
    },
    {
      icon: Stethoscope,
      title: "Intelligent Symptom Analysis",
      description:
        "Advanced AI diagnosis support with real-time symptom assessment and urgency detection",
    },
    {
      icon: Clock,
      title: "24/7 AI Assistant",
      description:
        "Round-the-clock AI support for health queries, appointment management, and medical guidance",
    },
    {
      icon: Shield,
      title: "AI-Enhanced Security",
      description:
        "Machine learning-powered data protection with predictive privacy safeguards",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100">
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <Heart className="h-8 w-8 text-purple-600" />
              <span className="text-xl font-bold text-gray-900">VAIDYA AI</span>
            </div>
            <div className="hidden md:flex space-x-8">
              <a
                href="#home"
                className="text-gray-700 hover:text-purple-600 transition-colors"
              >
                Home
              </a>
              <a
                href="#about"
                className="text-gray-700 hover:text-purple-600 transition-colors"
              >
                About
              </a>
              <a
                href="#reviews"
                className="text-gray-700 hover:text-purple-600 transition-colors"
              >
                Reviews
              </a>
              <a
                href="#contact"
                className="text-gray-700 hover:text-purple-600 transition-colors"
              >
                Contact
              </a>
            </div>
            <div className="flex space-x-2">
              <Link to="/hospital-command-center">
                <Button variant="outline" size="sm" className="border-indigo-600 text-indigo-600 hover:bg-indigo-600 hover:text-white">
                  <Building2 className="h-4 w-4 mr-1" />
                  Hospital Command Center
                </Button>
              </Link>
              <Link to="/doctor/login">
                <Button variant="outline" size="sm">
                  Doctor Login
                </Button>
              </Link>
              <Link to="/patient/login">
                <Button size="sm" className="bg-purple-600 hover:bg-purple-700">
                  Patient Login
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section id="home" className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="https://cdn.builder.io/api/v1/image/assets%2F68f5a1a4b9614e76ae3556fbd8a7bd53%2F76b421869fea404e842accfe27bc8bd5?format=webp&width=800"
            alt="Medical Professional"
            className="w-full h-full object-cover opacity-20"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-blue-600/20"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 mb-6">
                AI-Powered Healthcare,
                <span className="text-purple-600"> 24/7</span>
              </h1>
              <p className="text-xl text-gray-600 mb-8">
                Experience the future of healthcare with VAIDYA AI. Get instant
                AI consultations, smart symptom analysis, seamless appointment
                booking, and 24/7 AI assistance for all your health needs.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/book-appointment">
                  <Button
                    size="lg"
                    className="bg-purple-600 hover:bg-purple-700"
                  >
                    Book Appointment
                  </Button>
                </Link>
                <a href="https://ai-chatbot-personal.streamlit.app/" target="_blank" rel="noopener noreferrer">
                  <Button size="lg" variant="outline">
                    Check Symptoms
                  </Button>
                </a>
                <a href="https://medcare-1.streamlit.app/" target="_blank" rel="noopener noreferrer">
                  <Button size="lg" variant="outline" className="border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white">
                    Check Report/X-ray
                  </Button>
                </a>
              </div>

              <div className="mt-12 grid grid-cols-3 gap-8">
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">500+</div>
                  <div className="text-sm text-gray-600">
                    AI-Verified Doctors
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">50k+</div>
                  <div className="text-sm text-gray-600">AI Consultations</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">95%</div>
                  <div className="text-sm text-gray-600">AI Accuracy</div>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-2xl">
                <h3 className="text-2xl font-semibold mb-6 text-gray-900">
                  Quick Actions
                </h3>
                <div className="space-y-4">
                  <Link to="/patient/login">
                    <div className="flex items-center space-x-3 p-3 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors cursor-pointer">
                      <UserPlus className="h-6 w-6 text-purple-600" />
                      <span className="text-gray-700">Register as Patient</span>
                    </div>
                  </Link>
                  <Link to="/book-appointment">
                    <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors cursor-pointer">
                      <Calendar className="h-6 w-6 text-blue-600" />
                      <span className="text-gray-700">Book Appointment</span>
                    </div>
                  </Link>
                  <a href="https://ai-chatbot-personal.streamlit.app/" target="_blank" rel="noopener noreferrer">
                    <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg hover:bg-green-100 transition-colors cursor-pointer">
                      <ClipboardList className="h-6 w-6 text-green-600" />
                      <span className="text-gray-700">Check Symptoms</span>
                    </div>
                  </a>
                  <Link to="/doctor/login">
                    <div className="flex items-center space-x-3 p-3 bg-orange-50 rounded-lg hover:bg-orange-100 transition-colors cursor-pointer">
                      <Stethoscope className="h-6 w-6 text-orange-600" />
                      <span className="text-gray-700">Doctor Portal</span>
                    </div>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Why Choose VAIDYA AI?
            </h2>
            <p className="text-xl text-gray-600">
              Experience next-generation healthcare powered by artificial
              intelligence
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card
                key={index}
                className="text-center hover:shadow-lg transition-shadow"
              >
                <CardHeader>
                  <div className="mx-auto w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                    <feature.icon className="h-6 w-6 text-purple-600" />
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-gray-600">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6">
                About VAIDYA AI
              </h2>
              <p className="text-lg text-gray-600 mb-6">
                We're revolutionizing healthcare through artificial
                intelligence, making it more accessible, convenient, and
                personalized. Our AI-powered platform connects patients with
                top-quality doctors while providing intelligent insights,
                virtual assistance, and automated health monitoring to help you
                make informed decisions about your health.
              </p>
              <p className="text-lg text-gray-600 mb-8">
                Founded by AI researchers, healthcare professionals and
                technology experts, VAIDYA AI leverages cutting-edge artificial
                intelligence to transform the healthcare experience for both
                patients and doctors.
              </p>

              <div className="grid grid-cols-2 gap-6">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                  <span className="text-gray-700">24/7 Support</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                  <span className="text-gray-700">Verified Doctors</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                  <span className="text-gray-700">Secure Platform</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                  <span className="text-gray-700">AI Technology</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white p-6 rounded-lg shadow-md">
                <Users className="h-8 w-8 text-purple-600 mb-3" />
                <div className="text-2xl font-bold text-gray-900">8,000+</div>
                <div className="text-gray-600">Happy Patients</div>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md">
                <Stethoscope className="h-8 w-8 text-blue-600 mb-3" />
                <div className="text-2xl font-bold text-gray-900">500+</div>
                <div className="text-gray-600">Expert Doctors</div>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md">
                <Calendar className="h-8 w-8 text-green-600 mb-3" />
                <div className="text-2xl font-bold text-gray-900">50,000+</div>
                <div className="text-gray-600">Appointments</div>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md">
                <Heart className="h-8 w-8 text-red-600 mb-3" />
                <div className="text-2xl font-bold text-gray-900">99%</div>
                <div className="text-gray-600">Satisfaction</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Reviews Section */}
      <section id="reviews" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              What Our Patients Say
            </h2>
            <p className="text-xl text-gray-600">
              Real experiences from real people
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {reviews.map((review, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center space-x-1 mb-2">
                    {[...Array(review.rating)].map((_, i) => (
                      <Star
                        key={i}
                        className="h-4 w-4 fill-yellow-400 text-yellow-400"
                      />
                    ))}
                  </div>
                  <CardTitle className="text-lg">{review.name}</CardTitle>
                  <CardDescription className="text-sm text-gray-500">
                    {review.date}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">{review.review}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Get In Touch
            </h2>
            <p className="text-xl text-gray-600">
              Have questions? We're here to help
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12">
            <div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-6">
                Contact Information
              </h3>
              <div className="space-y-6">
                <div className="flex items-center space-x-3">
                  <Phone className="h-6 w-6 text-purple-600" />
                  <span className="text-gray-700">+91 9182736455</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Mail className="h-6 w-6 text-purple-600" />
                  <span className="text-gray-700">support@vaidyaai.com</span>
                </div>
                <div className="flex items-center space-x-3">
                  <MapPin className="h-6 w-6 text-purple-600" />
                  <span className="text-gray-700">
                    Yashoda Technical Campus
                  </span>
                </div>
              </div>

              <div className="mt-8">
                <h4 className="text-lg font-semibold text-gray-900 mb-4">
                  Office Hours
                </h4>
                <div className="space-y-2 text-gray-600">
                  <div>Monday - Friday: 8:00 AM - 6:00 PM</div>
                  <div>Saturday: 9:00 AM - 4:00 PM</div>
                  <div>Sunday: Emergency only</div>
                </div>
              </div>
            </div>

            <div>
              <Card>
                <CardHeader>
                  <CardTitle>Send us a message</CardTitle>
                  <CardDescription>
                    We'll get back to you within 24 hours
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleContactSubmit} className="space-y-4">
                    <div>
                      <Input
                        placeholder="Your Name"
                        value={contactForm.name}
                        onChange={(e) =>
                          setContactForm({
                            ...contactForm,
                            name: e.target.value,
                          })
                        }
                        required
                      />
                    </div>
                    <div>
                      <Input
                        type="email"
                        placeholder="Your Email"
                        value={contactForm.email}
                        onChange={(e) =>
                          setContactForm({
                            ...contactForm,
                            email: e.target.value,
                          })
                        }
                        required
                      />
                    </div>
                    <div>
                      <Textarea
                        placeholder="Your Message"
                        rows={4}
                        value={contactForm.message}
                        onChange={(e) =>
                          setContactForm({
                            ...contactForm,
                            message: e.target.value,
                          })
                        }
                        required
                      />
                    </div>
                    <Button
                      type="submit"
                      className="w-full bg-purple-600 hover:bg-purple-700"
                    >
                      Send Message
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Heart className="h-8 w-8 text-purple-400" />
                <span className="text-xl font-bold">VAIDYA AI</span>
              </div>
              <p className="text-gray-400">
                Your trusted partner in healthcare, providing innovative
                solutions for better health outcomes.
              </p>
            </div>

            <div>
              <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
              <div className="space-y-2">
                <a
                  href="#home"
                  className="text-gray-400 hover:text-white transition-colors block"
                >
                  Home
                </a>
                <a
                  href="#about"
                  className="text-gray-400 hover:text-white transition-colors block"
                >
                  About
                </a>
                <a
                  href="#reviews"
                  className="text-gray-400 hover:text-white transition-colors block"
                >
                  Reviews
                </a>
                <a
                  href="#contact"
                  className="text-gray-400 hover:text-white transition-colors block"
                >
                  Contact
                </a>
              </div>
            </div>

            <div>
              <h4 className="text-lg font-semibold mb-4">Services</h4>
              <div className="space-y-2">
                <a
                  href="#"
                  className="text-gray-400 hover:text-white transition-colors block"
                >
                  Book Appointment
                </a>
                <a
                  href="#"
                  className="text-gray-400 hover:text-white transition-colors block"
                >
                  Symptom Checker
                </a>
                <a
                  href="#"
                  className="text-gray-400 hover:text-white transition-colors block"
                >
                  Doctor Portal
                </a>
                <a
                  href="#"
                  className="text-gray-400 hover:text-white transition-colors block"
                >
                  Patient Portal
                </a>
                <a
                  href="#"
                  className="text-gray-400 hover:text-white transition-colors block"
                >
                  Check Report/X-ray
                </a>
              </div>
            </div>

            <div>
              <h4 className="text-lg font-semibold mb-4">Follow Us</h4>
              <div className="flex space-x-4">
                <Facebook className="h-6 w-6 text-gray-400 hover:text-white cursor-pointer transition-colors" />
                <Twitter className="h-6 w-6 text-gray-400 hover:text-white cursor-pointer transition-colors" />
                <Instagram className="h-6 w-6 text-gray-400 hover:text-white cursor-pointer transition-colors" />
                <Linkedin className="h-6 w-6 text-gray-400 hover:text-white cursor-pointer transition-colors" />
              </div>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-8 pt-8 text-center">
            <p className="text-gray-400">
              © 2025 VAIDYA AI. All rights reserved. | Privacy Policy | Terms
              of Service
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
