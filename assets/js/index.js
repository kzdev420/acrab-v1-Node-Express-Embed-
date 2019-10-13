// GSAP Variables
let red_curtain = $('.red-curtain');

let logo_1 = $('.title-card > .logo');
let title_1 = $('.title-card > .title > .outer > .inner');

let logo_2 = $('.title-card-1 > .logo');
let title_2 = $('.title-card-1 > .title-1 > .outer > .inner');

let arcab_image = $('.arc-container-1 .arcab');
let arc_footer = $('.arc-container-1 .arc-container-footer');

let tl = new TimelineMax();
tl
	.to(red_curtain, 1, { top: '0px', height: '100%', ease: Power2.easeIn }, 0.5)
	.to(logo_1, 1, { transform: ' translate(0px, 0px)', autoAlpha: 1, ease: Power2.easeOut }, 1.2)
	.staggerTo(title_1, 1, { top: '10px', ease: Power2.easeOut }, 0.04, 1.4)
	.staggerTo(title_1, 1, { top: '-100px', ease: Power2.easeIn }, 0.04, 3)
	.to(logo_1, 1, { transform: ' translate(-20px, 0px)', autoAlpha: 0, ease: Power2.easeOut }, 3.2)
	.to(red_curtain, 1, { height: '0%', ease: Power2.easeIn }, 3.2)
	.to(logo_2, 1, { transform: ' translate(0px, 0px)', autoAlpha: 1, ease: Power2.easeOut }, 4.5)
	.staggerTo(title_2, 1, { top: '10px', ease: Power2.easeOut }, 0.04, 4.7)
	.to(arcab_image, 1, { autoAlpha: 1, ease: Power2.easeIn }, 5.5)
	.to(arc_footer, 1, { autoAlpha: 1, ease: Power2.easeIn }, 5.8);
