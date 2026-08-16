import { createSlice, nanoid, PayloadAction } from '@reduxjs/toolkit';
import { TConstructorIngredient, TIngredient } from '@utils-types';

type TConstructorState = {
  bun: TConstructorIngredient | null;
  ingredients: TConstructorIngredient[];
};

const initialState: TConstructorState = {
  bun: null,
  ingredients: []
};

export const constructorSlice = createSlice({
  name: 'burgerConstructor',
  initialState,
  reducers: {
    addBun: (state, action: PayloadAction<TIngredient>) => {
      state.bun = { ...action.payload, id: nanoid() };
    },
    removeBun: (state) => {
      state.bun = null;
    },
    addIngredient: (state, action: PayloadAction<TIngredient>) => {
      state.ingredients.push({ ...action.payload, id: nanoid() });
    },
    removeIngredient: (state, action: PayloadAction<string>) => {
      state.ingredients = state.ingredients.filter(
        (ingredient) => ingredient.id !== action.payload
      );
    },
    moveIngredient: (
      state,
      action: PayloadAction<{ index: number; direction: 'up' | 'down' }>
    ) => {
      const { index, direction } = action.payload;
      const targetIndex = direction === 'up' ? index - 1 : index + 1;
      if (targetIndex < 0 || targetIndex >= state.ingredients.length) return;
      [state.ingredients[index], state.ingredients[targetIndex]] = [
        state.ingredients[targetIndex],
        state.ingredients[index]
      ];
    },
    clearConstructor: (state) => {
      state.bun = null;
      state.ingredients = [];
    }
  },
  selectors: {
    selectConstructorItems: (state) => state,
    selectConstructorBun: (state) => state.bun,
    selectConstructorIngredients: (state) => state.ingredients
  }
});

export const {
  addBun,
  removeBun,
  addIngredient,
  removeIngredient,
  moveIngredient,
  clearConstructor
} = constructorSlice.actions;

export const {
  selectConstructorItems,
  selectConstructorBun,
  selectConstructorIngredients
} = constructorSlice.selectors;
