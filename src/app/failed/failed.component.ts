// failed.component.ts

import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-failed',
  templateUrl: './failed.component.html',
  styleUrls: ['./failed.component.css']
})
export class FailedComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit() {
    // You can add additional logic if needed when the component initializes
  }

  goBack() {
    // Implement navigation logic to go back to the previous page or handle as needed
    this.router.navigate(['/products']);
  }

}
