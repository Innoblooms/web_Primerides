import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
  AbstractControl,
  ValidationErrors,
} from '@angular/forms';
import { CarserviceService } from '../carservice.service';
import { ActivatedRoute } from '@angular/router';
import emailjs, { EmailJSResponseStatus } from '@emailjs/browser';
import { HttpClient } from '@angular/common/http';
@Component({
  selector: 'app-cardetails',
  templateUrl: './cardetails.component.html',
  styleUrls: ['./cardetails.component.css'],
})
export class CardetailsComponent implements OnInit {





  searchForm: FormGroup;
  selectedStateValue: string = '';
  selectedPickupDate: string = '';
  selectedDropoffDate: string = '';
  totalTime: any;
  days: any;
  hours: any;
  minutes: any;
  selectedStartTime: string = '';
  selectedEndTime: any;
  totalTimes: any;
  TotalAmt: any;
  defaultLocation: string = 'Delhi-NCR';
//Start The 
  @ViewChild('form') form!: ElementRef;
  accessCode: any = 'AVVU40KL90BE67UVEB';
  encRequestRes: any;
  order_no: string = 'qaz234567';
  testAmount: any;
  merchant_id = 2860259;
  currency: string = 'INR';
  redirect_url = 'https://primerides.in/handleresponse';
  cancel_url = 'https://primerides.in/handleresponse';

  //End Code Payment Gatway
  ngOnInit() {
    this.route.queryParams.subscribe((params) => {
      this.selectedStateValue = params['location'] || 'Delhi-NCR';
      this.selectedPickupDate = params['pickupDate'];
      this.selectedDropoffDate = params['dropoffDate'];
      this.selectedStartTime = params['StartTime'];
      this.selectedEndTime = params['EndTime'];
      this.totalTime = params['totalTime'] || '30 Days';
      this.days = params['days'];
      this.hours = params['hours'];
      this.minutes = params['minutes'];
    });

    this.selectedCar = this.carService.getSelectedCar();
    this.Totalfare();
  }

  selectedCar: any;

  constructor(
    private carService: CarserviceService,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private router: Router,
    private location: Location,
    private http: HttpClient,
    private el: ElementRef
  ) {
    this.searchForm = this.fb.group({
      CusName: new FormControl('', [Validators.required, this.charOnlyValidator]),
      Phone: new FormControl('', [Validators.required, Validators.maxLength(10), Validators.pattern(/^[0-9]+$/)]),
      Email: new FormControl('', [Validators.required, Validators.email]),
      DLNo: new FormControl('', [Validators.required, Validators.maxLength(30)]),
      Addhar: new FormControl('', [Validators.required, Validators.minLength(12), Validators.pattern(/^[0-9]+$/)]),
      Address: new FormControl('', [Validators.required]),
      Country: new FormControl(),
      State: new FormControl(),
      City: new FormControl(),
      Pincode: new FormControl(),
      RefNo: new FormControl(),
      BookingDate: new FormControl(),
      BookingTime: new FormControl(),
      EndingDate: new FormControl(),
      EndingTime: new FormControl(),
      Destination: new FormControl(),
      DeliveryLocation: new FormControl(),
      Brand: new FormControl(),
      Modal: new FormControl(),
      Seater: new FormControl(),
      Fuel: new FormControl(),
      Transmission: new FormControl(),
      Image: new FormControl(),
      AdharPdf: new FormControl(),
      DLNoPdf: new FormControl(),
      DeliveryFare: new FormControl(),
      DepositAmt: new FormControl(),
      BaseFare: new FormControl(),
      TotalAmt: new FormControl(),
      
    });
    this.testAmount = this.TotalAmt;
  }

  orderid: string = '';
  myorder() {
    const currentDate = new Date();
    const month = (currentDate.getMonth() + 1).toString().padStart(2, '0');
    const day = currentDate.getDate().toString().padStart(2, '0');
    const hour = currentDate.getHours().toString().padStart(2, '0');
    const minute = currentDate.getMinutes().toString().padStart(2, '0');
    const second = currentDate.getSeconds().toString().padStart(2, '0');
    const milisec = currentDate.getMilliseconds().toString().padStart(2, '0');
    return `Or/${month}/${day}/${hour}/${minute}/${second}/${milisec}`;
  }

async proceed(selectedCar: any) {
    this.orderid = this.myorder();
    console.log('Form Valid:', this.searchForm.valid);
    if (this.searchForm.valid) {
      this.searchForm.get('orderid')?.setValue(this.orderid);
      this.searchForm.get('BookingDate')?.setValue(this.selectedPickupDate);
      this.searchForm.get('BookingTime')?.setValue(this.selectedStartTime);
      this.searchForm.get('EndingDate')?.setValue(this.selectedDropoffDate);
      this.searchForm.get('EndingTime')?.setValue(this.selectedEndTime);
      this.searchForm.get('Brand')?.setValue(selectedCar.Brand);
      this.searchForm.get('Modal')?.setValue(selectedCar.Modal);
      this.searchForm.get('Seater')?.setValue(selectedCar.Seater);
      this.searchForm.get('Fuel')?.setValue(selectedCar.Fuel);
      this.searchForm.get('Transmission')?.setValue(selectedCar.Transmission);
      this.searchForm.get('BaseFare')?.setValue(selectedCar.Rate);
      this.searchForm.get('DeliveryFare')?.setValue(selectedCar.DeliveryFare);
      this.searchForm.get('TotalAmt')?.setValue(selectedCar.Total);
      this.testAmount = this.searchForm.get('TotalAmt')?.value;
      this.searchForm.get('DepositAmt')?.setValue(selectedCar.SecurityDeposit);
      this.searchForm.get('Image')?.setValue(selectedCar.Image);
      const formData = this.searchForm.value;
      const bookingData = {
        ...formData,
        selectedCar: this.selectedCar,
        selectedStateValue: this.selectedStateValue,
        selectedPickupDate: this.selectedPickupDate,
        selectedDropoffDate: this.selectedDropoffDate,
        selectedStartTime: this.selectedStartTime,
        selectedEndTime: this.selectedEndTime,
        Modal: selectedCar.Modal,
        Brand: selectedCar.Brand,
        Seater: selectedCar.Seater,
        Fuel: selectedCar.Fuel,
        Transmission: selectedCar.Transmission,
        BaseFare: selectedCar.Rate | selectedCar.FirstRangePrice,
        DeliveryFare: selectedCar.DeliveryFare,
        TotalAmt: selectedCar.Total,
        DepositAmt: selectedCar.SecurityDeposit,
        Image: selectedCar.Image,
        days: this.days,
        hours: this.hours,
        minutes: this.minutes,
        totalTime: this.totalTime,
      };
      this.carService.saveBooking(bookingData).subscribe(
        (saveResult) => {
          this.submitPaymentForm();      
        },
        (error) => {  
          console.error('Booking save failed:', error);
        }
      );
      await this.send();
    } else {
      alert("Kindly Fill All Required Customer's Details For Booking");
      this.searchForm.markAllAsTouched();
    }
  }
  submitPaymentForm() {
    const form: HTMLFormElement | null = this.el.nativeElement.querySelector('form[name="servePayment"]');
    if (form) {
      form.submit();
    } else {
      console.error('Form not found');
    }
  }
  async send() {
    emailjs.init('URF2OhpeixMo_o8TU');
    try {
      const response: EmailJSResponseStatus = await emailjs.send(
        'service_f97sl2s',
        'template_8zg1vi6',
        {
          Modal: this.searchForm.value.Modal,
          Seater: this.searchForm.value.Seater,
          Fuel: this.searchForm.value.Fuel,
          Transmission: this.searchForm.value.Transmission,
          BookingDate: this.searchForm.value.BookingDate,
          BookingTime: this.searchForm.value.BookingTime,
          EndingDate: this.searchForm.value.EndingDate,
          EndingTime: this.searchForm.value.EndingTime,
          Destination: this.searchForm.value.Destination,
          CusName: this.searchForm.value.CusName,
          Phone: this.searchForm.value.Phone,
          DLNo: this.searchForm.value.DLNo,
          Addhar: this.searchForm.value.Addhar,
          RefNo: this.searchForm.value.RefNo,
        }
      );

      this.searchForm.reset();
    } catch (error) {
      console.error('Error sending email:', error);
    }
  }

  Totalfare() {
    if (!this.selectedCar) {
      return;
    }

    const rate = parseFloat(
      this.selectedCar.Rate || this.selectedCar.MonthlyPrice
    );

    // Convert deposit to a number
    const deposit = parseFloat(this.selectedCar.SecurityDeposit);

    // Ensure that rate and deposit are valid numbers
    if (typeof rate === 'number' && typeof deposit === 'number') {
      const totalAmount = rate + deposit;

      // Round the total amount to two decimal places
      this.selectedCar.Total = parseFloat(totalAmount.toFixed(2));
    }
  }

  get CusName() {
    return this.searchForm.get('CusName');
  }

  get Phone() {
    return this.searchForm.get('Phone');
  }

  get Email() {
    return this.searchForm.get('Email');
  }

  get DLNo() {
    return this.searchForm.get('DLNo');
  }

  get Addhar() {
    return this.searchForm.get('Addhar');
  }

  get Address() {
    return this.searchForm.get('Address');
  }

  charOnlyValidator(control: FormControl): { [key: string]: any } | null {
    const value = control.value;
    if (/^[a-zA-Z\s]+$/.test(value)) {
      return null; // Valid
    } else {
      return { invalidChar: true }; // Invalid
    }
  }


  

  displayStyle = 'none';
  terms() {
    this.displayStyle = 'block';
  }

  close() {
    this.displayStyle = 'none';
  }

  goBack(): void {
    this.location.back();
  }
}
