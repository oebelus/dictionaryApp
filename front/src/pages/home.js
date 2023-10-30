import React, { useState, useEffect } from "react";
import axios from "axios";
import { capitalize } from "../functions";
import Word from "../Word";
import { useAuth } from "./auth"
import { useParams } from 'react-router-dom';
import Cookies from 'js-cookie';

function Home() {
  const [listOfWords, setListOfWords] = useState([]);
  const [newWord, setNewWord] = useState({ word: '', meaning: '' });
  const [wordList, setWordList] = useState([]);
  const [warningWord, setWarningWord] = useState(false);
  const [warningMeaning, setWarningMeaning] = useState(false);
  const [editing, setEditing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { authenticated, setAuthenticated } = useAuth();
  const { userId } = useParams();

  useEffect(() => {
    const authToken = localStorage.getItem('authToken');
    const isAuthenticated = localStorage.getItem('isAuthenticated');
    if (authToken && isAuthenticated) {
      axios.get(`http://localhost:3000/words/${userId}`)
      .then((response) => {
        setAuthenticated(true)
        setListOfWords(response.data);
        setWordList(response.data);
        window.localStorage.setItem('authToken', authToken)
        window.localStorage.setItem('isAuthenticated', isAuthenticated)
      })
      .catch((error) => {
        console.error('Error fetching user data:', error);
        clearAuthentication();
      });
    } else {
      clearAuthentication(); }
    }, [userId]);

  useEffect(() => {
    const doSearch = () => {
      if (searchQuery === '') {
        setWordList(listOfWords);
      } else {
        const matchingWords = listOfWords.filter((word) =>
          word.word.toLowerCase().includes(searchQuery) ||
          word.meaning.toLowerCase().includes(searchQuery)
        );
        setWordList(matchingWords);
      }
    };
    doSearch();
  }, [searchQuery, listOfWords]);

  function clearAuthentication() {
      localStorage.removeItem('authToken');
      setAuthenticated(false);
      window.localStorage.removeItem('authToken');
      window.localStorage.removeItem('isAuthenticated');
  }

  const handleSearchQuery = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleWordChange = (e) => {
    setNewWord({ ...newWord, word: e.target.value });
    if (e.target.value.trim()) {
      setWarningWord(false);
    }
  };

  const handleMeaningChange = (e) => {
    setNewWord({ ...newWord, meaning: e.target.value });
    if (e.target.value.trim()) {
      setWarningMeaning(false);
    }
  };

  const handleAdd = (e) => {
    e.preventDefault();

    const capitalizedWord = capitalize(newWord.word);
    const capitalizedMeaning = capitalize(newWord.meaning);

    if (capitalizedWord.trim() === '') {
      setWarningWord(true);
      return;
    } else if (capitalizedMeaning.trim() === '') {
      setWarningMeaning(true);
      return;
    }

    axios
    .post(`http://localhost:3000/words/${userId}`, {
      userId: userId,
      word: capitalizedWord,
      meaning: capitalizedMeaning,
    },
    console.log("POST REQUEST 1: ", userId))
      .then((response) => {
        setListOfWords((prevList) => [...prevList, response.data]);
        setWordList((prevList) => [...prevList, response.data]);
        setNewWord({ word: '', meaning: '' });
        setWarningWord(false);
        setWarningMeaning(false);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const editWord = (e, index) => {
    const updatedWordList = [...wordList];
    updatedWordList[index].word = e.target.value;
    setWordList(updatedWordList);
  };

  const editMeaning = (e, index) => {
    const updatedWordList = [...wordList];
    updatedWordList[index].meaning = e.target.value;
    setWordList(updatedWordList);
  };

  const handleInputSize = (e) => {
    const input = e.target;
    input.size = input.value.length;
  };

  const handleDelete = (index, e) => {
    e.preventDefault();
    const deletedWord = listOfWords[index];

    axios
      .delete(`http://localhost:3000/words/${userId}/${deletedWord.id}`)
      .then((response) => {
        console.log(response.data);
      })
      .catch((error) => {
        console.error(error);
      });

    const updatedListOfWords = [...listOfWords];
    updatedListOfWords.splice(index, 1);
    setListOfWords(updatedListOfWords);

    const newWordList = [...wordList];
    newWordList.splice(index, 1);
    setWordList(newWordList);
    localStorage.setItem('wordList', JSON.stringify(newWordList));
  };

  const handleEdit = (index, e) => {
    e.preventDefault();
    const updatedWordList = [...wordList];
    const wordToEdit = updatedWordList[index];
    wordToEdit.word = capitalize(wordToEdit.word);
    wordToEdit.meaning = capitalize(wordToEdit.meaning);
    setEditing(true);

    axios
      .put(`http://localhost:3000/words/${userId}/${wordToEdit.id}`, {
        word: wordToEdit.word,
        meaning: wordToEdit.meaning,
      })
      .then(() => {
        setWordList(updatedWordList);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const handleSave = (index, e) => {
    e.preventDefault();
    const updatedWordList = [...wordList];
    const wordToEdit = updatedWordList[index];
    wordToEdit.word = capitalize(wordToEdit.word);
    wordToEdit.meaning = capitalize(wordToEdit.meaning);
    setEditing(false);

    axios
      .put(`http://localhost:3000/words/${userId}/${wordToEdit.id}`, {
        word: wordToEdit.word,
        meaning: wordToEdit.meaning,
      })
      .then(() => {
        setWordList(updatedWordList);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  return (
    <div>
      <div className="Dictionary">
        <form className='block card'>
          <label className='addText' htmlFor="dictionary">
            Add A Word:
          </label>
          <Word
            className="word"
            name="word"
            value={newWord.word}
            placeholder="Word"
            id="dictionary"
            onChange={handleWordChange}
          />
          {warningWord && <p className='warningWord'>Please enter a word</p>}
          <Word
            className="meaning"
            name="meaning"
            placeholder="Meaning"
            value={newWord.meaning}
            id="dictionary"
            onChange={handleMeaningChange}
          />
          {warningMeaning && (<p className='warningMeaning'>Please enter a meaning</p>)}
          <button onClick={handleAdd} className='addButton btn btn-dark'>
            Add
          </button>
        </form>
        <form className='formWord'>
          <div className="header">
            <h3 className="yourWords">Your Words</h3>
            <input
              className="form-control me-2 searchBar"
              type="search"
              placeholder='Search Word'
              value={searchQuery}
              onChange={handleSearchQuery}
            />
          </div>
          {wordList.map((word, index) => (
            <div key={index} className="dictionaryBlock">
              {editing ? (
                <>
                  <input
                    className="editDictionary"
                    type="text"
                    value={word.word}
                    onChange={(e) => editWord(e, index)}
                  />
                  <input
                    className="editDictionary"
                    type="text"
                    value={word.meaning}
                    onChange={(e) => editMeaning(e, index)}
                    onInput={handleInputSize}
                  />
                </>
              ) : (
                <div className='paragraph'>
                  <p className='wordParagraph'>{word.word}:</p>
                  <p className='meaningParagraph'>{word.meaning}</p>
                </div>
              )}
              <div className="btn-group">
                <button
                  type='button'
                  onClick={(e) => handleDelete(index, e)}
                  className="btn btn-light">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    fill="#212529"
                    className="bi bi-trash3-fill"
                    viewBox="0 0 16 16">
                    <path d="M11 1.5v1h3.5a.5.5 0 0 1 0 1h-.538l-.853 10.66A2 2 0 0 1 11.115 16h-6.23a2 2 0 0 1-1.994-1.84L2.038 3.5H1.5a.5.5 0 0 1 0-1H5v-1A1.5 1.5 0 0 1 6.5 0h3A1.5 1.5 0 0 1 11 1.5Zm-5 0v1h4v-1a.5.5 0 0 0-.5-.5h-3a.5.5 0 0 0-.5.5ZM4.5 5.029l.5 8.5a.5.5 0 1 0 .998-.06l-.5-8.5a.5.5 0 1 0-.998.06ZM6.53-.528a.5.5 0 0 0-.528.47l-.5 8.5a.5.5 0 0 0 .998.058l.5-8.5a.5.5 0 0 0-.47-.528ZM8 4.5a.5.5 0 0 0-.5.5v8.5a.5.5 0 0 0 1 0V5a.5.5 0 0 0-.5-.5Z" />
                  </svg>
                </button>
                {editing ? (
                  <button
                    type='button'
                    onClick={(e) => handleSave(index, e)}
                    className="btn btn-dark"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      fill="currentColor"
                      className="bi bi-save-fill"
                      viewBox="0 0 16 16">
                      <path d="M8.5 1.5A1.5 1.5 0 0 1 10 0h4a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V2a2 2 0 0 1 2-2h6c-.314.418-.5.937-.5 1.5v7.793L4.854 6.646a.5.5 0 1 0-.708.708l3.5 3.5a.5.5 0 0 0 .708 0l3.5-3.5a.5.5 0 0 0-.708-.708L8.5 9.293V1.5z" />
                    </svg>
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={(e) => handleEdit(index, e)}
                    className="btn btn-dark"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      fill="currentColor"
                      className="bi bi-pen-fill"
                      viewBox="0 0 16 16"
                    >
                      <path d="m13.498.795.149-.149a1.207 1.207 0 1 1 1.707 1.708l-.149.148a1.5 1.5 0 0 1-.059 2.059L4.854 14.854a.5.5 0 0 1-.233.131l-4 1a.5.5 0 0 1-.606-.606l1-4a.5.5 0 0 1 .131-.232l9.642-9.642a.5.5 0 0 0-.642.056L6.854 4.854a.5.5 0 1 1-.708-.708L9.44.854A1.5 1.5 0 0 1 11.5.796a1.5 1.5 0 0 1 1.998-.001z" />
                    </svg>
                  </button>
                )}
              </div>
            </div>
          ))}
        </form>
      </div>
    </div>
  );
}

export default Home;
