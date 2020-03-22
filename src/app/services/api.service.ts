import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

let apikey = "36fda24fe5588fa4285ac6c6c2fdfbdb6b6bc9834699774c9bf777f706d05a88"; //@Local, PSQL 

//@Prod & Dev
// const httpOptions = {
//   headers: new HttpHeaders({
//     'Access-Control-Allow-Origin': '*',
//     'Content-Type':  'application/json',
//     "X-DreamFactory-API-Key": apikey
//   })
// };

//@Local
const httpOptions = {
  headers: new HttpHeaders({
    'Access-Control-Allow-Origin': '*',
    'Content-Type':  'application/json',
    "X-DreamFactory-API-Key": apikey,
    "X-DreamFactory-Session-Token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiI2NGUxYjhkMzRmNDI1ZDE5ZTFlZTJlYTcyMzZkMzAyOCIsImlzcyI6Imh0dHA6Ly9sb2NhbGhvc3Q6ODA4MC9hcGkvdjIvc3lzdGVtL2FkbWluL3Nlc3Npb24iLCJpYXQiOjE1ODQ2OTI5NzcsImV4cCI6MTU4NDc3OTM3NywibmJmIjoxNTg0NjkyOTc3LCJqdGkiOiIzbHBUeXNGU3F0eXJoTmJqIiwidXNlcl9pZCI6MSwiZm9yZXZlciI6ZmFsc2V9.JihxiLpvzif4W1xeyUo28SebpO7zUEaf8KM_A23T_Hw" //@Local, PSQL
  })
};

@Injectable({
  providedIn: 'root'
})

export class ApiService {
  private baseURI: string; 
  // private env:any = environment;

  constructor(private http:HttpClient,  private router: Router) {
    // if(this.env == "prod"){
    //   this.baseURI = "http://10.0.15.84/api/mobile/"; //@Prod, PSQL 
    // }else if(this.env == "dev"){
    //   this.baseURI = "http://samitivej.demotoday.net:47780/api/v2/moi_app/"; //@Dev, mySQL 
    // }else{
      this.baseURI = "http://localhost:8080/api/v2/moipsql/"; //@Local, PSQL 
    // }
  }

  // GET
  getTel() {
    let path = "_table/moi_telephone?order=tel_id ASC";
    return this.http.get(this.baseURI + path, httpOptions);
  }

  // GET (with id)
  getUserProfile(data) {
    let path = "_table/moi_telephone/"+data;
    return this.http.get(this.baseURI + path, httpOptions);
  }

  // POST
  postUserInfo(data){
    let path = "_table/hs_user_info";
    return this.http.post(this.baseURI + path , data, httpOptions)
  }

  // PUT (update data)
  putTelephone(data){
    let path = "_table/moi_telephone";
    return this.http.put(this.baseURI + path , data, httpOptions)
  }
  

  // POPUP ALERT
  alertSuccess(altitle, navigate){
    Swal.fire({
      icon: 'success',
      title: altitle,
      showConfirmButton: false,
      timer: 2000,
      allowOutsideClick: false
    }).then((result) => {
      if(navigate != ''){
        this.router.navigate(navigate);
      }
    })
  }

  alertError(altitle, altext, albtntext, navigate){
    Swal.fire({
      title: altitle,
      text: altext,
      icon: 'error',
      confirmButtonColor: '#3085d6',
      confirmButtonText: albtntext,
      allowOutsideClick: false
    }).then((result) => {
      if (result.value) {
        if(navigate != ''){
          this.router.navigate(navigate);
        }
      }
    })
  }

  // Check format phone number for all type
  checkPhoneAll(event: any) {
    // const pattern = /[0-9\+\-\,\ ]/g;
    const pattern = /[0-9\,]/g;
    const inputChar = String.fromCharCode(event.charCode);

    if (!pattern.test(inputChar)) {
      return event.preventDefault();
    }
  }

  // Check format email
  checkEmailAll(email){
    const emailCheck = /^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/i;

    if (!emailCheck.test(email)) {
      return true; //wrong format
    }else{
      return false; //true format
    }
  }
}
