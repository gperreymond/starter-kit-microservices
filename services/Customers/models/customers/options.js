const options = {
  tableName: 'customers',
  timestamps: true,
  indexes: [{
    unique: true,
    fields: ['email']
  }]
}

module.exports = options
