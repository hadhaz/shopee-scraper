import { createSlice } from "@reduxjs/toolkit";

const uiSlice = createSlice({
  name: "ui",
  initialState: { loading: false, error: null },
  reducers: {
    setLoading(state, action) {
      state.loading = action.payload;
    },
    setError(state, action) {
      state.error = action.payload;
    },
  },
});

export const { setError, setLoading } = uiSlice.actions;
export default uiSlice.reducer;
export const selectedLoading = (state: any) => state.ui.loading;
export const selectedError = (state: any) => state.ui.error;
