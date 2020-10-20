const request = require('request')
const cheerio = require('cheerio')
const fs = require('fs')
const csvWriter = require('csv-write-stream')

var writer = csvWriter({sendHeaders: false})
writer.pipe(fs.createWriteStream('output.csv', {flags: 'a'}))

const baseURL = 'https://cookbooks.com/Recipe-Details.aspx?id='
var id = 51
var docID = 0

while(id <= 350){
  request(`${baseURL}${id}`, (error, response, html) => {
    if(!error && response.statusCode == 200){
      const $ = cheerio.load(html)

      // Dessert recipe title
      let title = $('.H2').first().text()
      title = title.toLowerCase()
    
      // List of ingredients
      let ingredients = $('table[cellpadding="10"]').find('.H1').first().text()
      ingredients = ingredients.replace(/,/g , ' or')  
      
      // Preparation details
      let preparation = $('table[cellpadding="10"]').next().find('.H1').text()
      preparation = preparation.replace('      ', '').replace(/,/g, ' ')

      docID++
      if(title != ' print the recipe'){
        writer.write({
          docID: docID,
          Title: title,
          Ingredients: ingredients,
          Preparation: preparation
        })
      }
    }
  })
  id += 1
}
