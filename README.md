# Quiz Challenge

## Links

Deployed quiz game: [https://andrenrwn.github.io/quizchallenge](https://andrenrwn.github.io/quizchallenge)

Repository: [https://github.com/andrenrwn/quizchallenge](https://github.com/andrenrwn/quizchallenge)

## About

This application implements a question and answer quiz game.
Users click on the "Start the Quiz" button to begin the quiz and start the timer.
Users click on multiple-choice questions, which will be evaluated and added to their score and open the next question card.
A quiz session will end when the time limit expires, or the user reaches the finish card.
Users can enter their initials to record their high score.
Quiz questions are presented in random order.

![running quiz](./images/screenshot_a.png)

Previous quiz questions and their results are stored in stacked cards. Previous cards can be pulled up to view the results.

![cards can be pulled up](./images/screenshot_b.png)

## Quiz questions

Quiz questions are stored in the .html itself, under the **#quizdata** main.
    <main id="quizdata">

Question cards are stored in sections with the .quiz class.
Answers are marked with the existence of a data-answer attribute, which is worth 1 point, or the specified data-answer value.

        <section class="quiz">
            <p>Commonly used data types do <em>NOT</em> include:</p>
            <ul>
                <li>strings</li>
                <li>booleans</li>
                <li data-answer>alerts</li>
                <li>numbers</li>
            </ul>
        </section>

        <section class="quiz">
            <p>Arrays in Javascript can be used to store:</p>
            <ul>
                <li data-answer="0.25">numbers and strings</li>
                <li data-answer="0.25">other arrays</li>
                <li data-answer="0.25">booleans</li>
                <li data-answer>all are correct</li>
            </ul>
        </section>

## Quiz timer

The quiz needs to be completed within a time limit shown in the countdown timer.
If the countdown timer expires, the quiz ends and the user is presented with the last card.
The quiz time limit is configured in the #timetotal span.
If the user answers incorrectly, the time deduction is set in #timededuct.

        <section class="start">
            <h3>Welcome to the Quiz!<br>Topic: JavaScript</h3>
            Time limit: <span id="timetotal">30</span> seconds.<br>
            Wrong answers deduct <span id="timededuct">5</span> seconds.<br>
            Are you ready?</p>
            <ul>
                <li>Start the quiz</li>
            </ul>
        </section>

## High Scores

High scores are stored in the browser's localstorage.
High scores are kept for each user initial. The high score table can be cleared with **reset high scores** button.
You can debug this with the browser's dev tools (F12), go to Applications -> Storage -> Local Storage -> highscores to manage the records.

![high score table](./images/screenshot_c.png)

## Credits

Pullup cards: Modified from colin's codepen: https://codepen.io/colin/pen/bdxoZL
Accordion animation: Incorporated Mamboleoo's codepen: https://codepen.io/Mamboleoo/pen/QWEpLqm
Color palette heler: https://paletton.com/#uid=54h0u0kowpcbHF6iItiszj4D7b-

## Others

Previous versions are stored in scratch/perspective
https://andrenrwn.github.io/quizchallenge/scratch/