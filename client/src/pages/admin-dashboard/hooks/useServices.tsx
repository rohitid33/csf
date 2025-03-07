import { useState, useEffect } from "react";
import { ServiceData } from "@/components/services/service-template";
import { getAllServices } from "@/data/services-data";
import { useToast } from "@/hooks/use-toast";

export function useServices() {
  const [services, setServices] = useState<ServiceData[]>([]);
  const [serviceId, setServiceId] = useState("");
  const [serviceTitle, setServiceTitle] = useState("");
  const [serviceIcon, setServiceIcon] = useState("");
  const [serviceDescription, setServiceDescription] = useState("");
  const [serviceFeatures, setServiceFeatures] = useState("");
  const [servicePopular, setServicePopular] = useState(false);
  const [serviceEligibility, setServiceEligibility] = useState("");
  const [serviceDocuments, setServiceDocuments] = useState("");
  const [serviceFaqs, setServiceFaqs] = useState<{question: string, answer: string}[]>([]);
  const [faqQuestion, setFaqQuestion] = useState("");
  const [faqAnswer, setFaqAnswer] = useState("");
  const [serviceProcess, setServiceProcess] = useState<{title: string, steps: string[]}[]>([]);
  const [processTitle, setProcessTitle] = useState("");
  const [processSteps, setProcessSteps] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [selectedSubcategoriesForService, setSelectedSubcategoriesForService] = useState<string[]>([]);
  const [editServiceId, setEditServiceId] = useState<string | null>(null);
  const [activeServiceSection, setActiveServiceSection] = useState("basic");
  
  const [isLoading, setIsLoading] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  
  const { toast } = useToast();

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    setIsLoading(true);
    try {
      const loadedServices = await getAllServices();
      setServices(loadedServices);
    } catch (error) {
      console.error('Error loading services:', error);
      toast({
        title: "Error loading services",
        description: "There was a problem loading the services.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddService = () => {
    if (!serviceId.trim() || !serviceTitle.trim() || !serviceDescription.trim() || !selectedCategory) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields including selecting a category.",
        variant: "destructive"
      });
      return;
    }

    const featuresArray = serviceFeatures.split(',').map(item => item.trim()).filter(Boolean);
    const eligibilityArray = serviceEligibility.split(',').map(item => item.trim()).filter(Boolean);
    const documentsArray = serviceDocuments.split(',').map(item => item.trim()).filter(Boolean);
    
    const serviceData: ServiceData = {
      id: serviceId,
      title: serviceTitle,
      icon: serviceIcon,
      description: serviceDescription,
      features: featuresArray,
      category: selectedCategory,
      subcategoryIds: selectedSubcategoriesForService.length > 0 ? selectedSubcategoriesForService : undefined,
      popular: servicePopular,
      eligibility: eligibilityArray,
      process: serviceProcess,
      documents: documentsArray,
      faqs: serviceFaqs,
      contactInfo: { 
        phone: contactPhone, 
        email: contactEmail 
      }
    };
    
    console.log("Creating/Updating service with data:", serviceData);
    console.log("Selected subcategories:", selectedSubcategoriesForService);
    
    if (editServiceId) {
      // Update existing service
      setServices(services.map(service => 
        service.id === editServiceId ? serviceData : service
      ));
      setEditServiceId(null);
    } else {
      // Add new service
      setServices([...services, serviceData]);
    }
    
    // Reset form
    resetServiceForm();
    setHasChanges(true);
    
    toast({
      title: editServiceId ? "Service updated" : "Service added",
      description: `The service has been ${editServiceId ? "updated" : "added"} to the local changes.`,
    });
  };

  const resetServiceForm = () => {
    setServiceId("");
    setServiceTitle("");
    setServiceIcon("");
    setServiceDescription("");
    setServiceFeatures("");
    setServicePopular(false);
    setServiceEligibility("");
    setServiceDocuments("");
    setServiceProcess([]);
    setServiceFaqs([]);
    setContactPhone("");
    setContactEmail("");
    setSelectedCategory("");
    setSelectedSubcategoriesForService([]);
    setActiveServiceSection("basic");
  };

  const handleDeleteService = (id: string) => {
    if (window.confirm(`Are you sure you want to delete this service?`)) {
      setServices(services.filter(service => service.id !== id));
      setHasChanges(true);
      
      toast({
        title: "Service deleted",
        description: "The service has been deleted from the local changes.",
      });
    }
  };

  return {
    services,
    setServices,
    serviceId,
    setServiceId,
    serviceTitle,
    setServiceTitle,
    serviceIcon,
    setServiceIcon,
    serviceDescription,
    setServiceDescription,
    serviceFeatures,
    setServiceFeatures,
    servicePopular,
    setServicePopular,
    serviceEligibility,
    setServiceEligibility,
    serviceDocuments,
    setServiceDocuments,
    serviceFaqs,
    setServiceFaqs,
    faqQuestion,
    setFaqQuestion,
    faqAnswer,
    setFaqAnswer,
    serviceProcess,
    setServiceProcess,
    processTitle,
    setProcessTitle,
    processSteps,
    setProcessSteps,
    contactPhone,
    setContactPhone,
    contactEmail,
    setContactEmail,
    selectedCategory,
    setSelectedCategory,
    selectedSubcategoriesForService,
    setSelectedSubcategoriesForService,
    editServiceId,
    setEditServiceId,
    activeServiceSection,
    setActiveServiceSection,
    isLoading,
    hasChanges,
    setHasChanges,
    fetchServices,
    handleAddService,
    handleDeleteService,
    resetServiceForm
  };
}