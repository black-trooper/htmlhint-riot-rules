var expect = require('expect.js')
var HTMLHint = require('htmlhint').HTMLHint

var ruleId = 'tag-options-primitive'
var ruleOptions = {}
ruleOptions[ruleId] = true
HTMLHint.addRule(require(`../../rules/${ruleId}.js`))

describe('Rules: ' + ruleId, function () {
  it('Add object option to attribute should result in an error', function () {
    var code = '<tag><p value="{ opts.item.id }"></p></tag>'
    var messages = HTMLHint.verify(code, ruleOptions)
    expect(messages.length).to.be(1)
    expect(messages[0].rule.id).to.be(ruleId)
    expect(messages[0].line).to.be(1)
    expect(messages[0].col).to.be(8)
    expect(messages[0].type).to.be('warning')
  })

  it('Add object option to text should result in an error', function () {
    var code = '<tag>{ opts.item.id }</tag>'
    var messages = HTMLHint.verify(code, ruleOptions)
    expect(messages.length).to.be(1)
    expect(messages[0].rule.id).to.be(ruleId)
    expect(messages[0].line).to.be(1)
    expect(messages[0].col).to.be(6)
    expect(messages[0].type).to.be('warning')
  })

  it('Add object option to script should result in an error', function () {
    var code = '<tag><script>let id = opts.item.id</script></tag>'
    var messages = HTMLHint.verify(code, ruleOptions)
    expect(messages.length).to.be(1)
    expect(messages[0].rule.id).to.be(ruleId)
    expect(messages[0].line).to.be(1)
    expect(messages[0].col).to.be(14)
    expect(messages[0].type).to.be('warning')
  })

  it('Add array option to attribute should result in an error', function () {
    var code = '<tag><p value="{ opts.value[0] }"></p></tag>'
    var messages = HTMLHint.verify(code, ruleOptions)
    expect(messages.length).to.be(1)
    expect(messages[0].rule.id).to.be(ruleId)
    expect(messages[0].line).to.be(1)
    expect(messages[0].col).to.be(8)
    expect(messages[0].type).to.be('warning')
  })

  it('Add array option to text should result in an error', function () {
    var code = '<tag>{ opts.value[0] }</tag>'
    var messages = HTMLHint.verify(code, ruleOptions)
    expect(messages.length).to.be(1)
    expect(messages[0].rule.id).to.be(ruleId)
    expect(messages[0].line).to.be(1)
    expect(messages[0].col).to.be(6)
    expect(messages[0].type).to.be('warning')
  })

  it('Add array option to script should result in an error', function () {
    var code = '<tag><script>let id = opts.value[0]</script></tag>'
    var messages = HTMLHint.verify(code, ruleOptions)
    expect(messages.length).to.be(1)
    expect(messages[0].rule.id).to.be(ruleId)
    expect(messages[0].line).to.be(1)
    expect(messages[0].col).to.be(14)
    expect(messages[0].type).to.be('warning')
  })

  it('Add primitive option to attribute value should not result in an error', function () {
    var code = `<tag>
      <p value="{ opts.id }" class="default"></p>
      <p value="{ opts.id}{opts.name }" class="{ default: opts.class }"></p>
      <p value="{ opts.id+opts.name }"></p>
      <p value="{ opts.id}{name[0]}"></p>
      <p value="{ opts.id+name[0] }"></p>
      <a each="{item in opts.items}">  </a>
    </tag>`
    var messages = HTMLHint.verify(code, ruleOptions)
    expect(messages.length).to.be(0)
  })

  it('Add primitive option to text should not result in an error', function () {
    var code = `<tag>
      <p>{ opts.id }</p>
      <p>{ name[0] }</p>
      <script></script>
    </tag>`
    var messages = HTMLHint.verify(code, ruleOptions)
    expect(messages.length).to.be(0)
  })

  it('Add primitive option to script should not result in an error', function () {
    var code = `<tag><script>
      import addDays from 'date-fns/add_days'
      let id = opts.id
      let text = ''
      let name = text
      let lastText
      const version = require('../package.json').version;
      this.id = opts.id
      this.text = ''
      this.name = text
    </script></tag>`
    var messages = HTMLHint.verify(code, ruleOptions)
    expect(messages.length).to.be(0)
  })
})