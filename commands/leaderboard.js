/**
 * @name Seoa:settings
 * @description settings Command
 */

// i18n (locale)
const i18n = require('i18n')

exports.run = async (seoa, msg) => {
  let server = await seoa.db.select('serverdata', { id: msg.guild.id })
  server = server[0]
  let arr = await seoa.db.select('userdata', null, 'order by quizPoint desc limit 10')

  let temp =
    '```fix\n' +
    i18n.__({
      phrase: 'LeaderBoardMsg',
      locale: server.lang
    }) +
    '\n'
  arr.forEach((leader, th) => {
    const user = seoa.users.find(u => u.id === leader.id)
    console.log(user)
    temp += i18n.__(
      {
        phrase: 'LeaderBoardMsg1',
        locale: server.lang
      },
      th + 1,
      user ? user.username : 'UNKNOWN',
      leader.quizPoint
    )
  })
  temp += '```'
  msg.channel.send(temp)
}

exports.callSign = ['leader', 'leaderboard', '리더보드', '리더', '보드']
exports.helps = {
  description: '리더보드를 보여줍니다',
  uses: 'leaderboard'
}
