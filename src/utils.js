const fs = require("fs/promises")

const reportarErro = async (error)=>{
    const data = new Date()
    await fs.writeFile(`./logs/${data}`, error)
}
module.exports = {reportarErro}
