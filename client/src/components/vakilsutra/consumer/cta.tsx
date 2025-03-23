import { Button } from "@/components/ui/button";

export default function ConsumerCTA() {
  const scrollToComplaint = () => {
    const complaintSection = document.getElementById('complaint-section');
    if (complaintSection) {
      complaintSection.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }
  };

  return (
    <section className="bg-blue-600 text-white">
      <div className="container mx-auto px-4 py-8 text-center">
        <h2 className="text-3xl font-bold sm:text-4xl">
          Ready to Fight for Your Consumer Rights?
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-lg opacity-90">
          Our expert legal team is here to help you resolve your consumer complaints.
          Get started today with a free consultation.
        </p>
        <Button size="lg" variant="secondary" className="mt-6" onClick={scrollToComplaint}>
          File Your Complaint Now
        </Button>
      </div>
    </section>
  );
} 