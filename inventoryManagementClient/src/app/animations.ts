import { trigger, state, transition, style, animate } from '@angular/animations';

let animationTime = 500;

export let fadeEffect = trigger('fade',[
    state('void',style({opacity : 0})),
    transition(':enter, :leave',[
        animate(animationTime)
    ])
])

export let dropDownEffect = trigger('dropDown',[
    state('void',style({transform : 'translateY(-100px)'})),
    transition(':enter, :leave',[
        animate(animationTime)
    ])
])