import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './components/partials/header/header.component';
import { HomeComponent } from './components/pages/home/home.component';
import { NgxStarsModule } from 'ngx-stars';
import { SearchComponent } from './components/partials/search/search.component';
import { TagsComponent } from './components/partials/tags/tags.component';
import { FooterComponent } from './components/partials/footer/footer.component';
import { FoodPageComponent } from './components/pages/food-page/food-page.component';
import { CartPageComponent } from './components/pages/cart-page/cart-page.component';
import { TitlesComponent } from './components/partials/titles/titles.component';

@NgModule({
  declarations: [AppComponent, HeaderComponent, HomeComponent, SearchComponent, TagsComponent, FooterComponent, FoodPageComponent, CartPageComponent, TitlesComponent],
  imports: [BrowserModule, AppRoutingModule, NgxStarsModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
