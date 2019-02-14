var expect = require('expect.js')
var HTMLHint = require('htmlhint').HTMLHint

var ruleId = 'tag-expressions-simple'
var ruleOptions = {}
ruleOptions[ruleId] = 5
HTMLHint.addRule(require(`../../rules/${ruleId}.js`))

describe('Rules: ' + ruleId, function () {
  it('Not simple expression should result in an error', function () {
    var code = `<tag>
      { (new Date()).getUTCFullYear() + '-' + ('0' + ((new Date()).getUTCMonth()+1)).slice(-2) }
      { (new Date()).getUTCFullYear() + '-' + ('0' + ((new Date()).getUTCMonth()+1)).slice(-2) }
      { year() + '-' + month() }
    </tag>`
    var messages = HTMLHint.verify(code, ruleOptions)
    expect(messages.length).to.be(3)
    expect(messages[0].rule.id).to.be(ruleId)
    expect(messages[0].line).to.be(2)
    expect(messages[0].col).to.be(1)
    expect(messages[0].type).to.be('warning')

    expect(messages[1].rule.id).to.be(ruleId)
    expect(messages[1].line).to.be(2)
    expect(messages[1].col).to.be(1)
    expect(messages[1].type).to.be('warning')
  })

  it('Escaped expression should not result in an error', function () {
    var code = `<tag>
      <code>\\{ (new Date()).getUTCFullYear() + '-' + ('0' + ((new Date()).getUTCMonth()+1)).slice(-2) \\}</code>
    </tag>`
    var messages = HTMLHint.verify(code, ruleOptions)
    expect(messages.length).to.be(0)
  })

  it('Simple expression should not result in an error', function () {
    var code = `<tag>
      { year() }-{ month() }
    </tag>`
    var messages = HTMLHint.verify(code, ruleOptions)
    expect(messages.length).to.be(0)
  })

  it('None expression should not result in an error', function () {
    var code = `<tag>aaa</tag>`
    var messages = HTMLHint.verify(code, ruleOptions)
    expect(messages.length).to.be(0)
  })
})