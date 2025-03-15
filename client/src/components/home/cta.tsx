import { Button } from "@/components/ui/button";

export default function CTA() {
  const scrollToCategories = () => {
    const categoriesSection = document.getElementById('categories-section');
    if (categoriesSection) {
      categoriesSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="bg-primary py-24 text-white">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl font-bold sm:text-4xl">
          Ready to Resolve Your Insurance Issues?
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-lg opacity-90">
          Our team of experts is here to help you with your insurance grievances.
          Get started today with a free consultation.
        </p>
        <Button size="lg" variant="secondary" className="mt-8" onClick={scrollToCategories}>
          File a Complaint Now
        </Button>
      </div>
    </section>
  );
}
