var expect = require('expect.js')
var HTMLHint = require('htmlhint').HTMLHint

var ruleId = 'use-script-inside-tag'
var ruleOptions = {}
ruleOptions[ruleId] = true
HTMLHint.addRule(require(`../../rules/${ruleId}.js`))

describe('Rules: ' + ruleId, function () {
  it('Add script without tag should result in an error', function () {
    var code = "<tag>this.trigger('click', this)</tag>"
    var messages = HTMLHint.verify(code, ruleOptions)
    expect(messages.length).to.be(1)
    expect(messages[0].rule.id).to.be(ruleId)
    expect(messages[0].line).to.be(1)
    expect(messages[0].col).to.be(33)
    expect(messages[0].type).to.be('error')
  })

  it('Add script with tag should not result in an error', function () {
    var code = "<tag><hoge />'a'</tag>"
    var messages = HTMLHint.verify(code, ruleOptions)
    expect(messages.length).to.be(1)
  })

  it('Add script with tag should not result in an error', function () {
    var code = "<tag><script>this.trigger('click', this)</script></tag>"
    var messages = HTMLHint.verify(code, ruleOptions)
    expect(messages.length).to.be(0)
  })

  it('None script should not result in an error', function () {
    var code = '<tag></tag>'
    var messages = HTMLHint.verify(code, ruleOptions)
    expect(messages.length).to.be(0)
  })

  it('Space only should not result in an error', function () {
    var code = '<tag> </tag>'
    var messages = HTMLHint.verify(code, ruleOptions)
    expect(messages.length).to.be(0)
  })
})