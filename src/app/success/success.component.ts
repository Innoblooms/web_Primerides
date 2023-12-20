
import { Component, OnInit } from "@angular/core";
import { trigger, state, style, animate, transition } from '@angular/animations';
import { Router } from '@angular/router';

@Component({
  selector: "app-success",
  templateUrl: "./success.component.html",
  styleUrls: ["./success.component.css"],
  animations: [
    trigger('fadeIn', [
      state('in', style({ opacity: 1, transform: 'translateY(0)' })),
      transition('void => *', [style({ opacity: 0, transform: 'translateY(-20px)' }), animate('1s ease-in-out')]),
    ]),
  ],
})
export class SuccessComponent implements OnInit {
  constructor(private router: Router) { }

  ngOnInit() {
    console.log("hi i am success");
  }
  goBack() {
    // Implement navigation logic to go back to the previous page or handle as needed
    this.router.navigate(['/']);
  }
}