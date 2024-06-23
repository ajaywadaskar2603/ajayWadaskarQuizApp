import { HttpClient } from '@angular/common/http';
import { Component ,OnInit ,viewChild,ElementRef, ViewChild} from '@angular/core';


@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrl: './welcome.component.css'
})
export class WelcomeComponent implements OnInit{

  @ViewChild('name') nameKey!:ElementRef;
  private jsonUrl = 'assets/assetsdob.json'; // Correct file path

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.getAllQuestions();
  }

  getAllQuestions(): void {
    this.http.get(this.jsonUrl).subscribe(
      data => {
        console.log('JSON data:', data);
      },
      error => {
        console.error('Error loading JSON:', error);
      }
    );
  }

  startQuiz(){
    localStorage.setItem("name",this.nameKey.nativeElement.value)
  }


}
