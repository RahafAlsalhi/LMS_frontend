import { configureStore } from "@reduxjs/toolkit";
import authSlice from "./slices/authSlice";
import coursesSlice from "./slices/coursesSlice";
import enrollmentsSlice from "./slices/enrollmentsSlice";
import uiSlice from "./slices/uiSlice";

export const store = configureStore({
  reducer: {
    auth: authSlice,
    courses: coursesSlice,
    enrollments: enrollmentsSlice,
    ui: uiSlice,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ["persist/PERSIST"],
      },
    }),
});

export default store;
