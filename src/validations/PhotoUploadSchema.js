const KategoriKerusakan  = {
    BAIK: "Baik",
    RUSAK_RINGAN:  "Rusak Ringan",
    RUSAK_BERAT: "Rusak Berat",
}
  
const JenisAssets = {
    PERKERASAN: "Perkerasan",
    DRAINASE: "Drainase",
    LERENG: "Lereng",
    JEMBATAN: "Jembatan",
    BOX_CULVERT: "Box Culvert",
    BARRIER: "Barrier",
    MARKA: "Marka",
    RAMBU: "Rambu",
    PJU: "PJU",
    GUARDRAIL: "Guardrail",
    PAGAR: "Pagar",
    PATOK: "Patok",
    RUMIJA: "Rumija",
};

const PhotoUploadSchema = Joi.object({
    fotoName: Joi.string().required(),
    inspectionDate: Joi.date().required(),
    inspectorName: Joi.string().required(),
    jenisAssets: Joi.string().valid(...Object.values(JenisAssets)).required(),
    kategoriKerusakan: Joi.string().valid(...Object.values(KategoriKerusakan)).required(),
    jenisKerusakan: Joi.string().required(),
    picturesCoordinate: Joi.string().required(),
});

module.exports = PhotoUploadSchema;