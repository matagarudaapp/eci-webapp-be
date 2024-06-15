const { Storage } = require("@google-cloud/storage");
const { v4: uuidv4 } = require("uuid");

const storage = new Storage({
  projectId: process.env.PROJECT_ID,
  keyFilename: "./storage-admin-key.json", // put the service account key file on the root
});

const uploadFile = async (file, bucket, destination) => {
  await storage.bucket(bucket).file(destination).save(file.buffer);

  const url = `https://storage.googleapis.com/${bucket}/${destination}`;
  return url;
};

const uploadCsv = async (file, videoResultId) => {
  return await uploadFile(
    file,
    "eci_matagaruda_bucket",
    `csv/${videoResultId}.csv`
  );
};

const uploadPicture = async (file, photoUploadId) => {
  return await uploadFile(
    file,
    "eci_matagaruda_bucket",
    `pictures/${photoUploadId}.`+file.mimetype.split("/")[1]
  );
};

const getCsvContent = async (fileName) => {
  const [file] = await storage
    .bucket("eci_matagaruda_bucket")
    .file("csv/" + fileName + ".csv")
    .download();
  return file.toString();
};


module.exports = { uploadCsv, getCsvContent, uploadPicture };
