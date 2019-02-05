var expect = require('expect.js')
var HTMLHint = require('htmlhint').HTMLHint

var ruleId = 'file-line-limit'
var ruleOptions = {}
ruleOptions[ruleId] = 6
HTMLHint.addRule(require(`../../rules/${ruleId}.js`))

describe('Rules: ' + ruleId, function () {
  it('File lines limit over should result in an error', function () {
    var code = `<tag><script>
        const date = new Date()
        this.message = "today is " + date
        this.show = function(){
          return this.message
        }
    </script></tag>`
    var messages = HTMLHint.verify(code, ruleOptions)
    expect(messages.length).to.be(1)
    expect(messages[0].rule.id).to.be(ruleId)
    expect(messages[0].line).to.be(7)
    expect(messages[0].col).to.be(14)
    expect(messages[0].type).to.be('warning')
  })
  it('Not exceed file lines limit over should not result in an error', function () {
    var code = '<tag><script></script></tag>'
    var messages = HTMLHint.verify(code, ruleOptions)
    expect(messages.length).to.be(0)
  })
})