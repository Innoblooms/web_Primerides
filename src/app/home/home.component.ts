import { Component, HostListener } from '@angular/core';
import { CarserviceService } from '../carservice.service';
import emailjs, { EmailJSResponseStatus } from '@emailjs/browser';
import {
  FormControl,
  FormBuilder,
  Validators,
  FormGroup,
} from '@angular/forms';
import { Observable, map, startWith } from 'rxjs';
import { Router } from '@angular/router';



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
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent {
 
  searchForm: FormGroup|any;
  selectedDropoffDate: any;

  data:any ;
  showSelfPickupInput: boolean = false;
  selectedPickupDate: string = this.getCurrentDate();
  selectedStartTime: string = '';  // To store the selected start time
  showStartTimeOptions: boolean = false;
  timeOptions: string[] = [];  // Add your time options
  endTimeOptions: string[] = []; // Add this line to declare endTimeOptions
  selectedEndTime: any;
  showEndTimeOptions: boolean = false;
 
  totalDays: any;
  totalHours: any;
  totalMinutes: any;
  totalTime: any;

  constructor(
    private user: CarserviceService,
    private fb: FormBuilder,
    private router: Router
  ) {
    this.searchForm = this.fb.group({
      selectedSeater: new FormControl(''),
      selectedFuel: new FormControl(''),
      selectedTransmission: new FormControl(''),
      PickupDate: null,
      DropupDate: null,
      StartTime: null,
      EndTime: null,
      location: null,
      
      totalhours: null,
      totalMinutes: null,
  
    });
  
    
  }
  // baseUrl = 'http://localhost:3035';
  baseUrl: any = 'https://carbackend.primerides.in';

  onSubmit() {

    const seater = this.searchForm.get('selectedSeater')?.value;
    const fuel = this.searchForm.get('selectedFuel')?.value;
    const transmission = this.searchForm.get('selectedTransmission')?.value;
  
    // Assuming you have the 'user' service for Matchenddate
    this.user.Matchenddate(this.selectedDropoffDate).subscribe((response: any) => {
      if (response && response.status === 'Sold Out') {
        console.log('Dropoff date is not available.');
        // Handle the case when the dropoff date is not available, e.g., show a message to the user.
      } else if (response && response.length > 0) {
        this.data = response;
        this.data = this.data.map((car: any) => ({
          ...car,
          Image: `${this.baseUrl}${car.Image}`,
          isSoldOut: true,
          showRentOutButton: true,
          showBookNowTemporarily: false,
        
          
        }));
  
        console.log(this.data);  
        console.log('Dropoff date is available. Navigating to products page.');
  
        const queryParams = {
          seater,
          fuel,
          transmission,
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
        };
  
        const routePath = this.selectedOption === 'Monthly' ? '/monthlycar' : '/products';
  
        this.router.navigate([routePath], {
           
          queryParams,
        });
      } 
    }); 
  }


 
  

  ngOnInit(): void {
    this.updateAvailableTimes();
    
   
    this.getEndTimeOptions();
    // this.price(300);
  }

  onTimePickerClick(event: Event) {
    
    event.stopPropagation();
}
@HostListener('document:click', ['$event'])
onDocumentClick(event: Event) {
  // Close the time picker if the click is outside the time picker
  const clickedElement = event.target as HTMLElement;

  // Check if the click is outside the start time picker
  const startTimePickerElement = document.querySelector('.time-picker input[formControlName="StartTime"]');
  if (startTimePickerElement && !startTimePickerElement.contains(clickedElement)) {
      this.showStartTimeOptions = false;
  }

  // Check if the click is outside the end time picker
  const endTimePickerElement = document.querySelector('.time-picker input[formControlName="EndTime"]');
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
    this.calculateTotalTime();
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
        if (disableBeforeTime && !isNaN(disableBeforeTime.getTime()) && currentTime.getTime() <= disableBeforeTime.getTime()) {
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
  
      // Set end time to start time plus 12 hours
      endDate.setHours(endDate.getHours() + 12);
  
      // If the selected end date is the last day of the month and start time is 12:00 PM, adjust end time and date
      const lastDayOfMonth = new Date( startDate.getMonth() + 1, 0).getDate();
      if (
        startDate.getDate() === lastDayOfMonth &&
        this.selectedStartTime === '12:00'
      ) {
        endDate.setMonth(endDate.getMonth() + 1, 1);
        endDate.setHours(12, 0); // Set end time to 12:00 PM
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
    this.calculateTotalTime(); // Update total time when start time changes
    // this.price(300);
  }

  selectEndTime(time: string): void {
    this.selectedEndTime = time;
    this.searchForm.get('EndTime').setValue(this.selectedEndTime);
    this.showEndTimeOptions = false;
    this.calculateTotalTime(); // Update total time when end time changes
    // this.price(300);
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
        totalTimeString += `${totalTimeString ? ',' : ''}${this.totalHours} hour${this.totalHours > 1 ? 's' : ''}`;
      }

      if (this.totalMinutes > 0) {
        totalTimeString += `${totalTimeString ? ' ' : ''}${this.totalMinutes} minute${this.totalMinutes > 1 ? 's' : ''}`;
      }

      this.totalTime = totalTimeString;
      // console.log(this.totalDays + '    ' + this.totalHours + '    ' + this.totalMinutes + '    ' + this.totalTime)
    }

  
  }

 

  // Subscribe to form control changes
  subscribeToFormChanges() {
    this.searchForm.get('PickupDate')?.valueChanges.subscribe(() => {
      this.calculateTotalTime();
      // this.price(300);
    });

    this.searchForm.get('DropupDate')?.valueChanges.subscribe(() => {
      this.calculateTotalTime();
      // this.price(300);
    });
  }
  

 
  form: FormGroup = this.fb.group({
    from_name: '',
    to_name: 'admin',
    from_email: '',
    phoneno: '',
    message: '',
  });

  async send() {
    emailjs.init('URF2OhpeixMo_o8TU');
    let response = emailjs.send(
      "service_f97sl2s","template_wn0f15j",
      {
        from_name: this.form.value.from_name,
        to_name: this.form.value.to_name,
        from_email: this.form.value.from_email,
        phoneno: this.form.value.phoneno,
        message: this.form.value.message,
      }
    );
    alert('message has been sent ');
    this.form.reset();
  }

  show: boolean = true;
  selectedOption = 'Daily'; // Set the default selected option

  selectOption(option: string) {
    this.selectedOption = option;
  }

  showTextArea() {
    this.showTextAreaContainer = true;
  }

  hideTextArea() {
    this.showTextAreaContainer = false;
  }
  
  selectHomeDelivery() {
    this.showSelfPickupInput = false;
  }
  
  selectedStateValue: string = 'Delhi-NCR';
  selectedTab: string = '';
  showTextAreaContainer: boolean = false;

  
  selectTab(tab: string) {
    this.selectedTab = tab;
  
    if (tab === 'selfPickup') {
      this.selectedStateValue = 'Self Pickup(Delhi-NCR)';
      this.hideTextArea();
      this.showSelfPickupInput = true;
    } else if (tab === 'homeDelivery') {
      this.selectedStateValue = 'Home Delivery(Delhi-NCR)';
      this.showTextAreaContainer = true;
      this.showSelfPickupInput = false; // Assuming you want to hide the self-pickup input
    }
  }


  isPopupVisible: boolean = false;

  openPopup(): void {
    this.isPopupVisible = true;
  }

  closePopup(): void {
    this.isPopupVisible = false;
  }


 
}
