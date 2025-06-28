import React, { useState } from 'react';

import ContactForm from './ContactForm';



import { MapPin, Route, DollarSign, Clock, Star, Download, Mail, Phone, User, Code, Palette } from 'lucide-react';

const AboutSection = () => {
  const [flippedCard, setFlippedCard] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });

  const features = [
    {
      icon: <Route className="w-8 h-8" />,
      title: "Smart Route Planner",
      description: "Optimized routes with cost, time, and comfort filters for the best travel experience."
    },
    {
      icon: <MapPin className="w-8 h-8" />,
      title: "Multimodal Transport",
      description: "Metro, bus, train, auto, and walking suggestions based on your preferences."
    },
    {
      icon: <Star className="w-8 h-8" />,
      title: "Tourist Spots Explorer",
      description: "Discover monuments, attractions, and hidden gems in every city."
    },
    {
      icon: <DollarSign className="w-8 h-8" />,
      title: "Budget Estimation",
      description: "Smart budget recommendations and cost breakdowns for your entire trip."
    },
    {
      icon: <Clock className="w-8 h-8" />,
      title: "City-wise Dynamic Pages",
      description: "Personalized content and recommendations for each destination."
    },
    {
      icon: <User className="w-8 h-8" />,
      title: "Smart UI/UX",
      description: "Intuitive interface designed around real travel problems and user needs."
    }
  ];

    const teamMembers = [
   
    {
      id: 1,
      name: "Nikhil Rai",
      role: "MERN Stack Developer",
      photo: "/images/nikhil.png",
      front: {
        description: "Full-stack developer specializing in the MERN stack, focused on building responsive, high-performance web applications. I turn ideas into scalable, maintainable code with seamless frontend experiences and robust backend architecture",
        resumeLink: "/videos/nikhil-rai.pdf"
      },
      back: {
        tools: ["React", "Node", "Tailwind CSS", "Express", "SQL", "MongoDB", "Git"],
        responsibilities: [
          "Backend Development",
          "Performance Optimization",
          "Cross-browser Compatibility",
          "Responsive Design Implementation",
          
        ],
        contact: "rainikhil723@gmail.com"
      }
    },
     {
      id: 2,
      name: "Santosh Rawat",
      role: "UI/UX Designer",
      photo: "/images/santosh.jpg",
      front: {
        description: "I design meaningful and aesthetically pleasing digital interfaces that simplify user interaction. Passionate about crafting experiences that connect users seamlessly with technology.",
        resumeLink: "/videos/santosh-rawat.pdf"
      },
      back: {
        tools: ["Figma", "Adobe XD", "Sketch", "Photoshop", "Canva", "Cad Modelling"],
        responsibilities: [
          "User Research & Analysis",
          "Design Web Development",
          "Logo Design & Branding",
          "Brand Identity Design"
        ],
        contact: "rawatsantosh2005@gmail.com"
      }
    },
    {
      id: 3,
      name: "ChandraShekhar Singh",
      role: "Frontend Developer",
      photo: "/images/shekhar.jpg",
      front: {
        description: "Frontend specialist focused on creating responsive, accessible web applications. I bring designs to life with clean code and smooth user experiences.",
        resumeLink: "/videos/chandrashekhar-singh.pdf"
      },
      back: {
        tools: ["HTML", "CSS", "JavaScript", "React", "Tailwind CSS", "Git"],
        responsibilities: [
         "Responsive Design Implementation",
         "Frontend Development",
        "Code Review & Mentoring"
        ],
        contact: "shekhar5980singh@gmail.com"
      }
    }
  ];

  const handleCardFlip = (cardId) => {
    setFlippedCard(flippedCard === cardId ? null : cardId);
  };

  const handleFormChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = () => {
    if (formData.name && formData.email && formData.message) {
      alert('Thank you for your message! We\'ll get back to you soon.');
      setFormData({ name: '', email: '', message: '' });
    } else {
      alert('Please fill in all fields.');
    }
  };

  return (
    <div className="min-h-screen bg-white relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-32 h-32 bg-blue-300 rounded-full opacity-20 animate-pulse"></div>
        <div className="absolute top-40 right-20 w-24 h-24 bg-yellow-300 rounded-full opacity-30 animate-bounce" style={{animationDelay: '1s'}}></div>
        <div className="absolute bottom-32 left-1/4 w-40 h-40 bg-blue-50 rounded-full opacity-25 animate-pulse" style={{animationDelay: '2s'}}></div>
        <div className="absolute bottom-20 right-1/3 w-28 h-28 bg-yellow-50 rounded-full opacity-20 animate-bounce" style={{animationDelay: '0.5s'}}></div>
      </div>

      {/* Hero Section */}
      <section className="relative pt-20 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="mb-8">
              <div className="inline-flex items-center justify-center w-24 h-24 rounded-full overflow-hidden mb-6">
  <img 
    src="/images/logo.jpg" 
    alt="BhramanAI Logo" 
    className="w-full h-full object-cover"
  />
</div>

            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              About <span className="text-blue-600">BhramanAI</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8 leading-relaxed">
              BhramanAI is your intelligent travel companion that revolutionizes trip planning with AI-powered route optimization, 
              budget estimation, and personalized recommendations. Say goodbye to travel hassles and hello to seamless journeys.
            </p>
            
          {/* Video Section */}
<div class="max-w-2x1 mx-10 mb-20 aspect-[16/16] ">
  <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl p-8 shadow-2xl">
    <div className="bg-gray-900 rounded-xl aspect-video overflow-hidden">
      <iframe
        className="w-full h-full"
        src="https://drive.google.com/file/d/1hWUebYfn1dbVwOCNBfcleIxbAweGoy3T/preview"
        allow="autoplay"
        allowFullScreen
      ></iframe>
    </div>
  </div>
</div>

{/* UI Showcase */}
<div className="grid grid-cols-1 md:grid-cols-3 gap-14 max-w-4xl mx-auto">
  {[1, 2, 3].map((i) => (
    <div key={i} className="w-64 h-40 mx-auto rounded-xl overflow-hidden shadow-lg">
      <img
        src={`/images/${i}.jpg`}
        className="w-full h-full object-cover"
        alt={`UI showcase ${i}`}
      />
    </div>
  ))}
</div>



          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Powerful Features</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Discover what makes BhramanAI the ultimate travel planning solution
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
                <div className="text-blue-600 mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

{/* Team Section */}
<section className="py-20 bg-gray-50 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-indigo-100 opacity-50"></div>
      <div className="absolute top-10 right-10 w-64 h-64 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse"></div>
      <div className="absolute bottom-10 left-10 w-64 h-64 bg-indigo-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse delay-1000"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Meet Our Team
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            The talented individuals behind BhramanAI's success
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {teamMembers.map((member) => (
            <div key={member.id} className="group perspective-1000 h-96">
              <div 
                className={`relative w-full h-full cursor-pointer transition-transform duration-700 transform-style-preserve-3d ${
                  flippedCard === member.id ? 'rotate-y-180' : ''
                }`}
                onClick={() => handleCardFlip(member.id)}
              >
                {/* Front of Card */}
                <div className="absolute inset-0 w-full h-full backface-hidden">
                  <div className="h-full aspect-[4/5] max-w-xs mx-auto p-6 bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 flex flex-col items-center justify-center">
                    <div className="mb-6">
                      <div className="w-24 h-24 overflow-hidden rounded-full border-4 border-white shadow-md">
                        <img 
                          src={member.photo}
                          alt={member.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>
                    
                    <h3 className="text-2xl font-bold mb-0 text-center">{member.name}</h3>
                    <p className="text-blue-100 text-lg mb-1 font-medium">{member.role}</p>
                    
                    <p className="text-[11px] md:text-sm text-center mt-0 text-blue-50 leading-relaxed line-clamp-4">
  {member.front.description}
</p>

                    
                    <a 
                      href={member.front.resumeLink} 
                      download 
                      className="mt-4 inline-flex items-center gap-2 bg-white text-blue-600 font-medium py-2 px-4 rounded-lg text-sm shadow hover:bg-blue-100 transition-all duration-200 hover:scale-105"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Download className="w-4 h-4" />
                      Download Resume
                    </a>
                    
                    <div className="mt-4 text-sm opacity-75 animate-pulse">
                      Click to learn more
                    </div>
                  </div>
                </div>

                {/* Back of Card */}
                <div className="absolute inset-0 w-full h-full backface-hidden rotate-y-180">
                  <div className="h-full aspect-[4/5] max-w-xs mx-auto bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
                    <div className="h-full flex flex-col p-6">
                      <div className="text-center mb-0">
                        <div className="mb-0">
                          <div className="w-16 h-16 rounded-full border-2 border-blue-500 overflow-hidden mx-auto bg-gray-100">
                            <img 
                              src={member.photo}
                              alt={member.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        </div>
                        <h3 className="text-lg font-bold text-gray-900">{member.name}</h3>
                        <p className="text-blue-600 text-sm font-medium">{member.role}</p>
                      </div>
                      
                      <div className="flex-1 space-y-4 overflow-hidden">
                        <div>
                          <h4 className="font-semibold text-gray-900 mb-2 flex items-center text-sm">
                            <Code className="w-4 h-4 mr-2 text-blue-500" />
                            Tools & Technologies
                          </h4>
                          <div className="flex flex-wrap gap-2">
                            {member.back.tools.map((tool, i) => (
                              <span 
                                key={i} 
                                className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full font-medium hover:bg-blue-200 transition-colors"
                              >
                                {tool}
                              </span>
                            ))}
                          </div>
                        </div>
                        
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-900 mb-2 flex items-center text-sm">
                            <Palette className="w-4 h-4 mr-2 text-blue-500" />
                            Key Responsibilities
                          </h4>
                          <ul className="text-xs text-gray-600 space-y-1">
                            {member.back.responsibilities.map((resp, i) => (
                              <li key={i} className="flex items-start">
                                <span className="text-blue-500 mr-2 mt-1">•</span>
                                <span>{resp}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                      
                      <div className="mt-4 pt-4 border-t border-gray-100">
                        <p className="text-xs text-gray-500 flex items-center hover:text-blue-600 transition-colors">
                          <Mail className="w-3 h-3 mr-2" />
                          {member.back.contact}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <style jsx>{`
        .perspective-1000 {
          perspective: 1000px;
        }
        .transform-style-preserve-3d {
          transform-style: preserve-3d;
        }
        .backface-hidden {
          backface-visibility: hidden;
        }
        .rotate-y-180 {
          transform: rotateY(180deg);
        }
        .line-clamp-4 {
          display: -webkit-box;
          -webkit-line-clamp: 4;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </section>
    
      {/* Download Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-blue-700 relative">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-white mb-4">Project Documentation</h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Get detailed insights into BhramanAI's architecture, features, and technical specifications
          </p>
          
          <a
  href="https://www.canva.com/design/DAGk3sm36C0/rJm39Z-OniWBs1QIcAuUyw/edit?utm_content=DAGk3sm36C0&utm_campaign=designshare&utm_medium=link2&utm_source=sharebutton"
  target="_blank"
  rel="noopener noreferrer"
  className="inline-flex items-center px-8 py-4 bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
>
  <Download className="w-6 h-6 mr-3" />
  Download Project SRS (PDF)
</a>

          
          <p className="text-blue-200 text-sm mt-4">Complete Software Requirements Specification Document</p>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20 bg-gray-50 relative">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Get In Touch</h2>
            <p className="text-xl text-gray-600">
              Have questions about BhramanAI? We'd love to hear from you!
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <ContactForm />

            {/* Contact Information */}
            <div className="space-y-8">
              <div className="bg-white rounded-2xl p-8 shadow-lg">
                <h3 className="text-xl font-semibold text-gray-900 mb-6">Contact Information</h3>
                
                <div className="space-y-4">
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                      <Mail className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">Email</p>
                      <p className="text-gray-600">rainikhil723@gmail.com   </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center mr-4">
                      <Phone className="w-6 h-6 text-yellow-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">Phone</p>
                      <p className="text-gray-600">+91 7838758231 || 8130237219 || 9968429840</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mr-4">
                      <MapPin className="w-6 h-6 text-green-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">Location</p>
                      <p className="text-gray-600">Palam, Ramesh Nagar , Nangli ,New Delhi, India</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl p-8 text-white">
                <h3 className="text-xl font-semibold mb-4">Ready to Transform Your Travel?</h3>
                <p className="text-blue-100 mb-6">
                  Join thousands of travelers who trust BhramanAI for their journey planning needs.
                </p>
                <button onClick={() => window.location.href = '/'} className="bg-white text-blue-600 font-semibold px-6 py-3 rounded-lg hover:bg-blue-50 transition-colors">
                   Try BhramanAI Now
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <style jsx>{`
        .transform-style-preserve-3d {
          transform-style: preserve-3d;
        }
        .backface-hidden {
          backface-visibility: hidden;
        }
        .rotate-y-180 {
          transform: rotateY(180deg);
        }
      `}</style>
    </div>
  );
};

export default AboutSection;  
