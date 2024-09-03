import Jadwals from "../models/JadwalModel.js";
import Users from "../models/UserModel.js";
import PesertaRapat from "../models/PesertaModel.js";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import Subscription from "../models/SubscriptionModel.js";
import { sendPushNotification } from "../services/pushNotification.js";
import cron from "node-cron";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

//jika up lebih dari 1 file
export const createJadwal = async (req, res) => {
  try {
    console.log("Received body:", req.body); // Lihat semua data yang diterima
    const {
      tema,
      tanggalRapat,
      waktuMulai,
      waktuSelesai,
      jenisRapat,
      lokasi,
      link,
      keterangan,
    } = req.body;
    const userId = req.id; // ID pengguna yang sedang login (dengan role operator)

    // Create the new meeting schedule
    const newJadwal = await Jadwals.create({
      tema,
      tanggalRapat,
      waktuMulai,
      waktuSelesai,
      jenisRapat,
      lokasi: jenisRapat === "offline" ? lokasi : null,
      link: jenisRapat === "online" ? link : null,
      keterangan,
      createdBy: userId, // Menyimpan ID pengguna yang membuat jadwal
    });

    // Parse participants dari req.body
    const participants = Object.keys(req.body)
      .filter((key) => key.startsWith("participants["))
      .map((key) => req.body[key]);

    // Jika participants adalah array bersarang, kita perlu meratakannya
    const flattenedParticipants = participants.flat();

    console.log("Received participants:", flattenedParticipants);

    // Temukan pengguna berdasarkan ID
    const peserta = await Users.findAll({
      where: { id: flattenedParticipants }, // Menggunakan ID dari array yang sudah diratakan
    });

    if (peserta.length === 0) {
      console.log("No participants found with the given IDs.");
    } else {
      console.log("Participants found:", peserta);
    }

    // Tambahkan peserta ke jadwal rapat (akan disimpan di tabel junction)
    await newJadwal.addPeserta(peserta);

    // Tambahkan pengguna yang sedang login sebagai peserta rapat
    await PesertaRapat.create({
      jadwalId: newJadwal.id,
      userId: userId,
    });

    // Tambahkan peserta ke jadwal rapat (termasuk operator)
    const allParticipants = [...flattenedParticipants, userId]; // Tambahkan operator ke daftar peserta
    console.error("error", allParticipants);

    // Mengirim notifikasi ke semua peserta rapat yang ditemukan
    const subscriptions = await Subscription.findAll({
      where: {
        userId: allParticipants, // Menggunakan userId untuk mengambil subscription
      },
    });

    // if (subscriptions.length === 0) {
    //   return res
    //     .status(404)
    //     .json({ message: "No participants found with valid subscriptions." });
    // }

    // Data notifikasi undangan rapat
    const invitationNotification = {
      title: "Undangan Rapat: " + tema,
      body: `Anda diundang untuk mengikuti rapat pada ${tanggalRapat} pukul ${waktuMulai} hingga ${waktuSelesai}.`,
      icon: "/icon.png",
    };

    // Kirim notifikasi ke setiap peserta
    for (const subscription of subscriptions) {
      const sub = {
        endpoint: subscription.endpoint,
        keys: {
          p256dh: subscription.p256dh,
          auth: subscription.auth,
        },
      };
      console.log("Sending push notification to:", subscription.endpoint);
      await sendPushNotification(sub, invitationNotification)
        .then(() =>
          console.log(
            `Invitation notification sent successfully: ${subscription.endpoint}`
          )
        )
        .catch((error) =>
          console.error(`Error sending invitation notification:`, error)
        );
    }

    // Mengatur Waktu Pengiriman Pengingat (1 jam sebelum rapat)
    const reminderTime = new Date(`${tanggalRapat} ${waktuMulai}`);
    // reminderTime.setHours(reminderTime.getHours() - 1); //1 jam sebelum rapat
    reminderTime.setMinutes(reminderTime.getMinutes() + 1); //1 menit setelah rapat

    // Ubah waktu pengingat ke pola cron
    const cronPattern = `${reminderTime.getMinutes()} ${reminderTime.getHours()} ${reminderTime.getDate()} ${
      reminderTime.getMonth() + 1
    } *`;
    console.log("Scheduled cron pattern for reminder:", cronPattern);

    // Jadwalkan cron job untuk mengirimkan notifikasi pengingat
    cron.schedule(cronPattern, async () => {
      console.log("Executing reminder cron job...");

      // Notifikasi Pengingat
      const reminderNotificationData = {
        title: `Pengingat Rapat: ${tema}`,
        body: `Rapat akan dimulai dalam 1 jam, pada pukul ${waktuMulai}.`,
        icon: "/icon.png",
      };

      for (const subscription of subscriptions) {
        const sub = {
          endpoint: subscription.endpoint,
          keys: {
            p256dh: subscription.p256dh,
            auth: subscription.auth,
          },
        };

        await sendPushNotification(sub, reminderNotificationData)
          .then(() =>
            console.log(
              `Reminder notification sent to: ${subscription.endpoint}`
            )
          )
          .catch((error) =>
            console.error(
              `Error sending reminder to ${subscription.endpoint}:`,
              error
            )
          );
      }

      console.log("Reminder cron job completed.");
    });

    // Handle file uploads
    if (req.files && req.files.fileRapat) {
      const files = Array.isArray(req.files.fileRapat)
        ? req.files.fileRapat
        : [req.files.fileRapat];
      console.log("Files:", req.files.fileRapat);

      const uploadDir = path.join(__dirname, "../uploads");

      // Ensure the uploads directory exists
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }

      const fileNames = [];

      for (const file of files) {
        const uploadPath = path.join(uploadDir, file.name);
        console.log("Upload Path:", uploadPath);

        // Save each file to uploads folder
        await file.mv(uploadPath);

        // Store file name or path in the database
        fileNames.push(file.name);
      }

      // Update Jadwal with the uploaded files (assuming you have a column to store file names)
      // Simpan nama file sebagai JSON array
      newJadwal.fileRapat = JSON.stringify(fileNames);
      await newJadwal.save();
    }

    res.status(200).json({
      message:
        "Jadwal created, participants notified, and files uploaded successfully",
      jadwalId: newJadwal.id,
    });
  } catch (error) {
    console.error(`Error creating jadwal:`, error);
    res.status(500).json({ message: error.message });
  }
};

export const getJadwals = async (req, res) => {
  try {
    const userId = req.id;

    const jadwals = await Jadwals.findAll({
      include: {
        model: Users,
        as: "peserta",
        attributes: ["id", "name"],
        where: {
          id: userId,
        },
      },
      order: [
        ["tanggalRapat", "DESC"],
        ["waktuMulai", "DESC"],
      ], // Urutkan berdasarkan tanggal dan waktu
    });

    // console.log("Jadwals fetched:", jadwals); // Logging the fetched data

    res.status(200).json(jadwals);
  } catch (error) {
    console.error("Error fetching jadwals:", error);
    res.status(500).json({ message: error.message });
  }
};

export const getJadwalById = async (req, res) => {
  try {
    const jadwal = await Jadwals.findOne({
      where: { id: req.params.id },
      include: {
        model: Users,
        as: "peserta",
        attributes: ["id", "name", "profilePhoto"],
      },
    });

    if (!jadwal)
      return res.status(404).json({ message: "Jadwal tidak ditemukan" });

    res.status(200).json(jadwal);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getJadwalsByUser = async (req, res) => {
  const userId = req.params.userId;

  try {
    // Cari unit pengguna berdasarkan userId (atau bisa ditentukan lain)
    const jadwals = await Jadwals.findAll({
      include: {
        model: Users,
        as: "peserta",
        where: { id: userId },
        attributes: [], // Hanya ambil jadwal, tidak termasuk detail user
      },
    });

    res.status(200).json(jadwals);
  } catch (error) {
    res.status(500).json({ message: "Error fetching jadwals", error });
  }
};

export const updateJadwal = async (req, res) => {
  const { id } = req.params;
  const {
    tema,
    tanggalRapat,
    waktuMulai,
    waktuSelesai,
    jenisRapat,
    lokasi,
    link,
    keterangan,
  } = req.body;
  const removedFiles = req.body["filesToRemove[]"] || [];
  const participantsToRemove = req.body["participantsToRemove[]"] || [];

  try {
    const jadwal = await Jadwals.findByPk(id);
    if (!jadwal)
      return res.status(404).json({ message: "Jadwal tidak ditemukan" });

    // Update the meeting schedule
    await jadwal.update({
      tema,
      tanggalRapat,
      waktuMulai,
      waktuSelesai,
      jenisRapat,
      lokasi: jenisRapat === "offline" ? lokasi : null,
      link: jenisRapat === "online" ? link : null,
      keterangan,
    });

    // Parse participants dari req.body
    const participants = Object.keys(req.body)
      .filter((key) => key.startsWith("participants["))
      .map((key) => req.body[key]);

    // Jika participants adalah array bersarang, kita perlu meratakannya
    const flattenedParticipants = participants.flat();

    console.log("Received participants:", flattenedParticipants);

    // Temukan pengguna berdasarkan ID
    const peserta = await Users.findAll({
      where: { id: flattenedParticipants }, // Menggunakan ID dari array yang sudah diratakan
    });

    if (peserta.length === 0) {
      console.log("No participants found with the given IDs.");
    } else {
      console.log("Participants found:", peserta);
    }

    // Tambahkan peserta ke jadwal rapat (akan disimpan di tabel junction)
    await jadwal.addPeserta(peserta);

    // Remove participants who are no longer part of the meeting
    if (participantsToRemove.length > 0) {
      await jadwal.removePeserta(participantsToRemove);
    }

    // Handle file uploads
    const uploadDir = path.join(__dirname, "../uploads");

    // Ensure the uploads directory exists
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    if (req.files && req.files.fileRapat) {
      const files = Array.isArray(req.files.fileRapat)
        ? req.files.fileRapat
        : [req.files.fileRapat];

      // Retrieve old file names
      const oldFileNames = jadwal.fileRapat ? JSON.parse(jadwal.fileRapat) : [];

      // Save new files and update the list of file names
      const newFileNames = [];
      for (const file of files) {
        const fileName = `${file.name}`;
        const uploadPath = path.join(uploadDir, fileName);

        // Save each file to uploads folder
        await file.mv(uploadPath);

        // Add new file name to list
        newFileNames.push(fileName);
      }

      // Remove deleted files from the filesystem
      if (removedFiles && removedFiles.length > 0) {
        for (const fileName of removedFiles) {
          const filePath = path.join(uploadDir, fileName);
          console.log(`Attempting to delete file at: ${filePath}`); // Debugging line
          try {
            if (fs.existsSync(filePath)) {
              fs.unlinkSync(filePath);
            } else {
              console.log(`File not found: ${filePath}`); // Debugging line
            }
          } catch (err) {
            console.error(`Error removing file: ${err.message}`); // Log any errors
          }
        }
      }
      // Combine old and new file names, excluding removed files
      const allFileNames = [...oldFileNames, ...newFileNames];
      jadwal.fileRapat = JSON.stringify(allFileNames);
      await jadwal.save();
    } else {
      // Handle case where no new files are uploaded but removed files are
      if (removedFiles && removedFiles.length > 0) {
        const oldFileNames = JSON.parse(jadwal.fileRapat || "[]");
        const updatedFileNames = oldFileNames.filter(
          (fileName) => !removedFiles.includes(fileName)
        );
        // Ensure req.files is not called if it's undefined
        const newFileNames =
          req.files && req.files.fileRapat
            ? Array.isArray(req.files.fileRapat)
              ? req.files.fileRapat.map((file) => file.filename)
              : [req.files.fileRapat.filename]
            : [];

        jadwal.fileRapat = JSON.stringify([
          ...updatedFileNames,
          ...newFileNames,
        ]);
        await jadwal.save();

        // Delete removed files from the filesystem
        for (const fileName of removedFiles) {
          console.log(`Attempting to delete file: ${fileName}`);

          const filePath = path.join(uploadDir, fileName);
          console.log(`Attempting to delete file at: ${filePath}`); // Debugging line
          try {
            if (fs.existsSync(filePath)) {
              fs.unlinkSync(filePath);
            } else {
              console.log(`File not found: ${filePath}`); // Debugging line
            }
          } catch (err) {
            console.error(`Error removing file: ${err.message}`); // Log any errors
          }
        }
      }
    }

    res.status(200).json({ message: "Jadwal berhasil diperbarui", jadwal });
  } catch (error) {
    console.error("Error updating schedule:", error);
    res.status(500).json({ message: error.message });
  }
};

export const deleteJadwal = async (req, res) => {
  try {
    const { id } = req.params;
    const jadwal = await Jadwals.findByPk(id);
    if (!jadwal)
      return res.status(404).json({ message: "Jadwal tidak ditemukan" });

    await jadwal.destroy();
    res.status(200).json({ message: "Jadwal berhasil dihapus" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getJenisRapat = async (req, res) => {
  try {
    // Dapatkan nilai enum dari model Jadwals
    const jenisRapatEnum = Jadwals.rawAttributes.jenisRapat.values;

    res.status(200).json(jenisRapatEnum);
  } catch (error) {
    console.error("Error in :", error);
    res
      .status(500)
      .json({ message: "Error fetching jenis rapat options", error });
  }
};
