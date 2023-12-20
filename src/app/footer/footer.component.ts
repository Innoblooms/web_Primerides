import { Component } from '@angular/core';
import emailjs, { EmailJSResponseStatus } from '@emailjs/browser';
import {
  FormControl,
  FormBuilder,
  Validators,
  FormGroup,
} from '@angular/forms';
@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent {
  constructor( private fb: FormBuilder) { }

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
