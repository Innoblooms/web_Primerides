import { Component } from '@angular/core';
import { timeInterval, windowTime } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'PrimeWebsite';


  isPopupVisible: boolean = false;
 
  openPopup(): void {
    this.isPopupVisible = true;
  }
 
  closePopup(): void {
    this.isPopupVisible = false;
  }




  isWhatsappVisible: boolean = false;
  openWhatsapp(): void {
    this.isWhatsappVisible = true;
  }

  closeWhatsapp(): void {
    this.isWhatsappVisible = false;
  }





}
