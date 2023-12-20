import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import emailjs, { EmailJSResponseStatus } from '@emailjs/browser';
@Component({
  selector: 'app-contactus',
  templateUrl: './contactus.component.html',
  styleUrls: ['./contactus.component.css'],
})
export class ContactusComponent {
 

  constructor(private fb: FormBuilder) {
   
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


  
}
