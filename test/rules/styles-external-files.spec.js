var expect = require('expect.js')
var HTMLHint = require('htmlhint').HTMLHint

var ruleId = 'styles-external-files'
var ruleOptions = {}
ruleOptions[ruleId] = true
HTMLHint.addRule(require(`../../rules/${ruleId}.js`))

describe('Rules: ' + ruleId, function () {
  it('Add style should result in an error', function () {
    var code = '<tag><style>h1{ font-size: 2rem }</style></tag>'
    var messages = HTMLHint.verify(code, ruleOptions)
    expect(messages.length).to.be(1)
    expect(messages[0].rule.id).to.be(ruleId)
    expect(messages[0].line).to.be(1)
    expect(messages[0].col).to.be(6)
    expect(messages[0].type).to.be('warning')
  })

  it('None style should not result in an error', function () {
    var code = '<tag></tag>'
    var messages = HTMLHint.verify(code, ruleOptions)
    expect(messages.length).to.be(0)
  })
})