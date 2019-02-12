var expect = require('expect.js')
var HTMLHint = require('htmlhint').HTMLHint

var ruleId = 'fake-es6-syntax-disabled'
var ruleOptions = {}
ruleOptions[ruleId] = true
HTMLHint.addRule(require(`../../rules/${ruleId}.js`))

describe('Rules: ' + ruleId, function () {
  it('Use fake ES6 syntax method should result in an error', function () {
    var code = `<tag><script>
      add() {
          if (this.text) {
              this.todos.push({ title: this.text });
              this.text = this.input.value = '';
          }
      }
    </script></tag>`
    var messages = HTMLHint.verify(code, ruleOptions)
    expect(messages.length).to.be(1)
    expect(messages[0].rule.id).to.be(ruleId)
    expect(messages[0].line).to.be(2)
    expect(messages[0].col).to.be(13)
    expect(messages[0].raw).to.be('      add() {')
    expect(messages[0].type).to.be('warning')
  })

  it('Use fake ES6 syntax propety should result in an error', function () {
    var code = `<tag><script>todos = [];</script></tag>`
    var messages = HTMLHint.verify(code, ruleOptions)
    expect(messages.length).to.be(1)
    expect(messages[0].rule.id).to.be(ruleId)
    expect(messages[0].line).to.be(1)
    expect(messages[0].col).to.be(14)
    expect(messages[0].raw).to.be('todos = [];')
    expect(messages[0].type).to.be('warning')
  })

  it('Ruled script should not result in an error', function () {
    var code = `<tag><script>
      import addDays from 'date-fns/add_days'
      var tag = this;
      tag.text = '';
      tag.todos = [];
      tag.add = add;
      tag.edit = edit;
      tag.toggle = toggle;
      
      var id = 1, object = {}, text = '';
      const version = require('../package.json').version;
      id = 2;
      object.z_index = 1;

      function add(event) {
          /* ... */
      }

      function edit(event) {
          /* ... */
      }

      function toggle(event) {
          /* ... */
      }
    </script></tag>`
    var messages = HTMLHint.verify(code, ruleOptions)
    expect(messages.length).to.be(0)
  })
})