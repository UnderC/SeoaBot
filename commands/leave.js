/**
 * @name Seoa:Leave
 * @description Voice Leave
 */

/** Message */
const i18n = require('i18n')

exports.run = (seoa, msg, settings) => {
  if (msg.guild.voiceConnection) {
    // TODO: LEAVE 에러 고치기
    msg.member.voiceChannel.leave()
    msg.channel.send(
      i18n.__({ phrase: 'Leave', locale: settings.servers[msg.guild.id].lang })
    )
  }
}

exports.callSign = ['나가기', 'leave']
exports.helps = {
  description: '음성 채널을 나갑니다',
  uses: '>leave'
}
