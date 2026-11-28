// ==========================================================
// CALENDAR — calendar.html only
// ==========================================================
function initCalendar() {
    const calendarDays = document.getElementById('calendarDays');
    const monthYearEl = document.getElementById('monthYear');
    const closestTasksList = document.getElementById('closestTasksList');
    const selectedDayEl = document.getElementById('selectedDay');
    const taskInput = document.getElementById('taskInput');
    const saveTaskBtn = document.getElementById('saveTaskBtn');

    let calendarTasks = JSON.parse(localStorage.getItem('calendarTasks')) || [];
    let selectedDate = null; // "YYYY-MM-DD"

    let currentYear = new Date().getFullYear();
    let currentMonth = new Date().getMonth();

    const monthNames = ["January", "February", "March", "April", "May", "June",
                        "July", "August", "September", "October", "November", "December"];

    function renderDays(year, month) {
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        const firstDayWeekday = new Date(year, month, 1).getDay(); // 0 = Sunday
        monthYearEl.textContent = `${monthNames[month]} ${year}`;
        calendarDays.innerHTML = '';

        // Empty cells before the 1st
        for (let i = 0; i < firstDayWeekday; i++) {
            const empty = document.createElement('div');
            empty.className = 'day-cell empty';
            calendarDays.appendChild(empty);
        }

        const today = new Date();
        for (let day = 1; day <= daysInMonth; day++) {
            const dayCell = document.createElement('div');
            dayCell.className = 'day-cell';
            dayCell.textContent = day;
            dayCell.dataset.day = day;
            dayCell.dataset.month = month;
            dayCell.dataset.year = year;

            const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
            if (selectedDate === dateStr) {
                dayCell.classList.add('selected');
            }
            if (dateStr === `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`) {
                dayCell.style.border = "2px solid #45d8ee";
            }

            dayCell.addEventListener('click', () => selectDay(dayCell));
            calendarDays.appendChild(dayCell);
        }
    }

    function selectDay(dayCell) {
        // Remove previous selection
        Array.from(calendarDays.children).forEach(c => c.classList.remove('selected'));
        dayCell.classList.add('selected');

        const day = dayCell.dataset.day;
        const month = dayCell.dataset.month;
        const year = dayCell.dataset.year;
        selectedDate = `${year}-${String(month < 10 ? '0' : '') + month}-${String(day < 10 ? '0' : '') + day}`;

        selectedDayEl.textContent = `Day ${day} of ${month}/${year}`;

        // Show tasks for this day in the textarea
        const dayTasks = calendarTasks.filter(t => t.date === selectedDate);
        taskInput.value = dayTasks.map(t => t.text).join('\n');

        renderClosestTasks();
    }

    function renderClosestTasks() {
        // Closest / approaching = tasks sorted by date ascending (soonest first)
        const sorted = [...calendarTasks].sort((a, b) => new Date(a.date) - new Date(b.date));
        closestTasksList.innerHTML = '';
        if (sorted.length === 0) {
            closestTasksList.innerHTML = '<li>No tasks yet.</li>';
            return;
        }
        sorted.forEach(t => {
            const li = document.createElement('li');
            li.textContent = `${t.date.slice(5)}: ${t.text}`;
            closestTasksList.appendChild(li);
        });
    }

    // Month navigation
    const navWrapper = document.createElement('div');
    navWrapper.style.display = 'flex';
    navWrapper.style.justifyContent = 'space-between';
    navWrapper.style.alignItems = 'center';
    navWrapper.style.marginBottom = '10px';

    const prevBtn = document.createElement('button');
    prevBtn.textContent = '‹ Prev Month';
    prevBtn.style.padding = '6px 12px';

    const nextBtn = document.createElement('button');
    nextBtn.textContent = 'Next Month ›';
    nextBtn.style.padding = '6px 12px';

    const topCal = document.querySelector('.top-cal');
    navWrapper.appendChild(prevBtn);
    navWrapper.appendChild(nextBtn);

    // Insert nav before monthYear (while monthYearEl is still a direct child of topCal)
    topCal.insertBefore(navWrapper, monthYearEl);
    // Then move monthYearEl into the nav wrapper (between the buttons)
    navWrapper.insertBefore(monthYearEl, nextBtn);

    prevBtn.addEventListener('click', () => {
        currentMonth--;
        if (currentMonth < 0) {
            currentMonth = 11;
            currentYear--;
        }
        renderDays(currentYear, currentMonth);
        // Re-select if the previously selected date is still visible
        if (selectedDate) {
            const sel = new Date(selectedDate);
            if (sel.getFullYear() === currentYear && sel.getMonth() === currentMonth) {
                const dayNum = sel.getDate();
                const cell = Array.from(calendarDays.children).find(
                    c => !c.classList.contains('empty') && c.textContent == dayNum
                );
                if (cell) selectDay(cell);
            } else {
                selectedDate = null;
                selectedDayEl.textContent = 'Select a day';
                taskInput.value = '';
            }
        }
        renderClosestTasks();
    });

    nextBtn.addEventListener('click', () => {
        currentMonth++;
        if (currentMonth > 11) {
            currentMonth = 0;
            currentYear++;
        }
        renderDays(currentYear, currentMonth);
        if (selectedDate) {
            const sel = new Date(selectedDate);
            if (sel.getFullYear() === currentYear && sel.getMonth() === currentMonth) {
                const dayNum = sel.getDate();
                const cell = Array.from(calendarDays.children).find(
                    c => !c.classList.contains('empty') && c.textContent == dayNum
                );
                if (cell) selectDay(cell);
            } else {
                selectedDate = null;
                selectedDayEl.textContent = 'Select a day';
                taskInput.value = '';
            }
        }
        renderClosestTasks();
    });

    // Initial render: current month
    renderDays(currentYear, currentMonth);

    // Select today by default
    const todayCell = Array.from(calendarDays.children).find(
        c => !c.classList.contains('empty') && c.textContent == new Date().getDate()
    );
    if (todayCell) selectDay(todayCell);

    // Save task for the selected day
    saveTaskBtn.addEventListener('click', () => {
        const text = taskInput.value.trim();
        if (!text || !selectedDate) return;

        calendarTasks.push({
            id: Date.now(),
            date: selectedDate,
            text: text
        });
        localStorage.setItem('calendarTasks', JSON.stringify(calendarTasks));

        taskInput.value = '';
        renderClosestTasks();

        // Re-select to refresh the textarea with the new task included
        const dayNum = selectedDate.split('-')[2];
        const cell = Array.from(calendarDays.children).find(
            c => !c.classList.contains('empty') && c.textContent == parseInt(dayNum, 10)
        );
        if (cell) selectDay(cell);
    });
}

if (window.location.pathname.includes('calendar.html')) {
    initCalendar();
}
