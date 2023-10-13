import {
  Component,
  OnChanges,
  OnDestroy,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { FoodService } from 'src/app/services/food.service';
import { Food } from 'src/app/shared/models/Food';

@Component({
  selector: 'app-food-form',
  templateUrl: './food-form.component.html',
  styleUrls: ['./food-form.component.css'],
})
export class FoodFormComponent implements OnInit, OnDestroy, OnChanges {
  foods!: Food[];
  food: any;
  id: any;
  foodObservable: Subscription | undefined;
  foodssObservable: Subscription | undefined;
  foodForm!: FormGroup;

  constructor(
    private foodService: FoodService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {}
  ngOnChanges(changes: SimpleChanges): void {}

  ngOnDestroy(): void {
    if (this.foodObservable) {
      this.foodObservable.unsubscribe();
    }
  }

  ngOnInit(): void {
    this.foodForm = new FormGroup({
      name: new FormControl('', [
        Validators.required,
        Validators.minLength(3),
        Validators.pattern(/^[A-Za-z0-9\s]+$/),
      ]),
      price: new FormControl('', [
        Validators.required,
        Validators.pattern(/^\d+(\.\d{1,2})?$/),
      ]),
      tags: new FormArray([]), // FormArray for an array of strings
      favorite: new FormControl(false),
      stars: new FormControl('', [
        Validators.required,
        Validators.min(1),
        Validators.max(5),
      ]),
      imageUrl: new FormControl('', [Validators.required]),
      origins: new FormArray([], [Validators.required]), // FormArray for an array of strings
      cookTime: new FormControl('', [Validators.required]),
    });
    // You can set up form controls with existing data if needed
    this.activatedRoute.params.subscribe((params) => {
      this.id = params['id'];
      if (this.id === '0') {
        // This is a new item, set initial values or use default values if needed
        this.foodForm.patchValue({
          favorite: false,
          stars: 0,
          cookTime: null,
          origins: [],
          imageUrl: null,
          tags: [],
          name: null,
          price: null,

          // Add other default values as needed
        });
      } else {
        // This is an existing item, fetch the data and populate the form
        this.foodObservable = this.foodService
          .getFoodById(this.id)
          .subscribe((food) => {
            this.foodForm.patchValue(food);
            const tagsArray = this.foodForm.get('tags') as FormArray;
            tagsArray.clear(); // Clear existing tags
            if (food.tags) {
              for (const tag of food.tags) {
                tagsArray.push(new FormControl(tag));
              }
            }

            // Populate the origins FormArray
            const originsArray = this.foodForm.get('origins') as FormArray;
            originsArray.clear(); // Clear existing origins
            for (const origin of food.origins) {
              originsArray.push(new FormControl(origin));
            }
          });
      }
    });
  }

  // Add a tag to the FormArray
  addTag() {
    const tagsArray = this.foodForm.get('tags') as FormArray;
    tagsArray.push(new FormControl(''));
  }

  // Remove a tag from the FormArray
  removeTag(index: number) {
    const tagsArray = this.foodForm.get('tags') as FormArray;
    tagsArray.removeAt(index);
  }

  // Add an origin to the FormArray
  addOrigin() {
    const originsArray = this.foodForm.get('origins') as FormArray;
    originsArray.push(new FormControl(''));
  }

  // Remove an origin from the FormArray
  removeOrigin(index: number) {
    const originsArray = this.foodForm.get('origins') as FormArray;
    originsArray.removeAt(index);
  }

  getTagsFormArray(): FormArray {
    return this.foodForm.get('tags') as FormArray;
  }

  getOriginsFormArray(): FormArray {
    return this.foodForm.get('origins') as FormArray;
  }

  saveFood() {
    // You can access the form data using this.foodForm.value
    const formData = this.foodForm.value;

    if (this.id === '0') {
      // Add a new food item
      this.foodService.createFood(formData).subscribe(() => {
        this.router.navigate(['/']);
      });
    } else {
      console.log(`inside update`);
      // Update an existing food item
      this.foodService.updateFood(this.id, formData).subscribe(() => {
        this.router.navigate(['/']);
      });
    }
  }
}
