import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { LoginComponent } from './user/login/login.component';
import { HomeComponent } from './home/home.component';
import { SignupComponent } from './user/signup/signup.component';
import { ProductsComponent } from './products/products.component';
import { InventoryComponent } from './inventory/inventory.component';
import { PreviewComponent } from './preview/preview.component';

const routes: Routes = [
  
  { 
    path: 'login', 
  component: LoginComponent
 },


 { 
  path: 'signup', 
component: SignupComponent
},

{ 
  path: 'products', 
component: ProductsComponent
},

{ 
  path: 'inventry', 
component: InventoryComponent
},

{ 
  path: 'preview', 
component: PreviewComponent
},

{ 
  path: 'home', 
component: HomeComponent
},
  

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
