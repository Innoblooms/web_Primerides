import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CarserviceService {

  // private baseUrl = 'http://localhost:3035/PrimeController/';
  private baseUrl = 'https://carbackend.primerides.in/PrimeController/';

  constructor(private http: HttpClient ) { }

 
  getCars() {
    return this.http.get(`${this.baseUrl}getCars`);
  }

  getMonthlyCars() {
    return this.http.get(`${this.baseUrl}getMonthlyCars`);
  }


  getBooking() {
    return this.http.get(`${this.baseUrl}getBooking`);
  }

  saveBooking(data:any) {
    return this.http.post(`${this.baseUrl}saveBooking`, data);
  }


 

 
//service
private selectedCar: any;

 
setSelectedCar(car: any) {
  this.selectedCar = car;
}


getSelectedCar() {
  return this.selectedCar;
}

getFilteredCars(seater: string, fuel: string, transmission: string): Observable<any> {
  const apiUrl = `${this.baseUrl}getSelectedCar?seater=${seater}&fuel=${fuel}&transmission=${transmission}`;
  return this.http.get(apiUrl);
}


Matchenddate(endingDate: string) {
  const url = `${this.baseUrl}Carfilter?EndingDate=${endingDate}`;
  return this.http.get(url);
}

signup(data:any){
  return this.http.post(`${this.baseUrl}saveUser`,data)

}

match(){
  return this.http.get(`${this.baseUrl}AlredyEmail`)

}

// Update the method in your user.service.ts
updateCar(CarID: any, formData: any) { 
  return this.http.put(`${this.baseUrl}updateCarData/${CarID}`, formData);
}







deleteCar(carID: any) {
  return this.http.delete(`${this.baseUrl}deleteCar/${carID}`);
}

deleteBooking(BookingID: any) {
  return this.http.delete(`${this.baseUrl}deleteBooking/${BookingID}`);
}

getBookingwithFilter(Modal: string, Fuel: string, Transmission: string): Observable<any> {
  const apiUrl = `${this.baseUrl}seledata?Modal=${Modal}&Fuel=${Fuel}&Transmission=${Transmission}`;
  return this.http.get(apiUrl);
}




 






}