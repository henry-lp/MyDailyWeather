/* animation */
import { trigger, style, transition, animate,query,group,animateChild } from '@angular/animations'; 
export const slideInAnimation =
   trigger('routeAnimations', [

        transition('* => Profile', [
             query(':enter, :leave', 
                  style({ position: 'fixed',  width: '100%' }), 
                  { optional: true }),
             group([
                  query(':enter', [
                      style({display:"block", transform: 'translateX(100%)' }), 
                      animate('0.5s ease-in-out', 
                      style({ transform: 'translateX(0%)' }))
                  ], { optional: true }),
                  query(':leave', [
                      style({display:"none", transform: 'translateX(0%)' }),
                      animate('0.5s ease-in-out', 
                      style({ transform: 'translateX(-100%)' }))
                      ], { optional: true }),
              ])
        ]),
     transition('* => Search', [
          query(':enter, :leave', 
               style({ position: 'fixed',  width: '100%' }), 
               { optional: true }),
          group([
               query(':enter', [
                    style({display:"flex", transform: 'translateX(-100%)' }), 
                    animate('0.5s ease-in-out', 
                    style({ transform: 'translateX(0%)' }))
                ], { optional: true }),
                query(':leave', [
                    style({display:"none", transform: 'translateX(0%)' }),
                    animate('0.5s ease-in-out', 
                    style({ transform: 'translateX(100%)' }))
                    ], { optional: true }),
           ])
     ]),
    ]);

