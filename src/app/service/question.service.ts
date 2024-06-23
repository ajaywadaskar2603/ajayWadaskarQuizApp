import { Injectable, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

interface Option {
  text: string;
  correct?: boolean;
}

interface Question {
  questionText: string;
  options: Option[];
  explanation: string;
}

@Injectable({
  providedIn: 'root'
})
export class QuestionService {

  private baseUrl :string = 'http://localhost:3000/questions';

  constructor(private http:HttpClient) { }

  getQuestion():Observable<Question[]>{
    // return this.http.get<any>(`assets/dob.json`);
    return this.http.get<Question[]>(this.baseUrl)
  }
}
