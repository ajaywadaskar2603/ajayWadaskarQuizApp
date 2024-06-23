import { Component ,OnInit} from '@angular/core';
import { QuestionService } from '../service/question.service';
import { interval } from 'rxjs';

@Component({
  selector: 'app-question',
  templateUrl: './question.component.html',
  styleUrl: './question.component.css'
})
export class QuestionComponent implements OnInit{
  name :string ="" ;
  questionList:any[]=[];
  currentQuestion:number =0;
  points:number = 0;
  counter = 30;
  correctAnswer:number = 0;
  IncorrectAnswer:number = 0;
  interval$ :any;
  progress:string="0";
  isQuizCompleted:boolean=false;
  option: any;
  selectedSingleOption: string = '';
  selectedMultiOptions: { [key: string]: boolean } = {};
  selectedDropdownOption: string = '';
  selectedCheckBoxValues:string[]=[];

  constructor(private questionService:QuestionService){}
  
  ngOnInit(): void {
    this.name = localStorage.getItem("name")!;
    this.getAllQuestion();
    this.startCounter();
  }

  getAllQuestion(){
    this.questionService.getQuestion().subscribe(data=>{
      this.questionList = data;
      console.log('Questions:', data);
    },
  error=>{
    console.error('Error fetching questions:', error);

  });
  }

  nextQuestion(){
    this.currentQuestion++;
  }
  previousQuestion(){
    this.currentQuestion--;
  }

  submitAnswer(currentQno:number)
  {
    if(currentQno === this.questionList.length){
      this.isQuizCompleted = true;
      this.stopCounter();
    }
    debugger
    let question=this.questionList[currentQno-1];
    let correctSingleSelectAnswer= false;
    let correctDropdownAns = false;

    if(this.selectedDropdownOption != '')
      {
        for (var ans of question.options){
          if(ans.correct ==true && ans.text == this.selectedDropdownOption)
            {
              correctDropdownAns=true;
            }
        }
        this.processToNextAnswer(correctDropdownAns);
      }
    else if(this.selectedSingleOption != '')
    {
        for (var ans of question.options) {
          if(ans.correct == true && ans.text==this.selectedSingleOption)
          {
            correctSingleSelectAnswer=true;
          }
        }

        this.processToNextAnswer(correctSingleSelectAnswer);
    }
    else if(this.selectedCheckBoxValues.length>0)
    {
     
        let multiSelectOption=false;
        for (var optionVal of this.selectedCheckBoxValues) {
          
          question.options.forEach((val:any) => {
              if(val.correct && val.text== optionVal)
                multiSelectOption=true
              else
                multiSelectOption=false;
          });
        
        }

        this.processToNextAnswer(multiSelectOption);  

    }
  }

  multiSelectOptionClick(checkboxClickedOption:any)
  {
    this.selectedCheckBoxValues.push(checkboxClickedOption);
  }

  processToNextAnswer(answerStat:boolean)
  {
    if(answerStat)
      {
       this.points+= 10;
      this.correctAnswer++;
      setTimeout(()=>{
      this.currentQuestion++;
      this.resetCounter();
      this.getProgressPercent();
      },1000);
    }
    else{
      setTimeout(()=>{
        this.currentQuestion++;
      this.IncorrectAnswer++;
      this.resetCounter();
      this.getProgressPercent();
      },1000)
      this.points-=10;  
    }
    this.selectedSingleOption='';
    this.selectedCheckBoxValues=[];
    this.selectedDropdownOption = '';
  }

  answer(currentQno:number , option:any){
    debugger
    if(currentQno === this.questionList.length){
      this.isQuizCompleted = true;
      this.stopCounter();
    }
    if(option.correct){
      this.points+= 10;
      this.correctAnswer++;
      setTimeout(()=>{
      this.currentQuestion++;
      this.resetCounter();
      this.getProgressPercent();
      },1000);
      
    }else{
      setTimeout(()=>{
        this.currentQuestion++;
      this.IncorrectAnswer++;
      this.resetCounter();
      this.getProgressPercent();
      },1000)
      this.points-=10; 
    }
    
  }

  startCounter(){
    this.interval$ = interval(1000).subscribe(val=>{
      this.counter--;
      if(this.counter===0){
        if(this.currentQuestion <= this.questionList.length)
          this.currentQuestion++;
        this.counter=30;
        this.points-=10;
      }
    });
    setTimeout(()=>{

      this.interval$.unsubscribe();
    },3000000)
  }
  stopCounter(){
    this.interval$.unsubscribe();
    this.counter=0;
  }
  resetCounter(){
    this.stopCounter();
    this.counter=30;
    this.startCounter();
  }


  getProgressPercent(){
    this.progress = ((this.currentQuestion/this.questionList.length) *100).toString();
    return this.progress;
  }

}
