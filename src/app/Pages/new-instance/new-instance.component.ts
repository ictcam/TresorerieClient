import { Component, OnInit } from '@angular/core';
import {CaisseService} from "../../services/caisse/caisse.service";
import {TokenStorageService} from "../../auth/auth/token-storage.service";
import {Caisse} from "../../Model/Caisse";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ActivatedRoute, Router} from "@angular/router";
import Swal from 'sweetalert2'

@Component({
  selector: 'app-new-instance',
  templateUrl: './new-instance.component.html',
  styleUrls: ['./new-instance.component.scss']
})
export class NewInstanceComponent implements OnInit {

  caisse: Caisse;
  editCaisse: Caisse;
  date: string;
  discForm: FormGroup;
  info: any;
  private roles: string[];
  public authority: string;
  public name: string = '';
  constructor(
      private caisseService: CaisseService,
      private tokenStorage: TokenStorageService,
      private fb: FormBuilder,
      private router: Router,
      private route: ActivatedRoute,
  ) {
    this.caisse = new Caisse();
    this.editCaisse = new Caisse();
    const today = new Date();
    this.date = today.getDate()+'/'+(today.getUTCMonth()+1)+'/'+today.getFullYear();
    this.createForm();
  }

  initDisci() {
    this.createForm();
  }
  createForm() {
    this.discForm = this.fb.group({
      piece: ['', [Validators.required]],
      mvt: ['', [Validators.required, Validators.minLength(5)]],
      etat: ['', [Validators.required, ]],
      montant: ['', [Validators.required, ]],
      cc: ['', [Validators.required, ]],
      provisoire: ['', ],
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
    this.showInstance()
  }

  showInstance() {
    this.route.params.subscribe(params => {
      this.caisseService.showInstance(params['id']).subscribe(
          res => {
            this.editCaisse = res;
          }
      )
    })
  }

  add(){
    // const Swal = require('sweetalert2');
    // const Swal = thi;
    var content = document.createElement('div');
    const x = this.discForm.controls['etat'].value;
    const y = this.discForm.controls['montant'].value;
    this.caisse.piece = this.discForm.controls['piece'].value;
    x == 'true' ? (this.caisse.encaissement = y, this.caisse.decaissement = 0) : (this.caisse.decaissement = y, this.caisse.encaissement = 0);
    // x == 'false' ? this.caisse.decaissement = y : this.caisse.encaissement = 0;
    this.caisse.provisoir = this.discForm.controls['provisoire'].value;
    this.caisse.mouvement= this.discForm.controls['mvt'].value;
    this.caisse.cc = this.discForm.controls['cc'].value;

    console.log('piece', this.caisse.piece);
    console.log('encaissement', this.caisse.encaissement);
    console.log('decaissement', this.caisse.decaissement);
    console.log('mvt', this.caisse.mouvement);
    console.log('provisoir', this.caisse.provisoir);
    console.log('mont', y);
    console.log('etat', x);
    console.log('caisse', this.caisse);
    // console.log('piece', this.caisse.piece);

    this.caisseService.addInstance(this.caisse).subscribe(
        res => {
            this.initDisci();
            this.router.navigateByUrl('/dashboard')
          const Toast = Swal.mixin({
            toast: true,
            position: 'bottom-end',
            showConfirmButton: false,
            timer: 5000,
            timerProgressBar: true,
            onOpen: (toast) => {
              toast.addEventListener('mouseenter', Swal.stopTimer);
              toast.addEventListener('mouseleave', Swal.resumeTimer);
            }
          });

          Toast.fire({
            icon: 'success',
            text: 'Nouvelle instance créée',
            title: 'Enregistrement',
          });
        },
        error => {
          // const Toast = Swal.mixin({
          //   toast: true,
          //   position: 'bottom-end',
          //   showConfirmButton: false,
          //   background: '#f7d3dc',
          //   timer: 5000,
          //   timerProgressBar: true,
          //   onOpen: (toast) => {
          //     toast.addEventListener('mouseenter', Swal.stopTimer);
          //     toast.addEventListener('mouseleave', Swal.resumeTimer);
          //   }
          // });
          //
          // Toast.fire({
          //   icon: 'error',
          //   text: error.error.message,
          //   title: 'Echec d\'enregistrement',
          // });

          content.innerHTML = error.error.message;
          Swal.fire({
            title: 'Echec d\'enregistrement!',
            html: content,
            icon: 'error',
            showCancelButton: false,
            confirmButtonText: 'OK',
            confirmButtonColor: '#f65656',
            allowOutsideClick: false,
            focusConfirm: true,
          }).then((result) => {
            // this._location.back();
          })
        },
    );
  }

  modifier(p: Caisse){
    const x = this.discForm.controls['etat'].value;
    const y = this.discForm.controls['montant'].value;
    this.caisse = p;
    this.caisse.piece = this.discForm.controls['piece'].value;
    x == 'true' ? (this.caisse.encaissement = y, this.caisse.decaissement = 0) : (this.caisse.decaissement = y, this.caisse.encaissement = 0);
    // x == 'false' ? this.caisse.decaissement = y : this.caisse.encaissement = 0;
    this.caisse.provisoir = this.discForm.controls['provisoire'].value;
    this.caisse.mouvement= this.discForm.controls['mvt'].value;
    this.caisse.cc = this.discForm.controls['cc'].value;

    console.log('piece', this.caisse.piece);
    console.log('encaissement', this.caisse.encaissement);
    console.log('decaissement', this.caisse.decaissement);
    console.log('mvt', this.caisse.mouvement);
    console.log('provisoir', this.caisse.provisoir);
    console.log('mont', y);
    console.log('etat', x);
    console.log('caisse', this.caisse);
    // console.log('piece', this.caisse.piece);

    this.caisseService.updateInstance(this.caisse.id, this.caisse).subscribe(
        res => {
            this.initDisci();
            this.router.navigateByUrl('/dashboard')
        }
    );
  }

}
