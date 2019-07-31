const axios = require('axios')
const parser = require('xml2json')

const Configuration = require('../../../config')
const { params } = require('./validate')

const handler = async (ctx) => {
  try {
    const { isbn } = ctx.params
    const URL = `${Configuration.bnf.api.sru.url}?version=1.2&operation=searchRetrieve&query=bib.ean%20all%20"${isbn}"&recordSchema=dublincore`
    const { data: xml } = await axios.get(URL)
    const data = parser.toJson(xml)
    return data
  } catch (e) { return Promise.reject(e) }
}

module.exports = {
  params,
  handler
}
