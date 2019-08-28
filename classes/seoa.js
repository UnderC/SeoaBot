const Discord = require('discord.js')
const Music = require('./music_native')
const Search = require('./search')
const { join } = require('path')

module.exports = class Seoa extends Discord.Client {
  constructor (config, db) {
    super()
    this.settings = config
    this.db = db || null
    this.m = new Music()
    this.commands = new Discord.Collection()
    this.player = null
    this.search = new Search(config.youtube)
      .addParam('type', 'video')
      .addParam('order', 'relevance')
    
    this.on('guildCreate', guild => {
      if (this.db) return this.db.update('serverdata', { owner: guild.ownerID }, { id: guild.id })
    })

    this.on('guildDelete', guild => {
      if (this.db) return this.db.update('serverdata', { owner: guild.ownerID }, { id: guild.id })
    })

    const commands = require(join(__dirname, '../', config.commands))
    Object.keys(commands).forEach(k => {
      const command = commands[k]
      if (config.localPolicy.core.printLoadedCMD) console.log(`${config.commands.split(/\\|\//).pop()}.${k} loaded`)
      command.callSign.forEach(c => {
        this.commands.set(c, command)
      })
    })
    this.login(config.token)
  }
}