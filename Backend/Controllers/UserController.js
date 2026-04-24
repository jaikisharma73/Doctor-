import validator from "validator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { v2 as cloudinary } from "cloudinary";
import User from "../Models/UserModel.js";
import Doctor from "../Models/DoctorModel.js";
import Appointment from "../Models/AppointmentModel.js";
// ===== REGISTER USER =====
const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({
                success: false,
                message: "Missing required fields",
            });
        };

        if (!validator.isEmail(email)) {
            return res.status(400).json({
                success: false,
                message: "Invalid email",
            });
        };

        if (password.length < 8) {
            return res.status(400).json({
                success: false,
                message: "Password must be at least 8 characters",
            });
        };

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(409).json({
                success: false,
                message: "User already exists",
            });
        };

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const user = await User.create({
            name,
            email,
            password: hashedPassword,
        });

        const token = jwt.sign(
            { id: user._id, role: "user" },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );

        return res.status(201).json({
            success: true,
            token,
        });

    } catch (error) {
        console.error("RegisterUser Error:", error.message);
        return res.status(500).json({
            success: false,
            message: "Server error",
        });
    };
};

// =====  LOGIN USER =====
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Email and password required",
            });
        };

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Invalid credentials",
            });
        };

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: "Invalid credentials",
            });
        };

        const token = jwt.sign(
            { id: user._id, role: "user" },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );

        return res.status(200).json({
            success: true,
            token,
        });

    } catch (error) {
        console.error("LoginUser Error:", error.message);
        return res.status(500).json({
            success: false,
            message: "Server error",
        });
    };
};

// ===== GET PROFILE =====
const getProfile = async (req, res) => {
    try {
        const userID = req.userID;

        const userData = await User.findById(userID).select("-password");
        if (!userData) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        };

        return res.status(200).json({
            success: true,
            userData,
        });

    } catch (error) {
        console.error("GetProfile Error:", error.message);
        return res.status(500).json({
            success: false,
            message: "Server error",
        });
    };
};

// =====  UPDATE PROFILE =====
const updateProfile = async (req, res) => {
    try {
        const userID = req.userID;
        const { name, phone, address, dob, gender } = req.body;
        const imageFile = req.file;

        if (!name) {
            return res.status(400).json({
                success: false,
                message: "Missing required fields",
            });
        };

        await User.findByIdAndUpdate(userID, {
            name,
            phone,
            dob,
            gender,
            address: address ? JSON.parse(address) : undefined,
        });

        if (imageFile) {
            const uploadRes = await cloudinary.uploader.upload(imageFile.path, {
                resource_type: "image",
            });

            await User.findByIdAndUpdate(userID, {
                image: uploadRes.secure_url,
            });
        };

        return res.status(200).json({
            success: true,
            message: "Profile updated",
        });

    } catch (error) {
        console.error("UpdateProfile Error:", error.message);
        return res.status(500).json({
            success: false,
            message: "Server error",
        });
    };
};

// ===== BOOK APPOINTMENT =====
const bookAppointment = async (req, res) => {
    try {
        const userID = req.userID;
        const { docID, slotDate, slotTime } = req.body;

        if (!docID || !slotDate || !slotTime) {
            return res.status(400).json({
                success: false,
                message: "Missing booking details",
            });
        };

        const doctor = await Doctor.findById(docID);
        if (!doctor || !doctor.available) {
            return res.status(400).json({
                success: false,
                message: "Doctor not available",
            });
        };

        const dateObj = new Date(slotDate);

        if (isNaN(dateObj.getTime())) {
            return res.status(400).json({
                success: false,
                message: "Invalid slot date format"
            });
        };

        const day = dateObj.getDate();
        const month = dateObj.getMonth() + 1;
        const year = dateObj.getFullYear();

        const formattedSlotDate = `${day}_${month}_${year}`;

        const slots = doctor.slots_booked || {};

        if (slots[formattedSlotDate]?.includes(slotTime)) {
            return res.status(409).json({
                success: false,
                message: "Slot already booked",
            });
        };

        slots[formattedSlotDate] = slots[formattedSlotDate] || [];
        slots[formattedSlotDate].push(slotTime);

        const appointment = await Appointment.create({
            userID,
            docID,
            slotDate: formattedSlotDate,
            slotTime,
            userData: { userID },
            docData: {
                docID: doctor._id,
                name: doctor.name,
                image: doctor.image,
                speciality: doctor.speciality,
                fees: doctor.fees
            },
            amount: doctor.fees,
            date: Date.now(),
        });

        doctor.slots_booked = slots;
        await doctor.save();

        return res.status(201).json({
            success: true,
            message: "Appointment booked",
            appointmentID: appointment._id,
        });

    } catch (error) {
        console.error("BookAppointment Error:", error.message);
        return res.status(500).json({
            success: false,
            message: "Server error",
        });
    };
};

// ===== LIST APPOINTMENTS =====
const listAppointment = async (req, res) => {
    try {
        const userID = req.userID;

        const appointments = await Appointment.find({ userID }).populate("docID", "name image speciality fees").sort({
            date: -1,
        });

        return res.status(200).json({
            success: true,
            appointments,
        });

    } catch (error) {
        console.error("ListAppointment Error:", error.message);
        return res.status(500).json({
            success: false,
            message: "Server error",
        });
    };
};

// ===== CANCEL APPOINTMENT =====
const cancelAppointment = async (req, res) => {
    try {
        const userID = req.userID;
        const { appointmentID } = req.body;

        const appointment = await Appointment.findById(appointmentID);
        if (!appointment) {
            return res.status(404).json({
                success: false,
                message: "Appointment not found",
            });
        };

        if (appointment.userID.toString() !== userID) {
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

        appointment.cancelled = true;
        await appointment.save();

        const doctor = await Doctor.findById(appointment.docID);
        if (doctor?.slots_booked[appointment.slotDate]) {
            doctor.slots_booked[appointment.slotDate] =
                doctor.slots_booked[appointment.slotDate].filter(
                    (t) => t !== appointment.slotTime
                );
            await doctor.save();
        };

        return res.status(200).json({
            success: true,
            message: "Appointment cancelled",
        });

    } catch (error) {
        console.error("CancelAppointment Error:", error.message);
        return res.status(500).json({
            success: false,
            message: "Server error",
        });
    };
};


export {
    registerUser,
    loginUser,
    getProfile,
    updateProfile,
    bookAppointment,
    listAppointment,
    cancelAppointment,
};
