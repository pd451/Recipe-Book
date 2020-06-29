import { EventEmitter , Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Ingredient } from '../shared/ingredient.model';

export class ShoppingListService {
    ingredientsChanged = new Subject<Ingredient[]>();
    startedEditing = new Subject<number>();
    private ingredients: Ingredient[] = [
        new Ingredient("Apples", 5),
        new Ingredient("Bananas", 5)
      ];    

    getIngredients() {
        return this.ingredients.slice();
    }

    getIngredient(index : number) {
        return this.ingredients[index];
    }

    addIngredient(ingredient: Ingredient) {
        this.ingredients.push(ingredient);
        this.ingredientsChanged.next(this.ingredients.slice());
    }

    addIngredients( ingredients: Ingredient[]) {
        this.ingredients.push(...ingredients);
        this.ingredientsChanged.next(this.ingredients.slice());
    }

    updateIngredient(index : number , newIngredient : Ingredient) {
        this.ingredients[index] = newIngredient;
        this.ingredientsChanged.next(this.ingredients.slice());
    }

    popIngredient() {
        if (this.ingredients.length > 0) {
            this.ingredients.splice(0,1);
            this.ingredientsChanged.next(this.ingredients.slice());
        }

        else {
            console.log("Number of Entries is 0");
        }
    }

    deleteIngredient(index : number) {
        this.ingredients.splice(index,1);
        this.ingredientsChanged.next(this.ingredients.slice());
    }
    
}