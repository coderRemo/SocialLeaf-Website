'use strict';

///////////////////////////////////////
// Modal window

const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');

const btnScroll = document.querySelector('.btn--scroll-to');
const section1 = document.querySelector('#section--1');

const tabs = document.querySelectorAll('.operations__tab');
const tabsContainer = document.querySelector('.operations__tab-container');
const tabsContent = document.querySelectorAll('.operations__content');

const nav = document.querySelector('.nav');

const openModal = function (e) {
  e.preventDefault();
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};

// working of open account top and bottom
btnsOpenModal.forEach(btn => btn.addEventListener('click', openModal));

// for (let i = 0; i < btnsOpenModal.length; i++)
//   btnsOpenModal[i].addEventListener('click', openModal);

btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});

///////////////////////////////////////
// <---- Implementing Scrolling ---->
btnScroll.addEventListener('click', function (e) {
  const cordElementSec1 = section1.getBoundingClientRect();
  console.log(cordElementSec1);

  console.log(e.target.getBoundingClientRect());

  console.log('Current scroll (X/Y)', window.scrollX, window.scrollY);

  console.log(
    'height/width viewport',
    document.documentElement.clientHeight,
    document.documentElement.clientWidth
  );

  // Scrolling
  ///////// Type 1
  // window.scrollTo(
  //   cordElementSec1.left + window.scrollX,
  //   cordElementSec1.top + window.scrollY
  // );

  ///////// Type 1
  // window.scrollTo({
  //   left: cordElementSec1.left + window.scrollX,
  //   top: cordElementSec1.top + window.scrollY,
  //   behavior: 'smooth',
  // });

  ///////// Type 3
  section1.scrollIntoView({ behavior: 'smooth' });
});

///////////////////////////////////////
// PAGE NAVIGATION

// this method works on multiple navigation, to prevent that we will be using event delegation method
// document.querySelectorAll('.nav__link').forEach(function (el) {
//   el.addEventListener('click', function (e) {
//     e.preventDefault();
//     const id = this.getAttribute('href');
//     console.log(id);
//     document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
//   });
// });

// Event delegation method using addEventListner that selects only the navigation
// 1. Add event listner to common parent element
// 2. Determine what element originated the event
document.querySelector('.nav__links').addEventListener('click', function (e) {
  // console.log(e.target);
  e.preventDefault();

  // Matching strategy
  if (e.target.classList.contains('nav__link')) {
    const id = e.target.getAttribute('href');
    console.log(id);
    document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
  }
});

///////////////////////////////////////
// TABBED COMPONENT
tabsContainer.addEventListener('click', function (e) {
  const clicked = e.target.closest('.operations__tab');
  console.log(clicked);

  // Guard Clause
  if (!clicked) return;

  // Remove active classes
  tabs.forEach(t => t.classList.remove('operations__tab--active'));
  tabsContent.forEach(c => c.classList.remove('operations__content--active'));

  // Activate Tab
  clicked.classList.add('operations__tab--active');

  // Activate content area
  document
    .querySelector(`.operations__content--${clicked.dataset.tab}`)
    .classList.add('operations__content--active');
});

///////////////////////////////////////
// MENU FADE ANIMATION
const handleHover = function (e) {
  if (e.target.classList.contains('nav__link')) {
    const link = e.target;
    const siblings = link.closest('.nav').querySelectorAll('.nav__link');
    const logo = link.closest('.nav').querySelectorAll('.img');

    siblings.forEach(el => {
      if (el !== link) el.style.opacity = this;
    });
    logo.style.opacity = this;
  }
};

nav.addEventListener('mouseover', handleHover.bind(0.5));
nav.addEventListener('mouseout', handleHover.bind(1));

///////////////////////////////////////
// STICKY NAVIGATION - we will be using scroll event

// Type 1
// const initialCoordinates = section1.getBoundingClientRect();
// console.log(initialCoordinates);

// window.addEventListener('scroll', function () {
//   console.log(window.scrollY);

//   if (window.scrollY > initialCoordinates.top) nav.classList.add('sticky');
//   else nav.classList.remove('sticky');
// });

// STICKY NAVIGATION - interaction observer API
// Type 2
// const obsCallBack = function (entries, observer) {
//   entries.forEach(entry => {
//     console.log(entry);
//   });
// };

// const obsOptions = {
//   root: null,
//   threshold: [0, 0.2],
// };

// const observer = new IntersectionObserver(obsCallBack, obsOptions);
// observer.observe(section1);

// Type 3
const header = document.querySelector('.header');
const navHeight = nav.getBoundingClientRect().height;
// console.log(navHeight);

const stickyNav = function (entries) {
  const [entry] = entries; // this means entries[0] and so on
  // console.log(entry);

  if (!entry.isIntersecting) nav.classList.add('sticky');
  else nav.classList.remove('sticky');
};

const headerObserver = new IntersectionObserver(stickyNav, {
  root: null,
  threshold: 0,
  rootMargin: `-${navHeight}px`,
});

headerObserver.observe(header);

// REVEAL SECTIONS
const allSections = document.querySelectorAll('.section');

// callback function for the Intersection Observer
const revealSection = function (entries, observer) {
  const [entry] = entries;
  // console.log(entry);

  if (!entry.isIntersecting) return;

  entry.target.classList.remove('section--hidden');
  observer.unobserve(entry.target);
};

// Create the Intersection Observer
const sectionObserver = new IntersectionObserver(revealSection, {
  root: null,
  threshold: 0.15,
});

// Observing Each Section
allSections.forEach(function (section) {
  sectionObserver.observe(section);
  // section.classList.add('section--hidden');
});

///////////////////////////////////////
// LAZY LOADING IMAGES
const imgTargets = document.querySelectorAll('img[data-src');
// console.log(imgTargets);

const loadImg = function (entries, observer) {
  const [entry] = entries;
  // console.log(entry);

  if (!entry.isIntersecting) return;

  // replace src with data-src
  entry.target.src = entry.target.dataset.src;

  entry.target.addEventListener('load', function () {
    entry.target.classList.remove('lazy-img');
  });

  observer.unobserve(entry.target);
};

const imgObserver = new IntersectionObserver(loadImg, {
  root: null,
  threshold: 0,
  rootMargin: '200px',
});

imgTargets.forEach(img => imgObserver.observe(img));

///////////////////////////////////////
// SLIDER
const slider = function () {
  const slides = document.querySelectorAll('.slide');
  const btnLeft = document.querySelector('.slider__btn--left');
  const btnRight = document.querySelector('.slider__btn--right');
  const dotContainer = document.querySelector('.dots');

  let curntSlide = 0;
  const maxSlide = slides.length;

  // const slider = document.querySelector('.slider');
  // slider.style.transform = 'scale(0.4) translateX(-800px)'; // decreasing size (scale) & aligning to left side (translateX) of images
  // slider.style.overflow = 'visible'; // slides visible side by side

  // slides.forEach((s, i) => (s.style.transform = `translateX(${100 * i}%)`)); - we are using fucntion goToSlide(0)
  // 0%, 100%, 200%, 300%

  // <-- Functions -->
  const createDots = function () {
    slides.forEach(function (_, i) {
      dotContainer.insertAdjacentHTML(
        'beforeend',
        `<button class="dots__dot" data-slide="${i}"></button>`
      );
    });
  };
  // createDots();

  const activateDot = function (slide) {
    document
      .querySelectorAll('.dots__dot')
      .forEach(dot => dot.classList.remove('dots__dot--active'));

    document
      .querySelector(`.dots__dot[data-slide="${slide}"]`)
      .classList.add('dots__dot--active');
  };
  // activateDot(0); // done to activate dot on current slider when page is reloaded

  const goToSlide = function (slide) {
    slides.forEach(
      (s, i) => (s.style.transform = `translateX(${100 * (i - slide)}%)`)
    );
  };
  // goToSlide(0);

  // Next Slide
  const nextSlide = function () {
    if (curntSlide === maxSlide - 1) {
      curntSlide = 0;
    } else {
      curntSlide++;
    }

    goToSlide(curntSlide);
    activateDot(curntSlide);
  };

  const previousSlide = function () {
    if (curntSlide === 0) {
      curntSlide = maxSlide - 1;
    } else {
      curntSlide--;
    }
    goToSlide(curntSlide);
    activateDot(curntSlide);
  };

  const init = function () {
    goToSlide(0);
    createDots();
    activateDot(0);
  };
  init();

  // <--- Event Handlers --->
  btnRight.addEventListener('click', nextSlide);
  btnLeft.addEventListener('click', previousSlide);

  document.addEventListener('keydown', function (e) {
    // console.log(e);
    if (e.key === 'ArrowLeft') previousSlide();
    e.key === 'ArrowRight' && nextSlide();
  });

  // DOT SLIDER
  dotContainer.addEventListener('click', function (e) {
    if (e.target.classList.contains('dots__dot')) {
      const { slide } = e.target.dataset;
      goToSlide(slide);
      activateDot(slide);
    }
  });

  // curntSlide = 1: -100%, 0, 100%, 200%
};
slider();

// This event indicates that the HTML has been completely loaded and parsed, and the DOM tree has been built, but it does not wait for other resources like stylesheets, images, and subframes to finish loading.
document.addEventListener('DOMContentLoaded', function (e) {
  console.log('HTML parsed and DOM tree built!', e);
});

// indicating that the page has fully loaded. This is useful for executing code that should run only after all resources (such as images, stylesheets, and scripts) have been completely loaded.
window.addEventListener('load', function (e) {
  console.log('Page fully loaded', e);
});

// Popup for loss of data - when a user is about to leave a page
// window.addEventListener('beforeunload', function(e) {
//   e.preventDefault(); // Prevent the default behavior
//   console.log(e);
//   e.returnValue = ''; // Set returnValue to trigger a confirmation dialog
// });

/*
////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
LECTURES

///////////////////////////////////////
// SELECTING ELEMENTS -->
console.log(document.documentElement); // html
console.log(document.head); // head
console.log(document.body); // body

const header = document.querySelector('.header');
// '.querySelectorAll' selects all the classes with same class name
const allSections = document.querySelectorAll('.section');
console.log(allSections);

document.getElementById('section--1');
// '.getElementsByTagName' selects all the tags with same tag name
const allButtons = document.getElementsByTagName('button');
console.log(allButtons);

console.log(document.getElementsByClassName('btn'));

///////////////////////////////////////
// CREATING & INSERTING ELEMENTS -->
const message = document.createElement('div');
message.classList.add('cookie-message');
// message.textContent = 'We use cookied for improved functionality and analytics.';

message.innerHTML =
  'We use cookied for improved functionality and analytics. <button class="btn btn--close-cookie">Got it!</button>';

// header.prepend(message); // '.prepend' adds to the first child of element 'header'
header.append(message); // '.append' moves to last child of element 'header'
// header.append(message.cloneNode(true)); // used to add in multiple places

// header.before(message); // adds before header
// header.after(message); // adds after header

///////////////////////////////////////
//  DELETE ELEMENTS -->
document
  .querySelector('.btn--close-cookie')
  .addEventListener('click', function () {
    // message.remove();
    message.parentElement.removeChild(message);
  });

///////////////////////////////////////
//  STYLE -->
message.style.backgroundColor = '#37383d';
message.style.width = '120%';

console.log(message.style.color); // will not show as not defined here
console.log(message.style.backgroundColor); // showing output as defined here

// this will show output as we are using function 'getComputedStyle'
console.log(getComputedStyle(message).color);
console.log(getComputedStyle(message).height);

// increasing the height of the 'Got It!' banner
message.style.height =
  Number.parseFloat(getComputedStyle(message).height, 10) + 30 + 'px';

// changing the color of the '--color-primary' from css
// document.documentElement.style.setProperty('--color-primary', 'orangered');

///////////////////////////////////////
// ATTRIBUTES -->
// standard way :-
// const logo = document.getElementById('logo');
const logo = document.querySelector('.nav__logo');
console.log(logo.alt);
console.log(logo.src); // to get absolute(full) link
console.log(logo.getAttribute('src')); // to get relative(written in HTML) link

logo.alt = 'Beautiful Minimalist logo'; // setting new alt

// non-standard way :-
console.log(logo.designer); // undefined as designer is not standard
console.log(logo.getAttribute('designer')); // getting attribute designer from html as it is defined now
logo.setAttribute('company', 'socialleaf'); // this sets new attribute

// href attrbute
const link = document.querySelector('.nav__link--btn');
console.log(link.href); // to get absolute(full) link
console.log(link.getAttribute('href')); // to get relative(written in HTML) link

// Data attributes - special type of attributes that starts with data
console.log(logo.dataset.versionNumber);

///////////////////////////////////////
// CLASSES -->
// logo.classList.add('c', 'd'); // we can add multiple classes
// logo.classList.remove('');
// logo.classList.toggle('');
// logo.classList.contains('');

// dont uses as this will overwrite all the classnames
// logo.className = 'sayan';

///////////////////////////////////////
// <---- Event Handlers/Listners ---->
const h1 = document.querySelector('h1');

const alertH1 = function (e) {
  alert('addEventListener: GREAT!');
};

h1.addEventListener('mouseenter', alertH1);

setTimeout(() => h1.removeEventListener('mouseenter', alertH1), 3000);

//// Type 1
// h1.onmouseenter = function (e) {
//   alert('onmouseenter: GREAT!');
// };


///////////////////////////////////////
// EVENT PROPAGATION
const randomInt = (min, max) =>
  Math.floor(Math.random() * (max - min + 1) + min);

// rgb(255, 255, 255)
const randomColor = () =>
  `rgb(${randomInt(0, 255)},${randomInt(0, 255)},${randomInt(0, 255)})`;

document.querySelector('.nav__link').addEventListener('click', function (e) {
  this.style.backgroundColor = randomColor();
  console.log('LINK', e.target, e.currentTarget);

  // STOP PROPAGATION - do not propagate to it parent elements
  // e.stopPropagation();
});

document.querySelector('.nav__links').addEventListener('click', function (e) {
  this.style.backgroundColor = randomColor();
  console.log('CONTAINER', e.target, e.currentTarget);
});

document.querySelector('.nav').addEventListener('click', function (e) {
  this.style.backgroundColor = randomColor();
  console.log('NAV', e.target, e.currentTarget);
});


///////////////////////////////////////
// <---- DOM TRAVERSING ---->
const h1 = document.querySelector('h1');

// Going DOWNWARDS: child
console.log(h1.querySelectorAll('.highlight'));
console.log(h1.childNodes);
console.log(h1.children);
h1.firstElementChild.style.color = 'white';
h1.lastElementChild.style.color = 'orangered';

// Going UPWARDS: parent
console.log(h1.parentNode);
console.log(h1.parentElement);

h1.closest('.header').style.background = 'var(--gradient-secondary)';
h1.closest('h1').style.background = 'var(--gradient-primary)';

// Going SIDEWAYS: siblings
console.log(h1.previousElementSibling);
console.log(h1.nextElementSibling);

console.log(h1.previousSibling);
console.log(h1.nextSibling);

console.log(h1.parentElement.children);

[...h1.parentElement.children].forEach(function (el) {
  if (el !== h1) el.style.transform = 'scale(0.5)';
});
*/
