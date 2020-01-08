import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireList } from 'angularfire2/database';
import { Observable } from 'rxjs';
import { Account } from '../classes/account';
import { map, first } from 'rxjs/operators';
@Injectable({
  providedIn: 'root'
})
export class FirebaseService {
  collection: string = "/accounts";
  constructor(private db: AngularFireDatabase) { }

  authenticate(username:string,password:string): Observable<boolean>{
    const obs = this.retrieveUser(username).valueChanges().pipe(first()).pipe(map(list => {
      if (list[0]) {
        return list[0].password === password;
      }
      return false;
    }));
    return obs;
  }

  /* create new user */
  createUser(username:string,password:string):Observable<string> {
    const obs = this.checkUserExisted(username).pipe(map(existed => {
      if (existed) {
        return "Name already exists";
      } else {
        var acc = new Account();
        acc.username = username;
        acc.password = password;
        acc.apiData = [];
        this.db.list(this.collection).push(acc).catch(error => {
          return "Firebase failed";
        });
        return "Successfully Registered";
      }
    }))
    return obs;
  }

  /* Retrieve user personal information */
  retrieveUser(username:string): AngularFireList<Account>{
    return this.db.list(this.collection, ref => ref.orderByChild("username").equalTo(username));
  }

  
  /* update user information with a new value */
  updateUser(username:string,keyName:string,newval:any):void {
    const items = this.db.list(this.collection,ref => ref.orderByChild("username").equalTo(username));
    items.snapshotChanges().pipe(first()).subscribe(list => {
      const snapShot = list[0];
      var json = {};
      json[keyName] = newval;
      items.update(snapShot.key,json);
    });
  }

  appendUserDataToList(username:string,keyName:string,newval:any):Observable<string> {
    const items = this.db.list(this.collection,ref => ref.orderByChild("username").equalTo(username));
    const addResult = items.snapshotChanges().pipe(first()).pipe(map(list => {
      var payload = {};
      payload[newval] = "someval";
      this.db.list(this.collection + "/" + list[0].key).update("apiData",payload);
      return " added!";
    }))
    return addResult;
  }

  removeUserDataFromList(username:string,keyName,valToRemove:any):Observable<string> {
    const items = this.db.list(this.collection,ref => ref.orderByChild("username").equalTo(username));
    const removeResult = items.snapshotChanges().pipe(first()).pipe(map(list => {
      var li = this.db.list(this.collection + "/" + list[0].key + "/apiData");
      li.remove(valToRemove);
      return " removed, if added before";
    }))
    return removeResult;
  } 

  deleteUser(username:string):Observable<string> {
    const obs = this.checkUserExisted(username).pipe(map(existed => {
      if (existed) {
        return "Already existed please choose another name";
      } else {
        const items = this.db.list(this.collection,ref => ref.orderByChild("username").equalTo(username));
        items.snapshotChanges().subscribe(list => {
          if (list !== []) {
            items.remove(list[0].key);
          }
        })
        return "deleted successfully";
      }
    }))
    return obs;
  }

  /* Helper */
  checkUserExisted(username:string):Observable<boolean> {
    const obs = this.retrieveUser(username).valueChanges().pipe(first()).pipe(map(list => {
      return list.length > 0;
    }))
    return obs;
  }
}
