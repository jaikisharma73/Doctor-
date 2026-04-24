import validator from "validator";
import bcrypt from "bcrypt";
import { v2 as cloudinary } from "cloudinary";
import jwt from "jsonwebtoken";
import Doctor from "../Models/DoctorModel.js";
import Appointment from "../Models/AppointmentModel.js";
import User from "../Models/UserModel.js";

// ===== ADD DOCTOR =====
const addDoctor = async (req, res) => {
    try {
        const {
            name,
            email,
            password,
            speciality,
            degree,
            experience,
            about,
            fees,
            address,
        } = req.body;

        const imageFile = req.file;

        // Validation
        if (
            !name ||
            !email ||
            !password ||
            !speciality ||
            !degree ||
            !experience ||
            !about ||
            !fees ||
            !address
        ) {
            return res.status(400).json({
                success: false,
                message: "Missing required fields",
            });
        };

        if (!validator.isEmail(email)) {
            return res.status(400).json({
                success: false,
                message: "Invalid email format",
            });
        };

        if (password.length < 8) {
            return res.status(400).json({
                success: false,
                message: "Password must be at least 8 characters",
            });
        };

        // Check duplicate doctor
        const existingDoctor = await Doctor.findOne({ email });
        if (existingDoctor) {
            return res.status(409).json({
                success: false,
                message: "Doctor already exists with this email",
            });
        };

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Upload image (optional)
        let imageURL = "";
        if (imageFile) {
            const uploadRes = await cloudinary.uploader.upload(imageFile.path, {
                resource_type: "image",
            });
            imageURL = uploadRes.secure_url;
        };

        const doctor = new Doctor({
            name,
            email,
            password: hashedPassword,
            image: imageURL,
            speciality,
            degree,
            experience,
            about,
            fees,
            address: JSON.parse(address),
            date: Date.now(),
        });

        await doctor.save();

        return res.status(201).json({
            success: true,
            message: "Doctor added successfully",
        });

    } catch (error) {
        console.error("AddDoctor Error:", error.message);
        return res.status(500).json({
            success: false,
            message: "Server error",
        });
    };
};

// ===== ADMIN LOGIN =====
const loginAdmin = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (
            email !== process.env.ADMIN_EMAIL ||
            password !== process.env.ADMIN_PASSWORD
        ) {
            return res.status(401).json({
                success: false,
                message: "Invalid credentials",
            });
        };

        const token = jwt.sign(
            { email, role: "admin" },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );

        return res.status(200).json({
            success: true,
            token,
        });

    } catch (error) {
        console.error("AdminLogin Error:", error.message);
        return res.status(500).json({
            success: false,
            message: "Server error",
        });
    };
};

// ===== ALL DOCTORS (ADMIN) =====
const allDoctors = async (req, res) => {
    try {
        const doctors = await Doctor.find({}).select("-password");

        return res.status(200).json({
            success: true,
            doctors,
        });

    } catch (error) {
        console.error("AllDoctors Error:", error.message);
        return res.status(500).json({
            success: false,
            message: "Server error",
        });
    };
};

// ===== ALL APPOINTMENTS (ADMIN) =====
const appointmentsAdmin = async (req, res) => {
    try {
        const appointments = await Appointment.find({}).populate("userID").populate("docID");

        return res.status(200).json({
            success: true,
            appointments,
        });

    } catch (error) {
        console.error("AppointmentsAdmin Error:", error.message);
        return res.status(500).json({
            success: false,
            message: "Server error",
        });
    };
};

// ===== CANCEL APPOINTMENT (ADMIN) =====
const appointmentCancel = async (req, res) => {
    try {
        const { appointmentID } = req.body;

        if (!appointmentID) {
            return res.status(400).json({
                success: false,
                message: "Appointment ID required",
            });
        };

        const appointment = await Appointment.findById(appointmentID);
        if (!appointment) {
            return res.status(404).json({
                success: false,
                message: "Appointment not found",
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

        // Release doctor slot
        const { docID, slotDate, slotTime } = appointment;
        const doctor = await Doctor.findById(docID);

        if (doctor && doctor.slots_booked[slotDate]) {
            doctor.slots_booked[slotDate] =
                doctor.slots_booked[slotDate].filter(
                    (time) => time !== slotTime
                );

            await doctor.save();
        };

        return res.status(200).json({
            success: true,
            message: "Appointment cancelled successfully",
        });

    } catch (error) {
        console.error("AdminCancel Error:", error.message);
        return res.status(500).json({
            success: false,
            message: "Server error",
        });
    };
};

// ===== DELETE APPOINTMENT (ADMIN) =====
const appointmentDelete = async (req, res) => {
    try {
        const { appointmentID } = req.body;

        if (!appointmentID) {
            return res.status(400).json({
                success: false,
                message: "Appointment ID required",
            });
        };

        const appointment = await Appointment.findById(appointmentID);
        if (!appointment) {
            return res.status(404).json({
                success: false,
                message: "Appointment not found",
            });
        };

        // Release doctor slot if not cancelled/completed
        if (!appointment.cancelled && !appointment.isCompleted) {
            const { docID, slotDate, slotTime } = appointment;
            const doctor = await Doctor.findById(docID);

            if (doctor && doctor.slots_booked[slotDate]) {
                doctor.slots_booked[slotDate] =
                    doctor.slots_booked[slotDate].filter(
                        (time) => time !== slotTime
                    );

                await doctor.save();
            };
        }

        await Appointment.findByIdAndDelete(appointmentID);

        return res.status(200).json({
            success: true,
            message: "Appointment deleted successfully",
        });

    } catch (error) {
        console.error("AdminDelete Error:", error.message);
        return res.status(500).json({
            success: false,
            message: "Server error",
        });
    };
};

// ===== ADMIN DASHBOARD =====
const adminDashboard = async (req, res) => {
    try {
        const doctorsCount = await Doctor.countDocuments();
        const usersCount = await User.countDocuments();
        const appointments = await Appointment.find({}).populate("docID").sort({ date: -1 });

        return res.status(200).json({
            success: true,
            dashData: {
                doctors: doctorsCount,
                patients: usersCount,
                appointments: appointments.length,
                latestAppointments: appointments.slice(0, 5),
            },
        });

    } catch (error) {
        console.error("AdminDashboard Error:", error.message);
        return res.status(500).json({
            success: false,
            message: "Server error",
        });
    };
};

export {
    addDoctor,
    loginAdmin,
    allDoctors,
    appointmentsAdmin,
    appointmentCancel,
    appointmentDelete,
    adminDashboard,
};
