import { Component, OnInit, Input, EventEmitter } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Observable, from } from "rxjs";
import { map, filter, catchError, mergeMap } from 'rxjs/operators';
import { DataServiceService } from '../data-service.service';
import { BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-modal-content',
  templateUrl: './modal-content.component.html',
  styleUrls: ['./modal-content.component.scss']
})
export class ModalContentComponent implements OnInit {
  symbol;
  foundResult = {
    symbol: "",
    price: ""
  };
  duplicateSymbol;
  public event: EventEmitter<any> = new EventEmitter();
  results: any[] = [];
  baseURL = 'https://api.binance.com/api/v1/ticker/price';
  constructor(public http: HttpClient, private dataService: DataServiceService, public bsModalRef: BsModalRef
    ) { }

  ngOnInit(): void {
    console.log(this.results)
  }

  async addSymbol(){
    let response = []
      await this.dataService.addSymbol().subscribe(async val=>{
        for(let i=0; i<100; i++){
            for(let result of this.results){
              if(this.symbol == result.symbol){
                this.duplicateSymbol = result.symbol;
                this.foundResult = result;
                break;
              }else{
                this.duplicateSymbol = undefined
              }}
              if(!this.duplicateSymbol){
              if(this.symbol == val[i].symbol){
                this.foundResult = val[i];
                this.event.emit({ data: this.foundResult });
                console.log(this.foundResult)
                this.bsModalRef.hide();
                break;
              }
              else{
                this.foundResult = {
                  symbol: "",
                  price: ""
                }
              }
            }
        }
        if(this.duplicateSymbol){
          alert('Symbol already exists in the table')
        }
        if(!this.foundResult.symbol){
          alert('Symbol not found. Enter symbol again')
        }
      })
      
  }

  closeModal(){
    this.bsModalRef.hide();
  }

}
