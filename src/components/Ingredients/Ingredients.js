import React, { useState, useEffect, useCallback } from 'react';

import IngredientForm from './IngredientForm';
import Search from './Search';
import IngredientList from './IngredientList';
import ErrorModal from '../UI/ErrorModal';

const Ingredients = () => {
  const [userIngredients, setUserIngredients] = useState([]);
  const [isLoading, setLoading] = useState(false);
  const [error, setError] = useState();

  useEffect(() => {
    console.log('RENDERING INGREDIENTS', userIngredients);
  }, [userIngredients]);

  const filteredIngredientsHandler = useCallback(filteredIngredients => {
    setUserIngredients(filteredIngredients);
  }, []);

  const addIngredientHandler = ingredient => {
    setLoading(true);
    fetch('https://react-hook-deeper-default-rtdb.firebaseio.com/ingredients.json', {
      method: 'POST',
      body: JSON.stringify(ingredient),
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then(response => {
        setLoading(false);
        response.json();
      })
      .then(data => {
        setUserIngredients(prevIngredients => [
          ...prevIngredients,
          {
            id: data.name,
            ...ingredient
          }
        ]);
      });
  };

  const removeIngredientHandler = ingredientId => {
    setLoading(true);
    fetch(`https://react-hook-deeper-default-rtdb.firebaseio.com/ingredients/${ingredientId}.jon`, {
      method: 'DELETE'
    }).then(response => {
      setLoading(false);
      console.log(response);
      setUserIngredients(prevIngredients =>
        prevIngredients.filter(ingredient => ingredient.id !== ingredientId)
      );
    }).catch(error => {
      setError(error.message);
    });
  };

  const clearError = () => {
    setError(null);
    setLoading(false);
  };

  return (
    <div className="App">
      {error && <ErrorModal onClose={clearError}>{error}</ErrorModal>}
      <IngredientForm
        onAddIngredient={addIngredientHandler}
        loading={isLoading} />

      <section>
        <Search onLoadIngredients={filteredIngredientsHandler} />
        <IngredientList
          ingredients={userIngredients}
          onRemoveItem={removeIngredientHandler} />
      </section>
    </div>
  );
}

export default Ingredients;
