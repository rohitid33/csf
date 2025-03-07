// Define the Subcategory interface
export interface SubcategoryData {
  id: string;
  name: string;
  categoryId: string;
  serviceIds: string[]; // IDs of services linked to this subcategory
}

// Initial subcategories data
export const subcategoriesData: SubcategoryData[] = [
  { 
    id: "health-insurance", 
    name: "Health Insurance", 
    categoryId: "insurance",
    serviceIds: ["health-claim"] 
  },
  { 
    id: "motor-insurance", 
    name: "Motor Insurance", 
    categoryId: "insurance",
    serviceIds: ["motor-claim"] 
  },
  { 
    id: "life-insurance", 
    name: "Life Insurance", 
    categoryId: "insurance",
    serviceIds: ["life-claim"] 
  }
];

// For reactive updates - store subscribers
let subscribers: (() => void)[] = [];

// Helper functions
export async function getAllSubcategories(): Promise<SubcategoryData[]> {
  try {
    // Try to fetch subcategories from the API
    const response = await fetch('/api/subcategories');
    
    if (response.ok) {
      const apiSubcategories = await response.json();
      
      // Update the local array
      subcategoriesData.length = 0;
      subcategoriesData.push(...apiSubcategories);
      
      // Update localStorage
      saveToLocalStorage();
      
      console.log('Subcategories fetched from API:', apiSubcategories.length);
      return [...apiSubcategories]; // Return a copy of the fetched subcategories
    } else {
      console.warn('Failed to fetch subcategories from API, using local data');
      return [...subcategoriesData]; // Return a copy to prevent direct mutation
    }
  } catch (error) {
    console.error('Error fetching subcategories from API:', error);
    // Fallback to the in-memory array
    return [...subcategoriesData]; // Return a copy to prevent direct mutation
  }
}

export function getSubcategoryById(id: string): SubcategoryData | undefined {
  return subcategoriesData.find(subcategory => subcategory.id === id);
}

export function getSubcategoriesByCategoryId(categoryId: string): SubcategoryData[] {
  return subcategoriesData.filter(subcategory => subcategory.categoryId === categoryId);
}

export function getSubcategoriesByServiceId(serviceId: string): SubcategoryData[] {
  return subcategoriesData.filter(subcategory => 
    subcategory.serviceIds.includes(serviceId)
  );
}

// Function to update the subcategories data
export async function updateSubcategoriesData(updatedSubcategories: SubcategoryData[]): Promise<void> {
  try {
    // First update the in-memory array
    subcategoriesData.length = 0; // Clear the array
    subcategoriesData.push(...updatedSubcategories); // Add the updated subcategories
    
    // Store subcategories in localStorage for persistence across page refreshes
    saveToLocalStorage();
    
    // Get the admin token from localStorage
    const adminToken = localStorage.getItem('adminToken');
    if (!adminToken) {
      throw new Error('Admin authentication required');
    }
    
    // Now, update each subcategory in the MongoDB collection via API
    const updatePromises = updatedSubcategories.map(async (subcategory) => {
      try {
        // Check if subcategory exists (by ID)
        const response = await fetch(`/api/subcategories/${subcategory.id}`);
        
        if (response.ok) {
          // Subcategory exists, update it
          console.log(`Updating subcategory ${subcategory.id} in MongoDB`);
          return fetch(`/api/subcategories/${subcategory.id}`, {
            method: 'PUT',
            headers: { 
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${adminToken}`
            },
            body: JSON.stringify(subcategory)
          });
        } else {
          // Subcategory doesn't exist, create it
          console.log(`Creating new subcategory ${subcategory.id} in MongoDB`);
          return fetch('/api/subcategories', {
            method: 'POST',
            headers: { 
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${adminToken}`
            },
            body: JSON.stringify(subcategory)
          });
        }
      } catch (error) {
        console.error(`Failed to update subcategory ${subcategory.id}:`, error);
        throw error;
      }
    });
    
    // Wait for all update operations to complete
    await Promise.all(updatePromises);
    console.log('All subcategories synced with MongoDB successfully');
    
    // Notify all subscribers that data has changed
    notifySubscribers();
  } catch (error) {
    console.error('Failed to update subcategories in the database:', error);
    throw error;
  }
}

// Function to add a service to a subcategory
export function addServiceToSubcategory(subcategoryId: string, serviceId: string): void {
  const subcategory = subcategoriesData.find(sc => sc.id === subcategoryId);
  if (subcategory && !subcategory.serviceIds.includes(serviceId)) {
    subcategory.serviceIds.push(serviceId);
    
    // Update localStorage
    saveToLocalStorage();
    
    // Notify subscribers
    notifySubscribers();
  }
}

// Function to remove a service from a subcategory
export function removeServiceFromSubcategory(subcategoryId: string, serviceId: string): void {
  const subcategory = subcategoriesData.find(sc => sc.id === subcategoryId);
  if (subcategory) {
    subcategory.serviceIds = subcategory.serviceIds.filter(id => id !== serviceId);
    
    // Update localStorage
    saveToLocalStorage();
    
    // Notify subscribers
    notifySubscribers();
  }
}

// Function to create a new subcategory
export async function createSubcategory(newSubcategory: SubcategoryData): Promise<void> {
  try {
    console.log("=== Creating subcategory ===");
    console.log("New subcategory data:", newSubcategory);
    
    // Check if subcategory with the same ID already exists
    if (subcategoriesData.some(subcategory => subcategory.id === newSubcategory.id)) {
      throw new Error(`Subcategory with ID ${newSubcategory.id} already exists`);
    }
    
    // Add the new subcategory to the array
    subcategoriesData.push(newSubcategory);
    
    // Save to localStorage
    saveToLocalStorage();
    
    // Get the admin token from localStorage
    const adminToken = localStorage.getItem('adminToken');
    console.log("Admin token present:", !!adminToken);
    
    if (!adminToken) {
      throw new Error('Admin authentication required');
    }
    
    // Create in MongoDB via API
    console.log("Sending request to create subcategory...");
    const response = await fetch('/api/subcategories', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${adminToken}`
      },
      body: JSON.stringify({
        name: newSubcategory.name,
        categoryId: newSubcategory.categoryId,
        serviceIds: newSubcategory.serviceIds || []
      })
    });
    
    console.log("Response status:", response.status);
    const responseData = await response.json();
    console.log("Response data:", responseData);
    
    if (!response.ok) {
      throw new Error(responseData.error || 'Failed to create subcategory in MongoDB');
    }
    
    console.log(`Subcategory ${newSubcategory.id} created in MongoDB successfully`);
    
    // Notify subscribers
    notifySubscribers();
  } catch (error) {
    console.error(`Failed to create subcategory ${newSubcategory.id}:`, error);
    throw error;
  }
}

// Function to subscribe to data changes
export function subscribeToSubcategories(callback: () => void): () => void {
  subscribers.push(callback);
  
  // Return unsubscribe function
  return () => {
    subscribers = subscribers.filter(cb => cb !== callback);
  };
}

// Function to notify all subscribers
function notifySubscribers(): void {
  subscribers.forEach(callback => callback());
}

// Helper function to save subcategories to localStorage
function saveToLocalStorage(): void {
  try {
    localStorage.setItem('subcategories', JSON.stringify(subcategoriesData));
  } catch (error) {
    console.error('Failed to save subcategories to localStorage:', error);
  }
}

// Load subcategories from localStorage on module initialization
try {
  const savedSubcategories = localStorage.getItem('subcategories');
  if (savedSubcategories) {
    const parsedSubcategories = JSON.parse(savedSubcategories);
    subcategoriesData.length = 0;
    subcategoriesData.push(...parsedSubcategories);
  }
} catch (error) {
  console.error('Failed to load subcategories from localStorage:', error);
}