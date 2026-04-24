import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../api/axiosInstance";

/* ================= DOCTORS ================= */

export const fetchAllDoctors = createAsyncThunk(
    "adminData/fetchDoctors",
    async (_, { rejectWithValue }) => {
        try {
            const { data } = await axiosInstance.get("/api/admin/all-doctors");
            if (!data.success) return rejectWithValue(data.message);
            return data.doctors;
        } catch (err) {
            return rejectWithValue(err.message);
        }
    }
);

export const changeAvailability = createAsyncThunk(
    "adminData/changeAvailability",
    async (docID, { rejectWithValue }) => {
        try {
            const { data } = await axiosInstance.post(
                "/api/admin/change-availability",
                { docID }
            );
            if (!data.success) return rejectWithValue(data.message);
            return docID;
        } catch (err) {
            return rejectWithValue(err.message);
        }
    }
);

/* ================= APPOINTMENTS ================= */

export const fetchAllAppointments = createAsyncThunk(
    "adminData/fetchAppointments",
    async (_, { rejectWithValue }) => {
        try {
            const { data } = await axiosInstance.get("/api/admin/appointments");
            if (!data.success) return rejectWithValue(data.message);
            return data.appointments;
        } catch (err) {
            return rejectWithValue(err.message);
        }
    }
);

export const cancelAppointmentAdmin = createAsyncThunk(
    "adminData/cancelAppointment",
    async (appointmentID, { rejectWithValue }) => {
        try {
            const { data } = await axiosInstance.post(
                "/api/admin/cancel-appointment",
                { appointmentID }
            );
            if (!data.success) return rejectWithValue(data.message);
            return appointmentID;
        } catch (err) {
            return rejectWithValue(err.message);
        }
    }
);

export const deleteAppointmentAdmin = createAsyncThunk(
    "adminData/deleteAppointment",
    async (appointmentID, { rejectWithValue }) => {
        try {
            const { data } = await axiosInstance.post(
                "/api/admin/delete-appointment",
                { appointmentID }
            );
            if (!data.success) return rejectWithValue(data.message);
            return appointmentID;
        } catch (err) {
            return rejectWithValue(err.message);
        }
    }
);

/* ================= DASHBOARD ================= */

export const fetchAdminDashboard = createAsyncThunk(
    "adminData/dashboard",
    async (_, { rejectWithValue }) => {
        try {
            const { data } = await axiosInstance.get("/api/admin/dashboard");
            if (!data.success) return rejectWithValue(data.message);
            return data.dashData;
        } catch (err) {
            return rejectWithValue(err.message);
        }
    }
);

const adminDataSlice = createSlice({
    name: "adminData",
    initialState: {
        doctors: [],
        appointments: [],
        dashData: null,
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            // doctors
            .addCase(fetchAllDoctors.fulfilled, (state, action) => {
                state.loading = false;
                state.doctors = action.payload;
            })

            // appointments
            .addCase(fetchAllAppointments.fulfilled, (state, action) => {
                state.loading = false;
                state.appointments = action.payload;
            })

            // dashboard
            .addCase(fetchAdminDashboard.fulfilled, (state, action) => {
                state.loading = false;
                state.dashData = action.payload;
            })

            // common
            .addMatcher(
                (action) => action.type.endsWith("/pending"),
                (state) => {
                    state.loading = true;
                    state.error = null;
                }
            )
            .addMatcher(
                (action) => action.type.endsWith("/rejected"),
                (state, action) => {
                    state.loading = false;
                    state.error = action.payload;
                }
            )
    },
});

export default adminDataSlice.reducer;
