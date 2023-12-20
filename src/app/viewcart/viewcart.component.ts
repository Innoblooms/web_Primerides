import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { CarserviceService } from '../carservice.service';
@Component({
  selector: 'app-viewcart',
  templateUrl: './viewcart.component.html',
  styleUrls: ['./viewcart.component.css']
})
export class ViewcartComponent  {
  @ViewChild('form') form!: ElementRef;

  accessCode: any = 'AVVU40KL90BE67UVEB';
  encRequestRes: any;
  order_no: string = 'qaz234567';
  testAmount: any = '10';
  merchant_id = 2860259;
  currency: string = 'INR';
  redirect_url = 'https://primerides.in/handleresponse';
  cancel_url = 'https://primerides.in/handleresponse';

}
