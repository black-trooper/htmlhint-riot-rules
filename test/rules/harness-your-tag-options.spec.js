var expect = require('expect.js')
var HTMLHint = require('htmlhint').HTMLHint

var ruleId = 'harness-your-tag-options'
var ruleOptions = {}
ruleOptions[ruleId] = true
HTMLHint.addRule(require(`../../rules/${ruleId}.js`))

describe('Rules: ' + ruleId, function () {
  it('Not Use defaults option values in attribute should result in an error', function () {
    var code = '<tag><ul><li each="{ item in opts.items }">{ item }</li></ul></tag>'
    var messages = HTMLHint.verify(code, ruleOptions)
    expect(messages.length).to.be(1)
    expect(messages[0].rule.id).to.be(ruleId)
    expect(messages[0].line).to.be(1)
    expect(messages[0].col).to.be(10)
    expect(messages[0].type).to.be('warning')
  })


  it('Not Use defaults option values in value should result in an error', function () {
    var code = '<tag>{ opts.name }</tag>'
    var messages = HTMLHint.verify(code, ruleOptions)
    expect(messages.length).to.be(1)
    expect(messages[0].rule.id).to.be(ruleId)
    expect(messages[0].line).to.be(1)
    expect(messages[0].col).to.be(6)
    expect(messages[0].type).to.be('warning')
  })

  it('Not Use defaults option values in script should result in an error', function () {
    var code = `<tag>
      <ul><li each="{ item in items }">{ item }</li></ul>
      <script>
        this.items = opts.items
      </script>
    </tag>`
    var messages = HTMLHint.verify(code, ruleOptions)
    expect(messages.length).to.be(1)
    expect(messages[0].rule.id).to.be(ruleId)
    expect(messages[0].line).to.be(4)
    expect(messages[0].col).to.be(8)
    expect(messages[0].raw).to.be('        this.items = opts.items')
    expect(messages[0].type).to.be('warning')
  })

  it('Not Use defaults option values in script one liner should result in an error', function () {
    var code = '<tag>{ name }<script>this.name = opts.name</script></tag>'
    var messages = HTMLHint.verify(code, ruleOptions)
    expect(messages.length).to.be(1)
    expect(messages[0].rule.id).to.be(ruleId)
    expect(messages[0].line).to.be(1)
    expect(messages[0].col).to.be(22)
    expect(messages[0].raw).to.be('this.name = opts.name')
    expect(messages[0].type).to.be('warning')
  })

  it('Not Use defaults option values in valiable declaration should result in an error', function () {
    var code = `<tag>
      <script>
        let items = opts.items
      </script>
    </tag>`
    var messages = HTMLHint.verify(code, ruleOptions)
    expect(messages.length).to.be(1)
    expect(messages[0].rule.id).to.be(ruleId)
    expect(messages[0].line).to.be(3)
    expect(messages[0].col).to.be(8)
    expect(messages[0].raw).to.be('        let items = opts.items')
    expect(messages[0].type).to.be('warning')
  })

  it('Ruled script should not result in an error', function () {
    var code = `<tag>
    <ul><li each="{ item in items }">{ item }</li></ul>
    <script>
      this.items = opts.items || [];
    </script></tag>`
    var messages = HTMLHint.verify(code, ruleOptions)
    expect(messages.length).to.be(0)
  })
})