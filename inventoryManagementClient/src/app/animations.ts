import { trigger, state, transition, style, animate } from '@angular/animations';
import { Constants } from './definitions/constants';

// const animationTime = 500;

export let fadeEffect = trigger('fade', [
    state('void', style({ opacity: 0 })),
    transition(':enter, :leave', [
        animate(Constants.ANIMATION_TIME)
    ])
])

export let dropDownEffect = trigger('dropDown', [
    state('void', style({ transform: 'translateY(-100px)' })),
    transition(':enter, :leave', [
        animate(Constants.ANIMATION_TIME)
    ])
])