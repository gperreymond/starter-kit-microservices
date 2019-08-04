const axios = require('axios')
const parser = require('xml2json')

const Configuration = require('../../../config')
const { params } = require('./validate')

const handler = async (ctx) => {
  ctx.service.logger.warn(ctx.action.rawName, ctx.params)
  try {
    const { isbn } = ctx.params
    console.log(`Call for isbn=${isbn}`)
    const URL = `${Configuration.bnf.api.sru.url}?version=1.2&operation=searchRetrieve&query=bib.ean%20all%20"${isbn}"&recordSchema=dublincore`
    const { data: xml } = await axios.get(URL)
    const data = JSON.parse(parser.toJson(xml))
    const count = parseInt(data['srw:searchRetrieveResponse']['srw:numberOfRecords'])
    if (count === 1) {
      const record = data['srw:searchRetrieveResponse']['srw:records']['srw:record']['srw:recordData']['oai_dc:dc']
      console.log(record)
    }
    return true
  } catch (e) { return Promise.reject(e) }
}

module.exports = {
  params,
  handler
}
