const { Storage } = require("@google-cloud/storage");
const { v4: uuidv4 } = require("uuid");

const storage = new Storage({
  projectId: process.env.PROJECT_ID,
  keyFilename: "./storage-admin-key.json",
});

const uploadFile = async (file, bucket, destination) => {
  await storage.bucket(bucket).file(destination).save(file.buffer);

  const url = `https://storage.googleapis.com/${bucket}/${destination}`;
  return url;
};

const uploadCsv = async (file) => {
  return await uploadFile(file, "eci_matagaruda_bucket", `csv/${uuidv4()}.csv`);
};

module.exports = { uploadCsv };