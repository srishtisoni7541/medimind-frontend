import React from 'react'
import { Heart, Stethoscope, Clock, Shield, Activity, Microscope } from "lucide-react"

const About = () => {
  return (
    <div className="min-h-screen bg-white ">
      {/* About Us Section */}
      <section className="py-12 md:py-24 px-4 md:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="order-2 lg:order-1">
            <div className="space-y-4">
              <div className="inline-block px-3 py-1 text-sm font-medium text-white bg-[#4E80EE] rounded-full">
                About Us
              </div>
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-gray-900">
                Dedicated to providing exceptional healthcare for over 25 years
              </h2>
              <p className="text-lg text-gray-600 mt-4">
              Medi Mind is a smart healthcare platform designed to make medical services more accessible and efficient. With features like AI-powered symptom checker, pill identifier, and digital prescription support, we aim to simplify healthcare for everyone. Our appointment system is easy to use and includes doctor ratings to help patients choose the right care.
              </p>
              <p className="text-lg text-gray-600">
              We also offer separate admin panels for doctors, patients, and hospitals to ensure smooth management. Medi Mind includes a hospital finder for quick access to nearby facilities and is fully accessible for users with disabilities. Our goal is to provide a reliable, user-friendly healthcare experience for all.
              </p>
            </div>
            <div className="mt-8 flex items-center">
              <div className="flex -space-x-2 mr-4">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="relative w-10 h-10 overflow-hidden rounded-full border-2 border-white">
                    <img
                      src={"./src/assets/about_image.png"}
                      alt={`Medical professional ${i}`}
                      width={40}
                      height={40}
                      className="object-cover"
                    />
                  </div>
                ))}
              </div>
              <div>
                <p className="font-medium">
                  Our team of <span className="text-[#4E80EE]">200+ healthcare professionals</span>
                </p>
              </div>
            </div>
          </div>

          <div className="order-1 lg:order-2 relative">
            <div className="aspect-square rounded-2xl overflow-hidden">
              <img
                src="./src/assets/about_image.png"
                alt="Healthcare professionals"
                width={600}
                height={600}
                className="object-cover w-full h-full"
              />
            </div>
            <div className="absolute -bottom-6 -left-6 bg-white p-4 rounded-lg shadow-xl hidden md:block">
              <div className="flex items-center space-x-2">
                <Heart className="h-6 w-6 text-[#4E80EE]" />
                <div>
                  <p className="text-sm font-medium">Patient-centered care</p>
                  <p className="text-xs text-gray-500">Serving our community since 1998</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-[#F0F6FE] py-12">
        <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <p className="text-3xl md:text-4xl font-bold text-[#4E80EE]">50,000+</p>
              <p className="text-gray-600 mt-2">Patients Served</p>
            </div>
            <div className="text-center">
              <p className="text-3xl md:text-4xl font-bold text-[#4E80EE]">98%</p>
              <p className="text-gray-600 mt-2">Patient Satisfaction</p>
            </div>
            <div className="text-center">
              <p className="text-3xl md:text-4xl font-bold text-[#4E80EE]">25+</p>
              <p className="text-gray-600 mt-2">Years of Excellence</p>
            </div>
            <div className="text-center">
              <p className="text-3xl md:text-4xl font-bold text-[#4E80EE]">24/7</p>
              <p className="text-gray-600 mt-2">Emergency Care</p>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-12 md:py-24 px-4 md:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-block px-3 py-1 text-sm font-medium text-white bg-[#4E80EE] rounded-full mb-4">
            Why Choose Us
          </div>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-gray-900">
            Exceptional healthcare you can trust
          </h2>
          <p className="text-lg text-gray-600 mt-4">
            We combine medical expertise, advanced technology, and compassionate care to provide the highest standard of
            healthcare services for you and your family.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            {
              icon: <Stethoscope className="h-8 w-8 text-[#4E80EE]" />,
              title: "Expert Medical Team",
              description:
                "Our board-certified physicians and experienced healthcare professionals provide the highest level of care.",
            },
            {
              icon: <Microscope className="h-8 w-8 text-[#4E80EE]" />,
              title: "Advanced Technology",
              description:
                "We invest in cutting-edge medical technology to ensure accurate diagnoses and effective treatments.",
            },
            {
              icon: <Heart className="h-8 w-8 text-[#4E80EE]" />,
              title: "Compassionate Care",
              description:
                "We treat each patient with dignity, respect, and personalized attention to their unique needs.",
            },
            {
              icon: <Clock className="h-8 w-8 text-[#4E80EE]" />,
              title: "Prompt Appointments",
              description: "We value your time and strive to minimize wait times for appointments and procedures.",
            },
            {
              icon: <Shield className="h-8 w-8 text-[#4E80EE]" />,
              title: "Comprehensive Services",
              description:
                "From preventive care to specialized treatments, we offer a wide range of healthcare services.",
            },
            {
              icon: <Activity className="h-8 w-8 text-[#4E80EE]" />,
              title: "Holistic Approach",
              description:
                "We focus on your overall wellbeing, addressing both physical and emotional aspects of health.",
            },
          ].map((item, index) => (
            <div
              key={index}
              className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300"
            >
              <div className="mb-4">{item.icon}</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">{item.title}</h3>
              <p className="text-gray-600">{item.description}</p>
            </div>
          ))}
        </div>
      </section>

      
    </div>
  )
}

export default About