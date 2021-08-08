const { response } = require('express')
const request = require('request')

const sendRequest = (options) => {
    return new Promise((resolve, reject) => {
        request (options, (error, response, body) => {
            if (!error && response.statusCode === 200) {
                resolve(body)
            } else {
                reject(error)
            }
        })
    })
}


const helpMessage = async (text) => {
    const options = {
        'method': 'GET',
        'url': `https://www.googleapis.com/customsearch/v1?key=${process.env.GOOGLE_API_KEY}&cx=${process.env.CX}&q=${text}`,
        'headers': {
        }
      }
    
      const responseBody = await sendRequest(options)
      let responses = []
      if (!JSON.parse(responseBody).items.length) {
        response = 'No matching result'
        return {
            text: response,
            createdAt: new Date().getTime()
        }
      } else {
          const items = JSON.parse(responseBody).items
          items.forEach((item) => {
              responses.push({
                  text: item.snippet,
                  link: item.link,
                  createdAt: new Date().getTime()
              })
          })
          return responses

      }    
}


module.exports = {
    helpMessage
}