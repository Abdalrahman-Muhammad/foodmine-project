import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { CartService } from 'src/app/services/cart.service';
import { FoodService } from 'src/app/services/food.service';
import { UserService } from 'src/app/services/user.service';
import { Food } from 'src/app/shared/models/Food';
import { User } from 'src/app/shared/models/User';

@Component({
  selector: 'app-food-page',
  templateUrl: './food-page.component.html',
  styleUrls: ['./food-page.component.css'],
})
export class FoodPageComponent implements OnInit {
  food!: Food;
  user!: User;
  id!: any;
  constructor(
    private activatedRoute: ActivatedRoute,
    private foodService: FoodService,
    private cartService: CartService,
    private router: Router,
    private userService: UserService
  ) {}
  ngOnInit(): void {
    this.activatedRoute.params.subscribe((params) => {
      if (params['id'])
        this.foodService.getFoodById(params['id']).subscribe((food) => {
          this.food = food;
        });
    });

    this.userService.userObservable.subscribe((user) => {
      this.user = user;
    });

    this.activatedRoute.params.subscribe((params) => {
      this.id = params['id'];
    });
  }

  addToCart() {
    this.cartService.addToCart(this.food);
    this.router.navigateByUrl('/cart-page');
  }

  deleteFood() {
    this.activatedRoute.params.subscribe((params) => {
      if (params['id'])
        this.foodService.deleteFood(params['id']).subscribe({
          next: () => this.router.navigateByUrl('/'),
        });
    });
  }
  editFood() {
    this.router.navigateByUrl(`food/${this.id}/edit`);
  }
}
