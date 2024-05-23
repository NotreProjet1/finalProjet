import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Card, Button, Form, Input, message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';

const { TextArea } = Input;

const AddQuiz = () => {
  const [quizData, setQuizData] = useState({
    titre: '',
    description: '',
  });

  const [questionData, setQuestionData] = useState({
    question: '',
    reponse_correct: '',
    reponse_incorect: [],
  });

  const [id_quiz, setid_quiz] = useState(null);
  const [showQuestionForm, setShowQuestionForm] = useState(false);
  const [addedQuiz, setAddedQuiz] = useState(null); // Pour stocker les données du quiz ajouté
  const [quizQuestions, setQuizQuestions] = useState([]); // Pour stocker les questions du quiz ajouté
  const [numQuestionsAdded, setNumQuestionsAdded] = useState(1); // Pour suivre le nombre total de questions ajoutées

  useEffect(() => {
    if (id_quiz) {
      // Récupérer les questions associées au quiz ajouté
      const fetchQuizQuestions = async () => {
        try {
          const response = await axios.get(`http://localhost:3000/question/getQuestionsByQuizId/${id_quiz}`);
          setQuizQuestions(response.data.questions);
        } catch (error) {
          console.error('Error fetching quiz questions:', error);
        }
      };

      fetchQuizQuestions();
    }
  }, [id_quiz]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setQuizData({ ...quizData, [name]: value });
  };

  const handleQuestionChange = (e) => {
    const { name, value } = e.target;
    setQuestionData({ ...questionData, [name]: value });
  };

  const handleAddQuiz = async () => {
    try {
      if (!quizData.titre || !quizData.description) {
        message.error('Please fill in all fields');
        return;
      }
  
      const token = localStorage.getItem('token');
  
      if (!token) {
        message.error('Authentication error');
        return;
      }
  
      const config = {
        headers: {
          Authorization: ` ${token}`,
        },
      };
  
      const data = {
        titre: quizData.titre,
        description: quizData.description,
      };
  
      const response = await axios.post('http://localhost:3000/quiz/Add', data, config);
      const id_quiz = response.data.id_quiz;
      setid_quiz(id_quiz);
      setAddedQuiz(quizData); // Stocker les données du quiz ajouté
      setQuizData({ titre: '', description: '' });
      message.success('Quiz added successfully');
      setShowQuestionForm(true);
    } catch (error) {
      console.error('Error adding quiz:', error);
      message.error('Failed to add quiz');
    }
  };

  const handleAddQuestion = async () => {
    try {
      if (!questionData.question || !questionData.reponse_correct || questionData.reponse_incorect.length === 0) {
        message.error('Please fill in all fields');
        return;
      }
      
      const response = await axios.get('http://localhost:3000/quiz/getLastQuizId');
      const lastQuizId = response.data.lastQuizId;

      const data = {
        id_quiz: lastQuizId,
        question: questionData.question,
        reponse_correct: questionData.reponse_correct,
        reponse_incorect: questionData.reponse_incorect,
      };
  
      await axios.post('http://localhost:3000/question/add', data);
      message.success('Question added successfully');
      setQuestionData({ question: '', reponse_correct: '', reponse_incorect: [] });
      setNumQuestionsAdded(numQuestionsAdded => numQuestionsAdded + 1); // Utilisation de la fonction de mise à jour pour garantir la mise à jour correcte du nombre de questions ajoutées
    } catch (error) {
      console.error('Error adding question:', error);
      message.error('Failed to add question');
    }
  };

  return (
    <section className="background-radial-gradient overflow-hidden">
      <style>{`
        .background-radial-gradient {
          background-color: hsl(218, 41%, 15%);
          background-image: radial-gradient(650px circle at 0% 0%,
            hsl(218, 41%, 35%) 15%,
            hsl(218, 41%, 30%) 35%,
            hsl(218, 41%, 20%) 75%,
            hsl(218, 41%, 19%) 80%,
            transparent 100%),
            radial-gradient(1250px circle at 100% 100%,
            hsl(218, 41%, 45%) 15%,
            hsl(218, 41%, 30%) 35%,
            hsl(218, 41%, 20%) 75%,
            hsl(218, 41%, 19%) 80%,
            transparent 100%);
        }

        #radius-shape-1 {
          height: 220px;
          width: 220px;
          top: -60px;
          left: -130px;
          background: radial-gradient(#44006b, #ad1fff);
          overflow: hidden;
        }

        #radius-shape-2 {
          border-radius: 38% 62% 63% 37% / 70% 33% 67% 30%;
          bottom: -60px;
          right: -110px;
          width: 300px;
          height: 300px;
          background: radial-gradient(#44006b, #ad1fff);
          overflow: hidden;
        }

        .bg-glass {
          background-color: hsla(0, 0%, 100%, 0.9) !important;
          backdrop-filter: saturate(200%) blur(25px);
        }
      `}</style>
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <div style={{ width: '50%' }}>
          {!showQuestionForm && (
            <Card title="Add Quiz" style={{ marginBottom: '20px' }}>
              <Form layout="vertical">
                <Form.Item label="Titre" rules={[{ required: true, message: 'Please enter the title' }]}>
                  <Input name="titre" value={quizData.titre} onChange={handleChange} />
                </Form.Item>
                <Form.Item label="Description" rules={[{ required: true, message: 'Please enter the description' }]}>
                  <TextArea name="description" value={quizData.description} onChange={handleChange} />
                </Form.Item>
              </Form>
              <Button type="primary" onClick={handleAddQuiz}>Add Quiz</Button>
            </Card>
          )}

          {showQuestionForm && (
            <Card title={`Add Question for ${addedQuiz.titre}`} style={{ marginBottom: '20px' }}>
              <Form layout="vertical">
                <Form.Item label="Question" rules={[{ required: true, message: 'Please enter the question' }]}>
                  <Input name="question" value={questionData.question} onChange={handleQuestionChange} />
                </Form.Item>
                <Form.Item label="Correct Answer" rules={[{ required: true, message: 'Please enter the correct answer' }]}>
                  <Input name="reponse_correct" value={questionData.reponse_correct} onChange={handleQuestionChange} />
                </Form.Item>
                <Form.Item label="Incorrect Answers" rules={[{ required: true, message: 'Please enter the incorrect answers' }]}>
                  <Input name="reponse_incorect" value={questionData.reponse_incorect} onChange={handleQuestionChange} />
                </Form.Item>
              </Form>
              <Button type="primary" onClick={handleAddQuestion} icon={<PlusOutlined />}>Add Question {numQuestionsAdded > 0 ? `(${numQuestionsAdded})` : ''}</Button>
            </Card>
          )}

          {id_quiz && (
            <Card title={`Questions for ${addedQuiz.titre}`} style={{ marginBottom: '20px' }}>
              {quizQuestions.map((question, index) => (
                <div key={index}>
                  <p>{question.question}</p>
                  <p>Correct Answer: {question.reponse_correct}</p>
                  <p>Incorrect Answers: {question.reponse_incorect.join(', ')}</p>
                </div>
              ))}
            </Card>
          )}
        </div>
      </div>
    </section>
  );
};

export default AddQuiz;
