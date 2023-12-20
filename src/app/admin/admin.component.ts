import { Component, HostListener } from '@angular/core';
import { CarserviceService } from '../carservice.service';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';


@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css'],
})
export class AdminComponent {
  private indexToDelete: any
  selectedDropoffDate: any;
  selectedOption = 'Daily';
  searchForm: FormGroup | any;
  showSelfPickupInput: boolean = false;
  selectedPickupDate: string = this.getCurrentDate();
  selectedStartTime: string = '';
  showStartTimeOptions: boolean = false;
  timeOptions: string[] = [];
  endTimeOptions: string[] = [];
  selectedEndTime: any;
  showEndTimeOptions: boolean = false;
  data: any = [];
  constructor(
    private user: CarserviceService,
    private fb: FormBuilder,
    private router: Router
  ) {
 
   
  }
  isBookNowClicked = false;

  baseUrl: any = 'https://carbackend.primerides.in';

  ngOnInit(): void {
    //this.getBookingData();    
    this.searchForm = this.fb.group({
      PickupDate: null,
      DropupDate: null,
      StartTime: null,
      EndTime: null,
      BookingDate: new FormControl(),
      BookingTime: new FormControl(),
      EndingDate: new FormControl(),
      EndingTime: new FormControl(),
      Brand: new FormControl(),
      Modal: new FormControl(),
      Seater: new FormControl(),
      Fuel: new FormControl(),
      Image: new FormControl(),
      Transmission: new FormControl(),
      FirstRangePrice: new FormControl(''),
      SecondRangePrice: new FormControl(''),
      ThirdRangePrice: new FormControl(''),
      MonthlyPrice: new FormControl(''),
      SecurityDeposit: new FormControl(''),
    });
    this.updateAvailableTimes();
    
    this.getEndTimeOptions();
    this.filterCars();
  //  this.DeleteBooking(this.indexToDelete);
   
  }

  getCurrentDate(): string {
    const today = new Date();
    return this.formatDate(today);
  }

  formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  updateAvailableTimes(): void {
    const selectedDate = new Date(this.selectedPickupDate);
    this.timeOptions = this.generateTimeOptions(selectedDate);
    this.selectedStartTime = this.timeOptions[0];
    this.selectedDropoffDate = this.getMinEndDate();
  }

  generateTimeOptions(
    selectedDate: Date,
    disableBeforeTime: Date | null = null
  ): string[] {
    const options: string[] = [];
    const currentDate = new Date();
    let startHour: number;
    let startMinute: number;
    startHour = currentDate.getHours();
    startMinute = Math.ceil(currentDate.getMinutes() / 30) * 30;
    const isToday = selectedDate.toDateString() === currentDate.toDateString();
    startHour = isToday ? currentDate.getHours() : 0;
    startMinute = isToday ? Math.ceil(currentDate.getMinutes() / 30) * 30 : 0;
    for (let hour = startHour; hour < 24; hour++) {
      for (let minute = startMinute; minute < 60; minute += 30) {
        const currentTime = new Date(selectedDate);
        currentTime.setHours(hour, minute);
        if (
          disableBeforeTime &&
          currentTime.getTime() <= disableBeforeTime.getTime()
        ) {
          continue;
        }
        const formattedHour = hour.toString().padStart(2, '0');
        const formattedMinute = minute.toString().padStart(2, '0');
        options.push(`${formattedHour}:${formattedMinute}`);
      }
      startMinute = 0;
    }
    return options;
  }

  getMinEndDate(): string {
    if (this.selectedPickupDate && this.selectedStartTime) {
      const startDate = new Date(
        `${this.selectedPickupDate}T${this.selectedStartTime}`
      );
      const endDate = new Date(startDate);
      endDate.setHours(endDate.getHours() + 12);
      if (endDate.getDate() !== startDate.getDate()) {
        endDate.setDate(startDate.getDate() + 1);
      }
      this.selectedEndTime = this.formatTime(endDate);
      return this.formatDate(endDate);
    } else {
      return this.getCurrentDate();
    }
  }

  formatTime(date: Date): string {
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  }

  selectStartTime(time: string): void {
    this.selectedStartTime = time;
    this.showStartTimeOptions = false;
    this.selectedDropoffDate = this.getMinEndDate();
    this.showStartTimeOptionsModal = false;
  }

  selectEndTime(time: string): void {
    this.selectedEndTime = time;
    this.searchForm.get('EndTime').setValue(this.selectedEndTime);
    this.showEndTimeOptions = false;
    this.showEndTimeOptionsModal = false;
  }

  onTimePickerClick(event: Event) {
    
    event.stopPropagation();
  }
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event) {
  // Close the time pickers if the click is outside both of them
  const clickedElement = event.target as HTMLElement;
  
  // Check if the click is outside both time pickers
  const startTimePickerElement = document.querySelector('.time-picker input');
  if (startTimePickerElement && !startTimePickerElement.contains(clickedElement)) {
    this.showStartTimeOptions = false;
    this.showStartTimeOptionsModal = false;
  }
  
  const endTimePickerElement = document.querySelector('.time-picker input');
  if (endTimePickerElement && !endTimePickerElement.contains(clickedElement)) {
    this.showEndTimeOptions = false;
     this.showEndTimeOptionsModal = false;
  }
  }
  
  
  getEndTimeOptions(): void {
    const selectedStartDate = new Date(this.selectedPickupDate);
    const selectedEndDate = new Date(this.selectedDropoffDate);
    const isSameDate =
      selectedEndDate.toDateString() === selectedStartDate.toDateString();
    if (isSameDate) {
      const startHour = parseInt(this.selectedStartTime.split(':')[0]);
      const startMinute = parseInt(this.selectedStartTime.split(':')[1]);
      const endHour = parseInt(this.selectedEndTime.split(':')[0]);
      const endMinute = parseInt(this.selectedEndTime.split(':')[1]);
      if (
        endHour - startHour < 12 ||
        (endHour - startHour === 12 && endMinute > startMinute)
      ) {
        const formattedEndDate = this.formatDate(selectedEndDate);
        const selectedEndTime = new Date(
          `${formattedEndDate}T${this.selectedEndTime}`
        );
        const minAllowedEndTime = new Date(selectedEndTime);
        minAllowedEndTime.setHours(minAllowedEndTime.getHours() + 12);
        this.endTimeOptions = this.generateTimeOptions(
          selectedEndDate,
          minAllowedEndTime
        );
      } else {
        const nextDay = new Date(selectedEndDate);
        nextDay.setDate(nextDay.getDate() + 1);
        this.endTimeOptions = this.generateTimeOptions(nextDay);
      }
    } else {
      this.endTimeOptions = this.generateTimeOptions(selectedEndDate);
    }
  }

  searchText: any;
  displayStyle = 'none';
  selectedCar: any;

  bookCar(index: number) {
    console.log('Clicked Index:', index);
    this.selectedCar = { index, data: this.data[index] };
    this.displayStyle = 'block';

  }
  book() {
    this.displayStyle = 'block';
  }

  closeStartTime() {
    this.displayStyle = 'none';
    this.onSubmit(this.selectedCar);
    this.selectedCar = {};
  }

  closeStartTimee() {
    this.displayStyle = 'none';
  }
  onSubmit(selectedCar: any) {
    console.log(this.searchForm.value);
    if (selectedCar && selectedCar.data) {
      const carData = selectedCar.data;
      this.searchForm.get('BookingDate')?.setValue(this.selectedPickupDate);
      this.searchForm.get('BookingTime')?.setValue(this.selectedStartTime);
      this.searchForm.get('EndingDate')?.setValue(this.selectedDropoffDate);
      this.searchForm.get('EndingTime')?.setValue(this.selectedEndTime);
      this.searchForm.get('Modal')?.setValue(carData.Modal);
      this.searchForm.get('Seater')?.setValue(carData.Seater);
      this.searchForm.get('Fuel')?.setValue(carData.Fuel);
      this.searchForm.get('Brand')?.setValue(carData.Brand);
      this.searchForm.get('Transmission')?.setValue(carData.Transmission);
      this.searchForm.get('Image')?.setValue(carData.Image);
      const formData = this.searchForm.value;
      const bookingData = {
        ...formData,
        Fuel: carData.Fuel,
      };
      this.user.saveBooking(bookingData).subscribe((data: any) => {
        console.log(data);
      });
    } else {
      console.error('Invalid selected car:', selectedCar);
    }
  }
  totalDays: any;
  totalHours: any;
  totalMinutes: any;
  totalTime: any;

  selectedStateValue: string = 'Delhi-Ncr';


  showRentOutButton: boolean = false;
  showBookNowTemporarily: boolean = false;

  originalData: any = [];
  filterCars() {
    const seater = this.searchForm.get('selectedSeater')?.value;
    const fuel = this.searchForm.get('selectedFuel')?.value;
    const transmission = this.searchForm.get('selectedTransmission')?.value;
  
    this.user.Matchenddate(this.selectedDropoffDate).subscribe((response: any) => {
      this.data = response;
      console.log('hii', this.data);
      this.data = this.data.map((car: any) => ({
        ...car,
        Image: `${this.baseUrl}${car.Image}`,
      }));
      
      // Sort the data array
      this.data.sort((a: { Modal: string; }, b: { Modal: any; }) => a.Modal.localeCompare(b.Modal));
  
      // Assign the sorted data to originalData
      this.originalData = [...this.data];
  
      this.data.forEach((car: any) => {
        const selectedStartDate = new Date(this.selectedPickupDate);
        const selectedEndDate = new Date(this.selectedDropoffDate);
  
        if (this.isSoldOut(car, selectedStartDate, selectedEndDate)) {
          console.log('Sold Out - Overlapping booking dates found for:', car);
          car.status = 'Sold Out';
          car.showRentOutButton = true;
          car.showBookNowTemporarily = false;
        } else {
          console.log('Book Now - No overlapping booking dates found.');
          car.showRentOutButton = false;
          car.showBookNowTemporarily = true;
          if (this.selectedOption === 'Monthly') {
            this.router.navigate(['/monthlycar'], {
              queryParams: {
                seater: seater,
                fuel: fuel,
                transmission: transmission,
                location: this.selectedStateValue,
                pickupDate: this.selectedPickupDate,
                dropoffDate: this.selectedDropoffDate,
                data: JSON.stringify(this.data),
                StartTime: this.selectedStartTime,
                EndTime: this.selectedEndTime,
                days: this.totalDays,
                hours: this.totalHours,
                minutes: this.totalMinutes,
                totalTime: this.totalTime,
              },
            });
          }
        }
      });
    });
  }

  // For non-modal dropdowns
  showEndTimeOptionsModal: boolean = false;

// For modal dropdowns
showStartTimeOptionsModal: boolean = false;


 isSoldOut(car: any, selectedStartDate: Date, selectedEndDate: Date): boolean {
    const carStartDate = new Date(car.BookingDate);
    const carStartTime = new Date(`1970-01-01T${car.BookingTime}Z`);
    const carStartDateTime = new Date(
      carStartDate.getFullYear(),
      carStartDate.getMonth(),
      carStartDate.getDate(),
      carStartTime.getHours(),
      carStartTime.getMinutes(),
      carStartTime.getSeconds()
    );
    const carEndDate = new Date(car.EndingDate);
    const carEndTime = new Date(`1970-01-01T${car.EndingTime}Z`);
    const carEndDateTime = new Date(
      carEndDate.getFullYear(),
      carEndDate.getMonth(),
      carEndDate.getDate(),
      carEndTime.getHours(),
      carEndTime.getMinutes(),
      carEndTime.getSeconds()
    );
    const overlap =
      (carStartDateTime <= selectedEndDate &&
        carEndDateTime >= selectedStartDate) ||
      (selectedStartDate <= carEndDateTime &&
        selectedEndDate >= carStartDateTime);
    return overlap;
  }

  searchCars() {
    if (this.searchText.trim() === '') {
      // If search text is empty, restore the original data
      this.data = [...this.originalData];
    } else {
      const searchTextLower = this.searchText.toLowerCase();
      this.data = this.originalData.filter((car: any) =>
        car.Modal.toLowerCase().startsWith(searchTextLower)
      );
    }
  }







  Editdisplay='none';
  closeEdit() {
    this.Editdisplay = 'none';
  }



  EditCar(index: number) {
    console.log('Clicked Index:', index);
    this.selectedCar = { index, data: this.data[index] };
  
  
    const selectedCarData = this.data[index];
  
   
    this.searchForm.patchValue({
      Brand: selectedCarData.Brand,
      Modal: selectedCarData.Modal,
      Seater: selectedCarData.Seater,
      Fuel: selectedCarData.Fuel,
      Transmission: selectedCarData.Transmission,
      FirstRangePrice: selectedCarData.FirstRangePrice,
      SecondRangePrice: selectedCarData.SecondRangePrice,
      ThirdRangePrice: selectedCarData.ThirdRangePrice,
      MonthlyPrice: selectedCarData.MonthlyPrice,
      SecurityDeposit: selectedCarData.SecurityDeposit,
    
    });
  
    
    const selectedCarId = selectedCarData.CarID;
  

    console.log('Selected Car ID:', selectedCarId);
  
    this.Editdisplay = 'block';
  }
  
  
  saveedit() {
    const selectedCarId = this.selectedCar?.data?.CarID;
    console.log('Selected Car ID:', selectedCarId);
  
    if (selectedCarId) {
      console.log('Form Data Before Update:', this.searchForm.value);
  
      const updatedData = { CarID: selectedCarId, ...this.searchForm.value };
  
      this.user.updateCar(selectedCarId, updatedData).subscribe(
        (response: any) => {
          console.log('Update Response:', response);
          alert('Car data updated successfully!');
          this.Editdisplay = 'none';
  
          this.ngOnInit()
          
        },
        (error: any) => {
          console.error('Error updating car data:', error);
  
         
          alert('Error updating car data. Please try again.');
        }
      );
    } else {
      console.error('Selected Car ID is undefined');
    }
  }
  

  deleteCar(carID: any) {
    const confirmDelete = window.confirm('Are you sure you want to delete this car?');
  
    if (confirmDelete) {
      this.user.deleteCar(carID).subscribe(
        (response: any) => {
          alert('Delete successfully');
          console.log('Car deleted successfully:', response);
          this.ngOnInit(); // It's better to handle this in a more structured way if possible
        },
        (error: any) => {
          console.error('Error deleting car:', error);
        }
      );
    } else {
      // User clicked "Cancel"
      console.log('Deletion canceled.');
    }
  }
  





bookings: any = [];
getBookingData() {   
  this.user.getBooking().subscribe(
    (data: any) => {
      this.bookings = data;
    },
    error => {
      console.error(error);
    }
  );

}

Bookingdisplay ='none';
DeleteBooking(index:any){

  this.selectedCar = { index, data: this.data[index] };
  const selectedCarData = this.data[index];
  const CarModal = selectedCarData.Modal;
  const fuel = selectedCarData.Fuel;
  const transmission = selectedCarData.Transmission;
  console.log('this is the modal you want to delete',CarModal);

this.user.getBookingwithFilter(CarModal, fuel, transmission).subscribe(
  
  (data: any) => {
    this.bookings = data;
    console.log('khkghr;hjh;',this.bookings);
  },

  error => {
    console.error(error);
  }
);


  
this.Bookingdisplay = 'block';

}


closeBooking(){
  this.Bookingdisplay = 'none';
}



deleteBookingTable() {
  console.log('Deleting a booking');

  if (this.bookings.length > 0) {
    const confirmDelete = window.confirm('Are you sure you want to delete this booking?');

    if (confirmDelete) {
      const bookingID = this.bookings[0].BookingID;

      this.user.deleteBooking(bookingID).subscribe(
        (data: any) => {
          this.Bookingdisplay = 'none';
          console.log('Booking deleted successfully:', data);
          alert('Booking Cancel');
          this.ngOnInit();
          this.refreshBookingData();
        },
        (error) => {
          console.error('Error deleting booking:', error);
        }
      );
    } else {
      // User clicked "Cancel"
      console.log('Deletion canceled.');
    }
  } else {
    console.error('No bookings available for deletion');
  }
}



refreshBookingData() {
  this.user.getBooking().subscribe(
    (data: any) => {
      alert('delete data successfully')
      this.ngOnInit()
    },
    (error) => {
      console.error('Error fetching bookings:', error);
    }
  );
}




}
