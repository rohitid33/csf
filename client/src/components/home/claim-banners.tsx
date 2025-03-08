import { motion, useAnimationControls } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { useEffect, useState, useRef } from 'react';

const questions = [
  "Need professional support for your insurance disputes?",
  "Frustrated by claim settlement delays?",
  "Ready to challenge a rejected insurance claim?",
  "Is your claim process too confusing?",
  "Ready for a fair claim resolution?"
];

// Create a longer seamless loop by repeating questions multiple times
const scrollingQuestions = [...questions, ...questions, ...questions, ...questions];

export default function ClaimBanners() {
  const controls = useAnimationControls();
  const [isResetting, setIsResetting] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const animationRef = useRef<number>();

  // Handle responsive behavior
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Initialize animation after mount
  useEffect(() => {
    setIsReady(true);
    return () => setIsReady(false);
  }, []);

  // Handle animation
  useEffect(() => {
    if (!isReady) return;

    let isActive = true;

    const animateScroll = async () => {
      if (!isActive) return;

      try {
        setIsResetting(false);
        
        // Scroll to the end - much slower on desktop
        if (isActive) {
          await controls.start({
            x: -100 * questions.length + '%',
            transition: {
              duration: isMobile ? 25 : 60, // Increased desktop duration
              ease: "linear"
            }
          });
        }

        if (!isActive) return;
        setIsResetting(true);

        // Quick reset to start
        if (isActive) {
          await controls.start({
            x: '0%',
            transition: {
              duration: 0
            }
          });
        }

        if (!isActive) return;

        // No pause between cycles for continuous flow
        if (isActive) {
          requestAnimationFrame(animateScroll);
        }
      } catch (error) {
        console.error('Animation error:', error);
      }
    };

    animateScroll();

    return () => {
      isActive = false;
      if (animationRef.current) {
        window.clearTimeout(animationRef.current);
      }
      controls.stop();
    };
  }, [isReady, isMobile, controls]);

  if (!isReady) return null;

  return (
    <div className="w-full bg-gradient-to-b from-blue-50 to-white py-8 md:py-10">
      <div className="container mx-auto px-4">
        <div className="relative overflow-hidden">
          <motion.div
            className="flex gap-6"
            animate={controls}
            initial={{ x: 0 }}
          >
            {scrollingQuestions.map((question, index) => (
              <div
                key={index}
                className={`
                  group relative flex items-center
                  min-w-[280px] md:min-w-[240px] h-20 px-5 md:px-6 rounded-xl
                  bg-white/80 backdrop-blur-sm
                  shadow-lg hover:shadow-xl
                  transition-all duration-300 transform hover:scale-[1.02] hover:-translate-y-1 hover:z-10
                  cursor-pointer overflow-hidden
                  border border-blue-100/50
                  ${isResetting ? 'transition-transform duration-500' : ''}
                `}
              >
                {/* Animated gradient background */}
                <div className="absolute inset-0 bg-gradient-to-r from-blue-50 via-white to-blue-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                
                {/* Decorative elements */}
                <div className="absolute top-0 right-0 w-32 h-32 -mr-16 -mt-16 bg-primary/5 rounded-full transform rotate-45" />
                <div className="absolute bottom-0 left-0 w-24 h-24 -ml-12 -mb-12 bg-blue-500/5 rounded-full" />
                
                {/* Content container */}
                <div className="relative flex items-center justify-between w-full gap-4 h-full py-3">
                  <div className="flex-1 flex items-center min-h-[40px]">
                    <p className="text-sm md:text-[13px] font-semibold text-gray-900 group-hover:text-primary transition-colors duration-300 leading-snug">
                      {question}
                    </p>
                  </div>
                  <div className="flex-shrink-0 flex items-center">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-primary to-blue-600 flex items-center justify-center transform group-hover:rotate-12 transition-transform duration-300 opacity-0 group-hover:opacity-100">
                      <ArrowRight className="w-4 h-4 text-white" />
                    </div>
                  </div>
                </div>

                {/* Bottom highlight effect */}
                <div className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-primary via-blue-500 to-primary transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
              </div>
            ))}
          </motion.div>

          {/* Side fade effects */}
          <div className="absolute top-0 bottom-0 left-0 w-8 bg-gradient-to-r from-blue-50 to-transparent pointer-events-none" />
          <div className="absolute top-0 bottom-0 right-0 w-8 bg-gradient-to-l from-blue-50 to-transparent pointer-events-none" />
        </div>
      </div>
    </div>
  );
} 