// console.log('Timer module loaded');
// Описаний в документації
import flatpickr from "flatpickr";
// Додатковий імпорт стилів
import "flatpickr/dist/flatpickr.min.css";

import iziToast from"izitoast";
import "izitoast/dist/css/iziToast.min.css";

// Зберігання обраної дати
let userSelectedDate = null;

const startBtn = document.querySelector("[data-start]");
startBtn.disabled = true;

const options = {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  onClose(selectedDates) {
    // 💡 Завжди починаємо з reset кнопки(скидаємо кнопку на початку)
    startBtn.disabled = true;

    const selectedDate = selectedDates[0];

    if (selectedDate <= new Date()) {
      iziToast.warning({
        title: "Oops",
        message: "Please choose a date in the future",
        position: "topRight",
        transitionIn: "fadeInDown",
  transitionOut: "fadeOutUp",
  timeout: 3000,
      });
      return;
    }

    //Якщо дата валідна — активуємо кнопку дозволяємо запустити таймер і зберігаємо дату
    startBtn.disabled = false;
    userSelectedDate = selectedDate;
  },
};


flatpickr("#datetime-picker", options); // Ось той “системний рядок”!

startBtn.addEventListener("click", () => {
  startBtn.disabled = true;
  document.querySelector("#datetime-picker").disabled = true;

  const intervalId = setInterval(() => {
    const currentTime = new Date();
    const timeDiff = userSelectedDate - currentTime;

    if (timeDiff <= 0) {
      clearInterval(intervalId);
      startBtn.disabled = true;

      updateTimerDisplay({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      document.querySelector("#datetime-picker").disabled = false;
      return;
    }

    const timeLeft = convertMs(timeDiff);
    updateTimerDisplay(timeLeft);
  }, 1000);
});
function updateTimerDisplay({ days, hours, minutes, seconds }) {
  document.querySelector("[data-days]").textContent = addLeadingZero(days);
  document.querySelector("[data-hours]").textContent = addLeadingZero(hours);
  document.querySelector("[data-minutes]").textContent = addLeadingZero(minutes);
  document.querySelector("[data-seconds]").textContent = addLeadingZero(seconds);
}

function addLeadingZero(value) {
  return String(value).padStart(2, "0");
}

// Для підрахунку значень використовуємо готову функцію convertMs,

function convertMs(ms) {
  // Number of milliseconds per unit of time
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  // Remaining days
  const days = Math.floor(ms / day);
  // Remaining hours
  const hours = Math.floor((ms % day) / hour);
  // Remaining minutes
  const minutes = Math.floor(((ms % day) % hour) / minute);
  // Remaining seconds
  const seconds = Math.floor((((ms % day) % hour) % minute) / second);

  return { days, hours, minutes, seconds };
}

console.log(convertMs(2000)); // {days: 0, hours: 0, minutes: 0, seconds: 2}
console.log(convertMs(140000)); // {days: 0, hours: 0, minutes: 2, seconds: 20}
console.log(convertMs(24140000)); // {days: 0, hours: 6 minutes: 42, seconds: 20}

