var expect = require('expect.js')
var HTMLHint = require('htmlhint').HTMLHint

var ruleId = 'use-each-in-syntax'
var ruleOptions = {}
ruleOptions[ruleId] = true
HTMLHint.addRule(require(`../../rules/${ruleId}.js`))

describe('Rules: ' + ruleId, function () {
  it('Add each not use in syntax should result in an error', function () {
    var code = '<tag><p each="{ items }"></p></tag>'
    var messages = HTMLHint.verify(code, ruleOptions)
    expect(messages.length).to.be(1)
    expect(messages[0].rule.id).to.be(ruleId)
    expect(messages[0].line).to.be(1)
    expect(messages[0].col).to.be(8)
    expect(messages[0].type).to.be('warning')
  })

  it('Add each use in syntax should not result in an error', function () {
    var code = '<tag><p each="{ item in items }"></p></tag>'
    var messages = HTMLHint.verify(code, ruleOptions)
    expect(messages.length).to.be(0)
  })
})