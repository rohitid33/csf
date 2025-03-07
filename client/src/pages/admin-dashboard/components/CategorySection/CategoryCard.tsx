import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CategoryData } from "@/data/categories-data";
import { SubcategoryData } from "@/components/services/service-template";

interface CategoryCardProps {
  category: CategoryData;
  subcategories: SubcategoryData[];
  onEdit: (category: CategoryData) => void;
  onDelete: (id: string) => void;
}

export function CategoryCard({ category, subcategories, onEdit, onDelete }: CategoryCardProps) {
  return (
    <Card key={category.id}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="text-2xl">{category.icon}</span>
            <h3 className="text-xl font-semibold">{category.name}</h3>
          </div>
          <div className="flex flex-col items-end">
            <span className="text-sm text-muted-foreground">ID: {category.id}</span>
            <span className="text-sm text-muted-foreground">Order: {category.number || 0}</span>
          </div>
        </div>
        
        {/* Display subcategories linked to this category */}
        <div className="mb-4">
          <h4 className="text-sm font-medium mb-2">Linked Subcategories:</h4>
          {subcategories.filter(subcat => subcat.categoryId === category.id).length > 0 ? (
            <ul className="list-disc list-inside text-sm">
              {subcategories
                .filter(subcat => subcat.categoryId === category.id)
                .map(subcat => (
                  <li key={subcat.id}>{subcat.name}</li>
                ))
              }
            </ul>
          ) : (
            <p className="text-sm text-muted-foreground">No subcategories linked</p>
          )}
        </div>
        
        <div className="flex gap-2 mt-4">
          <Button 
            variant="outline" 
            onClick={() => onEdit(category)}
          >
            Edit
          </Button>
          <Button 
            variant="destructive" 
            onClick={() => onDelete(category.id)}
          >
            Delete
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}