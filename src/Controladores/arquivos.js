const aws = require("aws-sdk")
require('aws-sdk/lib/maintenance_mode_message').suppress = true;
const endpoint = new aws.Endpoint(process.env.ENDPOINT_S3)
const s3 = new aws.S3({
    endpoint,
    credentials:{
        accessKeyId: process.env.KEY_ID,
        secretAccessKey: process.env.APP_KEY
    }
})
const uploadArquivo = async (path, buffer, mimetype)=>{
    const arquivo = await s3.upload({
        Bucket: process.env.BUCKET_NAME,
        Key: path,
        Body: buffer,
        ContentType: mimetype
    }).promise()
    return {
        url: arquivo.Location,
        path: arquivo.Key
    }
}
const excluirArquivo = async (path)=>{
    await s3.deleteObject({
        Bucket: process.env.BUCKET_NAME,
        Key: path
    }).promise()
}

module.exports = {
    uploadArquivo,
    excluirArquivo
}
