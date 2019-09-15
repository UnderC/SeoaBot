/**
 * @name Seoa:Music
 * @description Music
 */

const conv = require('./stuffs/convertTime')
const { RichEmbed } = require('discord.js')
exports.run = async (seoa, msg, query) => {
  /** 이벤트 중복 등록 방지 */
  const embed = new RichEmbed()
  const policy = seoa.settings.localPolicy.music
  if (!seoa.m.servers.has(msg.guild.id)) {
    seoa.m.once(`${msg.guild.id}_add`, _here => {
      _here.on('playing', song => {
        let u = conv(song.length)
        const embed = new RichEmbed()
        embed.addField(`:cd: **재생중!**`, `**제목** | ${song.title}\n**길이** | ${u[1]}시간 ${u[2]}분 ${u[3]}초`)
          .setThumbnail(song.thumbnail)
        msg.channel.send(embed)
      })

      _here.on('alreadyJoined', () => {
        msg.channel.send('이미 접속했대. 만약 오류라면 ``>>>m fix``를 사용해주라9! (찡긋)')
      })

      _here.on('notChannel', () => {
        msg.channel.send('니 채널에 없대')
      })

      _here.on('addSong', song => {
        const embed = new RichEmbed()
        embed.addField(':inbox_tray: **대기열 추가됨!**', `${song.title} (이)가 대기열에 추가되었습니다.`)
          .setThumbnail(song.thumbnail)
        msg.channel.send(embed)
      })

      _here.on('myList', m => {
        const embed = new RichEmbed()
        embed.addField(':inbox_tray: **대기열 추가됨!**', `<@${m.author}>(이)가 만든 ${m.name} 플레이리스트\n${m.list.length}개의 항목이 대기열에 추가되었습니다.`)
        msg.channel.send(embed)
      })

      _here.on('changeVol', (bef, aft) => {
        const embed = new RichEmbed()
        embed.addField(':loud_sound: **볼륨 변경됨!**', `볼륨이 ${bef * 100}% 에서 ${aft * 100}% (으)로 변경되었습니다.`)
        msg.channel.send(embed)
      })
    })
  }

  let here = seoa.m._(msg.guild.id, msg.member.voiceChannel)
  if (query.args[0] === 'join') here._(msg.member.voiceChannel)
  else if (query.args[0] === 'leave') here.leave()
  else if (query.args[0] === 'url') {
    if (!query.args[1]) return
    here.add(query.args[1])
    here.start()
  } else if (query.args[0] === 'play') here.start()
  else if (query.args[0] === 'vol') {
    if (0 <= Number(query.args[1])) {
      if (policy.volumeLimit ? Number(query.args[1]) <= 200 : true) here.setVolume(Number(query.args[1]) / 100)
      else msg.channel.send('200% 를 넘는 볼륨으로 설정 할 수 없습니다.')
    } else if (query.args[1]) msg.channel.send('0% 미만의 볼륨으로 설정 할 수 없습니다.')
  } else if (query.args[0] === 'stop') here.stop()
  else if (query.args[0] === 'skip') here.skip()
  else if (query.args[0] === 'pause') here.pause()
  else if (query.args[0] === 'clear') here.clear()
  else if (query.args[0] === 'repeat') here.repeat ? here.repeat = false : here.repeat = true
  else if (query.args[0] === 'random') here.random ? here.random = false : here.random = true
  else if (query.args[0] === 'now') {
    if (!here.currentSong) return
    let u = conv(here.currentSong.length - Math.floor(here.dispatcher.time / 1000))
    embed.addField(`:musical_note: **지금 재생중**`, `**제목** | ${here.currentSong.title}\n**길이** | ${u[1]}시간 ${u[2]}분 ${u[3]}초 남음`)
      .setThumbnail(here.currentSong.thumbnail)
    msg.channel.send(embed)
  } else if (query.args[0] === 'list') {
    embed.setTitle(`:clipboard: **대기열**`)
    let res = ''
    for (let i in here.songs) res += `[${i}] **제목** | ${here.songs[i].title}\n`
    msg.channel.send(embed.setDescription(res))
  } else if (query.args[0] === 'search') {
    if (!query.args[1]) return
    seoa.search._(query.args.splice(1).join(' '), 5).then(res => {
      here.add(res.items[0].id.videoId)
    })
  } else if (query.args[0] === 'fix') here.fix(msg.member.voiceChannel)
  else if (query.args[0] === 'stable') here.stableMode = true
  else if (query.args[0] === 'unstable') here.stableMode = false
  else if (query.args[0] === 'mylist') {
    let mylist = await seoa.db.select('mylist', { name: query.args[1] })
    here.mylist(mylist[0])
  }
  else {
    let desc = `
      **[] Optinal, <> Required**
      (p)m <join|leave|stop|skip>
      (p)m <now|queue>
      (p)m <play|repeat|fix>
      (p)m search <query>
      (p)m url <youtube_url>
      (p)m vol <percentage>
      (p)m mylist <mylist_ID>
    `
    msg.channel.send(desc.split('(p)').join(seoa.settings.prefix))
  }
}

exports.callSign = ['m']
exports.helps = {
  description: '음악과 관련된 명령어 입니다.',
  uses: 'm'
}
