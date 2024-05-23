import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Card, Button } from 'react-bootstrap';


function QuizDetail() {
  const { id_q } = useParams();
  const [quiz, setQuiz] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [score, setScore] = useState(0);
  const [showToast, setShowToast] = useState(false);
  const [isAnswerSelected, setIsAnswerSelected] = useState(false);
  useEffect(() => {
    async function fetchQuiz() {
      try {
        const response = await axios.get(`http://localhost:3000/quiz/getQuizById/${id_q}`);
        setQuiz(response.data.Quiz);
      } catch (error) {
        console.error('Error fetching quiz:', error);
      }
    }
    fetchQuiz();
  }, [id_q]);

  useEffect(() => {
    async function fetchQuestions() {
      try {
        const response = await axios.get(`http://localhost:3000/question/gestionQuiz/${id_q}`);
        setQuestions(response.data.questions);
      } catch (error) {
        console.error('Error fetching questions:', error);
      }
    }
    fetchQuestions();
  }, [id_q]);

  const handleAnswerChange = (answerId) => {
    setAnswers({ ...answers, [currentQuestionIndex]: answerId });
    setIsAnswerSelected(true);
  };
  

  const handleNextQuestion = () => {
    if (isAnswerSelected) {
      setCurrentQuestionIndex(current => current + 1);
      setIsAnswerSelected(false); // Réinitialisez l'état de sélection de réponse pour la prochaine question
    } else {
      // Affichez un message en rouge si aucune réponse n'a été sélectionnée
      alert('Veuillez sélectionner une réponse avant de passer à la question suivante.');
    }
  };
  const handleSubmit = () => {
    let totalScore = 0;
    questions.forEach((question, index) => {
      const correctAnswer = question.reponse_correct;
      const selectedAnswer = answers[index];
      if (correctAnswer === selectedAnswer) {
        totalScore += 2; // Ajoute 2 points pour chaque réponse correcte
      } else {
        // Ajoute 0 points si la réponse est incorrecte
        totalScore += 0;
      }
    });
    setScore(totalScore);
    setShowToast(true);
  };
  
  
  
  
  

  return (
    <div>
      {quiz && (
        <div className="quiz-card text-center mb-4">
          <h1 style={{ color: 'blue', textDecoration: 'underline' }}>{quiz.titre}</h1>
          <p style={{ color: 'blue' }}>{quiz.description}</p>
        </div>
      )}

      <div className="d-flex align-items-center justify-content-center">
        {currentQuestionIndex < questions.length && (
          <Card style={{ width: '18rem' }}>
            <Card.Body>
              <div style={{ fontWeight: 'bold', color: 'green' }}>
                <h3>{questions[currentQuestionIndex].question}</h3>
                <div>
                  <div>
                    <input
                      type="radio"
                      id={`question${currentQuestionIndex}_correct`}
                      name={`question${currentQuestionIndex}`}
                      value={questions[currentQuestionIndex].reponse_correct}
                      checked={answers[currentQuestionIndex] === questions[currentQuestionIndex].reponse_correct}
                      onChange={() => handleAnswerChange(questions[currentQuestionIndex].reponse_correct)}
                    />
                    <label htmlFor={`question${currentQuestionIndex}_correct`}>
                      {questions[currentQuestionIndex].reponse_correct}
                    </label>
                  </div>
                  <div>
                    <input
                      type="radio"
                      id={`question${currentQuestionIndex}_incorrect`}
                      name={`question${currentQuestionIndex}`}
                      value={questions[currentQuestionIndex].reponse_incorect}
                      checked={answers[currentQuestionIndex] === questions[currentQuestionIndex].reponse_incorect}
                      onChange={() => handleAnswerChange(questions[currentQuestionIndex].reponse_incorect)}
                    />
                    <label htmlFor={`question${currentQuestionIndex}_incorrect`}>
                      {questions[currentQuestionIndex].reponse_incorect}
                    </label>
                  </div>
                </div>
              </div>
            </Card.Body>
          </Card>
        )}
        {currentQuestionIndex < questions.length && (
          <Button onClick={handleNextQuestion} style={{ marginLeft: '10px' }}>Suivant</Button>
        )}
        {currentQuestionIndex === questions.length && (
          <Button onClick={handleSubmit} style={{ marginLeft: '10px' }}>Terminer</Button>
        )}
        {/* GIF à côté de la carte */}
        <img src="https://media4.giphy.com/media/v1.Y2lkPTc5MGI3NjExN3JzZzkwNW5oNnZpc2lnajZrNzBnYW9qajFsZ3hiZmZqb3ZpcDZ6ZiZlcD12MV9naWZzX3NlYXJjaCZjdD1n/8zjxfpuutpJFRnlM2h/200.webp" alt="gif" style={{ width: '400px', marginLeft: '10px', height: '160%', objectFit: 'cover' }} />
      </div>

      {score > 0 && <p className="text-center mt-4">Votre score: {score}/{questions.length * 2}</p>}

      {showToast && (
        <div className="toast" role="alert" aria-live="assertive" aria-atomic="true">
          <div className="toast-header">
            <strong className="me-auto">Résultat</strong>
          </div>
          <div className="toast-body">
            {score}/{questions.length * 2} - Votre score est de {score}.
          </div>
        </div>
      )}

      <style>{`
        .quiz-card {
          background-color: #f0f0f0;
          padding: 20px;
          border-radius: 10px;
          width: 400px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-left: 500px;
          margin-top: 16px;
        }
        .toast {
          position: fixed;
          top: 10px;
          right: 10px;
          background-color: #007bff;
          color: white;
        }
      `}</style>
    </div>
  );
}

export default QuizDetail;
