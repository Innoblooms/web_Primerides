import { Component } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.css']
})
export class PaymentComponent {
  constructor(private http: HttpClient) {}
  searchForm: FormGroup|any;

  // private baseUrl = 'http://localhost:3035/PrimeController/';
  private baseUrl = 'https://carbackend.primerides.in/PrimeController/';


  private  redirect_url = 'http://127.0.0.1:3001/ccavResponseHandler';


  myorder() {
    const currentDate = new Date();   
      const month = (currentDate.getMonth() + 1).toString().padStart(2, "0");
      const day = currentDate.getDate().toString().padStart(2, "0");
      const hour = currentDate.getHours().toString().padStart(2, "0");
      const minute = currentDate.getMinutes().toString().padStart(2, "0");
      const second = currentDate.getSeconds().toString().padStart(2, "0");
      const milisec = currentDate.getMilliseconds().toString().padStart(2, "0");
     return (`Or/${month}/${day}/${hour}/${minute}/${second}/${milisec}`);    
  
    } 
  onSubmit(){    
    const order_id = this.myorder();
    console.log(order_id);    
    this.http.get(`${this.baseUrl}make-payment`).subscribe((response) => {
      // Handle the server response, which may include the CCAvenue redirect URL
      // window.location.href = response.redirect_url;
  });
    
  }



  

}
