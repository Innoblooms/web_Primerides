import { Component,HostListener } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CarserviceService } from '../carservice.service';
import { AuthService } from 'src/app/auth.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {
  [x: string]: any;
  loginError: boolean = false;
  isNotAtEndOfPage: boolean = false;
  isLoginForm: boolean = true;
  loginForm: FormGroup;
  signupForm: FormGroup;
  isSidebarOpen: boolean = false;
  isNavbarOpen: boolean = false;
  data: any = [];
  isAuthenticated: boolean = false;
  userName: string = '';

  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private car: CarserviceService,
    private authService: AuthService,
    private router: Router
  ) {

    this.loginForm = this.fb.group({
      Email: ['', ],
      Passwd: ['',],
    });

    this.signupForm = this.fb.group({
      UserName: ['', [Validators.required]],
      Phone: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(12)]],
      Email: ['', [Validators.required, Validators.email]],
      Passwd: ['', [Validators.required, Validators.minLength(6)]],
    });


    this.route.url.subscribe((url) => {
      this.isNotAtEndOfPage = url.length === 0 || url[url.length - 1].path !== 'end';
    });
    this.match1()
  }

  openSidebar(): void {
    this.isSidebarOpen = true;
  }

  closeSidebar(): void {
    this.isSidebarOpen = false;
  }
  // login(): void {
  //   if (this.loginForm.valid) {
  //     const Email = this.loginForm.value.Email;
  //     const Passwd = this.loginForm.value.Passwd;

  //     this.authService.login(Email, Passwd).subscribe(
  //       (loggedIn) => {
  //         if (loggedIn) {
  //           this.isAuthenticated = true;

  //           this.router.navigate(['/permission']);
  //           localStorage.setItem('username', this.userName);
  //           alert('Login successful!');
  //           this.loginForm.reset();
  //           this.closeSidebar();
  //         } else {
  //           this.loginError = true;
  //           alert('Login failed. Please check your credentials.');
  //         }
  //       },
  //       (error) => {
  //         this.loginError = true;
  //         if (error.status === 401) {
  //           alert('Invalid username or password. Please try again.');
  //         } else {
  //           alert('Error during login. Please try again.');
  //         }
  //       }
  //     );
  //   } else {
  //     if (this.loginForm.get('Email')!.hasError('required')) {
  //       alert('Email is required.');
  //     } else if (this.loginForm.get('Passwd')!.hasError('required')) {
  //       alert('Password is required.');
  //     } else {
  //       alert('Please fill out all required fields correctly.');
  //     }
  //   }
  // }

  // ngOnInit() {
  //   const storedUserName = localStorage.getItem('username');

  //   if (storedUserName) {
  //     this.isAuthenticated = true;
  //     this.userName = storedUserName;
  //   }
  // }







  login(): void {
    if (this.loginForm.valid) {
      const Email = this.loginForm.value.Email;
      const Passwd = this.loginForm.value.Passwd;
  
      this.authService.login(Email, Passwd).subscribe(
        (loggedIn) => {
          if (loggedIn) {
            this.isAuthenticated = true;
            this.router.navigate(['/permission'])
  
            // Set username in local storage
            localStorage.setItem('username', this.authService.getUserName());
  
            // Get and log the username
            // const storedUserName = localStorage.getItem('userName');
            // console.log('Stored Username:', storedUserName);
            this.ngOnInit()
           
  
            alert('Login successful!');
            this.loginForm.reset();
            this.closeSidebar();
            
          } else {
            this.loginError = true;
            alert('Login failed. Please check your credentials.');
          }
        },
        (error) => {
          this.loginError = true;
          if (error.status === 401) {
            alert('Invalid username or password. Please try again.');
          } else {
            alert('Error during login. Please try again.');
          }
        }
      );
    } else {
      if (this.loginForm.get('Email')!.hasError('required')) {
        alert('Email is required.');
      } else if (this.loginForm.get('Passwd')!.hasError('required')) {
        alert('Password is required.');
      } else {
        alert('Please fill out all required fields correctly.');
      }
    }
  }
  

  ngOnInit() {
    // Retrieve username from local storage
    const storedUserName = localStorage.getItem('username');
    // console.log('Stored Username:', storedUserName); // Corrected log statement
  
    if (storedUserName) {
      this.isAuthenticated = true;
      this.userName = storedUserName;
  
      // Log username to console
      console.log('Stored Username:', this.userName);
    }
  }
  

  match1() {
    this.car.match().subscribe((res) => {
      this.data = res;
      // console.log(this.data[0]);
    });
  }

  signup() {
    if (this.signupForm.valid) {
      const userData = { ...this.signupForm.value };
  
      // Check if email or phone already exists
      const emailExists = this.data.some((user: { Email: string }) => user.Email === userData.Email);
      const phoneExists = this.data.some((user: { Phone: string }) => user.Phone === userData.Phone);
  
      if (emailExists || phoneExists) {
        if (emailExists && phoneExists) {
          alert('Email and phone already exist. Please use different ones.');
        } else if (emailExists) {
          alert('Email already exists. Please use a different one.');
        } else if (phoneExists) {
          alert('Phone already exists. Please use a different one.');
        }
      } else {
        this.car.signup(userData).subscribe(
          (response) => {
            alert('Signup successful!');
            this.signupForm.reset();
            this.isLoginForm = true;
          },
          (error) => {
            console.error('Error during registration:', error);
            alert('Error during registration. Please try again.'); // Show a user-friendly error message
          }
        );
      }
    } else {
      // Handle specific form validation errors
      const emailControl = this.signupForm.get('Email');
      const phoneControl = this.signupForm.get('Phone');
      const passwdControl = this.signupForm.get('Passwd');
  
      if (emailControl && emailControl.hasError('email')) {
        alert('Please enter a valid email address.');
      } else if (phoneControl && (phoneControl.hasError('minlength') || phoneControl.hasError('maxlength'))) {
        alert('Phone number must be 10 digits.');
      } else if (passwdControl && passwdControl.hasError('minlength')) {
        alert('Password must be at least 6 characters long.');
      } else {
        alert('Please fill out all required fields correctly.');
      }
    }
  }
  
 
  logout() {
    this.authService.logout()
    localStorage.removeItem('username');
    this.isAuthenticated = false;
    this.router.navigate(['/'])
  }
  toggleForm() {
    this.isLoginForm = !this.isLoginForm;
    this.resetForms();
  }

  resetForms() {
    this.loginForm.reset();
    this.signupForm.reset();
  }
  openExternalSite(url: string, width: number, height: number) {
    const windowHeight = 600;
    const windowWidth = width;

    const windowFeatures = `width=${windowWidth},height=${windowHeight},left=${(window.screen.width - windowWidth) / 2},top=${(window.screen.height - windowHeight) / 2},resizable=yes,scrollbars=yes`;
    window.open(url, 'externalSite', windowFeatures);
  }


  activeLink: string = ''; // Variable to keep track of the active link

  setActiveLink(link: string) {
    this.activeLink = link;
  }


  navbarCollapsed = false;
  
  toggleNavbar(): void {
    this.isNavbarOpen = !this.isNavbarOpen;
  this.navbarCollapsed = !this.navbarCollapsed;


  }


  isAdmin(): boolean {
    return this.authService.isAdminUser();
  }
 

  @HostListener('document:click', ['$event'])
  handleDocumentClick(event: Event) {
    const target = event.target as HTMLElement;
    const isButtonClicked = target.closest('.custom-link');
    if (this.isSidebarOpen && !this.isElementInsideSidebar(target) && !isButtonClicked) {
      this.closeSidebar();
    }
  }
  
  
  isElementInsideSidebar(element: HTMLElement): boolean {
    const sidebar = document.getElementById('sidebar');
    return !!sidebar && sidebar.contains(element);
  }
    

}
