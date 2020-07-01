import { Component } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ModalContentComponent } from './modal-content/modal-content.component';
import { interval } from 'rxjs';
import { Observable } from 'rxjs/internal/Observable';
import { DataServiceService } from './data-service.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent {
  title = 'angular-bootstrap-modal';
  bsModalRef: BsModalRef;
  results = [];
  newResults = [];
  lastChanged;
 constructor(private modalService: BsModalService, private dataService: DataServiceService) { }
 
 ngOnInit() {
   if(localStorage.getItem('results')){
     this.results = this.getUser()
   }
   interval(2000).subscribe(x => {
      this.dataService.addSymbol().subscribe(val=>{
        for(let apiVal of val){
          for(let j=0;j<this.results.length;j++){
            if(this.results[j].symbol == apiVal.symbol){
              this.lastChanged = this.results[j].price - apiVal.price
              if(this.lastChanged > 0){
                document.getElementById('resultsRow'+j).style.backgroundColor = 'green'
              }
              else if(this.lastChanged < 0){
                document.getElementById('resultsRow'+j).style.backgroundColor = 'red'
              }
              else if(this.lastChanged == 0){
                document.getElementById('resultsRow'+j).style.backgroundColor = 'white'
              }
              this.results.splice(j,1)
              this.results.push(apiVal)
              localStorage.setItem('results', JSON.stringify(this.results))
              break;
            }
          }
        }
      })
    });
  }
 
 openModalWithComponent() {
  const initialState = {
    results: this.results
  };
   this.bsModalRef = this.modalService.show(ModalContentComponent, {initialState});
   this.bsModalRef.content.closeBtnName = 'Close'; 
   this.bsModalRef.content.event.subscribe(res => {
    this.results.push(res.data);
    localStorage.setItem('results', JSON.stringify(this.results))
    this.ngOnInit()
  });

 }

 getUser(){
   let user = localStorage.getItem('results')
   user = JSON.parse(user)
   return<any> user;
 }

 deleteResult(index){
   this.results.splice(index,1)
   localStorage.setItem('results', JSON.stringify(this.results))
 }
 
  
}