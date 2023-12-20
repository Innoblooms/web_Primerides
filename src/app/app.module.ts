import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { ProductsComponent } from './products/products.component';
import { InventoryComponent } from './inventory/inventory.component';
import { ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';

import { HttpClientModule } from '@angular/common/http'; 
import { CardetailsComponent } from './cardetails/cardetails.component';
import { FooterComponent } from './footer/footer.component';
import { HeaderComponent } from './header/header.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgFor, AsyncPipe } from '@angular/common';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { AboutusComponent } from './aboutus/aboutus.component';
import { ContactusComponent } from './contactus/contactus.component';
import { PolicyComponent } from './policy/policy.component';
import { CondationsComponent } from './condations/condations.component';
import { RefundpolicyComponent } from './refundpolicy/refundpolicy.component';
import { FaqComponent } from './faq/faq.component';
import { MonthlycarComponent } from './monthlycar/monthlycar.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FleetComponent } from './fleet/fleet.component';
import { PaymentComponent } from './payment/payment.component';
import { AdminComponent } from './admin/admin.component';



@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    ProductsComponent,
    InventoryComponent,
   
    CardetailsComponent,
    FooterComponent,
    HeaderComponent,
    AboutusComponent,
    ContactusComponent,
    PolicyComponent,
    CondationsComponent,
    RefundpolicyComponent,
    FaqComponent,
    MonthlycarComponent,
    FleetComponent,
    PaymentComponent,
    AdminComponent,

    
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
  
    MatAutocompleteModule,
    NgFor,
    AsyncPipe,
    BrowserAnimationsModule,
    MatInputModule,
    MatFormFieldModule,
    NgbModule

  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
