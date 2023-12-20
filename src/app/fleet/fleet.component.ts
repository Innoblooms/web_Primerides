import { Component, HostListener } from '@angular/core';
import { CarserviceService } from '../carservice.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';


interface RateDetails {
  [key: string]: number;
}

interface TransmissionType {
  [key: string]: RateDetails;
}

interface SeatType {
  [key: string]: TransmissionType;
}

interface RatesByKilometers {
  [key: string]: SeatType;
}


@Component({
  selector: 'app-fleet',
  templateUrl: './fleet.component.html',
  styleUrls: ['./fleet.component.css']
})
export class FleetComponent{
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
    });
    this.updateAvailableTimes();
    // this.sortCarsAvailability();
    this.filterCars();

  }
  isBookNowClicked = false;

  baseUrl: any = 'https://carbackend.primerides.in';

  ngOnInit(): void {
   
    this.sortCarsAvailability();
    this.price(300);
    this.getEndTimeOptions();
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
  }
  
  const endTimePickerElement = document.querySelector('.time-picker input');
  if (endTimePickerElement && !endTimePickerElement.contains(clickedElement)) {
    this.showEndTimeOptions = false;
  }
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
  }

  selectEndTime(time: string): void {
    this.selectedEndTime = time;
    this.searchForm.get('EndTime').setValue(this.selectedEndTime);
    this.showEndTimeOptions = false;
   
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
     this.calculateTotalTime();
    this.onSubmit(this.selectedCar);
    this.selectedCar = {};
  }

  closeStartTimee() {
    this.displayStyle = 'none';
  }
  onSubmit(selectedCar: any) {
   // console.log(this.searchForm.value);
    if (selectedCar && selectedCar.data) {
      const carData = selectedCar.data;
      this.user.setSelectedCar(carData);
      const queryParams = {     
        pickupDate: this.selectedPickupDate,
        dropoffDate: this.selectedDropoffDate,
        StartTime: this.selectedStartTime,
        EndTime: this.selectedEndTime,
        totalTime: this.totalTime,
        days: this.totalDays,
        hours: this.totalHours,
        minutes: this.totalMinutes,
      };
      this.price(300);
      this.router.navigate(['/cardetails'], { queryParams });

     
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

  endDateTimeSelected: any;
  calculateTotalTime(): void {
    if (this.selectedPickupDate && this.selectedStartTime && this.selectedEndTime) {
      const startDate = new Date(`${this.selectedPickupDate}T${this.selectedStartTime}`);
      const endDate = new Date(`${this.selectedDropoffDate}T${this.selectedEndTime}`);

      const timeDiff = endDate.getTime() - startDate.getTime();

      this.totalDays = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
      this.totalHours = Math.floor((timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      this.totalMinutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));

      // Construct the total time string conditionally
      let totalTimeString = '';

      if (this.totalDays > 0) {
        totalTimeString += `${this.totalDays} day${this.totalDays > 1 ? 's' : ''}`;
      }

      if (this.totalHours > 0) {
        totalTimeString += `${totalTimeString ? ', ' : ''}${this.totalHours} hour${this.totalHours > 1 ? 's' : ''}`;
      }

      // if (this.totalMinutes > 0) {
      //   totalTimeString += `${totalTimeString ? ' ' : ''}${this.totalMinutes} minute${this.totalMinutes > 1 ? 's' : ''}`;
      // }

      this.totalTime = totalTimeString;

      console.log("......................",this.totalTime);
    }
    this.endDateTimeSelected = !!this.selectedDropoffDate && !!this.selectedEndTime;

    this.price(300);
  }



  selectedPlan: number = 0;
  rate: number = 0;
  ratesByKilometers: RatesByKilometers = {
    '300': {
      '4 SEATER': {
        Manual: {
          JIMNY: 5000,
          THAR: 6000,
        },
        Automatic: {
          THAR: 6500,
        },
      },
      '5 SEATER': {
        Manual: {
          CITY: 4000,
          AMAZE: 2500,
          VERNA: 4000,
          CRETA: 4000,
          VENUE: 3000,
          I20: 3000,
          EXTER: 3000,
          SELTOS: 4000,
          SONET: 3000,
          XUV300: 3000,
          CIAZ: 3500,
          BREZZA: 3200,
          'GRAND VITARA': 5000,
          'S CROSS': 3000,
          'SWIFT DZIRE CNG': 3000,
          BALENO: 2800,
          FRONX: 3000,
          'SWIFT DZIRE': 2500,
          IGNIS: 2200,
          SWIFT: 2200,
          MAGNITE: 3000,
          HARRIER: 5000,
          NEXON: 3500,
          ALRTOZ: 2500,
          PUNCH: 2500,
          TIAGO: 2200,
          TIGOR: 2500,
          GLANZA: 2500,
          WAGONR: 1800,
        },

        Automatic: {
          YARIS: 3500,
          CIAZ: 4000,
          BREZZA: 3500,
        },
      },
      '6 SEATER': {
        Manual: {
          XL6: 4000,          
        },
        Automatic:{
          'HECTOR PLUS':5500,
        },
      },
      '7 SEATER': {
        Manual: {
          SAFARI: 6500,
          FORTUNER: 12000,
          'INNOVA CRYSTA': 6500,
          'SCORPIO N': 6500,
          XUV7OO: 7000,
          KARENS: 4000,
          'ERTIGA CNG': 4000,
          SCORPIO: 5500,
          TUV300: 3000,
          ERTIGA: 3500,

        },
        Automatic: {
          'INNOVA CRYSTA': 7000,
          'INNOVA HYCROSS': 8000,
          SAFARI: 7000,
        },
      },
    }  
  };
  price(km: number) {
    this.selectedPlan = km;
    for (let car of this.data) {
      let rate =
        this.ratesByKilometers[km]?.[car.Seater]?.[car.Transmission][car.Modal];
    
        if (this.totalHours <= 8) {
          let price = rate / 24;
          car.Rate = this.totalDays === 0
            ? rate
            : Math.round(rate * this.totalDays + price * this.totalHours);
        } else {
          car.Rate = rate !== undefined ? Math.round(rate) * (this.totalDays + 1) : undefined;
        }
       // console.log(car.Rate);
      }
    }
  


    selectedSortingOption: any;
    isDropdownOpen: boolean = false;
  // Function to toggle the dropdown card
  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  // Function to sort all the cars based on the selected option
  sortCars() {
    if (this.selectedSortingOption === 'Price: Low to High') {
      this.data.sort((a: { FirstRangePrice: number; }, b: { FirstRangePrice: number; }) => a.FirstRangePrice - b.FirstRangePrice);
    } else if (this.selectedSortingOption === 'Price: High to Low') {
      this.data.sort((a: { FirstRangePrice: number; }, b: { FirstRangePrice: number; }) => b.FirstRangePrice - a.FirstRangePrice);
    }
  }
  sortCarsHighToLow() {
    this.data.sort((a: { FirstRangePrice: number; }, b: { FirstRangePrice: number; }) => b.FirstRangePrice - a.FirstRangePrice);
   
  }

  sortCarsLowToHigh() {
    this.data.sort((a: { FirstRangePrice: number; }, b: { FirstRangePrice: number; }) => a.FirstRangePrice - b.FirstRangePrice);
   
  }

  sortCarsAvailability() {
    // Sort the data array based on availability (Sold Out first)
    this.data.sort((a: { status: string }, b: { status: string }) => {
      if (a.status === 'Sold Out' && b.status !== 'Sold Out') {
        return 1; // Move 'Sold Out' to the end
      } else if (a.status !== 'Sold Out' && b.status === 'Sold Out') {
        return -1; // Move 'Sold Out' to the beginning
      } else {
        return 0; // Keep the order unchanged for other cases
      }
    });

    
  }


  showBookNowOnly: boolean = false;

  // Function to set the selected sorting option
  selectOption(option: string) {
    this.selectedSortingOption = option;
    this.sortCars();
    this.isDropdownOpen = false; // Close the dropdown card
  }





}






