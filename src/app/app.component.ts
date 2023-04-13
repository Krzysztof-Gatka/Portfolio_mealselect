import { Component, OnInit } from '@angular/core';
import { AuthService } from './auth/auth.service';
import { RecipesService } from './recipes/recipes.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  constructor(private authService: AuthService, private recipesService: RecipesService) {}

  ngOnInit(): void {
    this.authService.autologin();
    this.authService.userAuthentication.subscribe(operation => {
      if(operation === 'logOut') {
        this.recipesService.clearUserRecipes();
      }
    })
  }
}
