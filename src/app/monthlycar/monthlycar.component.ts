import { Component, AfterViewInit, Renderer2, ElementRef,HostListener } from '@angular/core';
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
  selector: 'app-monthlycar',
  templateUrl: './monthlycar.component.html',
  styleUrls: ['./monthlycar.component.css'],
})
export class MonthlycarComponent {
  carFilter: string = '';
  selectedSegment: string = '';
  selectedBrand: string = '';
  selectedFuelType: string = '';
  selectedTransmissionType: string = '';




  allowedModals = [
    'CRETA', 'VENUE', 'I20', 'KARENS', 'SONET', 'XUV7OO', 'THAR', 'SCORPIO',
    'XUV300', 'ERTIGA CNG', 'XL6', 'ERTIGA', 'BREZZA', 'BREZZA', 'SWIFT DZIRE CNG',
    'BALENO', 'SWIFT DZIRE', 'SWIFT', 'MAGNITE', 'NEXON', 'PUNCH', 'TIAGO',
    'INNOVA CRYSTA', 'INNOVA CRYSTA', 'HECTOR', 'HECTOR plus'
  ];

  // Create a property to store the selected sorting option
  selectedSortingOption: any;
  isDropdownOpen: boolean = false;
  // Initialize your cars array
  cars: any[] = [];

  selectedStateValue: string = '';
  selectedPickupDate: any;
  selectedDropoffDate: any;

  brands: string[] = [
    'HONDA',
    'HYUNDAI',
    'KIA',
    'MAHINDRA',
    'MARUTI SUZUKI',
    'NISSAN',
    'TATA',
    'TOYOTA',
  ];
  segments: string[] = ['Hatchback', 'Sedan', 'SUV', 'Luxury'];
  fuels: string[] = ['Diesel', 'Petrol', 'CNG', 'Electric'];
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
      this.selectedEndTime = params['EndTime'];
      this.totalTime = params['totalTime'];
      this.totalDays = params['days'];
      this.totalHours = params['hours'];
      this.totalMinutes = params['minutes'];

      console.log(
        this.totalDays +
          '    ' +
          this.totalHours +
          '    ' +
          this.totalMinutes +
          '    ' +
          this.totalTime
      );
      this.data = JSON.parse(params['data']);
    });
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

        console.log('Filter Condition:', filterCondition);
        console.log('Car Data:', car);

        return filterCondition;
      })
      .map((car: any) => {
        car.isSoldOut = this.isCarSoldOut(
          car,
          this.selectedPickupDate,
          this.selectedDropoffDate
        );
        return car;
      });

    this.data.sort((a: { Modal: string }, b: { Modal: any }) =>
      a.Modal.localeCompare(b.Modal)
    );
  }

  // Your existing isCarSoldOut function remains the same
  isCarSoldOut(car: any, pickupDate: string, dropoffDate: string): boolean {
    return false;
  }

  minDropoffDate: any;
  ModifySearch() {
    alert('hello');
  }

  isModifySearchButtonEnabled: boolean = false;

  // Create a method to check if the button should be enabled
  updateModifySearchButtonState() {
    this.isModifySearchButtonEnabled =
      !!this.selectedPickupDate &&
      !!this.selectedStartTime &&
      !!this.selectedDropoffDate &&
      !!this.selectedEndTime;
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
    this.data.sort((a: { Modal: string }, b: { Modal: any }) =>
      a.Modal.localeCompare(b.Modal)
    );
  }
  baseUrl: any = 'https://carbackend.primerides.in';
  // baseUrl: any = 'http://localhost:3050';
  products: any[] = [];
  showFirstCarList: boolean = true;

  // submit() {
  //   this.route.queryParams.subscribe((params) => {
  //     console.log('Query Parameters:', params);

  //     const selectedSeater = params['seater'];
  //     const selectedFuel = params['fuel'];
  //     const selectedTransmission = params['transmission'];
  //     if (selectedSeater || selectedFuel || selectedTransmission) {
  //       this.carService
  //         .getFilteredCars(selectedSeater, selectedFuel, selectedTransmission)
  //         .subscribe((data: any) => {
  //           console.log('getFilteredCars API Response:', data);
      
  //           this.data = data
  //             .filter((car: any) => {
  //               const allowedModels = [
  //                 'CRETA', 'VENUE', 'I20', 'KARENS', 'SONET', 'XUV7OO', 'THAR', 'SCORPIO',
  //                 'XUV300', 'ERTIGA CNG', 'XL6', 'ERTIGA', 'BREZZA', 'BREZZA', 'SWIFT DZIRE CNG',
  //                 'BALENO', 'SWIFT DZIRE', 'SWIFT', 'MAGNITE', 'NEXON', 'PUNCH', 'TIAGO',
  //                 'INNOVA CRYSTA', 'INNOVA CRYSTA', 'HECTOR', 'HECTOR plus'
  //               ];
      
  //               return allowedModels.includes(car.Modal);
  //             })
  //             .map((car: any) => ({
  //               ...car,
  //               Image: `${this.baseUrl}${car.Image}`,
  //               isSoldOut: car.status === 'Sold Out',
  //             }));
  //         });
      
  //       this.data.sort((a: { Modal: string }, b: { Modal: any }) =>
  //         a.Modal.localeCompare(b.Modal)
  //       );
  //     }
      
  //   });
  //   this.originalData = [...this.data];
  // }


  submit() {
    this.route.queryParams.subscribe((params) => {
      console.log('Query Parameters:', params);
  
      const selectedSeater = params['seater'];
      const selectedFuel = params['fuel'];
      const selectedTransmission = params['transmission'];
      
      if (selectedSeater || selectedFuel || selectedTransmission) {
        this.carService
          .getFilteredCars(selectedSeater, selectedFuel, selectedTransmission)
          .subscribe((data: any) => {
            console.log('getFilteredCars API Response:', data);
  
            const allowedModels = [
              'CRETA', 'VENUE', 'I20', 'KARENS', 'SONET', 'XUV7OO', 'THAR', 'SCORPIO',
              'XUV300', 'ERTIGA CNG', 'XL6', 'ERTIGA', 'BREZZA', 'BREZZA', 'SWIFT DZIRE CNG',
              'BALENO', 'SWIFT DZIRE', 'SWIFT', 'MAGNITE', 'NEXON', 'PUNCH', 'TIAGO',
              'INNOVA CRYSTA', 'INNOVA CRYSTA', 'HECTOR', 'HECTOR plus'
            ];
  
            this.data = data
              .filter((car: any) => allowedModels.includes(car.Modal))
              .map((car: any) => ({
                ...car,
                Image: `${this.baseUrl}${car.Image}`,
                isSoldOut: car.status === 'Sold Out',
              }));
  
            this.data.sort((a: { Modal: string }, b: { Modal: any }) =>
              a.Modal.localeCompare(b.Modal)
            );
          });
      }
    });
    this.originalData = [...this.data];
  }
  



  ngOnInit() {
    this.submit();

    // Make sure to apply sorting after any potential updates to the data
    this.data.sort((a: { Modal: string }, b: { Modal: any }) =>
      a.Modal.localeCompare(b.Modal)
    );
    this.sortCarsAvailability();

    this.updateEndTimeOptions();
  }

  // Function to toggle the dropdown card
  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  // Function to sort all the cars based on the selected option
  sortCars() {
    if (this.selectedSortingOption === 'Price: Low to High') {
      this.data.sort(
        (a: { CarRate: number }, b: { CarRate: number }) =>
          a.CarRate - b.CarRate
      );
    } else if (this.selectedSortingOption === 'Price: High to Low') {
      this.data.sort(
        (a: { CarRate: number }, b: { CarRate: number }) =>
          b.CarRate - a.CarRate
      );
    }
  }
  sortCarsHighToLow() {
    this.data.sort(
      (a: { Rate: number }, b: { Rate: number }) => b.Rate - a.Rate
    );
  }

  sortCarsLowToHigh() {
    this.data.sort(
      (a: { Rate: number }, b: { Rate: number }) => a.Rate - b.Rate
    );
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


  // Function to set the selected sorting option
  selectOption(option: string) {
    this.selectedSortingOption = option;
    this.sortCars();
    this.isDropdownOpen = false; // Close the dropdown card
  }
  selectedCar: any;




  add30DaysToDate() {
    const resultDate = new Date(this.selectedPickupDate);
    resultDate.setDate(resultDate.getDate() + 30);  
    // Format the date as "YYYY-MM-DD"
    const year = resultDate.getFullYear();
    const month = (resultDate.getMonth() + 1).toString().padStart(2, '0');
    const day = resultDate.getDate().toString().padStart(2, '0');
  
    this.selectedDropoffDate = `${year}-${month}-${day}`;
  
    console.log('Date after 30 days:', this.selectedDropoffDate);
  }
  


  bookNow(car: any) {
    this.carService.setSelectedCar(car);
    this.add30DaysToDate();
    const queryParams = {
      location: this.selectedStateValue,
      pickupDate: this.selectedPickupDate,
      dropoffDate: this.selectedDropoffDate,
      totalTimes: this.totalTime,
    };
    this.router.navigate(['/cardetails'], { queryParams });
  }

  ratesByKilometers: RatesByKilometers = {
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

    }
  };
  selectedPlan: number = 0;
  rate: number = 0;
  selectedEndTime: any = [];
  price(km: number) {
    this.selectedPlan = km;

    for (let car of this.data) {
      let rate =
        this.ratesByKilometers[km]?.[car.Seater]?.[car.Transmission][car.Modal];

      if (this.selectedPlan === 5000) {
        car.Rate = rate;
      }
    }
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.price(5000); // You can pass the desired value here
      this.markButtonAsClicked();
    }, 0);
  }
  isButtonClicked = false;
  markButtonAsClicked() {
    const buttonElement = this.el.nativeElement.querySelector('.btn-dark');

    // Add a CSS class to visually indicate the button has been clicked
    this.renderer.addClass(buttonElement, 'clicked');
  }

  timeOptions: string[] = [];
  endTimeOptions: string[] = [];

  selectedStartTime: string = ''; // To store the selected start time
  showStartTimeOptions: boolean = false;

  selectedTime: any;

  showEndTimeOptions: boolean = false;
  updateTotalTime() {
    const totalTime = this.calculateTotalTime(); // Replace with your calculation logic
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

    this.calculateTotalTime(); // Calculate total time by default
  }
  generateTimeOptions(selectedDate: Date): string[] {
    const options: string[] = [];
    const currentDate = new Date();

    // Determine the start time based on the selected date
    let startHour: number;
    let startMinute: number;

    if (selectedDate.toDateString() === currentDate.toDateString()) {
      // If the selected date is today, start from the current time
      startHour = currentDate.getHours();
      startMinute = Math.ceil(currentDate.getMinutes() / 30) * 30; // Round to the next 30-minute interval
    } else {
      // If the selected date is in the future, start from midnight
      startHour = 0;
      startMinute = 0;
    }

    // Generate time options with a 30-minute gap for future dates
    for (let hour = startHour; hour < 24; hour++) {
      for (let minute = startMinute; minute < 60; minute += 30) {
        const formattedHour = hour.toString().padStart(2, '0');
        const formattedMinute = minute.toString().padStart(2, '0');
        options.push(`${formattedHour}:${formattedMinute}`);
      }
      startMinute = 0; // Reset startMinute after the first iteration
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
    this.calculateTotalTime(); // Update total time when start time changes
  }

  selectEndTime(time: string): void {
    this.selectedEndTime = time;
    this.showEndTimeOptions = false;

    this.selectedTime = this.selectedEndTime;
    console.log('this.selectedEndTime', this.selectedEndTime);
    this.calculateTotalTime(); // Update total time when end time changes
  }

  calculateTotalTime(): void {
    if (
      this.selectedPickupDate &&
      this.selectedStartTime &&
      this.selectedEndTime
    ) {
      const startDate = new Date(
        `${this.selectedPickupDate}T${this.selectedStartTime}`
      );
      const endDate = new Date(
        `${this.selectedDropoffDate}T${this.selectedEndTime}`
      );

      const timeDiff = endDate.getTime() - startDate.getTime();

      this.totalDays = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
      this.totalHours = Math.floor(
        (timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      );
      this.totalMinutes = Math.floor(
        (timeDiff % (1000 * 60 * 60)) / (1000 * 60)
      );

      // Construct the total time string conditionally
      let totalTimeString = '';

      if (this.totalDays > 0) {
        totalTimeString += `${this.totalDays} day${
          this.totalDays > 1 ? 's' : ''
        }`;
      }

      if (this.totalHours > 0) {
        totalTimeString += `${totalTimeString ? ', ' : ''}${
          this.totalHours
        } hour${this.totalHours > 1 ? 's' : ''}`;
      }

      if (this.totalMinutes > 0) {
        totalTimeString += `${totalTimeString ? ' ' : ''}${
          this.totalMinutes
        } minute${this.totalMinutes > 1 ? 's' : ''}`;
      }

      this.totalTime = totalTimeString;
    }
  }

  getEndTimeOptions(): string[] {
    const allTimeOptions: string[] = this.generateAllTimeOptions(); // Generate all time options for any date

    // If the end date is tomorrow or a future date, return all time options
    if (this.isFutureDate(this.selectedDropoffDate)) {
      return allTimeOptions;
    }

    const selectedStartDate = new Date(this.selectedPickupDate);
    const selectedEndDate = new Date(this.selectedDropoffDate);

    // Check if the selected end date is the same as the selected start date
    const isSameDate =
      selectedEndDate.toDateString() === selectedStartDate.toDateString();

    // If the selected end date is the same as the selected start date, return all time options
    if (isSameDate) {
      return allTimeOptions;
    }

    const startHour = parseInt(this.selectedStartTime.split(':')[0]);
    const startMinute = parseInt(this.selectedStartTime.split(':')[1]);
    const endDate = new Date(selectedStartDate);
    endDate.setHours(startHour + 12);
    endDate.setMinutes(startMinute);

    // Filter out times before the calculated end time
    const formattedEndDate = this.formatDate(endDate);
    return allTimeOptions.filter((time) => {
      const endTime = new Date(`${formattedEndDate}T${time}`);
      return endTime > new Date();
    });
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

  updateEndTimeOptions(): void {
    this.endTimeOptions = this.getEndTimeOptions();
  }

  searchText: any;

  searchCars() {
    if (this.searchText.trim() === '') {
      this.data = this.originalData;
    } else {
      const searchTextLower = this.searchText.toLowerCase();
      this.data = this.originalData.filter(
        (car: any) => car.Modal.toLowerCase().startsWith(searchTextLower)
        // car.Fuel.toLowerCase().startsWith(searchTextLower) ||
        // car.Transmission.toLowerCase().startsWith(searchTextLower) ||
        // car.Seater.toString().startsWith(searchTextLower)
      );
    }
  }

  @HostListener('document:click', ['$event'])
  handleDocumentClick(event: Event) {
    const target = event.target as HTMLElement;
    const dropdownLabel = document.querySelector('.filter-icon');
    const dropdownContainer = document.querySelector('.card');
  
    if (
      this.isDropdownOpen &&
      dropdownLabel && // Check if dropdownLabel is not null
      dropdownContainer && // Check if dropdownContainer is not null
      !dropdownLabel.contains(target) &&
      !dropdownContainer.contains(target)
    ) {
      this.isDropdownOpen = false;
    }
  }
}
