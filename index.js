const scrapper = require('./scrapper');
const init =  async() => {
    const result = await scrapper();
    console.log(result);
}
init();