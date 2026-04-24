import Doctor from "../Models/DoctorModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import Appointment from "../Models/AppointmentModel.js";

// ===== CHANGE AVAILABILITY (ADMIN) =====
const changeAvailability = async (req, res) => {
    try {
        const { docID } = req.body;

        if (!docID) {
            return res.status(400).json({
                success: false,
                message: "Doctor ID required",
            });
        };

        const doctor = await Doctor.findById(docID);

        if (!doctor) {
            return res.status(404).json({
                success: false,
                message: "Doctor not found",
            });
        };

        doctor.available = !doctor.available;
        await doctor.save();

        return res.status(200).json({
            success: true,
            message: "Doctor Availability updated",
        });

    } catch (error) {
        console.error("ChangeAvailability Error:", error.message);
        return res.status(500).json({
            success: false,
            message: "Server error",
        });
    };
};

// ===== DOCTOR LIST (PUBLIC) =====
const doctorList = async (req, res) => {
    try {
        const doctors = await Doctor.find({})
            .select("-password -email")
            .sort({ date: -1 });

        return res.status(200).json({
            success: true,
            doctors,
        });

    } catch (error) {
        console.error("DoctorList Error:", error.message);
        return res.status(500).json({
            success: false,
            message: "Server error",
        });
    };
};

// ===== DOCTOR LOGIN =====
const doctorLogin = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Email and password required",
            });
        };

        const doctor = await Doctor.findOne({ email });
        if (!doctor) {
            return res.status(401).json({
                success: false,
                message: "Invalid credentials",
            });
        };

        const isMatch = await bcrypt.compare(password, doctor.password);
        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: "Invalid credentials",
            });
        };

        const token = jwt.sign(
            { id: doctor._id, role: "doctor" },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );

        return res.status(200).json({
            success: true,
            token,
        });

    } catch (error) {
        console.error("DoctorLogin Error:", error.message);
        return res.status(500).json({
            success: false,
            message: "Server error",
        });
    };
};

// ===== DOCTOR APPOINTMENTS =====
const doctorAppointments = async (req, res) => {
    try {
        const docID = req.doctor.id

        const appointments = await Appointment.find({ docID })
            .populate("userID", "name image dob")
            .sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            appointments,
        });

    } catch (error) {
        console.error("DoctorAppointments Error:", error.message);
        return res.status(500).json({
            success: false,
            message: "Server error",
        });
    };
};

// ===== COMPLETE APPOINTMENT =====
const appointmentComplete = async (req, res) => {
    try {
        const docID = req.doctor.id
        const { appointmentID } = req.body;

        const appointment = await Appointment.findById(appointmentID);
        if (!appointment) {
            return res.status(404).json({
                success: false,
                message: "Appointment not found",
            });
        };

        if (appointment.docID.toString() !== docID.toString()) {
            return res.status(403).json({
                success: false,
                message: "Unauthorized action",
            });
        };

        await Appointment.findByIdAndUpdate(appointmentID, {
            isCompleted: true,
        });

        return res.status(200).json({
            success: true,
            message: "Appointment marked as completed",
        });

    } catch (error) {
        console.error("AppointmentComplete Error:", error.message);
        return res.status(500).json({
            success: false,
            message: "Server error",
        });
    };
};

// ===== CANCEL APPOINTMENT (DOCTOR) =====
const appointmentCancel = async (req, res) => {
    try {
        const docID = req.doctor.id
        const { appointmentID } = req.body;

        const appointment = await Appointment.findById(appointmentID);
        if (!appointment) {
            return res.status(404).json({
                success: false,
                message: "Appointment not found",
            });
        };

        if (appointment.docID.toString() !== docID.toString()) {
            return res.status(403).json({
                success: false,
                message: "Unauthorized action",
            });
        };

        if (appointment.cancelled) {
            return res.status(400).json({
                success: false,
                message: "Appointment already cancelled",
            });
        };

        await Appointment.findByIdAndUpdate(appointmentID, {
            cancelled: true,
        });

        return res.status(200).json({
            success: true,
            message: "Appointment cancelled",
        });

    } catch (error) {
        console.error("DoctorCancel Error:", error.message);
        return res.status(500).json({
            success: false,
            message: "Server error",
        });
    };
};

// =====  DOCTOR DASHBOARD =====
const doctorDashboard = async (req, res) => {
    try {
        const docID = req.doctor.id

        const appointments = await Appointment.find({ docID })
            .populate("userID", "name image")
            .sort({ createdAt: -1 });

        let earnings = 0;
        const patientSet = new Set();

        appointments.forEach((item) => {
            if (item.isCompleted || item.payment) {
                earnings += item.amount;
            }
            patientSet.add(item.userID);
        });

        const latestAppointments = [...appointments]
            .sort((a, b) => b.date - a.date)
            .slice(0, 5);

        return res.status(200).json({
            success: true,
            dashData: {
                earnings,
                appointments: appointments.length,
                patients: patientSet.size,
                latestAppointments,
            },
        });

    } catch (error) {
        console.error("DoctorDashboard Error:", error.message);
        return res.status(500).json({
            success: false,
            message: "Server error",
        });
    };
};

// ===== DOCTOR PROFILE =====
const doctorProfile = async (req, res) => {
    try {
        const docID = req.doctor.id

        const profileData = await Doctor.findById(docID).select("-password");
        if (!profileData) {
            return res.status(404).json({
                success: false,
                message: "Doctor not found",
            });
        };

        return res.status(200).json({
            success: true,
            profileData,
        });

    } catch (error) {
        console.error("DoctorProfile Error:", error.message);
        return res.status(500).json({
            success: false,
            message: "Server error",
        });
    };
};

// ===== UPDATE DOCTOR PROFILE =====
const updateDoctorProfile = async (req, res) => {
    try {
        const docID = req.doctor.id
        const { name, degree, speciality, about, fees, address, available } = req.body;

        await Doctor.findByIdAndUpdate(docID, {
            name,
            degree,
            speciality,
            about,
            fees,
            address,
            available,
        });

        return res.status(200).json({
            success: true,
            message: "Profile updated",
        });

    } catch (error) {
        console.error("UpdateDoctorProfile Error:", error.message);
        return res.status(500).json({
            success: false,
            message: "Server error",
        });
    };
};

export {
    changeAvailability,
    doctorList,
    doctorLogin,
    doctorAppointments,
    appointmentComplete,
    appointmentCancel,
    doctorDashboard,
    doctorProfile,
    updateDoctorProfile,
};
