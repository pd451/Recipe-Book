import { Injectable } from '@angular/core';
import { Recipe } from './recipe.model';
import { Ingredient } from '../shared/ingredient.model';
import { ShoppingListService } from '../shopping-list/shopping-list.service';
import { Subject } from 'rxjs'

@Injectable({providedIn: 'root'})

export class RecipeService {
  private recipes: Recipe[] = [];
  public recipesChanged = new Subject<Recipe[]>();

  getRecipes() {
      return this.recipes.slice();
  }

  getRecipe(index : number) {
    return this.recipes[index];
  }

  setRecipes(recipes : Recipe []) {
    this.recipes = recipes;
    this.recipesChanged.next(this.recipes.slice());
  }

  constructor(private slService: ShoppingListService) {

  }

  addIngredientsToShoppingList( ingredients : Ingredient[]) {
    this.slService.addIngredients(ingredients);
  }

  addRecipe(recipe : Recipe) {
    this.recipes.push(recipe);
    this.recipesChanged.next(this.recipes.slice());
  }

  editRecipe(recipe : Recipe, index : number) {
    this.recipes[index] = recipe;
    this.recipesChanged.next(this.recipes.slice());
  }

  deleteRecipe(index : number) {
    this.recipes.splice(index,1);
    this.recipesChanged.next(this.recipes.slice());
  }

  

}