document.addEventListener('DOMContentLoaded', function () {


    //TODO: rendere il pulsante reset hidden all'inizio perchè da problemi 
    //TODO: Eliminare il tasto pausa
    //TODO: Eliminare animazioni inutili


    // Variables
    let workDuration = 25 * 60;
    let breakDuration = 5 * 60;

    let sessionNumber = 1;

    let timeLeft = 25 * 60;
    let timeSpent = 0;
    let sessionCounter = 0;


    let typeSession = "work";
    let currentTypeSession = "base";

    //Animation Variables
    let isAnimationRunning = false;
    let animationInterval;



    let workDurationInput = document.getElementById('input-work-duration');
    let breakDurationInput = document.getElementById('input-break-duration');
    let sessionNumberInput = document.getElementById('input-session-number');


    workDurationInput.value = "25";
    breakDurationInput.value = "5";
    sessionNumberInput.value = "1";

    let updateWorkDuration;
    let updateBreakDuration;
    let updateSessionNumber;

    // Update Durations
    workDurationInput.addEventListener('input', function () {
        updateWorkDuration = minToSec(this.value);
    });

    breakDurationInput.addEventListener('input', function () {
        updateBreakDuration = minToSec(this.value);
    }
    );

    sessionNumberInput.addEventListener('input', function () {
        updateSessionNumber = minToSec(this.value);
    }
    );

    // Minuts to seconds
    const minToSec = (min) => {
        return min * 60;
    }

    // buttons
    const startBtn = document.getElementById('start-btn');
    const resetBtn = document.getElementById('reset-btn');



    let isClockRunning = false;
    let isClockStopped = true;

    // Buttons functions
    startBtn.addEventListener('click', function () {
        // add class show to resetBtn
        resetBtn.classList.add("show");
        startBtn.classList.add("hide");
        currentTypeSession = "work";
        startAnimation();

        if (isClockRunning) {
            return;
        } else {

            isClockRunning = true;
            isClockStopped = false;
            swithClockState();
        }
    });


    resetBtn.addEventListener('click', function () {
        currentTypeSession = "base";
        resetBtn.classList.remove("show");
        startBtn.classList.remove("hide");
        stopAnimation();
        changeTheme();

        document.getElementById("callsign").innerHTML = "Pomodoro Timer";
        // caso di bug
        setTimeout(() => {
            document.getElementById("callsign").innerHTML = "Pomodoro Timer";
            changeTheme();
        }, 2000);

        swithClockState(true);
    });




    // Timer functions 
    const swithClockState = (reset) => {
        if (reset == true) {
            resetClock();
        } else {

            updateTimerValues();
            if (isClockRunning) {
                clockTimer = setInterval(() => {
                    changeSession(); // update the session and time left
                    displayCurrentTimeLeft(); // update the display
                }, 1000);

            } else {
                clearInterval(clockTimer);
                updateTimerValues();

            }
        }
    };

    const resetClock = () => {
        currentTypeSession = "base";
        stopAnimation();
        updateTimerValues();
        clearInterval(clockTimer);
        isClockRunning = false;
        isClockStopped = true;
        sessionCounter = 0;
        workDuration = minToSec(workDurationInput.value);
        breakDuration = minToSec(breakDurationInput.value);
        sessionNumber = sessionNumberInput.value;
        typeSession = "work";
        timeSpent = 0;
        displayCurrentTimeLeft();

    };


    const displayCurrentTimeLeft = () => {
        let output = "";
        const secondsLeft = timeLeft;
        const minutes = Math.floor(secondsLeft / 60);
        const seconds = secondsLeft % 60;
        let hours = Math.floor(minutes / 60);

        function addZero(time) {
            return time < 10 ? `0${time}` : time;
        }
        if (hours > 0) {
            resurlt += `${hours}:`;
        }
        output += `${addZero(minutes)}:${addZero(seconds)}`;
        document.getElementById("time-display").textContent = output.toString();  // display !!!

    }

    const changeSession = () => {
        if (timeLeft > 0) {
            timeLeft--;
            timeSpent++;
        } else if (timeLeft == 0) {
            timeSpent = 0;
            console.log("cambio  di session");           // debug
            // change session if i am in work session
            if (typeSession == "work") {
                currentTypeSession = "break"
                typeSession = "break";
                timeLeft = breakDuration;
                updateTimerValues();

            } else {
                sessionCounter++;
                // change session if i am in break sessiono
                currentTypeSession = "work";
                typeSession = "work";
                timeLeft = workDuration;
                updateTimerValues();
            }
            if (sessionCounter == sessionNumber) {
                currentTypeSession = "base";
                console.log("fineeee");           // debug
                resetClock();
            }
        }
        displayCurrentTimeLeft();
    }

    const updateTimerValues = () => {
        if (typeSession == "work") {
            timeLeft = updateWorkDuration ? updateWorkDuration : workDuration;
            workDuration = timeLeft;
        }
        else {
            timeLeft = updateBreakDuration ? updateBreakDuration : breakDuration;
            breakDuration = timeLeft;
            currentTypeSession = "break";
        }
    };











    // animated text

    const restArray = [
        "Rest and recharge.",
        "Gift yourself rest.",
        "Relax your body, calm your mind.",
    ];
    const workArray = [
        "Focus sharpens your path to success.",
        "Focus for success.",
        "Clear mind, high productivity.",
        "Focus on what matters most.",
        "Concentration conquers challenges.",
        "Determined focus overcomes all.",
        "Breathe. Center. Focus.",
    ]


    function showAnimation() {
        var AnimationText = document.getElementById("callsign");
        if (!isAnimationRunning) {
            AnimationText.innerHTML = "Pomodoro Timer";
            return;
        }

        AnimationText.classList.remove("animate-in");
        AnimationText.classList.add("animate-out");

        let arrayToUse;

        if (currentTypeSession == "work") {
            arrayToUse = workArray;
        }
        else if (currentTypeSession == "break") {
            arrayToUse = restArray;
        }

        setTimeout(function () {
            let i = Math.floor(Math.random() * arrayToUse.length);
            AnimationText.innerHTML = arrayToUse[i];
            AnimationText.classList.remove("animate-out");
            AnimationText.classList.add("animate-in");
        }, 1500);
    }

    function stopAnimation() {
        isAnimationRunning = false;
        clearInterval(animationInterval);
        if (currentTypeSession == "base") {
            document.getElementById("callsign").innerHTML = "Pomodoro Timer";
        }
    }

    function startAnimation() {
        if (isAnimationRunning) {
            return;
        }
        isAnimationRunning = true;
        animationInterval = setInterval(showAnimation, 3000);
    }

    // line progress bar

    // calculate the progress percentage
    const calculateProgress = () => {
        const settionDuration = typeSession === "work" ? workDuration : breakDuration;
        let progress = ((settionDuration - timeSpent) / settionDuration) * 100;
        return progress;
    }



    let interval = setInterval(() => {
        //const settionDuration = typeSession === "work" ? workDuration : breakDuration;
        let percentage = 100 - calculateProgress();
        document.querySelector(".percentage-bar h1").innerHTML = percentage.toFixed(0) + "%";
        document.querySelector(".percentage-bar hr").style.width = percentage.toFixed(2) + "%";
    }, 1000)


    // chande color and theme according to the session // Break
    // linear-gradient(to right, #7bcabb, #edc531, #453b16, #b6a373)  background-color di p
    // #baad23  color progress bar
    // antiquewhite    background-color container
    // rgb(227 97 97)  background-color button
    // #000  color button
    // RED  botton hover
    // #000  lable color
    // h1 #1c37ab

    // work session

    let p = document.querySelectorAll("p");
    let container = document.querySelector("#container");
    let button = document.querySelectorAll("button");
    let label = document.querySelectorAll("label");
    let hr = document.querySelector("hr");
    let h1 = document.querySelector("h1");

    let purple = "rgb(123, 31, 162)";
    let violet = "  rgb(103, 58, 183)";
    let pink = " rgb(244, 143, 177)";

    let buttonHoverCssWork = `button:hover{
        background-color: ${purple};
        color: rgb(255, 255, 255);
        text-shadow: 0 0 15px ${purple}, 0 0 40px ${purple}; } `;

    let buttonHoverCssBrak = `button:hover{
        background-color: red;
        color: rgb(255, 255, 255);
       text-shadow: 0 0 15px ${purple}, 0 0 40px ${purple}; } `;

    function changeTheme() {
        if (currentTypeSession == "break") {
            p.forEach(element => {
                element.style.background = "linear-gradient(to right, #7bcabb, #edc531, #453b16, #b6a373)";
            });
            hr.style.color = "#baad23";
            container.style.backgroundColor = "antiquewhite";
            button.forEach(element => {
                element.style.backgroundColor = "rgb(227, 97, 97)";
                element.style.color = "#000";
                element.style.transition = "0.5s";
                element.style.cssText = buttonHoverCssBrak;

            });
            label.forEach(element => {
                element.style.color = "#000";
            });
            h1.style.color = "#1c37ab";

        }


        else {
            p.forEach(element => {
                element.style.background = `linear-gradient(to right,${purple} ,${violet}, ${pink}, #6b3980)`;
            });
            hr.style.color = "#f60d54";
            container.style.backgroundColor = "rgb(10, 10, 10)";
            button.forEach(element => {
                element.style.backgroundColor = "rgb(45,45,45,1)";
                element.style.color = "#999";
                element.style.transition = "0.5s";
                element.style.cssText = buttonHoverCssWork;

            });
            label.forEach(element => {
                element.style.color = "white";
            });
            h1.style.color = "white";
        }


    }

    // call the function
    setInterval(() => {
        changeTheme();
    }, 3000);
});