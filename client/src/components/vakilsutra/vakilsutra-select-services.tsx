import React, { useState } from "react";

interface VakilsutraSelectServicesProps {
  category: string;
  searchQuery?: string;
}

interface Service {
  name: string;
  icon: string;
  url: string;
}

interface CategoryServices {
  [key: string]: Service[];
}

interface Services {
  [key: string]: CategoryServices | Service[];
}
const services: Services = {
  "Consumer Complaint": [
    { name: "Consumer Court Filing", icon: "/icons/consumer.png", url: "/vakilsutra/consumer/court" },
    { name: "E-Commerce Complaint", icon: "/icons/ecommerce.png", url: "/vakilsutra/consumer/ecommerce" },
    { name: "Product Defect", icon: "/icons/product.png", url: "/vakilsutra/consumer/product" },
    { name: "Service Issues", icon: "/icons/service.png", url: "/vakilsutra/consumer/service" },
    { name: "Insurance Claims", icon: "/icons/insurance.png", url: "/vakilsutra/consumer/insurance" }
  ],
  "Intellectual Property": {
    "A. Trademark Services": [
      { name: "a. Trademark Registration", icon: "/icons/trademark.png", url: "/vakilsutra/ip/trademark-registration" },
      { name: "b. Search for Trademark", icon: "/icons/search.png", url: "/vakilsutra/ip/trademark-search" },
      { name: "c. Respond to TM Objection", icon: "/icons/objection.png", url: "/vakilsutra/ip/trademark-objection" },
      { name: "d. Well-Known Trademark", icon: "/icons/well-known.png", url: "/vakilsutra/ip/well-known-trademark" },
      { name: "e. Trademark Watch", icon: "/icons/watch.png", url: "/vakilsutra/ip/trademark-watch" },
      { name: "f. Trademark Renewal", icon: "/icons/renewal.png", url: "/vakilsutra/ip/trademark-renewal" },
      { name: "g. Trademark Assignment", icon: "/icons/assignment.png", url: "/vakilsutra/ip/trademark-assignment" },
      { name: "h. USA Trademark", icon: "/icons/usa.png", url: "/vakilsutra/ip/usa-trademark" },
      { name: "i. International Trademark", icon: "/icons/international.png", url: "/vakilsutra/ip/international-trademark" },
      { name: "j. Trademark Infringement", icon: "/icons/infringement.png", url: "/vakilsutra/ip/trademark-infringement" }
    ],
    "B. Copyright Services": [
      { name: "a. Copyright Registration", icon: "/icons/copyright.png", url: "/vakilsutra/ip/copyright-registration" },
      { name: "b. Copyright Infringement", icon: "/icons/infringement.png", url: "/vakilsutra/ip/copyright-infringement" }
    ],
    "C. Patent Services": [
      { name: "a. Indian Patent Search", icon: "/icons/search.png", url: "/vakilsutra/ip/patent-search" },
      { name: "b. Provisional Application", icon: "/icons/provisional.png", url: "/vakilsutra/ip/provisional-patent" },
      { name: "c. Permanent Patent", icon: "/icons/patent.png", url: "/vakilsutra/ip/permanent-patent" },
      { name: "d. Patent Infringement", icon: "/icons/infringement.png", url: "/vakilsutra/ip/patent-infringement" }
    ],
    "D. Design & Branding Services": [
      { name: "a. Logo Design", icon: "/icons/logo.png", url: "/vakilsutra/ip/logo-design" },
      { name: "b. Design Registration", icon: "/icons/design.png", url: "/vakilsutra/ip/design-registration" }
    ]
  },
  "Business Incorporation": {
    "A. Business Entity Registration": [
      { name: "a. Private Limited Company", icon: "/icons/private-ltd.png", url: "/vakilsutra/corporate/private-ltd" },
      { name: "b. Limited Liability Partnership", icon: "/icons/llp.png", url: "/vakilsutra/corporate/llp" },
      { name: "c. One Person Company", icon: "/icons/opc.png", url: "/vakilsutra/corporate/opc" },
      { name: "d. Sole Proprietorship", icon: "/icons/sole.png", url: "/vakilsutra/corporate/sole-proprietorship" },
      { name: "e. Nidhi Company", icon: "/icons/nidhi.png", url: "/vakilsutra/corporate/nidhi" },
      { name: "f. Producer Company", icon: "/icons/producer.png", url: "/vakilsutra/corporate/producer" },
      { name: "g. Partnership Firm", icon: "/icons/partnership.png", url: "/vakilsutra/corporate/partnership" },
      { name: "h. Startup India Registration", icon: "/icons/startup.png", url: "/vakilsutra/corporate/startup" },
      { name: "i. Company Name Search", icon: "/icons/search.png", url: "/vakilsutra/corporate/name-search" },
      { name: "j. Digital Signature Certificate", icon: "/icons/dsc.png", url: "/vakilsutra/corporate/dsc" }
    ],
    "B. Business Agreements": [
      { name: "a. Non-Disclosure Agreement (NDA)", icon: "/icons/nda.png", url: "/vakilsutra/corporate/nda" },
      { name: "b. Service Level Agreement", icon: "/icons/sla.png", url: "/vakilsutra/corporate/sla" },
      { name: "c. Franchise Agreement", icon: "/icons/franchise.png", url: "/vakilsutra/corporate/franchise" },
      { name: "d. Master Service Agreement", icon: "/icons/msa.png", url: "/vakilsutra/corporate/msa" },
      { name: "e. Shareholders Agreement", icon: "/icons/shareholders.png", url: "/vakilsutra/corporate/shareholders" },
      { name: "f. Joint Venture Agreement", icon: "/icons/jv.png", url: "/vakilsutra/corporate/jv" },
      { name: "g. Founders Agreement", icon: "/icons/founders.png", url: "/vakilsutra/corporate/founders" },
      { name: "h. Vendor Agreement", icon: "/icons/vendor.png", url: "/vakilsutra/corporate/vendor" },
      { name: "i. Consultancy Agreement", icon: "/icons/consultancy.png", url: "/vakilsutra/corporate/consultancy" },
      { name: "j. Memorandum of Understanding", icon: "/icons/mou.png", url: "/vakilsutra/corporate/mou" },
      { name: "k. Scope of Work Agreement", icon: "/icons/sow.png", url: "/vakilsutra/corporate/sow" }
    ],
    "C. Legal & Compliance Documents": [
      { name: "a. Terms of Service", icon: "/icons/tos.png", url: "/vakilsutra/corporate/tos" },
      { name: "b. GDPR", icon: "/icons/gdpr.png", url: "/vakilsutra/corporate/gdpr" },
      { name: "c. Disclaimer", icon: "/icons/disclaimer.png", url: "/vakilsutra/corporate/disclaimer" }
    ],
    "D. Company Structure & Governance": [
      { name: "a. Add a Director", icon: "/icons/add-director.png", url: "/vakilsutra/corporate/add-director" },
      { name: "b. Remove a Director", icon: "/icons/remove-director.png", url: "/vakilsutra/corporate/remove-director" },
      { name: "c. Increase Authorized Capital", icon: "/icons/capital.png", url: "/vakilsutra/corporate/increase-capital" },
      { name: "d. Change Objective/Activity", icon: "/icons/objective.png", url: "/vakilsutra/corporate/change-objective" },
      { name: "e. Change Address", icon: "/icons/address.png", url: "/vakilsutra/corporate/change-address" },
      { name: "f. Change Company Name", icon: "/icons/name-change.png", url: "/vakilsutra/corporate/change-name" },
      { name: "g. Private Limited Company / OPC", icon: "/icons/private-opc.png", url: "/vakilsutra/corporate/private-opc" },
      { name: "h. Limited Liability Partnership", icon: "/icons/llp-change.png", url: "/vakilsutra/corporate/llp-change" },
      { name: "i. Proprietorship to Pvt Ltd", icon: "/icons/prop-pvt.png", url: "/vakilsutra/corporate/prop-to-pvt" },
      { name: "j. Partnership to LLP", icon: "/icons/partnership-llp.png", url: "/vakilsutra/corporate/partnership-to-llp" },
      { name: "k. Private to Public Limited", icon: "/icons/private-public.png", url: "/vakilsutra/corporate/private-to-public" },
      { name: "l. Private to One Person Company", icon: "/icons/private-opc.png", url: "/vakilsutra/corporate/private-to-opc" }
    ],
    "E. Company Closure & Dissolution": [
      { name: "a. Close the Pvt Ltd Company", icon: "/icons/close-pvt.png", url: "/vakilsutra/corporate/close-pvt" },
      { name: "b. Close the LLP", icon: "/icons/close-llp.png", url: "/vakilsutra/corporate/close-llp" }
    ],
    "F. LLP-Specific Compliance": [
      { name: "a. Add Designated Partner", icon: "/icons/add-partner.png", url: "/vakilsutra/corporate/add-partner" },
      { name: "b. Changes to LLP Agreement", icon: "/icons/llp-agreement.png", url: "/vakilsutra/corporate/llp-agreement" }
    ],
    "G. NGO Related": [
      { name: "a. NGO", icon: "/icons/ngo.png", url: "/vakilsutra/corporate/ngo" },
      { name: "b. Section 8", icon: "/icons/section8.png", url: "/vakilsutra/corporate/section-8" },
      { name: "c. Trust Registration", icon: "/icons/trust.png", url: "/vakilsutra/corporate/trust" },
      { name: "d. Society Registration", icon: "/icons/society.png", url: "/vakilsutra/corporate/society" },
      { name: "e. NGO Compliance", icon: "/icons/ngo-compliance.png", url: "/vakilsutra/corporate/ngo-compliance" },
      { name: "f. Section 8 Compliance", icon: "/icons/section8-compliance.png", url: "/vakilsutra/corporate/section8-compliance" },
      { name: "g. CSR-1 Filing", icon: "/icons/csr.png", url: "/vakilsutra/corporate/csr" },
      { name: "h. Sec.80G & Sec.12A", icon: "/icons/tax-exemption.png", url: "/vakilsutra/corporate/tax-exemption" },
      { name: "i. Darpan Registration", icon: "/icons/darpan.png", url: "/vakilsutra/corporate/darpan" }
    ]
  },
  "Labor & Compliance": {
    "A. Employment & HR Agreements": [
      { name: "a. Employment Agreement", icon: "/icons/employment.png", url: "/vakilsutra/labor/employment-agreement" },
      { name: "b. Employee Stock Option Plan (ESOP)", icon: "/icons/esop.png", url: "/vakilsutra/labor/esop-agreement" }
    ],
    "B. Registrations & Compliance": [
      { name: "a. Provident Fund (PF) Registration", icon: "/icons/pf.png", url: "/vakilsutra/labor/pf" },
      { name: "b. ESI Registration", icon: "/icons/esi.png", url: "/vakilsutra/labor/esi" },
      { name: "c. Professional Tax Registration", icon: "/icons/professional-tax.png", url: "/vakilsutra/labor/professional-tax" },
      { name: "d. Shops and Establishments License", icon: "/icons/shop.png", url: "/vakilsutra/labor/shop-establishment" },
      { name: "e. Employee Stock Option Plan [ESOP]", icon: "/icons/esop-reg.png", url: "/vakilsutra/labor/esop-registration" },
      { name: "f. POSH Compliance", icon: "/icons/posh.png", url: "/vakilsutra/labor/posh" }
    ]
  },
  "Tax & Financial Compliance": {
    "A. Tax Related": [
      { name: "a. GST Registration", icon: "/icons/gst.png", url: "/vakilsutra/tax/gst-registration" },
      { name: "b. GST Filing", icon: "/icons/gst-filing.png", url: "/vakilsutra/tax/gst-filing" },
      { name: "c. GST Advisory", icon: "/icons/gst-advisory.png", url: "/vakilsutra/tax/gst-advisory" },
      { name: "d. Indirect Tax", icon: "/icons/indirect-tax.png", url: "/vakilsutra/tax/indirect-tax" },
      { name: "e. RoDTEP", icon: "/icons/rodtep.png", url: "/vakilsutra/tax/rodtep" },
      { name: "f. TDS Return Filing", icon: "/icons/tds.png", url: "/vakilsutra/tax/tds-filing" },
      { name: "g. Individual Income Tax Filing", icon: "/icons/income-tax.png", url: "/vakilsutra/tax/individual-tax" },
      { name: "h. Proprietorship Tax Return Filing", icon: "/icons/proprietorship-tax.png", url: "/vakilsutra/tax/proprietorship-tax" },
      { name: "i. Income Tax Notice", icon: "/icons/tax-notice.png", url: "/vakilsutra/tax/income-tax-notice" }
    ],
    "B. Financial & Regulatory Compliance": [
      { name: "a. Accounting and Book-keeping", icon: "/icons/accounting.png", url: "/vakilsutra/tax/accounting" },
      { name: "b. Payroll Maintenance", icon: "/icons/payroll.png", url: "/vakilsutra/tax/payroll" },
      { name: "c. Compliance Check - Secretarial Audit", icon: "/icons/audit.png", url: "/vakilsutra/tax/secretarial-audit" },
      { name: "d. Due Diligence", icon: "/icons/due-diligence.png", url: "/vakilsutra/tax/due-diligence" },
      { name: "e. RBI Compliance", icon: "/icons/rbi.png", url: "/vakilsutra/tax/rbi-compliance" }
    ]
  },
  "Personal & Civil Services": [
    { name: "a. Name Change", icon: "/icons/name-change.png", url: "/vakilsutra/civil/name-change" },
    { name: "b. Religion Change", icon: "/icons/religion.png", url: "/vakilsutra/civil/religion-change" },
    { name: "c. Gender Change", icon: "/icons/gender.png", url: "/vakilsutra/civil/gender-change" },
    { name: "d. Marriage Registration", icon: "/icons/marriage.png", url: "/vakilsutra/civil/marriage-registration" },
    { name: "e. Court Marriage", icon: "/icons/court-marriage.png", url: "/vakilsutra/civil/court-marriage" }
  ],
  "Property related Services": [
    { name: "Property Title Verification", icon: "/icons/verification.png", url: "/vakilsutra/property/title-verification" },
    { name: "Rental Agreement", icon: "/icons/rent.png", url: "/vakilsutra/property/rental-agreement" },
    { name: "Sale Deed", icon: "/icons/sale-deed.png", url: "/vakilsutra/property/sale-deed" },
    { name: "Make a Will", icon: "/icons/will.png", url: "/vakilsutra/property/will" },
    { name: "Power of Attorney", icon: "/icons/poa.png", url: "/vakilsutra/property/poa" }
  ],
  "Cyber Fraud": [
    { name: "Online Fraud Recovery", icon: "/icons/cyber-fraud.png", url: "/vakilsutra/cyber/online-fraud" }
  ],
  "Debt Relief": [
    { name: "Debt Recovery", icon: "/icons/debt.png", url: "/vakilsutra/debt/recovery" }
  ]
};

export default function VakilsutraSelectServices({ category, searchQuery = "" }: VakilsutraSelectServicesProps) {
  const [selectedService, setSelectedService] = useState<string | null>(null);
  const [expandedSubcategories, setExpandedSubcategories] = useState<{ [key: string]: boolean }>({});

  const getServices = () => {
    return services[category] || {};
  };

  const handleServiceClick = (serviceName: string, url: string) => {
    setSelectedService(serviceName);
    window.location.href = url;
  };

  const toggleSubcategory = (subcategory: string) => {
    setExpandedSubcategories(prev => ({
      ...prev,
      [subcategory]: !prev[subcategory]
    }));
  };

  const categoryServices = getServices();
  const hasSubcategories = Object.keys(categoryServices).some(key => key.includes('.'));

  return (
    <div className="mt-8 pt-6 border-t border-blue-100">
      <h3 className="text-lg font-semibold text-blue-950 mb-6">{category} Services</h3>
      {hasSubcategories ? (
        <div className="space-y-10">
          {Object.entries(categoryServices as CategoryServices).map(([subcategory, subServices]) => (
            <div key={subcategory}>
              <div 
                onClick={() => toggleSubcategory(subcategory)}
                className="flex items-center justify-between cursor-pointer mb-6 group"
              >
                <h4 className="text-md font-medium text-blue-800 group-hover:text-blue-600 transition-colors duration-200">
                  {subcategory}
                </h4>
                <svg
                  className={`w-5 h-5 text-blue-800 transform transition-transform duration-200 ${
                    expandedSubcategories[subcategory] ? 'rotate-180' : ''
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>
              {expandedSubcategories[subcategory] && (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
                  {subServices.map((service: Service, index: number) => (
                    <div 
                      key={index}
                      onClick={() => handleServiceClick(service.name, service.url)}
                      className={`flex flex-col items-center gap-4 p-5 bg-white rounded-xl border transition-all duration-200 cursor-pointer group ${
                        selectedService === service.name 
                          ? 'border-blue-500 shadow-lg bg-blue-50' 
                          : 'border-blue-100 hover:shadow-md'
                      }`}
                    >
                      <div className={`w-16 h-16 rounded-full flex items-center justify-center transition-all duration-200 ${
                        selectedService === service.name 
                          ? 'bg-blue-100 shadow-inner' 
                          : 'bg-blue-50 group-hover:bg-blue-100'
                      }`}>
                        <img
                          src={service.icon}
                          alt={service.name}
                          className="w-10 h-10 object-contain"
                        />
                      </div>
                      <span className={`text-sm font-medium text-center transition-colors duration-200 ${
                        selectedService === service.name 
                          ? 'text-blue-800' 
                          : 'text-blue-950 group-hover:text-blue-800'
                      }`}>
                        {service.name}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
          {(categoryServices as Service[]).map((service: Service, index: number) => (
            <div 
              key={index}
              onClick={() => handleServiceClick(service.name, service.url)}
              className={`flex flex-col items-center gap-4 p-5 bg-white rounded-xl border transition-all duration-200 cursor-pointer group ${
                selectedService === service.name 
                  ? 'border-blue-500 shadow-lg bg-blue-50' 
                  : 'border-blue-100 hover:shadow-md'
              }`}
            >
              <div className={`w-16 h-16 rounded-full flex items-center justify-center transition-all duration-200 ${
                selectedService === service.name 
                  ? 'bg-blue-100 shadow-inner' 
                  : 'bg-blue-50 group-hover:bg-blue-100'
              }`}>
                <img
                  src={service.icon}
                  alt={service.name}
                  className="w-10 h-10 object-contain"
                />
              </div>
              <span className={`text-sm font-medium text-center transition-colors duration-200 ${
                selectedService === service.name 
                  ? 'text-blue-800' 
                  : 'text-blue-950 group-hover:text-blue-800'
              }`}>
                {service.name}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
} 