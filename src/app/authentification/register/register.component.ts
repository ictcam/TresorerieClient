import { Component, OnInit } from '@angular/core';
import {CaisseService} from "../../services/caisse/caisse.service";
import {Caisse} from "../../Model/Caisse";
import {TokenStorageService} from "../../auth/auth/token-storage.service";
import {DatePipe} from "@angular/common";

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

  caisses: Caisse[];
  entree: number;
  sortie: number;
  solde: number;
  date: any;
  datas = {
    labels: [] = [],
    datasets: [] = []
  };
  loaders = false;
  constructor(
      private caisseService: CaisseService,
      private tokenStorage: TokenStorageService,
      private datePipe: DatePipe,
  ) {
    this.sortie = 0;
    this.solde = 0;
    this.entree= 0;
    this.caisses = [];
    const today = new Date();
    this.date = today.getDate()+'/'+(today.getMonth()+1)+'/'+today.getFullYear();
    console.log(this.date)
  }

  ngOnInit() {
    this.getCaisse();
    this.last30days();
    this.getSolde();
    console.log(this.tokenStorage.getAuthorities())
  }

  getCaisse(){
    this.loaders = true;
    this.caisseService.getCaisse().subscribe(
        resp => {
          resp ? this.caisses = resp : this.caisses = [];
          for(let r of this.caisses){
            this.entree = this.entree + r.encaissement;
            this.sortie = this.sortie + r.decaissement;
          }
        },
        error => {
          this.loaders = false;
        },
        () => {
          this.loaders = false;
        }
    )
  }

  getSolde(){
    this.caisseService.getSolde().subscribe(
        resp => {
          this.solde = resp.solde;
        }
    )
  }

  last30days(){
    this.datas.labels = [];
    this.datas.datasets = [];
    const datasetNbrePanne3 = {
      data: [],
      label: "Décaissement",
      yAxisID: 'y-axis-0',
      backgroundColor: 'red',
      borderColor: '#0692fb',
    };
    const datasetNbrePanne4 = {
      data: [],
      label: "Cotisation",
      yAxisID: 'y-axis-1',
      type: 'line'
    };
    this.caisseService.getLast30Days().subscribe(
        list => list.forEach(mach => {
          // datasetNbrePanne2.name = (mach.machine);
          this.datas.labels.push(this.datePipe.transform(mach.date, 'dd-MMM'));
          // this.dah = this.datas.labels.length;
          datasetNbrePanne3.data.push(mach.nbre);
          // datasetNbrePanne4.data.push(mach.montant);
          // this.loaders = false;
          // this.loaders = false
        } ),
        error => {
          console.log('une erreur a été détectée!')
          // this.loaders = false;
        },
        () => {
          console.log('chargement des pannes');
          // this.loaders = false;
          // console.log("test007: "+this.dah)
        }) ;
    this.datas.datasets.push(datasetNbrePanne3);
    // this.datas.datasets.push(datasetNbrePanne4);

  }
}
