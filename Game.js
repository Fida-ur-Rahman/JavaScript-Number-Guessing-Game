       // Game variables
        let secretNumber;
        let attempts;
        let maxAttempts = 10;
        let gameOver = false;
        let bestScore = localStorage.getItem('bestScore') || null;

        // DOM elements
        const guessInput = document.getElementById('guess-input');
        const guessBtn = document.getElementById('guess-btn');
        const resetBtn = document.getElementById('reset-btn');
        const feedback = document.getElementById('feedback');
        const attemptsCount = document.getElementById('attempts-count');
        const remainingGuesses = document.getElementById('remaining-guesses');
        const bestScoreDisplay = document.getElementById('best-score');
        const attemptsHistory = document.getElementById('attempts-history');

        // Initialize the game
        function initGame() {
            // Generate a random secret number between 1 and 100
            secretNumber = Math.floor(Math.random() * 100) + 1;
            attempts = 0;
            gameOver = false;
            
            // Update UI
            updateGameInfo();
            feedback.innerHTML = "Start by entering your first guess!";
            feedback.style.color = "white";
            attemptsHistory.innerHTML = "";
            guessInput.value = "";
            guessInput.disabled = false;
            guessBtn.disabled = false;
            guessInput.focus();
            
            // Display best score
            if (bestScore) {
                bestScoreDisplay.textContent = bestScore;
            } else {
                bestScoreDisplay.textContent = "--";
            }
            
            console.log(`Secret number: ${secretNumber}`); // For debugging
        }

        // Update game info displays
        function updateGameInfo() {
            attemptsCount.textContent = attempts;
            remainingGuesses.textContent = maxAttempts - attempts;
        }

        // Process the user's guess
        function processGuess() {
            if (gameOver) return;
            
            const userGuess = parseInt(guessInput.value);
            
            // Validate input
            if (isNaN(userGuess) || userGuess < 1 || userGuess > 100) {
                feedback.innerHTML = "Please enter a valid number between 1 and 100!";
                feedback.style.color = "#ff6b6b";
                guessInput.value = "";
                guessInput.focus();
                return;
            }
            
            // Increment attempt count
            attempts++;
            updateGameInfo();
            
            // Add to history
            const attemptItem = document.createElement('div');
            attemptItem.className = 'attempt-item';
            
            // Check guess against secret number
            let resultText = '';
            let feedbackText = '';
            let feedbackColor = '';
            
            if (userGuess === secretNumber) {
                // Correct guess
                gameOver = true;
                resultText = 'Correct!';
                feedbackText = `🎉 Congratulations! You guessed the number in ${attempts} attempts!`;
                feedbackColor = '#4CAF50';
                
                // Update best score if applicable
                if (!bestScore || attempts < bestScore) {
                    bestScore = attempts;
                    localStorage.setItem('bestScore', bestScore);
                    bestScoreDisplay.textContent = bestScore;
                    feedbackText += ` 🏆 New Best Score!`;
                }
                
                // Disable input
                guessInput.disabled = true;
                guessBtn.disabled = true;
            } else if (userGuess < secretNumber) {
                // Guess is too low
                resultText = 'Too Low';
                feedbackText = `${userGuess} is too low. Try a higher number!`;
                feedbackColor = '#ffa726';
            } else {
                // Guess is too high
                resultText = 'Too High';
                feedbackText = `${userGuess} is too high. Try a lower number!`;
                feedbackColor = '#ffa726';
            }
            
            // Update feedback
            feedback.innerHTML = feedbackText;
            feedback.style.color = feedbackColor;
            
            // Add to attempts history
            attemptItem.innerHTML = `
                <span class="attempt-number">#${attempts}: ${userGuess}</span>
                <span class="attempt-result">${resultText}</span>
            `;
            attemptsHistory.prepend(attemptItem);
            
            // Check if max attempts reached
            if (attempts >= maxAttempts && userGuess !== secretNumber) {
                gameOver = true;
                feedback.innerHTML = `💔 Game Over! The secret number was ${secretNumber}. Try again!`;
                feedback.style.color = '#f44336';
                guessInput.disabled = true;
                guessBtn.disabled = true;
            }
            
            // Clear input and focus
            guessInput.value = "";
            guessInput.focus();
        }

        // Event listeners
        guessBtn.addEventListener('click', processGuess);
        
        guessInput.addEventListener('keyup', function(event) {
            if (event.key === 'Enter') {
                processGuess();
            }
        });
        
        resetBtn.addEventListener('click', initGame);
        
        // Initialize the game when page loads
        window.addEventListener('DOMContentLoaded', initGame);