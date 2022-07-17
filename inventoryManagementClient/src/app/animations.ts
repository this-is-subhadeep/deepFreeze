import { trigger, state, transition, style, animate } from '@angular/animations';

export let fadeEffect = trigger('fade',[
    state('void',style({opacity : 0})),
    transition(':enter, :leave',[
        animate(500)
    ])
])

export let dropDownEffect = trigger('dropDown',[
    state('void',style({transform : 'translateY(-50px)'})),
    transition(':enter',[
        animate(500)
    ])
])