// console.log('Snackbar script loaded');
import iziToast from "izitoast";
import "izitoast/dist/css/iziToast.min.css";


const form = document.querySelector(".form");

form.addEventListener("submit", e => {
  e.preventDefault();

  const delay = Number(form.elements.delay.value);
  const state = form.elements.state.value;
if (delay <= 0 || isNaN(delay)) {
  iziToast.warning({
    title: '⚠️',
    message: 'Please enter a positive delay in ms',
    position: 'topRight',
  });
  return;
}

  createPromise(delay, state)
    .then(result => {
      iziToast.success({
        title: '✅',
        message: `Fulfilled promise in ${result}ms`,
        position: 'topRight',
      });
    })
    .catch(error => {
      iziToast.error({
        title: '❌',
        message: `Rejected promise in ${error}ms`,
        position: 'topRight',
      });
      form.reset(); // Скидаємо форму після помилки
    });
});

function createPromise(delay, state) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      state === "fulfilled" ? resolve(delay) : reject(delay);
    }, delay);
  });
}


