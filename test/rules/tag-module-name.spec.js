var expect = require('expect.js')
var HTMLHint = require('htmlhint').HTMLHint

var ruleId = 'tag-module-name'
var ruleOptions = {}
ruleOptions[ruleId] = true
HTMLHint.addRule(require(`../../rules/${ruleId}.js`))

describe('Rules: ' + ruleId, function () {
  it('Not include a hyphen should result in an error', function () {
    var code = `<tag></tag>`
    var messages = HTMLHint.verify(code, ruleOptions)
    expect(messages.length).to.be(1)
    expect(messages[0].rule.id).to.be(ruleId)
    expect(messages[0].line).to.be(1)
    expect(messages[0].col).to.be(1)
    expect(messages[0].type).to.be('error')
  })
  it('Include a hyphen should not result in an error', function () {
    var code = '<app-tag><script></script></app-tag>'
    var messages = HTMLHint.verify(code, ruleOptions)
    expect(messages.length).to.be(0)
  })
})