import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface CategoryFormProps {
  categoryName: string;
  setCategoryName: (value: string) => void;
  categoryIcon: string;
  setCategoryIcon: (value: string) => void;
  categoryNumber: number;
  setCategoryNumber: (value: number) => void;
  editCategoryId: string | null;
  onAddCategory: () => void;
  onCancelEdit: () => void;
  isLoading?: boolean;
}

export function CategoryForm({
  categoryName,
  setCategoryName,
  categoryIcon,
  setCategoryIcon,
  categoryNumber,
  setCategoryNumber,
  editCategoryId,
  onAddCategory,
  onCancelEdit,
  isLoading = false
}: CategoryFormProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{editCategoryId ? "Edit Category" : "Add New Category"}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="categoryName">Category Name</Label>
              <Input 
                id="categoryName"
                value={categoryName}
                onChange={(e) => setCategoryName(e.target.value)}
                placeholder="e.g., Insurance"
              />
            </div>
            <div>
              <Label htmlFor="categoryIcon">Icon (emoji)</Label>
              <Input 
                id="categoryIcon"
                value={categoryIcon}
                onChange={(e) => setCategoryIcon(e.target.value)}
                placeholder="e.g., 🔒"
              />
            </div>
            <div>
              <Label htmlFor="categoryNumber">Display Order</Label>
              <Input 
                id="categoryNumber"
                type="number"
                value={categoryNumber}
                onChange={(e) => setCategoryNumber(parseInt(e.target.value) || 0)}
                placeholder="0"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Enter a number to control display order (lower numbers appear first)
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button onClick={onAddCategory} disabled={isLoading}>
              {isLoading ? "Processing..." : (editCategoryId ? "Update Category" : "Add Category")}
            </Button>
            {editCategoryId && (
              <Button variant="outline" onClick={onCancelEdit}>
                Cancel
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}