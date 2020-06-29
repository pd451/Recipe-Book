import { Component, OnInit } from '@angular/core';
import { ActivatedRoute , Router, Params } from '@angular/router';
import { Recipe } from '../recipe.model';
import { RecipeService } from '../recipe.service';

@Component({
  selector: 'app-recipe-detail',
  templateUrl: './recipe-detail.component.html',
  styleUrls: ['./recipe-detail.component.css']
})
export class RecipeDetailComponent implements OnInit {
  recipe: Recipe;
  id : number;
  constructor(private rs : RecipeService, private router : Router, private route : ActivatedRoute) { }

  ngOnInit(): void {
    this.route.params.subscribe(
      (params : Params) => { this.id = +params['id']; this.recipe = this.rs.getRecipe(this.id);}
    )
  }

  onAddtoShoppingList() {
    this.rs.addIngredientsToShoppingList(this.recipe.ingredients);
  }

  onEditRecipe() {
    this.router.navigate(['edit'] , {relativeTo : this.route});
  }

  onDeleteRecipe() {
    this.rs.deleteRecipe(this.id);
    this.router.navigate(['../'] , {relativeTo : this.route});
  }

}
