import { trigger, state, transition, style, animate } from '@angular/animations';

export let fadeInEffect = trigger("fadeIn", [
    state("void", style({ opacity: 0 })),
    transition(":enter", [
        animate(1000)
    ])
]);

export let dropDownEffect = trigger("dropDown", [
    state("void", style({ transform: "translateY(-50px)" })),
    transition(":enter", [
        animate(500)
    ])
]);