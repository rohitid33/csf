import { useState, useEffect } from "react";
import { CategoryData, getAllCategories } from "@/data/categories-data";
import { useToast } from "@/hooks/use-toast";

export function useCategories() {
  const [categories, setCategories] = useState<CategoryData[]>([]);
  const [categoryName, setCategoryName] = useState("");
  const [categoryIcon, setCategoryIcon] = useState("");
  const [categoryNumber, setCategoryNumber] = useState<number>(0);
  const [editCategoryId, setEditCategoryId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  
  const { toast } = useToast();

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    setIsLoading(true);
    try {
      const loadedCategories = await getAllCategories();
      setCategories(loadedCategories || []);
    } catch (error) {
      console.error('Error loading categories:', error);
      toast({
        title: "Error loading categories",
        description: "There was a problem loading the categories.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddCategory = () => {
    if (!categoryName.trim()) {
      toast({
        title: "Error",
        description: "Category name is required",
        variant: "destructive"
      });
      return;
    }

    const id = categoryName.toLowerCase().replace(/\s+/g, '-');
    
    if (editCategoryId) {
      // Update existing category
      setCategories(categories.map(cat => 
        cat.id === editCategoryId ? { id, name: categoryName, icon: categoryIcon, number: categoryNumber } : cat
      ));
      setEditCategoryId(null);
    } else {
      // Add new category
      setCategories([...categories, { id, name: categoryName, icon: categoryIcon, number: categoryNumber }]);
    }
    
    // Reset form
    setCategoryName("");
    setCategoryIcon("");
    setCategoryNumber(0);
    setHasChanges(true);
    
    toast({
      title: editCategoryId ? "Category updated" : "Category added",
      description: `The category has been ${editCategoryId ? "updated" : "added"} to the local changes.`,
    });
  };

  const handleDeleteCategory = (id: string) => {
    if (window.confirm(`Are you sure you want to delete this category?`)) {
      setCategories(categories.filter(cat => cat.id !== id));
      setHasChanges(true);
      
      toast({
        title: "Category deleted",
        description: "The category has been deleted from the local changes.",
      });
    }
  };

  return {
    categories,
    categoryName,
    setCategoryName,
    categoryIcon,
    setCategoryIcon,
    categoryNumber,
    setCategoryNumber,
    editCategoryId,
    setEditCategoryId,
    isLoading,
    hasChanges,
    setHasChanges,
    fetchCategories,
    handleAddCategory,
    handleDeleteCategory
  };
}