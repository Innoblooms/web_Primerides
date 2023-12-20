import { Component } from '@angular/core';

interface FAQItem {
  id: number; // You can adjust the structure based on your FAQ item's properties
  question: string;
  answer: string;
}

@Component({
  selector: 'app-faq',
  templateUrl: './faq.component.html',
  styleUrls: ['./faq.component.css']
})
export class FaqComponent {
  showAnswer: boolean[] = [false];

  toggleAnswer(index: number) {
    this.showAnswer[index] = !this.showAnswer[index];
  }
  searchQuery: string = '';
  filteredFAQs: FAQItem[] = [];
  faqItems: FAQItem[] = [
    // Your FAQ items here
  ];

  constructor() {
    // Initialize the filteredFAQs array with all FAQs initially
    this.filteredFAQs = this.faqItems;
  }

  searchFAQ() {
    // Filter FAQ items based on the searchQuery
    this.filteredFAQs = this.faqItems.filter(item =>
      item.question.toLowerCase().includes(this.searchQuery.toLowerCase())
    );
  }
}
