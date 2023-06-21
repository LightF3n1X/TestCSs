// Initialize Firebase
const firebaseConfig = {
  apiKey: "AIzaSyBr0TrlUw0qzYsi0TQMMwQz5pNfwGc7hg0",
  authDomain: "testuvalnik.firebaseapp.com",
  databaseURL: "https://testuvalnik-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "testuvalnik",
  storageBucket: "testuvalnik.appspot.com",
  messagingSenderId: "286878960460",
  appId: "1:286878960460:web:c3bdeeca8546f34b6b9de9"
};

firebase.initializeApp(firebaseConfig);

function addAnswer(answerContainer) {
  var answerInput = document.createElement('input');
  answerInput.type = 'text';
  answerInput.className = 'answer-input';
  answerInput.placeholder = 'Введіть відповідь...';

  var answerGroup = document.createElement('div');
  answerGroup.className = 'answer-group';
  answerGroup.appendChild(answerInput);

  var addAnswerBtn = document.createElement('button');
  addAnswerBtn.className = 'add-answer-btn';
  addAnswerBtn.textContent = 'Додати варіант відпоіді';
  addAnswerBtn.addEventListener('click', function () {
    addAnswer(answerContainer);
  });

  var removeAnswerBtn = document.createElement('button');
  removeAnswerBtn.className = 'remove-answer-btn';
  removeAnswerBtn.textContent = 'Прибрати варіант відповіді';
  removeAnswerBtn.addEventListener('click', function () {
    removeAnswer(answerContainer, answerGroup);
  });

  var markAnswerBtn = document.createElement('button');
  markAnswerBtn.className = 'mark-answer-btn';
  markAnswerBtn.textContent = 'Позначити відповідь як істинну';
  markAnswerBtn.addEventListener('click', function () {
    markAnswer(answerContainer, answerInput);
  });

  answerGroup.appendChild(addAnswerBtn);
  answerGroup.appendChild(removeAnswerBtn);
  answerGroup.appendChild(markAnswerBtn);

  answerContainer.appendChild(answerGroup);
}



function removeAnswer(answerContainer, answerInput) {
  answerContainer.removeChild(answerInput);
  var addAnswerBtn = answerContainer.getElementsByClassName('add-answer-btn')[0];
  var removeAnswerBtn = answerContainer.getElementsByClassName('remove-answer-btn')[0];
  var markAnswerBtn = answerContainer.getElementsByClassName('mark-answer-btn')[0];
  answerContainer.removeChild(addAnswerBtn);
  answerContainer.removeChild(removeAnswerBtn);
  answerContainer.removeChild(markAnswerBtn);
}

function markAnswer(answerContainer, answerInput) {
  var answerInputs = answerContainer.getElementsByClassName('answer-input');

  for (var i = 0; i < answerInputs.length; i++) {
    if (answerInputs[i] === answerInput) {
      answerInputs[i].classList.toggle('true-answer');
    } else {
      answerInputs[i].classList.remove('true-answer');
    }
  }
}

function addQuestion() {
  var questionsContainer = document.getElementById('questions-container');

  var questionContainer = document.createElement('div');
  questionContainer.className = 'question-container';

  var questionInput = document.createElement('input');
  questionInput.type = 'text';
  questionInput.className = 'question-input';
  questionInput.placeholder = 'Введіть запитання...';

  var answerContainer = document.createElement('div');
  answerContainer.className = 'answer-container';
  answerContainer.style.display = 'none'; // Hide the answer container initially

  var addAnswerBtn = document.createElement('button');
  addAnswerBtn.className = 'add-answer-btn';
  addAnswerBtn.textContent = 'Додати варіант відповіді';
  addAnswerBtn.addEventListener('click', function () {
    addAnswer(answerContainer);
  });

  var markAnswerBtn = document.createElement('button');
  markAnswerBtn.className = 'mark-answer-btn';
  markAnswerBtn.textContent = 'Позначити відповідь як істинну';
  markAnswerBtn.addEventListener('click', function () {
    markAnswer(answerContainer, questionInput);
  });

  // Function to show the question and answer fields when the "Add Question" button is clicked
  function showQuestionAndAnswerFields() {
    questionInput.style.display = 'block';
    answerContainer.style.display = 'block';
    addAnswerBtn.style.display = 'inline-block';
    markAnswerBtn.style.display = 'inline-block';
    addQuestionBtn.removeEventListener('click', showQuestionAndAnswerFields);
  }

  var addQuestionBtn = document.getElementById('add-question-btn');
  addQuestionBtn.addEventListener('click', showQuestionAndAnswerFields);

  answerContainer.appendChild(addAnswerBtn);
  answerContainer.appendChild(markAnswerBtn);

  questionContainer.appendChild(questionInput);
  questionContainer.appendChild(answerContainer);

  questionsContainer.appendChild(questionContainer);
  questionsContainer.appendChild(document.createElement('br')); // Add a line break after each question
}

function submitQuestions() {
  var questionsContainer = document.getElementById('questions-container');
  var questionContainers = questionsContainer.getElementsByClassName('question-container');

  var testNameInput = document.getElementById('test-name-input');
  var testName = testNameInput.value.trim();

  if (testName === '') {
    alert('Please enter a test name');
    return;
  }

  for (var i = 0; i < questionContainers.length; i++) {
    var questionInput = questionContainers[i].getElementsByClassName('question-input')[0];
    var answerInputs = questionContainers[i].getElementsByClassName('answer-input');

    var question = questionInput.value.trim();

    // Skip the question if it is empty
    if (question === '') {
      continue;
    }

    var answersData = []; // Array to store the answers for saving to Firebase

    for (var j = 0; j < answerInputs.length; j++) {
      var answer = answerInputs[j].value.trim();

      // Skip the answer if it is empty
      if (answer === '') {
        continue;
      }

      var isTrue = answerInputs[j].classList.contains('true-answer');

      // Save answer data to the array
      var answerData = {
        answer: answer,
        isTrue: isTrue
      };
      answersData.push(answerData);
    }

    // Save the question and answers to Firebase Realtime Database
    if (answersData.length > 0) {
      var testsRef = firebase.database().ref('Tests');
      var newTestRef = testsRef.child(testName);
      var newQuestionRef = newTestRef.child(question);
      newQuestionRef.set(answersData);
    }
  }

  alert('Questions submitted successfully!');
  testNameInput.value = '';
}

document.addEventListener('DOMContentLoaded', function () {
  var addQuestionBtn = document.getElementById('add-question-btn');
  addQuestionBtn.addEventListener('click', addQuestion);

  var submitQuestionsBtn = document.getElementById('submit-questions-btn');
  submitQuestionsBtn.addEventListener('click', submitQuestions);
});

