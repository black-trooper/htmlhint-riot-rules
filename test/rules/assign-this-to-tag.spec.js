var expect = require('expect.js')
var HTMLHint = require('htmlhint').HTMLHint

var ruleId = 'assign-this-to-tag'
var ruleOptions = {}
ruleOptions[ruleId] = true
HTMLHint.addRule(require(`../../rules/${ruleId}.js`))

describe('Rules: ' + ruleId, function () {
  it('Not assign this to tag should result in an error', function () {
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
    expect(messages[0].line).to.be(2)
    expect(messages[0].col).to.be(1)
    expect(messages[0].type).to.be('warning')
  })
  it('Assign this to tag but use this should result in an error', function () {
    var code = `<tag><script>
        const tag = this;
        const date = new Date()
        this.message = "today is " + date
        this.show = function(){
          return this.message
        }
    </script></tag>`
    var messages = HTMLHint.verify(code, ruleOptions)
    expect(messages.length).to.be(1)
    expect(messages[0].rule.id).to.be(ruleId)
    expect(messages[0].line).to.be(2)
    expect(messages[0].col).to.be(1)
    expect(messages[0].type).to.be('warning')
  })
  it('Assign this to tag should result in an error', function () {
    var code = `<tag><script>
        const tag = this;
        const date = new Date()
        tag.message = "today is " + date
        tag.show = function(){
          return this.message
        }
    </script></tag>`
    var messages = HTMLHint.verify(code, {
      'assign-this-to-tag': {
        force: true
      }
    })
    expect(messages.length).to.be(1)
  })
  it('Assign this to tag should not result in an error', function () {
    var code = `<tag><script>
        const tag = this;
        const date = new Date()
        tag.message = "today is " + date
        tag.show = function(){
          return this.message
        }
    </script></tag>`
    var messages = HTMLHint.verify(code, ruleOptions)
    expect(messages.length).to.be(0)
  })
  it('None this should not result in an error', function () {
    var code = '<tag><script></script></tag>'
    var messages = HTMLHint.verify(code, ruleOptions)
    expect(messages.length).to.be(0)
  })
})