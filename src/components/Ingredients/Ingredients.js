import React, { useReducer, useEffect, useCallback, useMemo } from 'react';

import IngredientForm from './IngredientForm';
import Search from './Search';
import IngredientList from './IngredientList';
import ErrorModal from '../UI/ErrorModal';
import useHttp from '../../hooks/http';

const ingredientsReducer = (currentIngredients, action) => {
  switch (action.type) {
    case 'SET':
      return action.ingredients;
    case 'ADD':
      return [...currentIngredients, action.ingredient];
    case 'DELETE':
      return currentIngredients.filter(ingredient => ingredient.id !== action.id);
    default:
      throw new Error('Should not get there!');
  }
};

const Ingredients = () => {
  const [userIngredients, dispatch] = useReducer(ingredientsReducer, []);
  const { isLoading, error, data, sendRequest } = useHttp();
  // const [userIngredients, setUserIngredients] = useState([]);
  // const [isLoading, setLoading] = useState(false);
  // const [error, setError] = useState();

  useEffect(() => {
    console.log('RENDERING INGREDIENTS', userIngredients);
  }, [userIngredients]);

  const filteredIngredientsHandler = useCallback(filteredIngredients => {
    // setUserIngredients(filteredIngredients);
    dispatch({ type: 'SET', ingredients: filteredIngredients });
  }, []);

  const addIngredientHandler = useCallback(ingredient => {
    // dispatchHttp({ type: 'SEND' });
    // fetch('https://react-hook-deeper-default-rtdb.firebaseio.com/ingredients.json', {
    //   method: 'POST',
    //   body: JSON.stringify(ingredient),
    //   headers: {
    //     'Content-Type': 'application/json'
    //   }
    // })
    //   .then(response => {
    //     dispatchHttp({ type: 'RESPONSE' });
    //     response.json();
    //   })
    //   .then(responseData => {
    //     dispatch({
    //       type: 'ADD',
    //       ingredient: {
    //         id: responseData.name,
    //         ...ingredient
    //       }
    //     });
    //   });
  }, []);

  const removeIngredientHandler = useCallback(ingredientId => {
    sendRequest(
      `https://react-hook-deeper-default-rtdb.firebaseio.com/ingredients/${ingredientId}.json`,
      'DELETE'
    );
  }, [sendRequest]);

  const clearError = useCallback(() => {
    // dispatchHttp({ type: 'CLEAR' });
  }, []);

  const ingredientList = useMemo(() => {
    return (
      <IngredientList
        ingredients={userIngredients}
        onRemoveItem={removeIngredientHandler} />
    );
  }, [userIngredients, removeIngredientHandler]);

  return (
    <div className="App">
      {data}
      {error && <ErrorModal onClose={clearError}>{error}</ErrorModal>}
      <IngredientForm
        onAddIngredient={addIngredientHandler}
        loading={isLoading} />

      <section>
        <Search onLoadIngredients={filteredIngredientsHandler} />
        {ingredientList}
      </section>
    </div>
  );
}

export default Ingredients;
