document.addEventListener("DOMContentLoaded", function () {
    const questionForm = document.getElementById("question-form");
    questionForm.addEventListener("submit", function (e) {
      e.preventDefault();
  
      const title = document.getElementById("title").value;
      const description = document.getElementById("description").value;
      const category = document.getElementById("category").value;
      const complexity = document.getElementById("complexity").value;
  
      const question = {
        id: Date.now(), // using timestamp as a simple unique ID
        title: title,
        description: description,
        category: category,
        complexity: complexity
      };
  
      addQuestionToLocalStorage(question);
      displayQuestions();
    });
  
    displayQuestions();
  });
  
  function addQuestionToLocalStorage(question) {
    let questions = JSON.parse(localStorage.getItem("questions")) || [];
    questions.push(question);
    localStorage.setItem("questions", JSON.stringify(questions));
  }
  
  function displayQuestions() {
    const questions = JSON.parse(localStorage.getItem("questions")) || [];
    const tbody = document.querySelector("#question-list tbody");
    tbody.innerHTML = ""; // clear existing rows
  
    questions.forEach((question) => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
            <td><a href="#" onclick="viewQuestion(${question.id})">${question.title}</a></td>
            <td>${question.complexity}</td>
            <td>
                <button onclick="viewQuestion(${question.id})">View</button>
                <button onclick="deleteQuestion(${question.id})">Delete</button>
            </td>
        `;
      tbody.appendChild(tr);
    });
  }
  
  function viewQuestion(id) {
    const questions = JSON.parse(localStorage.getItem('questions')) || [];
    const question = questions.find(q => q.id === id);

    if (question) {
        document.getElementById('detail-title').textContent = question.title;
        document.getElementById('detail-description').textContent = question.description;
        document.getElementById('detail-category').textContent = question.category;
        document.getElementById('detail-complexity').textContent = question.complexity;

        // Set values in the edit form
        document.getElementById('edit-title').value = question.title;
        document.getElementById('edit-description').value = question.description;
        document.getElementById('edit-category').value = question.category;
        document.getElementById('edit-complexity').value = question.complexity;

        // Store the current question ID for editing
        document.getElementById('edit-form').dataset.id = question.id;

        // Show the question details section and hide others
        document.getElementById('question-details').style.display = 'block';
        document.getElementById('add-question').style.display = 'none';
        document.getElementById('question-list').style.display = 'none';
    }
}

function showEditForm() {
  document.getElementById('edit-form').style.display = 'block';
}

function hideEditForm() {
  document.getElementById('edit-form').style.display = 'none';
}

document.getElementById('edit-form').addEventListener('submit', function(e) {
  e.preventDefault();

  const id = parseInt(this.dataset.id, 10);
  const title = document.getElementById('edit-title').value;
  const description = document.getElementById('edit-description').value;
  const category = document.getElementById('edit-category').value;
  const complexity = document.getElementById('edit-complexity').value;

  const updatedQuestion = {
      id: id,
      title: title,
      description: description,
      category: category,
      complexity: complexity
  };

  updateQuestionInLocalStorage(updatedQuestion);
  displayQuestions();
  hideQuestionDetails();
});

function updateQuestionInLocalStorage(updatedQuestion) {
  let questions = JSON.parse(localStorage.getItem('questions')) || [];
  const index = questions.findIndex(q => q.id === updatedQuestion.id);
  if (index !== -1) {
      questions[index] = updatedQuestion;
      localStorage.setItem('questions', JSON.stringify(questions));
  }
}

function hideQuestionDetails() {
    // Hide the question details section and show the list and add sections
    document.getElementById('question-details').style.display = 'none';
    document.getElementById('add-question').style.display = 'block';
    document.getElementById('question-list').style.display = 'block';
}

  
function deleteQuestion(id) {
  let questions = JSON.parse(localStorage.getItem("questions")) || [];
  questions = questions.filter((question) => question.id !== id);
  localStorage.setItem("questions", JSON.stringify(questions));
  displayQuestions(); // refresh the list after deletion
}
  