import Units from "../models/UnitModel.js";

//mendapatkan daftar unit
export const getUnits = async (req, res) => {
  try {
    const response = await Units.findAll({
      attributes: ["id", "nameUnit"],
    });
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

//mendapatkan unit berdasarkan id
export const getUnitById = async (req, res) => {
  try {
    const response = await Units.findOne({
      attributes: ["id", "nameUnit"],
      //utk mencari pengguna berdasarkan id yang diberikan melalui parameter id dari permintaan (req.params.id)
      where: {
        id: req.params.id,
      },
    });
    if (!response) {
      return res.status(404).json({ msg: "Unit tidak ditemukan." });
    }
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

//membuat unit baru
export const createUnit = async (req, res) => {
  const { nameUnit } = req.body;
  try {
    await Units.create({
      nameUnit,
    });
    res.status(201).json({ msg: "Unit Baru Berhasil Ditambahkan" });
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

//memperbarui data unit
export const updateUnit = async (req, res) => {
  const unit = await Units.findOne({
    where: {
      id: req.params.id,
    },
  });
  if (!unit) return res.status(404).json({ msg: "Unit tidak ditemukan" });
  const { nameUnit } = req.body;
  try {
    await Units.update(
      {
        nameUnit,
      },
      {
        where: {
          id: unit.id,
        },
      }
    );
    res.status(200).json({ msg: "Data Unit Berhasil Diperbarui" });
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

//menghapus unit
export const deleteUnit = async (req, res) => {
  const unit = await Units.findOne({
    where: {
      id: req.params.id,
    },
  });
  if (!unit) return res.status(404).json({ msg: "Unit tidak ditemukan" });
  const { nameUnit } = req.body;
  try {
    await Units.destroy({
      where: {
        id: unit.id,
      },
    });
    res.status(200).json({ msg: "Unit Berhasil Dihapus" });
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

//membuat banyak unit baru sekaligus
export const createMultipleUnits = async (req, res) => {
  try {
    const units = req.body.units; // Mengambil array data units dari body request
    if (!Array.isArray(units) || units.length === 0) {
      return res
        .status(400)
        .json({ msg: "Data units harus berupa array dan tidak boleh kosong" });
    }
    //bulk mengacu pada operasi yang memproses sejumlah besar data sekaligus
    await Units.bulkCreate(units); // Menggunakan bulkCreate untuk menambahkan banyak unit
    res.status(201).json({ msg: "Unit Baru Berhasil Ditambahkan" });
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};
