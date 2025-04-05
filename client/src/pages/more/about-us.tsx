import React from "react";
import { motion } from "framer-motion";

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

export default function AboutUsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Hero Section */}
      <div className="relative bg-[#002B4E] text-white">
        <div className="absolute inset-0 bg-opacity-70 z-0">
          <div className="absolute inset-0 bg-blue-900 opacity-30 mix-blend-multiply" />
        </div>
        <div className="container mx-auto px-4 py-16 relative z-10">
          <motion.h1 
            className="text-4xl md:text-5xl font-bold mb-4"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            About Claimsutra
          </motion.h1>
          <motion.p 
            className="text-xl md:text-2xl max-w-3xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            India's leading legal claim expert, dedicated to navigating the complex world of insurance claims and legal disputes.
          </motion.p>
        </div>
      </div>
      
      <div className="container mx-auto px-4 py-12">
        <div className="prose max-w-none">
          <motion.div 
            className="bg-white p-8 rounded-lg shadow-lg mb-12"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            variants={fadeIn}
          >
            <p className="text-lg leading-relaxed text-gray-700">
              Claimsutra is India's leading legal claim expert, dedicated to helping individuals and businesses navigate the complex world of insurance claims and legal disputes.
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-12">
            <motion.div 
              className="bg-white p-8 rounded-lg shadow-lg border-l-4 border-primary"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              variants={fadeIn}
            >
              <h2 className="text-2xl font-semibold text-primary mb-4">Our Mission</h2>
              <p className="text-gray-700">
                Our mission is to empower people with the knowledge and support they need to successfully resolve insurance claims and legal matters. We believe everyone deserves fair treatment and proper compensation when dealing with insurance companies and legal systems.
              </p>
            </motion.div>
            
            <motion.div 
              className="bg-white p-8 rounded-lg shadow-lg border-l-4 border-primary"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              variants={fadeIn}
            >
              <h2 className="text-2xl font-semibold text-primary mb-4">Our Vision</h2>
              <p className="text-gray-700">
                We envision a world where the process of filing and resolving insurance claims is transparent, fair, and accessible to all. We strive to be the bridge that connects people with the expertise they need to navigate complex legal and insurance landscapes.
              </p>
            </motion.div>
          </div>
          
          <motion.h2 
            className="text-3xl font-bold text-center mb-8 text-[#002B4E]"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            variants={fadeIn}
          >
            Our Expert Team
          </motion.h2>
          
          <motion.p
            className="text-center mb-12 text-lg text-gray-700 max-w-3xl mx-auto"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            variants={fadeIn}
          >
            Our team consists of experienced professionals from various fields including law, insurance, customer service, and technology. This diverse expertise allows us to provide comprehensive support for all types of claims and legal matters.
          </motion.p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            <motion.div 
              className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 border-t-4 border-primary"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              variants={fadeIn}
            >
              <div className="bg-primary/10 p-4 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3 text-center">Legal Experts</h3>
              <p className="text-gray-700 text-center">Our legal team has decades of combined experience in insurance law and consumer protection.</p>
            </motion.div>
            
            <motion.div 
              className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 border-t-4 border-primary"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              variants={fadeIn}
            >
              <div className="bg-primary/10 p-4 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3 text-center">Insurance Specialists</h3>
              <p className="text-gray-700 text-center">Our insurance specialists understand the intricacies of policies and know how to maximize your claims.</p>
            </motion.div>
            
            <motion.div 
              className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 border-t-4 border-primary"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
              variants={fadeIn}
            >
              <div className="bg-primary/10 p-4 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3 text-center">Customer Support</h3>
              <p className="text-gray-700 text-center">Our dedicated support team is available to guide you through every step of the process.</p>
            </motion.div>
          </div>
          
          <motion.div 
            className="bg-white p-8 rounded-lg shadow-lg mb-16 border-l-4 border-primary"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            variants={fadeIn}
          >
            <h2 className="text-2xl font-semibold text-primary mb-4">Our Approach</h2>
            <p className="text-gray-700 mb-4">
              We take a client-centered approach to every case, ensuring that your specific needs and circumstances are taken into account. Our process is designed to be:
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div className="flex items-start space-x-3">
                <div className="bg-primary/10 p-2 rounded-full flex-shrink-0">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <p className="font-semibold">Transparent</p>
                  <p className="text-gray-600">We keep you informed at every stage of the process.</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="bg-primary/10 p-2 rounded-full flex-shrink-0">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <div>
                  <p className="font-semibold">Efficient</p>
                  <p className="text-gray-600">We work diligently to resolve your claims as quickly as possible.</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="bg-primary/10 p-2 rounded-full flex-shrink-0">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <div>
                  <p className="font-semibold">Thorough</p>
                  <p className="text-gray-600">We leave no stone unturned in pursuing the best outcome for your case.</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="bg-primary/10 p-2 rounded-full flex-shrink-0">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </div>
                <div>
                  <p className="font-semibold">Supportive</p>
                  <p className="text-gray-600">We provide emotional and practical support throughout your journey.</p>
                </div>
              </div>
            </div>
          </motion.div>
          
          <motion.h2 
            className="text-3xl font-bold text-center mb-8 text-[#002B4E]"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            variants={fadeIn}
          >
            Contact Us
          </motion.h2>
          
          <motion.p
            className="text-center mb-8 text-lg text-gray-700 max-w-3xl mx-auto"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            variants={fadeIn}
          >
            If you have any questions or would like to learn more about how we can help you, please don't hesitate to get in touch. We're here to help you navigate your legal and insurance challenges.
          </motion.p>
          
          <motion.div 
            className="bg-[#002B4E] text-white p-8 rounded-lg shadow-lg mt-6 max-w-2xl mx-auto"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            variants={fadeIn}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-semibold mb-4 text-primary-foreground">Contact Details</h3>
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary-foreground flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                    </svg>
                    <div>
                      <p className="font-medium text-primary-foreground">Claimsutra</p>
                      <p>Head-Office: 1/59 Delhi Gate, Opposite Pushpanjali Hospital, Agra, Uttar-Pradesh</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary-foreground flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    <p>+91-8630959445</p>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary-foreground flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    <p>info@claimsutra.com</p>
                  </div>
                </div>
              </div>
              
              <div className="border-t md:border-t-0 md:border-l border-white/20 pt-6 md:pt-0 md:pl-8">
                <h3 className="text-xl font-semibold mb-4 text-primary-foreground">Business Hours</h3>
                <div className="space-y-2">
                  <p>Monday - Friday: 9:00 AM - 6:00 PM</p>
                  <p>Saturday: 10:00 AM - 4:00 PM</p>
                  <p>Sunday: Closed</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}