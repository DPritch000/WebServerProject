// Exercise Tracker Application

class ExerciseTracker {
    constructor() {
        this.exercises = this.loadExercises();
        this.initEventListeners();
        this.setTodayDate();
        this.render();
    }

    // Load exercises from local storage
    loadExercises() {
        const stored = localStorage.getItem('exercises');
        return stored ? JSON.parse(stored) : [];
    }

    // Save exercises to local storage
    saveExercises() {
        localStorage.setItem('exercises', JSON.stringify(this.exercises));
    }

    // Initialize event listeners
    initEventListeners() {
        const form = document.getElementById('exerciseForm');
        form.addEventListener('submit', (e) => this.handleFormSubmit(e));
    }

    // Set today's date as default
    setTodayDate() {
        const today = new Date().toISOString().split('T')[0];
        document.getElementById('exerciseDate').value = today;
    }

    // Handle form submission
    handleFormSubmit(e) {
        e.preventDefault();

        const exercise = {
            id: Date.now(),
            name: document.getElementById('exerciseName').value,
            duration: parseInt(document.getElementById('duration').value),
            calories: parseInt(document.getElementById('caloriesBurned').value) || 0,
            date: document.getElementById('exerciseDate').value
        };

        this.exercises.push(exercise);
        this.saveExercises();
        this.render();
        this.resetForm();
    }

    // Reset the form
    resetForm() {
        document.getElementById('exerciseForm').reset();
        this.setTodayDate();
    }

    // Delete an exercise
    deleteExercise(id) {
        this.exercises = this.exercises.filter(ex => ex.id !== id);
        this.saveExercises();
        this.render();
    }

    // Calculate total statistics
    calculateStats() {
        const total = {
            count: this.exercises.length,
            minutes: this.exercises.reduce((sum, ex) => sum + ex.duration, 0),
            calories: this.exercises.reduce((sum, ex) => sum + ex.calories, 0)
        };
        return total;
    }

    // Update statistics display
    updateStats() {
        const stats = this.calculateStats();
        document.getElementById('totalExercises').textContent = stats.count;
        document.getElementById('totalMinutes').textContent = stats.minutes;
        document.getElementById('totalCalories').textContent = stats.calories;
    }

    // Format date for display
    formatDate(dateString) {
        const options = { year: 'numeric', month: 'short', day: 'numeric' };
        return new Date(dateString + 'T00:00:00').toLocaleDateString('en-US', options);
    }

    // Render the exercise list
    renderExerciseList() {
        const listContainer = document.getElementById('exerciseList');

        if (this.exercises.length === 0) {
            listContainer.innerHTML = '<p class="empty-message">No exercises logged yet. Start by adding your first workout!</p>';
            return;
        }

        // Sort exercises by date (newest first)
        const sortedExercises = [...this.exercises].sort((a, b) => 
            new Date(b.date) - new Date(a.date)
        );

        listContainer.innerHTML = sortedExercises.map(exercise => `
            <div class="exercise-item">
                <div class="exercise-content">
                    <div class="exercise-name">${this.escapeHtml(exercise.name)}</div>
                    <div class="exercise-details">
                        <div class="detail-item">
                            <strong>Date:</strong> ${this.formatDate(exercise.date)}
                        </div>
                        <div class="detail-item">
                            <strong>Duration:</strong> ${exercise.duration} mins
                        </div>
                        <div class="detail-item">
                            <strong>Calories:</strong> ${exercise.calories} kcal
                        </div>
                    </div>
                </div>
                <div class="exercise-actions">
                    <button class="btn-delete" onclick="tracker.deleteExercise(${exercise.id})">Delete</button>
                </div>
            </div>
        `).join('');
    }

    // Escape HTML to prevent XSS
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    // Main render function
    render() {
        this.updateStats();
        this.renderExerciseList();
    }
}

// Initialize the tracker when the page loads
let tracker;
document.addEventListener('DOMContentLoaded', () => {
    tracker = new ExerciseTracker();
});
