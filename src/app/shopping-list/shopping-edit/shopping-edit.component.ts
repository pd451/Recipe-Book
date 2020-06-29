import { Component, OnInit, ViewChild } from '@angular/core';
import { Ingredient } from 'src/app/shared/ingredient.model';
import { ShoppingListService } from '../shopping-list.service'; 
import { NgForm } from '@angular/forms'
import { Subscription } from 'rxjs';


@Component({
  selector: 'app-shopping-edit',
  templateUrl: './shopping-edit.component.html',
  styleUrls: ['./shopping-edit.component.css']
})
export class ShoppingEditComponent implements OnInit {
  @ViewChild('f') slForm : NgForm;
  subscription : Subscription;
  editMode = false;
  editIndex: number;
  editItem: Ingredient;

  onSubmit(form : NgForm) {
    const value = form.value; 
    const ing = new Ingredient( value.name, value.amount);

    if (this.editMode) {
      this.slService.updateIngredient(this.editIndex, ing);
    }
    else {
      this.slService.addIngredient(ing);
    }
    this.editMode = false;
    form.reset();
    
  }

  onDelete() {
    this.slService.deleteIngredient(this.editIndex);
  }

  PopElement() {
    this.slService.popIngredient();
  }

  onClear() {
    this.slForm.reset();
    this.editMode = false;
  }

  constructor(private slService : ShoppingListService) { }

  ngOnInit(): void {
    this.subscription = this.slService.startedEditing.subscribe(
      (index : number) => {
        this.editMode = true;
        this.editIndex = index;
        this.editItem = this.slService.getIngredient(index);
        this.slForm.setValue({
          name: this.editItem.name,
          amount: this.editItem.amount
        });
      }
    );
  }

}
