import { Component, AfterViewInit, Renderer2, ElementRef, HostListener } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CarserviceService } from '../carservice.service';


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
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css'],
})
export class ProductsComponent implements AfterViewInit {


  showMobileFilters: boolean = false;
  endDateTimeSelected: any;

  toggleMobileFilters() {
    this.showMobileFilters = !this.showMobileFilters;
    
  }



  carFilter: string = '';
  selectedSegment: string = '';
  selectedBrand: string = '';
  selectedFuelType: string = '';
  selectedTransmissionType: string = '';
  selectedEndTime: any = [];

  // Create a property to store the selected sorting option


  // Initialize your cars array
  cars: any[] = [];


  selectedStateValue: string = '';
  selectedPickupDate: any;
  selectedDropoffDate: any;

  brands: string[] = ['HONDA', 'HYUNDAI', 'KIA', 'MAHINDRA', 'MARUTI SUZUKI', 'NISSAN', 'TATA', 'TOYOTA'];
  segments: string[] = ['Hatchback', 'Sedan', 'SUV', 'Luxury'];
  fuels: string[] = ['Diesel', 'Petrol', 'CNG'];
  transmissions: string[] = ['Automatic', 'Manual'];
  seatings: string[] = ['4 SEATER', '5 SEATER', '6 SEATER', '7 SEATER'];
  totalDays: any;
  totalHours: any;
  totalMinutes: any;
  totalTime: any;
  data: any;

  constructor(
    private carService: CarserviceService,
    private route: ActivatedRoute,
    private router: Router,
    private renderer: Renderer2,
    private el: ElementRef
  ) {
    this.route.queryParams.subscribe((params) => {
      this.selectedStateValue = params['location'];
      this.selectedPickupDate = params['pickupDate'] || 'Default Pickup Date';
      this.selectedDropoffDate = params['dropoffDate'] || 'Default Drop Date';
      this.selectedStartTime = params['StartTime'] || 'Default Start Time ';
      this.selectedEndTime = params['EndTime']
      this.totalTime = params['totalTime'];
      this.totalDays = params['days'];
      this.totalHours = params['hours'];
      this.totalMinutes = params['minutes'];

     // console.log(this.totalDays + '    ' + this.totalHours + '    ' + this.totalMinutes + '    ' + this.totalTime)
      this.data = JSON.parse(params['data']);
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
      }
        })


    });   
   

  }


  
 showRentOutButton: boolean = false;
 showBookNowTemporarily: boolean = false;
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




  selectedSeatingCapacities: { [key: string]: boolean } = {};

  selectedTransmissionTypes: { [key: string]: boolean } = {};
  selectedFuelTypes: { [key: string]: boolean } = {};
  selectedSegments: { [key: string]: boolean } = {};
  selectedBrands: { [key: string]: boolean } = {};
  originalData: any[] = [];

  
  //Define your filter function
  filterCars() {
    this.data = this.originalData
      .filter((car: any) => {
        const filterCondition =
          car.Modal.toLowerCase().includes(this.carFilter.toLowerCase()) &&
          (this.selectedSegments[car.Segment] ||
            Object.values(this.selectedSegments).every((value) => !value)) &&
          (this.selectedBrands[car.Brand] ||
            Object.values(this.selectedBrands).every((value) => !value)) &&
          (this.selectedFuelTypes[car.Fuel] ||
            Object.values(this.selectedFuelTypes).every((value) => !value)) &&
          (this.selectedTransmissionTypes[car.Transmission] ||
            Object.values(this.selectedTransmissionTypes).every(
              (value) => !value
            )) &&
          (this.selectedSeatingCapacities[car.Seater] ||
            Object.values(this.selectedSeatingCapacities).every(
              (value) => !value
            ));

           

        return filterCondition;
      })      
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
      }
        });

       
        console.log('this is filter data after filtering ', this.data )
      this.showMobileFilters = false;

     // Sort the data array based on the 'Modal' property in ascending order
     this.data.sort((a: { Modal: string; }, b: { Modal: any; }) => a.Modal.localeCompare(b.Modal));
 
  }


 

  isModifyButtonEnabled: boolean = false;
  canModify: boolean = false;
  modify: boolean = true;

  modifySearch() {
    if (this.canModify && this.isModifyButtonEnabled) {
      this.calculateTotalTime();
      this.price(300);
      this.modify = false;
      this.canModify = false;
      this.isModifyButtonEnabled = false; 
      // Disable the button again after modifying
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
      }
        })
    }
  }
  
  updateModify() {
    this.canModify =
      !!this.selectedPickupDate &&
      !!this.selectedStartTime &&
      !!this.selectedDropoffDate &&
      !!this.selectedEndTime;
  
    // Update the state of the "Modify" button
    this.isModifyButtonEnabled = this.canModify;
  }  
  
  

  clearFilters() {
    this.carFilter = '';
    this.selectedSegment = '';
    this.selectedBrand = '';
    this.selectedFuelType = '';
    this.selectedTransmissionType = '';

    // Clear all selected properties using a loop
    const selectedProperties = [
      this.selectedSeatingCapacities,
      this.selectedTransmissionTypes,
      this.selectedFuelTypes,
      this.selectedSegments,
      this.selectedBrands,
    ];

    selectedProperties.forEach((property) => {
      for (const key in property) {
        if (property.hasOwnProperty(key)) {
          property[key] = false;
        }
      }
    });

    // Restore the original data
    this.data = [...this.originalData];
     // Sort the data array based on the 'Modal' property in ascending order
     this.data.sort((a: { Modal: string; }, b: { Modal: any; }) => a.Modal.localeCompare(b.Modal));
     this.showMobileFilters = false;
  }


  // baseUrl: any = 'http://localhost:3050';
  baseUrl: any = 'https://carbackend.primerides.in';
  products: any[] = [];
  showFirstCarList: boolean = true;


  
  submit() {
    this.route.queryParams.subscribe((params) => {
      const selectedSeater = params['seater'];
      const selectedFuel = params['fuel'];
      const selectedTransmission = params['transmission'];
  
      if (selectedSeater || selectedFuel || selectedTransmission) {
        this.carService
          .getFilteredCars(selectedSeater, selectedFuel, selectedTransmission)
          .subscribe((data: any) => {
            console.log('getFilteredCars API Response:', data);
  
            this.data = data.map((car: any) => { 
              const selectedStartDate = new Date(this.selectedPickupDate);
              const selectedEndDate = new Date(this.selectedDropoffDate);
  
              if (this.isSoldOut(car, selectedStartDate, selectedEndDate)) {
                console.log('Sold Out - Overlapping booking dates found for:', car);
                return {
                  ...car,
                  Image: `${this.baseUrl}${car.Image}`,
                  isSoldOut: true,
                  showRentOutButton: true,
                  showBookNowTemporarily: false,
                  Rate: this.calculateRate(car),
                };
              } else {
                console.log('Book Now - No overlapping booking dates found.');
                return {
                  ...car,
                  Image: `${this.baseUrl}${car.Image}`,
                  isSoldOut: false,
                  showRentOutButton: false,
                  showBookNowTemporarily: true,
                  Rate: this.calculateRate(car),
                  
                };
              }
            });
            this.data.sort((a: { Modal: string; }, b: { Modal: any; }) => a.Modal.localeCompare(b.Modal));
  
          
          });
      }
    });
      // Sort the data array based on the 'Modal' property in ascending order
  
      // Update originalData
      this.originalData = [...this.data];
  }


calculateRate(car:any){
  let rate = car.Rate;
  if (car.FirstRangeKms && car.FirstRangePrice) {
    rate = car.FirstRangePrice;
  } else if (car.SecondRangeKms && car.SecondRangePrice) {
    rate = car.SecondRangePrice;
  } else if (car.ThirdRangeKms && car.ThirdRangePrice) {
    rate = car.ThirdRangePrice;
  } else if (car.MonthlyKms && car.MonthlyPrice) {
    rate = car.MonthlyPrice;
  }
}


  ngOnInit() {
    this.submit();
    this.filterCars();
    this.modifySearch();
    this.onButtonClick();
    // Make sure to apply sorting after any potential updates to the data
    this.data.sort((a: { Modal: string; }, b: { Modal: any; }) => a.Modal.localeCompare(b.Modal));
    this.sortCarsAvailability();
   
    this.updateAvailableTimes();
   
    this.getEndTimeOptions();
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
      this.data.sort((a: { CarRate: number; }, b: { CarRate: number; }) => a.CarRate - b.CarRate);
    } else if (this.selectedSortingOption === 'Price: High to Low') {
      this.data.sort((a: { CarRate: number; }, b: { CarRate: number; }) => b.CarRate - a.CarRate);
    }
  }
  sortCarsHighToLow() {
    this.data.sort((a: { Rate: number; }, b: { Rate: number; }) => b.Rate - a.Rate);
    this.showMobileFilters = false;
  }

  sortCarsLowToHigh() {
    this.data.sort((a: { Rate: number; }, b: { Rate: number; }) => a.Rate - b.Rate);
    this.showMobileFilters = false;
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

    this.showMobileFilters = false;
  }


  showBookNowOnly: boolean = false;

  // Function to set the selected sorting option
  selectOption(option: string) {
    this.selectedSortingOption = option;
    this.sortCars();
    this.isDropdownOpen = false; // Close the dropdown card
  }
  selectedCar: any;

  bookNow(car: any) {
    this.carService.setSelectedCar(car);
    const queryParams = {
      location: this.selectedStateValue,
      pickupDate: this.selectedPickupDate,
      dropoffDate: this.selectedDropoffDate,
      StartTime: this.selectedStartTime,
      EndTime: this.selectedEndTime,
      totalTime: this.totalTime,
      days: this.totalDays,
      hours: this.totalHours,
      minutes: this.totalMinutes,
    };
    this.router.navigate(['/cardetails'], { queryParams });
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
    },

    '450': {
      '4 SEATER': {
        Manual: {
          JIMNY: 6000,
          THAR: 7200,
        },
        Automatic: {
          THAR: 7800,
        },
      },
      '5 SEATER': {
        Manual: {
          CITY: 4800,
          AMAZE: 3000,
          VERNA: 4800,
          CRETA: 4800,
          VENUE: 3600,
          I20: 3600,
          EXTER: 3600,
          XUV300: 3600,
          SELTOS: 4800,
          SONET: 3600,
          'GRAND VITARA': 6000,
          CIAZ: 4200,
          BREZZA: 3840,
          'S CROSS': 3600,
          'SWIFT DZIRE CNG': 3600,
          BALENO: 3360,
          FRONX: 3600,
          'SWIFT DZIRE': 3000,
          IGNIS: 2640,
          SWIFT: 2600,
          MAGNITE: 3600,
          GLANZA: 3000,
          HARRIER: 6000,
          NEXON: 4200,
          ALRTOZ: 3000,
          PUNCH: 3000,
          TIAGO: 2640,
          TIGOR: 3000,
          WAGONR: 2200,
        },
        Automatic: {
          BREZZA: 4200,
          CIAZ: 4800,
          YARIS: 4200,
        },
      },
      '6 SEATER': {
        Manual: {
          XL6: 4800,
        },
        Automatic:{
          'HECTOR PLUS':6600,
        },
      },
      '7 SEATER': {
        Manual: {
          SAFARI: 7800,
          FORTUNER: 14400,
          'INNOVA CRYSTA': 7800,
          'SCORPIO N': 7800,
          XUV7OO: 8400,
          KARENS: 4800,
          'ERTIGA CNG': 4800,
          SCORPIO: 6600,
          TUV300: 3600,
          ERTIGA: 4200,

        },
        Automatic: {
          SAFARI: 8400,
          'INNOVA HYCROSS': 9600,
          'INNOVA CRYSTA': 8400,

        },
      },
    },

    '600': {
      '4 SEATER': {
        Manual: {
          JIMNY: 7500,
          THAR: 9000,
        },
        Automatic: {
          THAR: 9800,
        },
      },
      '5 SEATER': {
        Manual: {
          CITY: 6000,
          AMAZE: 3800,
          VERNA: 6000,
          CRETA: 6000,
          VENUE: 4500,
          I20: 4500,
          EXTER: 4500,
          XUV300: 4500,
          SELTOS: 6000,
          SONET: 4500,
          'GRAND VITARA': 7500,
          CIAZ: 5250,
          BREZZA: 4800,
          'S CROSS': 4500,
          'SWIFT DZIRE CNG': 4500,
          BALENO: 4200,
          FRONX: 4500,
          'SWIFT DZIRE': 3800,
          IGNIS: 3300,
          SWIFT: 3500,
          MAGNITE: 4500,
          GLANZA: 3750,
          HARRIER: 7500,
          NEXON: 5250,
          ALRTOZ: 3800,
          PUNCH: 3800,
          TIAGO: 3800,
          TIGOR: 3750,
          WAGONR: 2700,
        },
        Automatic: {
          BREZZA: 5250,
          CIAZ: 5200,
          YARIS: 5250,

        },
      },
      '6 SEATER': {
        Manual: {
          XL6: 6000,
        },
        Automatic:{
          'HECTOR PLUS':8250,
        },
      },
      '7 SEATER': {
        Manual: {
          SAFARI: 9800,
          FORTUNER: 18000,
          'INNOVA CRYSTA': 9800,
          'SCORPIO N': 9800,
          XUV7OO: 10500,
          KARENS: 6000,
          'ERTIGA CNG': 6000,
          SCORPIO: 8250,
          TUV300: 4500,
          ERTIGA: 5250,

        },
        Automatic: {
          SAFARI: 10500,
          'INNOVA HYCROSS': 12000,
          'INNOVA CRYSTA': 10500,

        },
      },
    },

    '5000': {
      '4 SEATER': {
        Manual: {
          JIMNY: 80000,
          THAR: 110000,
        },
        Automatic: {
          THAR: 110000,
        },
      },
      '5 SEATER': {
        Manual: {
          CITY: 60000,
          AMAZE: 45000,
          VERNA: 70000,
          CRETA: 60000,
          VENUE: 50000,
          I20: 50000,
          EXTER: 45000,
          XUV300: 50000,
          SELTOS: 60000,
          SONET: 50000,
          'GRAND VITARA': 85000,
          CIAZ: 60000,
          BREZZA: 50000,
          'S CROSS': 50000,
          'SWIFT DZIRE CNG': 45000,
          BALENO: 45000,
          FRONX: 45000,
          'SWIFT DZIRE': 38000,
          IGNIS: 35000,
          SWIFT: 32000,
          MAGNITE: 48000,
          GLANZA: 45000,
          HARRIER: 70000,
          NEXON: 55000,
          ALRTOZ: 40000,
          PUNCH: 40000,
          TIAGO: 40000,
          TIGOR: 40000,
          WAGONR: 35000,

        },

        Automatic: {
          BREZZA: 55000,
          CIAZ: 65000,
          YARIS: 55000,

        },
      },
      '6 SEATER': {
        Manual: {
          XL6: 70000,
        },
        Automatic:{
          'HECTOR PLUS':120000,
        },
      },
      '7 SEATER': {
        Manual: {
          SAFARI: 100000,
          FORTUNER: 180000,
          'INNOVA CRYSTA': 110000,
          'SCORPIO N': 120000,
          XUV7OO: 125000,
          KARENS: 70000,
          'ERTIGA CNG': 70000,
          SCORPIO: 95000,
          TUV300: 60000,
          ERTIGA: 65000,


        },
        Automatic: {
          SAFARI: 125000,
          'INNOVA HYCROSS': 150000,
          'INNOVA CRYSTA': 120000,

        },
      },

    },

  }; 
  
  // price(km: number) {
  //   this.selectedPlan = km;
  
  //   for (let car of this.data) {
  //     let rate =  (this.ratesByKilometers[km]?.[car.Seater]?.[car.Transmission][car.Modal]) ;
  
  //     if (this.selectedPlan === 5000) {
  //       car.Rate = rate;
  //     } else {
  //       if (this.totalHours <= 8) {
  //         let price = rate / 24;
  //         car.Rate = this.totalDays === 0
  //           ? rate
  //           : Math.round(rate * this.totalDays + price * this.totalHours);
  //       } else {
  //         car.Rate = rate !== undefined ? (Math.round(rate) * (this.totalDays + 1)) : undefined;
  //       }
  //     }
  //   }
  // }



  price(km: number) {
    this.selectedPlan = km;

    for (let car of this.data) {
      let rate =
        this.ratesByKilometers[km]?.[car.Seater]?.[car.Transmission][car.Modal];

      if (this.selectedPlan === 5000) {
        car.Rate = rate;
      } else {
        if (this.totalHours <= 8) {
          let price = rate / 24;
          car.Rate =
            this.totalDays == 0
              ? rate
              : Math.round(rate * this.totalDays + price * this.totalHours);
        } else {
          let dayRate = Math.round(rate) * this.totalDays;
          car.Rate = rate !== undefined ? dayRate + Math.round(rate) : undefined;
        }
      }
    }
  }

  

  ngAfterViewInit() {
    // Trigger the click event for the button with a delay
    setTimeout(() => {
      this.price(300); // You can pass the desired value here
      this.markButtonAsClicked();
    }, 0);
  }
  isButtonClicked = false;
  markButtonAsClicked() {
    const buttonElement = this.el.nativeElement.querySelector('.btn-grey');

    // Add a CSS class to visually indicate the button has been clicked
    this.renderer.addClass(buttonElement, 'clicked');
  }


onTimePickerClick(event: Event) {
    
  event.stopPropagation();
}

  
@HostListener('document:click', ['$event'])
handleDocumentClick(event: Event) {
  const target = event.target as HTMLElement;
  const dropdownLabel = document.querySelector('.filter-icon');
  const dropdownContainer = document.querySelector('.card');
  const startTimePickerElement = document.querySelector('.time-picker input');
  const endTimePickerElement = document.querySelector('.time-picker input');

  // Close the time pickers if the click is outside both of them
  if (startTimePickerElement && !startTimePickerElement.contains(target)) {
    this.showStartTimeOptions = false;
  }

  if (endTimePickerElement && !endTimePickerElement.contains(target)) {
    this.showEndTimeOptions = false;
  }

  // Close the dropdown if the click is outside the dropdown label and container
  if (
    this.isDropdownOpen &&
    dropdownLabel &&
    dropdownContainer &&
    !dropdownLabel.contains(target) &&
    !dropdownContainer.contains(target)
  ) {
    this.isDropdownOpen = false;
  }
}



  timeOptions: string[] = [];
  endTimeOptions: string[] = [];

  selectedStartTime: string = '';  // To store the selected start time
  showStartTimeOptions: boolean = false;

  selectedTime: any;


  showEndTimeOptions: boolean = false;
 

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
    // this.selectedStartTime = this.timeOptions[0];
    // this.selectedDropoffDate = this.getMinEndDate();

    // this.calculateTotalTime(); // Calculate total time by default
  }
  generateTimeOptions(selectedDate: Date, disableBeforeTime: Date | null = null): string[] {
    const options: string[] = [];
    const currentDate = new Date();
    let startHour: number;
    let startMinute: number;

    // Check if the selected date is tomorrow
    const isTomorrow = selectedDate.getDate() > currentDate.getDate();

    // Set the start time accordingly
    if (isTomorrow) {
        startHour = 0;
        startMinute = 0;
    } else {
        // Set the start time to the current time plus 2 hours
        startHour = currentDate.getHours() + 2;
        startMinute = 30; // Start from the next half-hour

        // If the current time is after the first half-hour of the hour, move to the next hour
        if (currentDate.getMinutes() > 30) {
            startHour++;
            startMinute = 0;
        }
    }

    for (let hour = startHour; hour < 24; hour++) {
        for (let minute = startMinute; minute < 60; minute += 30) {
            const currentTime = new Date(selectedDate);
            currentTime.setHours(hour, minute);

            // Check if the current time is before the disableBeforeTime
            if (disableBeforeTime && currentTime.getTime() <= disableBeforeTime.getTime()) {
                continue;
            }

            const formattedHour = currentTime.getHours().toString().padStart(2, '0');
            const formattedMinute = currentTime.getMinutes().toString().padStart(2, '0');
            options.push(`${formattedHour}:${formattedMinute}`);
        }

        // Reset startMinute for the next hour
        startMinute = 0;
    }

    return options;
}

  getMinEndDate(): string {
    if (this.selectedPickupDate && this.selectedStartTime) {
      const startDate = new Date(`${this.selectedPickupDate}T${this.selectedStartTime}`);
      const endDate = new Date(startDate);
      endDate.setHours(endDate.getHours() + 12);

      // Check if the date has changed after adding 12 hours
      if (endDate.getDate() !== startDate.getDate()) {
        // If the date changed, set the end date to the next day at the same time
        endDate.setDate(startDate.getDate() + 1);
      }

      this.selectedEndTime = this.formatTime(endDate); // Set selected end time based on calculated end date
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
    this.updateModify();
  }


  selectEndTime(time: string): void {
    this.selectedEndTime = time;
    this.showEndTimeOptions = false;

    this.updateModify();
  }

  getEndTimeOptions(): void {
    // Check if selectedEndTime is set to avoid NaN issues
    if (!this.selectedEndTime) {
      this.endTimeOptions = this.generateTimeOptions(new Date());
      return;
    }
  
    const selectedStartDate = new Date(this.selectedPickupDate);
    const selectedEndDate = new Date(this.selectedDropoffDate);
  
    const isSameDate = selectedEndDate.toDateString() === selectedStartDate.toDateString();
  
    if (isSameDate) {
      const startHour = parseInt(this.selectedStartTime.split(':')[0]);
      const startMinute = parseInt(this.selectedStartTime.split(':')[1]);
      const endHour = parseInt(this.selectedEndTime.split(':')[0]);
      const endMinute = parseInt(this.selectedEndTime.split(':')[1]);
  
      if (endHour - startHour < 12 || (endHour - startHour === 12 && endMinute > startMinute)) {
        const formattedEndDate = this.formatDate(selectedEndDate);
        const selectedEndTime = new Date(`${formattedEndDate}T${this.selectedEndTime}`);
  
        // Calculate the minimum allowed end time (12 hours after start time)
        const minAllowedEndTime = new Date(selectedEndTime);
        minAllowedEndTime.setHours(minAllowedEndTime.getHours() + 12);
  
        // Generate end time options based on the minimum allowed end time
        this.endTimeOptions = this.generateTimeOptions(selectedEndDate, minAllowedEndTime);
      } else {
        // Show times starting from the beginning of the next day
        const nextDay = new Date(selectedEndDate);
        nextDay.setDate(nextDay.getDate() + 1);
        this.endTimeOptions = this.generateTimeOptions(nextDay);
      }
    } else {
      // For other cases, return all time options
      this.endTimeOptions = this.generateTimeOptions(selectedEndDate);
    }
  }
  
  // ... (rest of the code)
  
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
  
        if (this.totalMinutes > 0) {
          totalTimeString += `${totalTimeString ? ' ' : ''}${this.totalMinutes} minute${this.totalMinutes > 1 ? 's' : ''}`;
        }
  
        this.totalTime = totalTimeString;
       // console.log(this.totalDays + '    ' + this.totalHours + '    ' + this.totalMinutes + '    ' + this.totalTime)
      }
  
    
    }
  


  generateAllTimeOptions(): string[] {
    const options: string[] = [];

    // Generate time options with a 30-minute gap for the entire day
    for (let hour = 0; hour < 24; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const formattedHour = hour.toString().padStart(2, '0');
        const formattedMinute = minute.toString().padStart(2, '0');
        options.push(`${formattedHour}:${formattedMinute}`);
      }
    }

    return options;
  }

  isFutureDate(selectedDate: string): boolean {
    const selected = new Date(selectedDate);
    const today = new Date();
    return selected > today;
  }


  showFilters = false;

  // Other properties and methods...

  toggleFilters() {
    console.log('Toggling filters');
    this.showFilters = !this.showFilters;
  }
  



  
  isPopupVisible: boolean = false;

  openPopup(): void {
    this.isPopupVisible = true;
    //console.log('harsh kumar')
  }

  closePopup(): void {
    this.isPopupVisible = false;   
    
  }
  isPopupVisible1: boolean = false;

  openPopup1(): void {
    this.isPopupVisible1 = true;
  }

  closePopup1(): void {
    this.isPopupVisible1 = false;
  }


  onButtonClick() {
    setTimeout(() => {
      this.price(300);
    },1000);
  }
  


}
