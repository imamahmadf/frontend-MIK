import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { User, LoginCredentials, AuthResponse } from "@/types/auth";
import { login as loginAPI, getCurrentUser } from "@/lib/api/auth";

interface AuthState {
  user: User | null;
  token: string | null;
  loading: boolean;
  error: string | null;
  isAuthenticated: boolean;
}

const initialState: AuthState = {
  user: null,
  token: null,
  loading: false,
  error: null,
  isAuthenticated: false,
};

// Async thunk untuk login
export const loginUser = createAsyncThunk(
  "auth/login",
  async (credentials: LoginCredentials, { rejectWithValue }) => {
    try {
      const response = await loginAPI(credentials);
      return response;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : "Terjadi kesalahan saat login"
      );
    }
  }
);

// Async thunk untuk initialize auth dari localStorage
export const initializeAuth = createAsyncThunk(
  "auth/initialize",
  async (_, { rejectWithValue }) => {
    try {
      if (typeof window === "undefined") {
        return null;
      }

      const token = localStorage.getItem("token");
      if (!token) {
        return null;
      }

      const userData = getCurrentUser();
      if (!userData) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        return null;
      }

      return { user: userData, token };
    } catch (error) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      return rejectWithValue("Gagal memuat data autentikasi");
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.error = null;

      if (typeof window !== "undefined") {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
      }
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Login cases
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        loginUser.fulfilled,
        (state, action: PayloadAction<AuthResponse>) => {
          state.loading = false;
          state.user = action.payload.user;
          state.token = action.payload.token;
          state.isAuthenticated = true;
          state.error = null;

          if (typeof window !== "undefined") {
            localStorage.setItem("token", action.payload.token);
            localStorage.setItem("user", JSON.stringify(action.payload.user));
          }
        }
      )
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.isAuthenticated = false;
      });

    // Initialize auth cases
    builder
      .addCase(initializeAuth.pending, (state) => {
        state.loading = true;
      })
      .addCase(initializeAuth.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload) {
          state.user = action.payload.user;
          state.token = action.payload.token;
          state.isAuthenticated = true;
        } else {
          state.isAuthenticated = false;
        }
      })
      .addCase(initializeAuth.rejected, (state) => {
        state.loading = false;
        state.isAuthenticated = false;
      });
  },
});

export const { logout, clearError } = authSlice.actions;
export default authSlice.reducer;
