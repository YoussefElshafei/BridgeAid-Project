import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, CheckSquare, Download, Play, Award, AlertTriangle, Home as HomeIcon, Droplets, Flame, Wind, Thermometer, Heart, Menu, X, User } from 'lucide-react';
import jsPDF from 'jspdf';

// Navigation Bar Component
const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [userEmail, setUserEmail] = useState(null);

  // Check for logged in user on component mount
  useEffect(() => {
    const email = localStorage.getItem('userEmail');
    if (email) {
      setUserEmail(email);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userEmail');
    setUserEmail(null);
    window.location.href = '/';
  };

  // Extract username from email (part before @)
  const getUsername = (email) => {
    return email ? email.split('@')[0] : '';
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-slate-900/95 backdrop-blur-lg border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo and Login - Left Side */}
          <div className="flex items-center gap-8">
            <Link to="/" className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-yellow-500 rounded-lg flex items-center justify-center">
                <Flame className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold text-white">BridgeAid</span>
            </Link>
            
            {userEmail ? (
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 px-4 py-2 bg-slate-800 rounded-lg text-white">
                  <User className="w-4 h-4" />
                  <span className="font-medium">{getUsername(userEmail)}</span>
                </div>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg transition-colors text-white font-medium"
                >
                  Logout
                </button>
              </div>
            ) : (
              <Link to="/login" className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors text-white">
                <User className="w-4 h-4" />
                <span className="font-medium">Login</span>
              </Link>
            )}
          </div>

          {/* Desktop Navigation - Right Side */}
          <div className="hidden md:flex items-center gap-6">
            <Link to="/" className="text-slate-300 hover:text-white transition-colors font-medium">
              Homepage
            </Link>
            <Link to="/prepare" className="text-orange-400 font-medium">
              Prepare
            </Link>
            <Link to="/recovery" className="text-slate-300 hover:text-white transition-colors font-medium">
              Recovery
            </Link>
            <Link to="/report" className="text-slate-300 hover:text-white transition-colors font-medium">
              Report
            </Link>
            <Link to="/request-aid" className="text-slate-300 hover:text-white transition-colors font-medium">
              Request Aid
            </Link>
            <Link to="/volunteer" className="text-slate-300 hover:text-white transition-colors font-medium">
              Volunteer
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden text-white"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation Menu */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 pb-4 space-y-3">
            <Link to="/" className="block text-slate-300 hover:text-white transition-colors font-medium py-2">
              Homepage
            </Link>
            <Link to="/prepare" className="block text-orange-400 font-medium py-2">
              Prepare
            </Link>
            <Link to="/recovery" className="block text-slate-300 hover:text-white transition-colors font-medium py-2">
              Recovery
            </Link>
            <Link to="/report" className="block text-slate-300 hover:text-white transition-colors font-medium py-2">
              Report
            </Link>
            <Link to="/request-aid" className="block text-slate-300 hover:text-white transition-colors font-medium py-2">
              Request Aid
            </Link>
            <Link to="/volunteer" className="block text-slate-300 hover:text-white transition-colors font-medium py-2">
              Volunteer
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
};

// Main Prepare Page Component
const PreparePage = () => {
  const [selectedDisaster, setSelectedDisaster] = useState(null);
  const [checklist, setChecklist] = useState([]);
  const [quizScore, setQuizScore] = useState(null);

  const disasterTypes = [
    {
      id: 'earthquake',
      name: 'Earthquake',
      icon: AlertTriangle,
      color: 'from-amber-500 to-orange-600',
      description: 'Learn how to stay safe before, during, and after an earthquake',
      tips: [
        'Secure heavy furniture and appliances to walls',
        'Create a family emergency communication plan',
        'Identify safe spots in each room (under sturdy tables)',
        'Keep emergency supplies and flashlights accessible',
        'Practice "Drop, Cover, and Hold On" drills regularly'
      ],
      supplies: ['First aid kit', 'Water (1 gallon per person per day)', 'Non-perishable food', 'Flashlight', 'Battery radio', 'Whistle', 'Dust masks']
    },
    {
      id: 'flood',
      name: 'Flood',
      icon: Droplets,
      color: 'from-blue-500 to-cyan-600',
      description: 'Learn how to stay safe before, during, and after a flood incident',
      tips: [
        'Know your flood risk and evacuation routes',
        'Move valuable items to higher floors',
        'Install check valves in plumbing to prevent backflow',
        'Consider flood insurance (standard policies don\'t cover floods)',
        'Create waterproof container for important documents'
      ],
      supplies: ['Waterproof bags', 'Life jackets', 'Rubber boots', 'Water purification tablets', 'Inflatable raft', 'Rope', 'Emergency blankets']
    },
    {
      id: 'wildfire',
      name: 'Wildfire',
      icon: Flame,
      color: 'from-red-500 to-orange-600',
      description: 'Learn how to stay safe before, during, and after a wildfire threat',
      tips: [
        'Create defensible space around your home (100 feet)',
        'Use fire-resistant building materials',
        'Keep gutters and roof clear of debris',
        'Have multiple evacuation routes planned',
        'Assemble "go bags" for quick evacuation'
      ],
      supplies: ['N95 respirator masks', 'Fire extinguisher', 'Garden hose', 'Battery-powered radio', 'Goggles', 'Leather gloves', 'Go-bag with essentials']
    },
    {
      id: 'hurricane',
      name: 'Hurricane',
      icon: Wind,
      color: 'from-indigo-500 to-purple-600',
      description: 'Learn how to stay safe before, during, and after a hurricane',
      tips: [
        'Know your evacuation zone and routes',
        'Reinforce garage doors and windows with shutters',
        'Trim trees and shrubs to reduce wind damage',
        'Stock up on supplies before hurricane season',
        'Review insurance policies for adequate coverage'
      ],
      supplies: ['Plywood for windows', 'Generator', 'Extra fuel', 'Portable cell charger', 'Tarp', 'Sandbags', 'Manual can opener']
    },
    {
      id: 'heatwave',
      name: 'Extreme Heat',
      icon: Thermometer,
      color: 'from-yellow-500 to-red-600',
      description: 'Learn how to stay safe before, during, and after extreme heat and heatwaves',
      tips: [
        'Identify cooling centers in your community',
        'Install window reflectors and weatherstripping',
        'Learn signs of heat exhaustion and heat stroke',
        'Check on elderly neighbors and vulnerable populations',
        'Never leave children or pets in vehicles'
      ],
      supplies: ['Cooling towels', 'Electric fans', 'Sunscreen SPF 30+', 'Wide-brimmed hats', 'Light-colored clothing', 'Electrolyte drinks', 'Spray bottles']
    },
    {
      id: 'homeless',
      name: 'Community Support',
      icon: Heart,
      color: 'from-pink-500 to-rose-600',
      description: 'Learn how to help vulnerable populations during disasters',
      tips: [
        'Know locations of homeless shelters and warming/cooling centers',
        'Donate supplies to local organizations year-round',
        'Volunteer at community disaster preparedness workshops',
        'Advocate for inclusive emergency planning in your city',
        'Share disaster alerts with outreach workers'
      ],
      supplies: ['Thermal blankets', 'Hand warmers', 'Waterproof ponchos', 'Sealed snacks', 'Bottled water', 'Hygiene kits', 'Warm socks']
    }
  ];

  const videos = [
    { id: 'BLEPakj1YTY', title: 'What to Do Before, During, and After an Earthquake' },
    { id: 'Ed3g9WWD6xM', title: 'Flood and Water Safety - RNLI' },
    { id: 'wIYA2xn2hmc', title: 'How to Prepare for a Wildfire' },
    { id: '7IQTeelrDWA', title: 'How to Stay Safe in a Flash Flood Emergency' }
  ];

  const quizQuestions = [
    {
      question: 'What should you do during an earthquake?',
      options: ['Run outside immediately', 'Drop, Cover, and Hold On', 'Stand in a doorway', 'Use the elevator'],
      correct: 1
    },
    {
      question: 'How much water should you store per person per day?',
      options: ['1/2 gallon', '1 gallon', '2 gallons', '3 gallons'],
      correct: 1
    },
    {
      question: 'What is the recommended defensible space around your home for wildfires?',
      options: ['30 feet', '50 feet', '100 feet', '200 feet'],
      correct: 2
    }
  ];

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showResult, setShowResult] = useState(false);

  const generateChecklist = (disaster) => {
    const basicSupplies = [
      'Emergency contact list',
      'Important documents (IDs, insurance)',
      'Prescription medications',
      'Cash and credit cards',
      'Phone chargers and power banks'
    ];
    setChecklist([...basicSupplies, ...disaster.supplies]);
  };

  const handleQuizAnswer = (index) => {
    setSelectedAnswer(index);
    if (index === quizQuestions[currentQuestion].correct) {
      setQuizScore((quizScore || 0) + 1);
    }
    setTimeout(() => {
      if (currentQuestion < quizQuestions.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
        setSelectedAnswer(null);
      } else {
        setShowResult(true);
      }
    }, 1000);
  };

  const resetQuiz = () => {
    setCurrentQuestion(0);
    setQuizScore(0);
    setSelectedAnswer(null);
    setShowResult(false);
  };
  
  const downloadChecklistPDF = () => {
  if (!selectedDisaster) return;

  const doc = new jsPDF();
  doc.setFontSize(18);
  doc.text(`${selectedDisaster.name} - Emergency Checklist`, 14, 20);

  doc.setFontSize(12);
  let y = 35;

  checklist.forEach((item, index) => {
    // If we run out of space, add a new page
    if (y > 270) {
      doc.addPage();
      y = 20;
    }
    doc.text(`${index + 1}. ${item}`, 14, y);
    y += 10;
  });

  doc.save(`${selectedDisaster.name.replace(/\s+/g, '_')}_Checklist.pdf`);
    };


  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      {/* Navigation Bar */}
      <Navbar />

      {/* Add padding to account for fixed navbar */}
      <div className="pt-20">
        {/* Hero Section */}
        <div className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900"></div>
          <div className="relative max-w-7xl mx-auto px-6 py-20">
            <div className="text-center">
              <div className="inline-flex items-center gap-2 bg-orange-500/20 backdrop-blur-sm px-6 py-2 rounded-full mb-6 border border-orange-500/30">
                <BookOpen className="w-5 h-5 text-orange-400" />
                <span className="text-orange-200 font-medium">Education Hub</span>
              </div>
              <h1 className="text-6xl font-bold text-white mb-6">
                Prepare for the
                <span className="block bg-gradient-to-r from-orange-400 to-yellow-400 bg-clip-text text-transparent">
                  Unexpected
                </span>
              </h1>
              <p className="text-xl text-slate-300 max-w-3xl mx-auto mb-8">
                Knowledge is your first line of defense. Learn, prepare, and protect yourself and your loved ones with our comprehensive disaster preparedness guides.
              </p>
            </div>
          </div>
        </div>

        {/* Disaster Type Cards */}
        <div className="max-w-7xl mx-auto px-6 py-16">
          <h2 className="text-4xl font-bold text-white mb-4 text-center">
            Choose What To Learn
          </h2>
          <p className="text-slate-400 text-center mb-12">
            Select a card to access tailored preparation guides and checklists
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
            {disasterTypes.map((disaster) => {
              const Icon = disaster.icon;
              return (
                <div
                  key={disaster.id}
                  onClick={() => {
                    setSelectedDisaster(disaster);
                    generateChecklist(disaster);
                  }}
                  className={`cursor-pointer transform transition-all duration-300 hover:scale-105 ${
                    selectedDisaster?.id === disaster.id ? 'ring-4 ring-white' : ''
                  }`}
                >
                  <div className={`bg-gradient-to-br ${disaster.color} p-6 rounded-2xl shadow-2xl`}>
                    <Icon className="w-12 h-12 text-white mb-4" />
                    <h3 className="text-2xl font-bold text-white mb-2">{disaster.name}</h3>
                    <p className="text-white/90 text-sm">{disaster.description}</p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Selected Disaster Details */}
          {selectedDisaster && (
            <div className="bg-slate-800/50 backdrop-blur-lg rounded-3xl p-8 mb-16 border border-slate-700">
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-3xl font-bold text-white mb-6 flex items-center gap-3">
                    <BookOpen className="w-8 h-8 text-orange-400" />
                    Preparation Tips for {selectedDisaster.name}
                  </h3>
                  <div className="space-y-4">
                    {selectedDisaster.tips.map((tip, index) => (
                      <div key={index} className="flex gap-3 items-start">
                        <div className="w-6 h-6 rounded-full bg-gradient-to-br from-orange-500 to-yellow-500 flex items-center justify-center flex-shrink-0 mt-1">
                          <span className="text-white text-sm font-bold">{index + 1}</span>
                        </div>
                        <p className="text-slate-300">{tip}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-3xl font-bold text-white mb-6 flex items-center gap-3">
                    <CheckSquare className="w-8 h-8 text-green-400" />
                    Emergency Checklist
                  </h3>
                  <div className="bg-slate-900/50 rounded-xl p-6 mb-4">
                    <div className="space-y-3 max-h-96 overflow-y-auto">
                      {checklist.map((item, index) => (
                        <label key={index} className="flex items-center gap-3 cursor-pointer group">
                          <input
                            type="checkbox"
                            className="w-5 h-5 rounded border-2 border-slate-600 bg-slate-800 checked:bg-green-500 checked:border-green-500"
                          />
                          <span className="text-slate-300 group-hover:text-white transition-colors">
                            {item}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>
                  <button
                  onClick={downloadChecklistPDF}
                  className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold py-3 rounded-xl hover:from-green-600 hover:to-emerald-700 transition-all flex items-center justify-center gap-2"
                  >
                    <Download className="w-5 h-5" />
                    Download Checklist PDF
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Video Section */}
          <div className="mb-16">
            <h2 className="text-4xl font-bold text-white mb-4 text-center">
              Visual Learning Resources
            </h2>
            <p className="text-slate-400 text-center mb-12">
              Watch expert-guided videos on disaster preparedness
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {videos.map((video) => (
                <div key={video.id} className="bg-slate-800/50 backdrop-blur-lg rounded-2xl overflow-hidden border border-slate-700 hover:border-orange-500/50 transition-all">
                  <div className="aspect-video bg-slate-900 relative group">
                    <iframe
                      src={`https://www.youtube.com/embed/${video.id}`}
                      title={video.title}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      className="w-full h-full"
                    ></iframe>
                  </div>
                  <div className="p-4">
                    <h3 className="text-white font-semibold flex items-center gap-2">
                      <Play className="w-5 h-5 text-orange-400" />
                      {video.title}
                    </h3>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Interactive Quiz */}
          <div className="bg-gradient-to-br from-purple-900/30 to-blue-900/30 backdrop-blur-lg rounded-3xl p-8 border border-purple-500/30">
            <h2 className="text-4xl font-bold text-white mb-4 text-center flex items-center justify-center gap-3">
              <Award className="w-10 h-10 text-yellow-400" />
              Test Your Knowledge
            </h2>
            <p className="text-slate-400 text-center mb-8">
              Complete this quiz to earn your Disaster Preparedness Badge!
            </p>

            {!showResult ? (
              <div className="max-w-2xl mx-auto">
                <div className="bg-slate-900/50 rounded-2xl p-8">
                  <div className="flex justify-between items-center mb-6">
                    <span className="text-slate-400">
                      Question {currentQuestion + 1} of {quizQuestions.length}
                    </span>
                    <span className="text-orange-400 font-bold">
                      Score: {quizScore || 0}
                    </span>
                  </div>
                  
                  <h3 className="text-2xl font-bold text-white mb-6">
                    {quizQuestions[currentQuestion].question}
                  </h3>
                  
                  <div className="space-y-3">
                    {quizQuestions[currentQuestion].options.map((option, index) => (
                      <button
                        key={index}
                        onClick={() => handleQuizAnswer(index)}
                        disabled={selectedAnswer !== null}
                        className={`w-full text-left p-4 rounded-xl font-medium transition-all ${
                          selectedAnswer === null
                            ? 'bg-slate-800 hover:bg-slate-700 text-white'
                            : selectedAnswer === index
                            ? index === quizQuestions[currentQuestion].correct
                              ? 'bg-green-600 text-white'
                              : 'bg-red-600 text-white'
                            : index === quizQuestions[currentQuestion].correct
                            ? 'bg-green-600 text-white'
                            : 'bg-slate-800 text-slate-500'
                        }`}
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="max-w-2xl mx-auto text-center">
                <div className="bg-slate-900/50 rounded-2xl p-12">
                  <Award className="w-24 h-24 text-yellow-400 mx-auto mb-6" />
                  <h3 className="text-3xl font-bold text-white mb-4">
                    Quiz Complete!
                  </h3>
                  <p className="text-5xl font-bold bg-gradient-to-r from-orange-400 to-yellow-400 bg-clip-text text-transparent mb-6">
                    {quizScore} / {quizQuestions.length}
                  </p>
                  <p className="text-slate-300 mb-8">
                    {quizScore === quizQuestions.length
                      ? '🎉 Perfect score! You\'re a disaster preparedness expert!'
                      : quizScore >= quizQuestions.length / 2
                      ? '👏 Great job! Keep learning to improve your preparedness.'
                      : '📚 Review the guides above and try again!'}
                  </p>
                  <button
                    onClick={resetQuiz}
                    className="bg-gradient-to-r from-orange-500 to-yellow-500 text-white font-bold py-3 px-8 rounded-xl hover:from-orange-600 hover:to-yellow-600 transition-all"
                  >
                    Retake Quiz
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer CTA */}
        <div className="max-w-7xl mx-auto px-6 py-16 text-center">
          <div className="bg-gradient-to-r from-orange-500/20 to-yellow-500/20 backdrop-blur-sm rounded-3xl p-12 border border-orange-500/30">
            <h2 className="text-4xl font-bold text-white mb-4">
              Ready to Take Action?
            </h2>
            <p className="text-xl text-slate-300 mb-8">
              Move to the next step: Real-time response and recovery tools
            </p>
            <div className="flex gap-4 justify-center flex-wrap">
              <Link to="/report" className="bg-gradient-to-r from-blue-500 to-cyan-600 text-white font-bold py-3 px-8 rounded-xl hover:from-blue-600 hover:to-cyan-700 transition-all">
                Report Incident →
              </Link>
              <Link to="/recovery" className="bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold py-3 px-8 rounded-xl hover:from-green-600 hover:to-emerald-700 transition-all">
                Go to Recovery →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PreparePage;