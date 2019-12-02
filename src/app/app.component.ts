import { Component } from '@angular/core';
import { slideInAnimation } from './animation';
import { RouterOutlet } from '@angular/router';
import { Subject } from 'rxjs';
import { FirebaseService } from './services/firebase.service';
import { AngularFireDatabase } from 'angularfire2/database';
import { first,map } from 'rxjs/operators';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  animations: [
    slideInAnimation
  ]
})

export class AppComponent {
  private EventToChildSub: Subject<any> = new Subject();
  collection: string = "/accounts";
  constructor(private db:AngularFireDatabase) {
    this.appendData("cindy","apiData","tokyo")
  }

  appendData(username:string,keyName:string,newval:any):void {
    const items = this.db.list(this.collection,ref => ref.orderByChild("username").equalTo(username));
    const addResult = items.snapshotChanges().pipe(first()).pipe(map(list => {
      var jsonObj = list[0].payload.val()[keyName] || [];
      /* Only push if value not included */
      var objKey = list[0].key;

      var payload = {};
      payload[newval] = "someval";
      /* console.log(objKey);
      this.db.object(this.collection + "/" + objKey)
      console.log(this.db.list(this.collection + "/" + objKey).update("apiData",payload)) */
      /* this.db.list(this.collection + "/" + objKey + "/apiData").snapshotChanges().pipe(map(items => {
        return items.map(a =>  a.payload.key)
      })).subscribe(val => {
        console.log(val);
      }); */
      /* var li = this.db.list(this.collection + "/" + objKey + "/apiData");
      li.remove(newval); */
      /* li.snapshotChanges().subscribe(dataList => {
        console.log(dataList);
        if (dataList){
          
        }
      }) */

      /* if (!jsonObj.includes(newval)) {
        jsonObj.push(newval);
        var upJson = {};
        upJson[keyName] = jsonObj;
        items.update(list[0].key,upJson);
        return " added!";
      } else {
        return " already existed in your profile";
      } */
    })).subscribe(val => {});
  }

  prepareRoute(outlet: RouterOutlet) {
    return outlet && outlet.activatedRouteData && outlet.activatedRouteData['animation'];
  }
}