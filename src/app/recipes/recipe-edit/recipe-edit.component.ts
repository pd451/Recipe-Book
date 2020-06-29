import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params , Router } from '@angular/router';
import { FormGroup, FormControl, FormArray , Validators } from '@angular/forms';
import { RecipeService } from '../recipe.service';



@Component({
  selector: 'app-recipe-edit',
  templateUrl: './recipe-edit.component.html',
  styleUrls: ['./recipe-edit.component.css']
})
export class RecipeEditComponent implements OnInit {
  id: number;
  editMode = false;
  recipeForm : FormGroup;

  constructor(private route : ActivatedRoute , private recipeService : RecipeService,
    private router : Router) { }

  ngOnInit(): void {
    this.route.params.subscribe(
      (params: Params) => {
        this.id = +params['id'];
        this.editMode = params['id'] != null;
        this.initForm();
      }

    );
  }

  private initForm() {
    let recipeName = '';
    let recipeImagePath = '';
    let recipeDescription = '';
    let recipeIngredients = new FormArray([]);

    if (this.editMode) {
      const recipe = this.recipeService.getRecipe(this.id);
      recipeName = recipe.name;
      recipeImagePath = recipe.imagePath;
      recipeDescription = recipe.description;

      if (recipe.ingredients) {
        for (let ingredient of recipe.ingredients) {
          recipeIngredients.push(
            new FormGroup({
              'name' : new FormControl(ingredient.name, Validators.required),
              'amount' : new FormControl(ingredient.amount, [Validators.required, 
              Validators.pattern(/^[1-9]+[0-9]*$/) ])
            })
          );
        }
      }
    }

    this.recipeForm = new FormGroup({ 
      'name' : new FormControl(recipeName, Validators.required),
      'imagePath' : new FormControl(recipeImagePath, Validators.required),
      'description' : new FormControl(recipeDescription, Validators.required),
      'ingredients' : recipeIngredients  
    });
  }



  get controls() { // a getter!
    return (<FormArray>this.recipeForm.get('ingredients')).controls;
  }

  onSubmit(event : any) {
    if (event.target.innerText === 'Save') {
      const new_recipe = this.recipeForm.value;

      if (this.editMode) {
        this.recipeService.editRecipe(new_recipe , this.id);
      }
      else {      
        this.recipeService.addRecipe(new_recipe);
      }
      this.router.navigate(['../'] , {relativeTo : this.route});
    }
    // const new_name = this.recipeForm.get('name').value;
    // const new_image = this.recipeForm.get('imagePath').value;
    // const new_desc = this.recipeForm.get('description').value;
    // const new_ingredients = [];

    // for (let ingredient of (<FormArray>this.recipeForm.get('ingredients')).controls ) {
    //   const n1 = ingredient.value.name;
    //   const a1 = ingredient.value.amount;
    //   const t1  = new Ingredient(n1,a1);
    //   new_ingredients.push(t1);
    // }
    
  }

  onCancel() {
    this.router.navigate(['../'] , {relativeTo : this.route});
  }

  onClearIngredients() {
    (<FormArray>this.recipeForm.get('ingredients')).clear();
  }

  onDeleteIngredient(index : number) {
    (<FormArray>this.recipeForm.get('ingredients')).removeAt(index);
  }

  onAddIngredient() {
    (<FormArray>this.recipeForm.get('ingredients')).push(
      new FormGroup({
        'name' : new FormControl(null , Validators.required),
              'amount' : new FormControl(null , [Validators.required, 
              Validators.pattern(/^[1-9]+[0-9]*$/) ])
        })
    );
  }

}
