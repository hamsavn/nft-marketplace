import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { User } from '@generated/graphql';
import { RepositoryFactory } from '@repositories/RepositoryFactory';

const initialWallet = {
  isInstalled: false,
  isconnected: false,
  chain: undefined,
  address: undefined,
  balance: undefined,
};

interface Wallet {
  isInstalled: boolean;
  isconnected: boolean;
  chain: string | undefined;
  address: string | undefined;
  balance: number | undefined;
}

export interface AppState {
  user?: User;
  loggedIn: boolean;
  initialized: boolean;
  wallet: Wallet;
}

const initialState: AppState = {
  loggedIn: false,
  initialized: false,
  wallet: initialWallet,
};

export const fetchUser = createAsyncThunk('app/fetchUser', RepositoryFactory.get('auth').getuser);

const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    setLoggedIn: (state, { payload }: PayloadAction<{ value: boolean; resetWallet?: boolean }>) => {
      state.loggedIn = payload.value;

      if (payload.resetWallet) {
        state.wallet = initialWallet;
      }
    },
    setWallet: (state, { payload }: PayloadAction<Wallet>) => {
      state.wallet = payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchUser.fulfilled, (state, { payload }) => {
      state.user = payload.user;
      state.loggedIn = payload.checkLogin;
      state.initialized = true;
      return state;
    });
  },
});

export const { setLoggedIn, setWallet } = appSlice.actions;
export default appSlice.reducer;
