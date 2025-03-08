import { useState, useEffect, useRef } from 'react';

// All statements
const statements = [
  "Need professional support for your insurance disputes",
  "Frustrated by claim settlement delays",
  "Ready to challenge a rejected insurance claim",
  "Is your claim process too confusing",
  "Ready for a fair claim resolution",
  "Worried about unfair claim deductions",
  "Need guidance to speed up your claim",
  "Don't know where to start with your claim",
  "Overwhelmed by endless back-and-forth communication"
];

// Group statements into sets of 3
const groupedStatements = [];
for (let i = 0; i < statements.length; i += 3) {
  groupedStatements.push(statements.slice(i, i + 3));
}

// Add padding to last group if needed
if (groupedStatements[groupedStatements.length - 1].length < 3) {
  const lastGroup = groupedStatements[groupedStatements.length - 1];
  while (lastGroup.length < 3) {
    // Use statements from the beginning to fill the last group
    lastGroup.push(statements[lastGroup.length - 3]);
  }
}

// Create a continuous array for infinite scrolling by repeating groups
const scrollGroups = [...groupedStatements, ...groupedStatements];

export default function ClaimBanners() {
  const [isMobile, setIsMobile] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [activeGroupIndex, setActiveGroupIndex] = useState(0);
  const mobileScrollContainerRef = useRef<HTMLDivElement>(null);
  const desktopScrollContainerRef = useRef<HTMLDivElement>(null);

  // Handle responsive behavior
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Auto-scrolling for mobile view (one banner at a time)
  useEffect(() => {
    if (!isMobile || !mobileScrollContainerRef.current) return;

    const timer = setInterval(() => {
      setActiveIndex((prevIndex) => {
        const nextIndex = (prevIndex + 1) % statements.length;
        
        // Scroll to the next banner
        const container = mobileScrollContainerRef.current;
        if (container) {
          const nextItem = container.children[nextIndex] as HTMLElement;
          
          if (nextItem) {
            container.scrollTo({
              left: nextItem.offsetLeft,
              behavior: 'smooth'
            });
          }
        }
        
        return nextIndex;
      });
    }, 2500); // Change every 2.5 seconds

    return () => clearInterval(timer);
  }, [isMobile]);

  // Auto-scrolling for desktop view (groups of 3)
  useEffect(() => {
    if (isMobile || !desktopScrollContainerRef.current) return;

    const container = desktopScrollContainerRef.current;
    
    const timer = setInterval(() => {
      setActiveGroupIndex((prevIndex) => {
        const nextIndex = (prevIndex + 1) % groupedStatements.length;
        
        // Calculate the scroll position (each group takes up 100% of container width)
        const scrollPosition = nextIndex * container.clientWidth;
        
        // Scroll to the next group of 3
        container.scrollTo({
          left: scrollPosition,
          behavior: 'smooth'
        });
        
        return nextIndex;
      });
    }, 2500); // Change every 2.5 seconds

    return () => clearInterval(timer);
  }, [isMobile]);

  // For mobile: show one banner at a time with auto-scroll
  if (isMobile) {
    return (
      <div className="w-full bg-gradient-to-b from-blue-50 to-white py-8">
        <div className="px-4">
          <div 
            className="relative overflow-hidden" 
            style={{ height: '130px' }}
          >
            <div 
              ref={mobileScrollContainerRef}
              className="flex snap-x snap-mandatory overflow-x-auto hide-scrollbar"
              style={{ scrollBehavior: 'smooth', scrollSnapType: 'x mandatory' }}
            >
              {statements.map((statement, index) => (
                <div
                  key={index}
                  className={`
                    flex-shrink-0 w-full snap-center
                    flex items-center justify-center
                    h-28 px-5 mx-1 rounded-xl
                    bg-white
                    shadow-md
                    border-2 border-blue-200
                    transition-opacity duration-300
                    ${activeIndex === index ? 'opacity-100' : 'opacity-70'}
                  `}
                >
                  <div className="flex flex-col items-center justify-center gap-2 text-center px-2">
                    <p className="text-lg font-semibold text-blue-800 leading-snug">
                      {statement}
                    </p>
                    
                    {/* Blue circle with white checkmark */}
                    <div className="flex-shrink-0 w-7 h-7 rounded-full bg-blue-700 flex items-center justify-center">
                      <svg 
                        className="w-4 h-4 text-white" 
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path 
                          strokeLinecap="round" 
                          strokeLinejoin="round" 
                          strokeWidth={2.5} 
                          d="M5 13l4 4L19 7" 
                        />
                      </svg>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Indicator dots */}
            <div className="flex justify-center mt-3 gap-1.5">
              {statements.map((_, index) => (
                <div 
                  key={index}
                  className={`
                    w-2 h-2 rounded-full transition-all duration-300
                    ${activeIndex === index ? 'bg-blue-700 w-4' : 'bg-blue-300'}
                  `}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // For desktop: show groups of 3 banners that scroll horizontally
  return (
    <div className="w-full bg-gradient-to-b from-blue-50 to-white py-8 md:py-12">
      <div className="container mx-auto px-4">
        <div className="relative overflow-hidden">
          {/* Left and right fade effects */}
          <div className="absolute left-0 top-0 bottom-0 w-12 bg-gradient-to-r from-blue-50 to-transparent z-10 pointer-events-none"></div>
          <div className="absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-blue-50 to-transparent z-10 pointer-events-none"></div>
          
          {/* Scrolling container for groups of 3 */}
          <div 
            ref={desktopScrollContainerRef}
            className="flex overflow-x-auto snap-x snap-mandatory hide-scrollbar"
            style={{ scrollBehavior: 'smooth' }}
          >
            {/* Each group of 3 takes exactly 100% of the container width */}
            {scrollGroups.map((group, groupIdx) => (
              <div 
                key={`group-${groupIdx}`} 
                className="flex-shrink-0 w-full flex justify-center gap-4 snap-center"
              >
                {group.map((statement, itemIdx) => (
                  <div
                    key={`group-${groupIdx}-item-${itemIdx}`}
                    className="
                      flex-1 max-w-[350px]
                      flex items-center justify-center
                      h-28 px-5 rounded-xl
                      bg-white
                      shadow-md
                      border-2 border-blue-200
                      transition-all duration-300
                    "
                  >
                    <div className="flex flex-col items-center justify-center gap-2 text-center">
                      <p className="text-xl font-semibold text-blue-800 leading-snug">
                        {statement}
                      </p>
                      
                      {/* Blue circle with white checkmark */}
                      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-700 flex items-center justify-center">
                        <svg 
                          className="w-5 h-5 text-white" 
                          fill="none" 
                          stroke="currentColor" 
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path 
                            strokeLinecap="round" 
                            strokeLinejoin="round" 
                            strokeWidth={2.5} 
                            d="M5 13l4 4L19 7" 
                          />
                        </svg>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
          
          {/* Group indicators */}
          <div className="flex justify-center mt-5 gap-1.5">
            {groupedStatements.map((_, index) => (
              <div 
                key={index}
                className={`
                  w-2 h-2 rounded-full transition-all duration-300
                  ${activeGroupIndex === index ? 'bg-blue-700 w-4' : 'bg-blue-300'}
                `}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// Add CSS for hiding scrollbars
const style = `
  .hide-scrollbar {
    -ms-overflow-style: none;  /* IE and Edge */
    scrollbar-width: none;  /* Firefox */
  }
  .hide-scrollbar::-webkit-scrollbar {
    display: none;  /* Chrome, Safari, Opera */
  }
`;

// Add style to the document
if (typeof document !== 'undefined') {
  const styleElement = document.createElement('style');
  styleElement.innerHTML = style;
  document.head.appendChild(styleElement);
}