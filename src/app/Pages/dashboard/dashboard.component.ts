import { Component, OnInit } from '@angular/core';
import {CaisseService} from "../../services/caisse/caisse.service";
import {Caisse} from "../../Model/Caisse";
import {TokenStorageService} from "../../auth/auth/token-storage.service";
import {DatePipe} from "@angular/common";
import {Router} from "@angular/router";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import html2canvas from "html2canvas";
import jsPDF from 'jspdf';
import {throwIfEmpty} from "rxjs/internal/operators/throwIfEmpty";
import * as pdfMake from '../../../../node_modules/pdfmake/build/pdfmake.js';
import * as pdfFonts from '../../../../node_modules/pdfmake/build/vfs_fonts.js';
// import * as sweetalert from '../../../../node_modules/sweetalert2/dist/sweetalert2.js';
import {SoldeService} from "../../services/solde.service";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  caisses: Caisse[];
  provisoirs: Caisse[];
  todayCaisse: Caisse[];
  todayEntree: number;
  todaySortie: number;
  lastSolde: any;
  entree: number;
  sortie: number;
  solde: number;
  date: any;
  today: Date;
  color = '#25c481';
  closeResult: any;
  datas = {
    labels: [] = [],
    datasets: [] = []
  };
  group = {
    labels: [] = [],
    datasets: [] = []
  };
  loaders = false;
  info: any;
  private roles: string[];
  public authority: string;
  public name: string = '';
  public ranges: string;
  selectPanForm: FormGroup;
  rangeForm: FormGroup;

  // pdfMake = require('pdfmake/build/pdfmake.js');
  // pdfFonts = require('pdfmake/build/vfs_fonts.js');
  showDate = false;
  constructor(
      private caisseService: CaisseService,
      private soldeService: SoldeService,
      private tokenStorage: TokenStorageService,
      private router: Router,
      private fb: FormBuilder,
      private datePipe: DatePipe,
      private modalService: NgbModal
  ) {
    this.ranges = 'false';
    this.sortie = 0;
    this.solde = 0;
    this.entree= 0;
    this.todaySortie = 0;
    this.todayEntree= 0;
    this.caisses = [];
    this.todayCaisse = [];
    this.provisoirs = [];
    const today = new Date();
    this.today = new Date();
    console.log(this.date);
    this.createForms();
    this.rangeForms();
    pdfMake.vfs = pdfFonts.pdfMake.vfs;
  }

  createForms() {
    this.selectPanForm = this.fb.group({
      periode: ['']
    });
  }

  rangeForms() {
    this.rangeForm = this.fb.group({
      date1: ['', Validators.required],
      date2: ['', Validators.required]
    });
  }

  ngOnInit() {

    this.info = {
      token: this.tokenStorage.getToken(),
      username: this.tokenStorage.getUsername(),
      authorities: this.tokenStorage.getAuthorities()
    };

    if (this.tokenStorage.getToken()) {
      this.roles = this.tokenStorage.getAuthorities();
      this.roles.every(role => {
        // 'ROLE_USER_ALPI,,,,,,,'
        if (role === 'ROLE_SUPER_ADMIN') {
          this.authority = 'super_admin';
          this.name = 'Super Admin';
          return false;
        } else if (role === 'ROLE_TRESORIER') {
          this.authority = 'tresorier';
          this.name = 'tresorier';
          return false;
        }
        this.authority = 'admin';
        this.name = 'admin';
        return true;
      });
    }

    this.getCaisse();
    this.getProvisoir();
    this.last30days();
    this.groupByCc();
    this.getSolde();
    this.getLastSolde();
    console.log(this.tokenStorage.getAuthorities())
  }

  getLastSolde(){
    this.loaders = true;
    this.soldeService.getLastSolde().subscribe(
        resp => {
          resp ? this.lastSolde = resp : this.lastSolde = null;
        },
        error => {
          this.loaders = false;
        },
        () => {
          this.loaders = false;
          console.log('last solde: ', this.lastSolde)
        }
    )
  }

  getCaisse(){
    this.loaders = true;
    this.sortie = 0;
    this.entree = 0;
    this.todayEntree = 0;
    this.todaySortie = 0;
    this.showDate = false;
    const dat = new Date();
    const dat1 = this.datePipe.transform(dat.setMonth(dat.getMonth()), 'dd/MM/yyyy');
    // this.date = today.getDate()+'/'+(today.getMonth()+1)+'/'+today.getFullYear();
    this.date = dat1;
    this.caisseService.getCaisse().subscribe(
        resp => {
          resp ? this.caisses = resp : this.caisses = [];
          resp ? this.todayCaisse = resp : this.todayCaisse = [];
          for(let r of this.caisses){
            this.todayEntree = this.todayEntree + r.encaissement;
            this.todaySortie = this.todaySortie + r.decaissement;
            this.entree = this.entree + r.encaissement;
            this.sortie = this.sortie + r.decaissement;
          }
        },
        error => {
          this.loaders = false;
        },
        () => {
          this.loaders = false;
          console.log('casisse: ', this.caisses)
        }
    )
  }

  getProvisoir(){
    this.loaders = true;

    this.caisseService.getProvisoir().subscribe(
        resp => {
          resp ? this.provisoirs = resp : this.provisoirs= [];
        },
        error => {
          this.loaders = false;
        },
        () => {
          this.loaders = false;
          console.log('provisoirs: ', this.provisoirs)
        }
    )
  }

  getHierCaisse(){
    this.loaders = true;
    this.caisses = [];
    this.sortie = 0;
    this.entree = 0;
    const dat = new Date();
    const dat2 = dat.setDate(dat.getDate()-1);
    // const dat1 = this.datePipe.transform(dat2.setMonth(dat2.getMonth()), 'dd/MM/yyyy');
    // this.date = today.getDate()+'/'+(today.getMonth()+1)+'/'+today.getFullYear();
    this.date = this.datePipe.transform(dat2, 'dd/MM/yyyy');
    this.caisseService.getHier().subscribe(
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

  getThisWeekCaisse(){
    this.loaders = true;
    this.caisses = [];
    this.sortie = 0;
    this.entree = 0;
    this.date = "Récapitulatif de la Semaine";
    this.caisseService.getThisWeek().subscribe(
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

  getLastWeekCaisse(){
    this.loaders = true;
    this.caisses = [];
    this.sortie = 0;
    this.entree = 0;
    this.date = "Récapitulatif de la Semaine Passée";
    this.caisseService.getLastWeek().subscribe(
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

  getLastMonthCaisse(){
    this.loaders = true;
    this.caisses = [];
    this.sortie = 0;
    this.entree = 0;
    const dat = new Date();
    const dat1 = this.datePipe.transform(dat.setMonth(dat.getMonth()-1), 'MMMM');
    const x = dat.getMonth() == 1 ? this.datePipe.transform(dat.setFullYear(dat.getFullYear()-1), 'yyyy') : this.datePipe.transform(dat.setFullYear(dat.getFullYear()), 'yyyy')
    console.log('last Month: '+ dat1);
    this.date = "Récapitulatif du mois de "+ dat1+" "+x;
    this.caisseService.getLastMonth().subscribe(
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

  getThisMonthCaisse(){
    this.loaders = true;
    this.caisses = [];
    this.sortie = 0;
    this.entree = 0;
    const dat = new Date();
    const dat1 = this.datePipe.transform(dat.setMonth(dat.getMonth()), 'MMMM yyyy');
    this.date = "pannes du mois de "+ dat1;
    this.caisseService.getThisMonth().subscribe(
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
    this.solde = 0;
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

  groupByCc(){
    this.group.labels = [];
    this.group.datasets = [];
    const datasetNbrePanne3 = {
      data: [],
      label: "Décaissement",
      yAxisID: 'y-axis-0',
      backgroundColor: 'red',
      borderColor: '#0692fb',
    };
    const datasetNbrePanne4 = {
      data: [],
      label: "Prélèvement",
      yAxisID: 'y-axis-1',
      type: 'line'
    };
    this.caisseService.getGroup().subscribe(
        list => list.forEach(mach => {
          // datasetNbrePanne2.name = (mach.machine);
          this.group.labels.push(mach.cc);
          // this.dah = this.datas.labels.length;
          datasetNbrePanne3.data.push(mach.nbre);
          datasetNbrePanne4.data.push(mach.count);
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
    this.group.datasets.push(datasetNbrePanne3);
    this.group.datasets.push(datasetNbrePanne4);

  }

  findSso($event){
    if (this.selectPanForm.controls['periode'].value == 'hp'){
      console.log('test hp')
      this.getHierCaisse();
      this.showDate = true;
    }
    if (this.selectPanForm.controls['periode'].value == 'twp'){
      this.getThisWeekCaisse();
      console.log('test twp');

    this.showDate = true;
    }
    if (this.selectPanForm.controls['periode'].value == 'lwp'){
      this.getLastWeekCaisse();
      console.log('test lwp');

    this.showDate = true;
    }
    if (this.selectPanForm.controls['periode'].value == 'tmp'){
      this.getThisMonthCaisse();
      console.log('test tmp');

    this.showDate = true;
    }
    if (this.selectPanForm.controls['periode'].value == 'lmp'){
      this.getLastMonthCaisse();
      console.log('test lmp');

    this.showDate = true;
    }
    // if (this.selectPanForm.controls['periode'].value == 'typ'){
    //   // this.ThisYearPannes();
    // }
    // if (this.selectPanForm.controls['periode'].value == 'lyp'){
    //   // this.LastYearPannes();
    // }
    // if (this.selectPanForm.controls['periode'].value == 'pp'){
    //   this.ranges = "true";
    //   console.log('test pp')
    // }
    // else {
    //   this.ranges = "false";
    //
    //   console.log('test pp2')
    // }
  }

  async downloads(){
    const dat = new Date();
    const min = 'min';
    const user = this.tokenStorage.getUsername();

    var docDefinition = {
      pageSize: 'A4',
      pageOrientation: 'portrait',
      pageMargins: [40, 60, 40, 60],
      footer: function (currentPage, pageCount) {
        return {
          columns: [
            {
              text: window.location.toString()+' généré par: ' + user,
              fontSize: 8,
              italics: true,
              margin: [40, 20, 0, 0],
              alignment: 'left'
            },
            // { text: 'from acon-stats produced by '+this.token.getUsername().bold(), fontSize: 8, italics: true, margin: [ 10, 10, 0, 0 ], alignment: 'left'},
            {
              text: currentPage.toString() + '/' + pageCount,
              fontSize: 8,
              italics: true,
              margin: [0, 20, 40, 0],
              alignment: 'right'
            }
          ],
        }
      },
      header: {
        columns: [
          {
            image: await this.getBase64ImageFromURL("/assets/new/img/alpi.jpg"),
            width: 87,
            height: 22,
            margin: [40, 12, 0, 0],
            alignment: 'left'
          },
          {
            text: 'Etat de la caisse au ' + this.datePipe.transform(dat, 'dd/MM/yyyy HH:mm'),
            bold: true, fontSize: 8, italics: true,
            alignment: 'right',
            margin: [0, 12, 40, 0],
          }
        ]
      },

      info: {
        title: 'Rapport de Caisse du ' + this.datePipe.transform(dat, 'dd/MM/yyyy'),
        author: user,
        subject: 'Brouillard de Caisse',
        creator: 'ACON',
        producer: user,
        creationDate: this.datePipe.transform(dat, 'dd/MM/yyyy HH:mm')
      },
      content: [
        {
          text: 'CAISSE ALPICAM INDUSTRIES',
          fontSize: 16, bold: true, alignment: 'center',
          decoration: 'underline', decorationStyle: 'double',
          margin: [0, 0, 0, 0]
        },
        {
          margin: [0, 10],
          columns: [
            {
              text: [
                {
                  text: `Solde du ${this.datePipe.transform(this.lastSolde.date, 'dd MMM yyyy')} `,
                  fontSize: 12,
                  italics: true,
                  alignment: 'left',
                  // decoration: 'underline',
                  margin: [0, 0]
                },
                {
                  text: [
                    {text: this.lastSolde.solde, bold: true, fontSize: 12, alignment: 'left',},
                  ],
                },
                {
                  text: [
                    {text: ' Fcfa' , fontSize: 12, alignment: 'left',},
                  ],
                },
              ]
            },

          ]
        },

        this.getTable(this.todayCaisse.reverse()),

        // {
        //   margin: [0, 10],
        //   columns: [
        //     {
        //       text: [
        //         {
        //           text: 'Encaissement :\n',
        //           fontSize: 13,
        //           italics: true,
        //           bold: true,
        //           alignment: 'left',
        //           decoration: 'underline',
        //           margin: [0, 0]
        //         },
        //         {
        //           text: [
        //             {text: this.todayEntree+' Fcfa' , fontSize: 12, alignment: 'left',},
        //           ],
        //         },
        //       ]
        //     },
        //     {
        //       text: [
        //         {
        //           text: 'Décaissement :\n',
        //           fontSize: 13,
        //           italics: true,
        //           bold: true,
        //           alignment: 'center',
        //           decoration: 'underline',
        //           margin: [0, 0]
        //         },
        //         {
        //           text: [
        //             {text: this.todaySortie+' Fcfa' , fontSize: 12, alignment: 'center',},
        //           ],
        //         },
        //       ]
        //     },
        //     {
        //       text: [
        //         {
        //           text: 'Solde Caisse:\n',
        //           fontSize: 13,
        //           italics: true,
        //           bold: true,
        //           alignment: 'right',
        //           decoration: 'underline',
        //           margin: [0, 0]
        //         },
        //         {
        //           text: [
        //             {text: this.solde+' Fcfa' , fontSize: 12, alignment: 'right',},
        //           ],
        //         },
        //       ]
        //     },
        //
        //   ]
        // },
        {
          margin: [0, 10],
          columns: [
            {
              text: [
                {
                  text: 'Visa Caissier\n',
                  fontSize: 13,
                  italics: true,
                  bold: true,
                  alignment: 'left',
                  // decoration: 'underline',
                  margin: [0, 0]
                },
              ]
            },
            {
              text: [
                {
                  text: 'Visa Chef Trésorerie\n',
                  fontSize: 13,
                  italics: true,
                  bold: true,
                  alignment: 'left',
                  // decoration: 'underline',
                  margin: [0, 0]
                },
              ]
            },
            {
              text: [
                {
                  text: 'Visa Chef Comptable\n',
                  fontSize: 13,
                  italics: true,
                  bold: true,
                  alignment: 'right',
                  // decoration: 'underline',
                  margin: [0, 0]
                },
              ]
            },
            {
              text: [
                {
                  text: 'Visa DAF\n',
                  fontSize: 13,
                  italics: true,
                  bold: true,
                  alignment: 'right',
                  // decoration: 'underline',
                  margin: [0, 0]
                },
              ]
            },

          ]
        },

      ],
      styles: {
        header: {
          fontSize: 18,
          bold: true,
          margin: [0, 0, 0, 10],

        },
        subheader: {
          fontSize: 16,
          bold: true,
          margin: [0, 10, 0, 5]
        },
        tableExample: {
          margin: [0, 5, 0, 15]
        },
        tableOpacityExample: {
          margin: [0, 5, 0, 15],
          fillColor: 'blue',
          fillOpacity: 0.3
        },
        tableHeader: {
          bold: true,
          fontSize: 12,
          fillColor: '#d0eeff',
          fontFamily: 'Roboto',
          alignement: 'left',
          color: '#0b5885',
        },
        tableFooter: {
          bold: true,
          fontSize: 10,
          // fillColor: '#d0eeff',
          fontFamily: 'Roboto',
          alignement: 'left',
          color: '#000',
        },
        tableFooters: {
          bold: true,
          fontSize: 12,
          // fillColor: '#d0eeff',
          fontFamily: 'Roboto',
          alignement: 'left',
          color: '#000',
        },
        tableFootersE: {
          bold: true,
          fontSize: 12,
          // fillColor: '#d0eeff',
          fontFamily: 'Roboto',
          alignement: 'left',
          color: '#000',
        },
        tableFootersD: {
          bold: true,
          fontSize: 12,
          // fillColor: '#d0eeff',
          fontFamily: 'Roboto',
          alignement: 'center',
          color: '#000',
        },
        tableFootersS: {
          bold: true,
          fontSize: 12,
          // fillColor: '#d0eeff',
          fontFamily: 'Roboto',
          alignement: 'right',
          color: '#f65656',
        },
        black: {
          bold: true,
          fontSize: 12,
          fillColor: '#000',
          fontFamily: 'Roboto',
          alignement: 'left',
          color: '#000',
        },
        td: {
          bold: false,
          fontSize: 10,
          fillColor: '#fff',
          fontFamily: 'Roboto',
          alignement: 'left',
          color: '#000',
        },
        tv: {
          bold: false,
          fontSize: 10,
          fillColor: '#fff',
          fontFamily: 'Roboto',
          alignement: 'left',
          color: '#3ac47d',
        },
        tr: {
          bold: false,
          fontSize: 10,
          fillColor: '#fff',
          fontFamily: 'Roboto',
          alignement: 'left',
          color: '#d92550',
        },
        tj: {
          bold: false,
          fontSize: 10,
          fillColor: '#fff',
          fontFamily: 'Roboto',
          alignement: 'left',
          color: '#f7b924',
        }
      },

    };
    // this.pdfMake.createPdf(docDefinition).download('Rapport de Maintenance - ' + this.datePipe.transform(dat, 'MMM-yyyy'));
    pdfMake.createPdf(docDefinition).open();
  }


  getBase64ImageFromURL(url) {
    return new Promise((resolve, reject) => {
      var img = new Image();
      img.setAttribute("crossOrigin", "anonymous");
      img.onload = () => {
        var canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;
        var ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0);
        var dataURL = canvas.toDataURL("image/png");
        resolve(dataURL);
      };
      img.onerror = error => {
        reject(error);
      };
      img.src = url;
    });
  }

  getTable(rap: any[]){
    return {
      style: 'tableExample',
      table: {
        headerRows: 1,
        widths: [210, 40, 80, 80, 50],
        body: [
          [{ text: 'Mouvements Caisse', style: 'tableHeader' }, { text: 'Pièces', style: 'tableHeader' }, { text: 'Encaissement', style: 'tableHeader' }, { text: 'Décaissement', style: 'tableHeader' }, { text: 'Solde', style: 'tableHeader' }, ],

          ...rap.map(stat => {
            return [{text: stat.mouvement, style: 'td'},
              {text: stat.piece, style: 'td'}, {text: stat.encaissement, style: 'td'}, {text: stat.decaissement, style: 'td'},

              {text: stat.solde, style: 'td'},

              ]
          }),
          [{ text: '', style: 'black' }, { text: '', style: 'black' }, { text: '', style: 'black' }, { text: '', style: 'black' }, { text: '', style: 'black' }, ],
          [{ text: 'Total', style: 'tableFooters' }, { text: '', style: 'tableFooter' }, { text: this.todayEntree, style: 'tableFooter' }, { text: this.todaySortie, style: 'tableFooter' }, { text: this.solde, style: 'tableFooter' }, ],
          // [{ text: 'Total EnCaissement', style: 'tableFootersE' }, { text: '', style: 'tableFooter' }, { text: this.todayEntree, style: 'tableFooter' }, { text: '', style: 'tableFooter' }, { text: '', style: 'tableFooter' }, ],
          // [{ text: 'Total Décaissement', style: 'tableFootersD' }, { text: '', style: 'tableFooter' }, { text: '', style: 'tableFooter' }, { text: this.todaySortie, style: 'tableFooter' }, { text: '', style: 'tableFooter' }, ],
          // [{ text: 'Solde', style: 'tableFootersS' }, { text: '', style: 'tableFooter' }, { text: '', style: 'tableFooter' }, { text: '', style: 'tableFooter' }, { text: this.solde, style: 'tableFooter' }, ],

        ]
      },
      layout: 'lightHorizontalLines'
    };
  }

  // swl(){
  //   const Swal = require('sweetalert2');
  //   const Toast = Swal.mixin({
  //     toast: true,
  //     position: 'bottom-end',
  //     showConfirmButton: false,
  //     background: '#f7d3dc',
  //     timer: 5000,
  //     timerProgressBar: true,
  //     onOpen: (toast) => {
  //       toast.addEventListener('mouseenter', Swal.stopTimer);
  //       toast.addEventListener('mouseleave', Swal.resumeTimer);
  //     }
  //   });
  //
  //   Toast.fire({
  //     icon: 'error',
  //     text: 'sortie',
  //     title: 'Echec d\'enregistrement',
  //   });
  // }



  open(content){
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) =>{
          this.closeResult = `Closed with: ${result}`;
        }, (reason) =>{

        }
    );
  }
}
