var expect = require('expect.js')
var HTMLHint = require('htmlhint').HTMLHint

var ruleId = 'avoid-tag-parent'
var ruleOptions = {}
ruleOptions[ruleId] = true
HTMLHint.addRule(require(`../../rules/${ruleId}.js`))

describe('Rules: ' + ruleId, function () {
  it('Add parent to attribute should result in an error', function () {
    var code = '<tag><p value="{ parent.item }"></p></tag>'
    var messages = HTMLHint.verify(code, ruleOptions)
    expect(messages.length).to.be(1)
    expect(messages[0].rule.id).to.be(ruleId)
    expect(messages[0].line).to.be(1)
    expect(messages[0].col).to.be(8)
    expect(messages[0].type).to.be('warning')
  })

  it('Add parent to text should result in an error', function () {
    var code = '<tag>{ parent.item }</tag>'
    var messages = HTMLHint.verify(code, ruleOptions)
    expect(messages.length).to.be(1)
    expect(messages[0].rule.id).to.be(ruleId)
    expect(messages[0].line).to.be(1)
    expect(messages[0].col).to.be(6)
    expect(messages[0].type).to.be('warning')
  })

  it('Use parent.parent attribute value with each attribute should result in an error', function () {
    var code = '<tag><p each="{ item in items }" on-click="{ parent.parent.show }"></p></tag>'
    var messages = HTMLHint.verify(code, ruleOptions)
    expect(messages.length).to.be(1)
    expect(messages[0].rule.id).to.be(ruleId)
    expect(messages[0].line).to.be(1)
    expect(messages[0].col).to.be(33)
    expect(messages[0].type).to.be('warning')
  })

  it('Use parent attribute value with each attribute should not result in an error', function () {
    var code = '<tag><p each="{ item in items }" on-click="{ parent.show }"></p></tag>'
    var messages = HTMLHint.verify(code, ruleOptions)
    expect(messages.length).to.be(0)
  })

  it('None parent attribute value should not result in an error', function () {
    var code = '<tag><p value="{ item }"></p></tag>'
    var messages = HTMLHint.verify(code, ruleOptions)
    expect(messages.length).to.be(0)
  })

  it('None parent text should not result in an error', function () {
    var code = '<tag><p>{ item }</p></tag>'
    var messages = HTMLHint.verify(code, ruleOptions)
    expect(messages.length).to.be(0)
  })
})