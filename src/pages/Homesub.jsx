import { useState } from 'react';
import { Stethoscope, Activity, Utensils, ArrowRight, Search, Calendar, Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Homesub() {
  const [hoveredCard, setHoveredCard] = useState(null);
  const navigate = useNavigate();

  const services = [
    {
      title: 'Find a Doctor',
      description: 'Search our network of qualified healthcare professionals.',
      icon: <Stethoscope size={22} />,
      action: 'Find a Doctor',
      route: '/doctors',
      features: ['Specialty search', 'Location filter', 'Appointment booking']
    },
    {
      title: 'Symptom Checker',
      description: 'Check symptoms and get preliminary guidance.',
      icon: <Activity size={22} />,
      action: 'Check Symptoms',
      route: '/symptom-checker',
      features: ['AI-powered analysis', 'Medical resources', 'Follow-up recommendations']
    },
    {
      title: 'Meal Planner',
      description: 'Get personalized meal plans based on your health.',
      icon: <Utensils size={22} />,
      action: 'Plan Meals',
      route: '/health-plan',
      features: ['Dietary preferences', 'Nutritional tracking', 'Recipe suggestions']
    }
  ];

  const handleNavigate = (route) => {
    navigate(route);
  };

  return (
    <div className="bg-white min-h-screen flex flex-col items-center justify-center p-6">
      <div className="mb-12 text-center">
        <h1 className="text-4xl font-bold text-blue-600 mb-2 animate-fadeIn">Our Top Services</h1>
        <p className="animate-fadeIn text-blue-400 text-lg" style={{ animationDelay: '100ms' }}>
          Comprehensive healthcare solutions for your wellbeing
        </p>
      </div>

      <div className="flex flex-row flex-wrap justify-center gap-6 w-full max-w-6xl">
        {services.map((service, index) => (
          <div
            key={index}
            className={`bg-white border border-blue-100 rounded-xl p-5 flex flex-col items-center text-center transition-all duration-300 ease-in-out w-72 ${
              hoveredCard === index ? 'translate-y-[-5px] shadow-xl border-blue-300' : 'shadow-md'
            } animate-fadeUp cursor-pointer`}
            style={{ animationDelay: `${index * 150}ms` }}
            onMouseEnter={() => setHoveredCard(index)}
            onMouseLeave={() => setHoveredCard(null)}
            onClick={() => handleNavigate(service.route)}
          >
            <div
              className={`p-4 rounded-full mb-4 transition-all duration-300 ${
                hoveredCard === index ? 'scale-110 bg-blue-600 text-white' : 'bg-blue-100 text-blue-600 scale-100'
              }`}
            >
              {service.icon}
            </div>

            <h2 className="text-xl font-semibold text-blue-800 mb-2">
              {service.title}
            </h2>

            <p className="text-gray-600 text-sm mb-4">
              {service.description}
            </p>

            <div className="w-full border-t border-blue-100 my-2"></div>

            <ul className="text-left w-full mb-4">
              {service.features.map((feature, idx) => (
                <li key={idx} className="flex items-center text-xs text-gray-600 mb-1">
                  <div className="mr-2 text-blue-400">
                    {idx === 0 ? <Search size={12} /> : idx === 1 ? <Calendar size={12} /> : <Star size={12} />}
                  </div>
                  {feature}
                </li>
              ))}
            </ul>

            <button
              onClick={(e) => {
                e.stopPropagation();
                handleNavigate(service.route);
              }}
              className={`mt-auto w-full py-2 rounded-lg flex items-center justify-center transition-colors font-medium ${
                hoveredCard === index
                  ? 'bg-blue-700 text-white'
                  : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
              }`}
            >
              {service.action}
              <ArrowRight
                size={16}
                className={`ml-2 transition-transform duration-300 ${
                  hoveredCard === index ? 'translate-x-1' : ''
                }`}
              />
            </button>
          </div>
        ))}
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fadeUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fadeIn {
          opacity: 0;
          animation: fadeIn 0.8s ease-out forwards;
        }

        .animate-fadeUp {
          opacity: 0;
          animation: fadeUp 0.8s ease-out forwards;
        }
      `}</style>
    </div>
  );
}