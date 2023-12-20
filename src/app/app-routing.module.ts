import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';

import { HomeComponent } from './home/home.component';

import { ProductsComponent } from './products/products.component';
import { InventoryComponent } from './inventory/inventory.component';

import { CardetailsComponent } from './cardetails/cardetails.component';
import { ContactusComponent } from './contactus/contactus.component';
import { RefundpolicyComponent } from './refundpolicy/refundpolicy.component';
import { PolicyComponent } from './policy/policy.component';
import { CondationsComponent } from './condations/condations.component';
import { AboutusComponent } from './aboutus/aboutus.component';
import { FaqComponent } from './faq/faq.component';
import { MonthlycarComponent } from './monthlycar/monthlycar.component';
import { FleetComponent } from './fleet/fleet.component';
import { PaymentComponent } from './payment/payment.component';
import { AuthGuard } from './auth.guard';
import { AdminComponent } from './admin/admin.component';
import { SuccessComponent } from './success/success.component';
import { ViewcartComponent } from './viewcart/viewcart.component';
import { FailedComponent } from './failed/failed.component';

const routes: Routes = [
  {
    path: 'permission',
    canActivate: [AuthGuard],
    component: AdminComponent,
    data: { permission: 'user-master' },
  },

  {
    path: 'products',
    component: ProductsComponent,
  },
  {
    path: 'cardetails',
    component: CardetailsComponent,
  },

  {
    path: 'inventry',
    component: InventoryComponent,
  },

  {
    path: 'terms',
    component: CondationsComponent,
  },
  {
    path: 'policy',
    component: PolicyComponent,
  },
  {
    path: 'refund',
    component: RefundpolicyComponent,
  },
  {
    path: 'contact-us',
    component: ContactusComponent,
  },

  {
    path: 'aboutus',
    component: AboutusComponent,
  },

  {
    path: 'faq',
    component: FaqComponent,
  },

  {
    path: '',
    component: HomeComponent,
  },

  {
    path: 'monthlycar',
    component: MonthlycarComponent,
  },

  {
    path: 'fleet',
    component: FleetComponent,
  },

  {
    path: 'payment',
    component: PaymentComponent,
  },

  {
    path: 'success',
    component: SuccessComponent,
  },
  {
    path: 'view',
    component: ViewcartComponent,
  },
  {
    path: 'failed',
    component: FailedComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { scrollPositionRestoration: 'top' })],
  exports: [RouterModule],
})
export class AppRoutingModule {}
