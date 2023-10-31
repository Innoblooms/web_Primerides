import { Component } from '@angular/core';
import { Router } from '@angular/router';
@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent  {

  locations: string[] = ['Bangalore', 'Mumbai','delhi','Hyderabad', /* ... */];
  skills: string[] = ['Frontend Developer', 'Sales Executive','Backend Developer','Android Developer', /* ... */];

 
 
  
  searchTerm: string = '';
  searchLocation: string = '';
  selectedExperience: string = '';
  filteredJobs: any[] = [];
  experience: string[] = ['0-1 years', '1-2 years', '2-3 years','3-5 years','2-5 years','1-10 years',/* ... */];
  
  selectedSkills: string[] = [];
  selectedSalaries: string[] = [];
  selectedLocations: string[] = [];

  [key: string]: any;
  jobs = [
    {
      title: 'Frontend Developer',
      company: 'WebSolutions Pvt. Ltd.',
      location: 'Delhi, India',
      experience: '2-3 Years',
      salary: '8-12 LPA',
      type: 'Full-Time',
      postedOn: new Date(2023, 4, 15)
    },
    {
      title: 'Sales Executive',
      company: 'SalesMax Inc.',
      location: 'Mumbai, India',
      experience: '1-2 Years',
      salary: '6-8 LPA',
      type: 'Part-Time',
      postedOn: new Date(2023, 4, 16)
    },
    {
      title: 'Backend Developer',
      company: 'CodeCraft',
      location: 'Bangalore, India',
      experience: '3-5 Years',
      salary: '10-16 LPA',
      type: 'Full-Time',
      postedOn: new Date(2023, 4, 17)
    },
    {
      title: 'HR Manager',
      company: 'PeopleFirst Pvt. Ltd.',
      location: 'Delhi, India',
      experience: '5-8 Years',
      salary: '15-20 LPA',
      type: 'Full-Time',
      postedOn: new Date(2023, 4, 18)
    },
    {
      title: 'Sales Manager',
      company: 'SalesHub',
      location: 'Mumbai, India',
      experience: '4-6 Years',
      salary: '10-15 LPA',
      type: 'Full-Time',
      postedOn: new Date(2023, 4, 19)
    },
    {
      title: 'Frontend Developer',
      company: 'WebCrafters',
      location: 'Pune, India',
      experience: '3-4 Years',
      salary: '7-10 LPA',
      type: 'Full-Time',
      postedOn: new Date(2023, 3, 20)
    },
    {
      title: 'Data Scientist',
      company: 'DataMinds Tech',
      location: 'Hyderabad, India',
      experience: '4-6 Years',
      salary: '12-18 LPA',
      type: 'Remote',
      postedOn: new Date(2023, 3, 21)
    },
    {
      title: 'Android Developer',
      company: 'MobileMakers',
      location: 'Mumbai, India',
      experience: '2-5 Years',
      salary: '9-14 LPA',
      type: 'Full-Time',
      postedOn: new Date(2023, 3, 22)
    },
    {
      title: 'Marketing Specialist',
      company: 'MarketWiz Solutions',
      location: 'Kolkata, India',
      experience: '1-3 Years',
      salary: '6-8 LPA',
      type: 'Part-Time',
      postedOn: new Date(2023, 3, 23)
    },
    {
      title: 'Product Manager',
      company: 'ProdTech Innovations',
      location: 'Bangalore, India',
      experience: '5-7 Years',
      salary: '15-25 LPA',
      type: 'Full-Time',
      postedOn: new Date(2023, 3, 24)
    },
    {
      title: 'UX/UI Designer',
      company: 'DesignHouse Pvt. Ltd.',
      location: 'Chennai, India',
      experience: '3-6 Years',
      salary: '10-15 LPA',
      type: 'Remote',
      postedOn: new Date(2023, 3, 25)
    },
    {
      title: 'Content Writer',
      company: 'WriteCraft',
      location: 'Delhi, India',
      experience: '2-4 Years',
      salary: '5-9 LPA',
      type: 'Freelance',
      postedOn: new Date(2023, 3, 26)
    },
    {
      title: 'DevOps Engineer',
      company: 'CloudTech Pvt. Ltd.',
      location: 'Hyderabad, India',
      experience: '4-8 Years',
      salary: '12-20 LPA',
      type: 'Full-Time',
      postedOn: new Date(2023, 3, 27)
    },
    {
      title: 'Network Specialist',
      company: 'NetGuardians',
      location: 'Bangalore, India',
      experience: '5-10 Years',
      salary: '14-22 LPA',
      type: 'Full-Time',
      postedOn: new Date(2023, 3, 28)
    },
    {
      title: 'Customer Support Agent',
      company: 'HelpFirst Services',
      location: 'Mumbai, India',
      experience: '1-3 Years',
      salary: '3-5 LPA',
      type: 'Remote',
      postedOn: new Date(2023, 3, 29)
    }
    
  ]

  constructor(private router: Router) {
    this['filteredJobs'] = [...this.jobs];
}

// Filters the job list based on criteria
// Filters the job list based on criteria
// Filters the job list based on criteria
search() {
  this.filteredJobs = this.jobs.filter(job => {
      const termCondition = !this.searchTerm || job.title.toLowerCase().includes(this.searchTerm.toLowerCase()) || job.company.toLowerCase().includes(this.searchTerm.toLowerCase());
      const locationCondition = !this.searchLocation || job.location.toLowerCase().includes(this.searchLocation.toLowerCase());
      const experienceCondition = this.checkExperience(job.experience);
      const salaryCondition = this.checkSalary(job.salary);
      
      const skillCondition = !this.selectedSkills.length || this.selectedSkills.some((skill: string) => job.title.toLowerCase().includes(skill));
      
      const locationCheckboxCondition = !this.selectedLocations.length || this.selectedLocations.some((location: string) => job.location.toLowerCase().includes(location));

      return termCondition && locationCondition && experienceCondition && skillCondition && salaryCondition && locationCheckboxCondition;
  });
}

checkSalary(salary: string): boolean {
  // Parsing the salary range (e.g., '5-9 LPA')
  const salaryRange = salary.split('-').map(value => parseFloat(value.trim()));

  return salaryRange[0] >= this.salaryLeftValue && salaryRange[1] <= this.salaryRightValue;
}



checkExperience(experience: string): boolean {
  const experienceRange = experience.split('-').map(value => parseInt(value.trim()));

  return experienceRange[0] >= this.leftValue && experienceRange[1] <= this.rightValue;
}

navigateToSecondPage() {
    this.router.navigate(['/detale']);
}

handleCheckbox(type: string, value: string, event: any) {
    if (event.target.checked) {
        this[type].push(value);
    } else {
        const index = this[type].indexOf(value);
        if (index > -1) {
            this[type].splice(index, 1);
        }
    }
    this.search();  // Update the filtered jobs automatically
}

// Triggers the search function every time there's a change detected in the component.
ngDoCheck() {
    this.search();
}

minExperience: number = 0;
maxExperience: number = 50;
filterJobs() {
  this.filteredJobs = this.jobs.filter(job => {
      const experienceRange = job.experience.split('-').map(value => parseInt(value.trim()));
      
      return experienceRange[0] >= this['selectedRange'][0] && experienceRange[1] <= this['selectedRange'][1];
  });
}

minValue: number = 0;
maxValue: number = 50;
leftValue: number = 0;
rightValue: number = 50;
// ... other properties ...

salaryMinValue: number = 0;
salaryMaxValue: number = 50; // Let's assume 10,00,000 is the max salary for demonstration
salaryLeftValue: number = 0;
salaryRightValue: number = 50;

}
