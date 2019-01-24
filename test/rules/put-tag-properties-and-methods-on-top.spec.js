var expect = require('expect.js')
var HTMLHint = require('htmlhint').HTMLHint

var ruleId = 'put-tag-properties-and-methods-on-top'
var ruleOptions = {}
ruleOptions[ruleId] = true
HTMLHint.addRule(require(`../../rules/${ruleId}.js`))

describe('Rules: ' + ruleId, function () {
  it('Not Put tag declaration on top should result in an error', function () {
    var code = `<tag><script>
      function add() {}
      var tag = this;
    </script></tag>`
    var messages = HTMLHint.verify(code, ruleOptions)
    expect(messages.length).to.be(1)
    expect(messages[0].rule.id).to.be(ruleId)
    expect(messages[0].message).to.be('Put tag declaration on top.')
    expect(messages[0].line).to.be(2)
    expect(messages[0].col).to.be(6)
    expect(messages[0].raw).to.be('      function add() {}')
    expect(messages[0].type).to.be('warning')
  })

  it('Multi line tag method should result in an error', function () {
    var code = `<tag><script>
      var tag = this;
      tag.show = function(){
        return this.message
      }
    </script></tag>`
    var messages = HTMLHint.verify(code, ruleOptions)
    expect(messages.length).to.be(1)
    expect(messages[0].rule.id).to.be(ruleId)
    expect(messages[0].message).to.be('Keeping tag method declaration a one-liner.')
    expect(messages[0].line).to.be(3)
    expect(messages[0].col).to.be(6)
    expect(messages[0].raw).to.be('      tag.show = function(){')
    expect(messages[0].type).to.be('warning')
  })

  it('Tag properties not in order should result in an error', function () {
    var code = `<tag><script>
      var tag = this
      tag.todos = [];
      tag.text = '';
    </script></tag>`
    var messages = HTMLHint.verify(code, ruleOptions)
    expect(messages.length).to.be(1)
    expect(messages[0].rule.id).to.be(ruleId)
    expect(messages[0].message).to.be('Expected tag properties to be in order.')
    expect(messages[0].line).to.be(4)
    expect(messages[0].col).to.be(6)
    expect(messages[0].raw).to.be('      tag.text = \'\';')
    expect(messages[0].type).to.be('warning')
  })

  it('Tag properties not after tag declaration should result in an error', function () {
    var code = `<tag><script>
      var tag = this
      tag.add = add;
      tag.text = '';
      function add(event) {
          /* ... */
      }
    </script></tag>`
    var messages = HTMLHint.verify(code, ruleOptions)
    expect(messages.length).to.be(1)
    expect(messages[0].rule.id).to.be(ruleId)
    expect(messages[0].message).to.be('Put tag properties after tag declaration.')
    expect(messages[0].line).to.be(4)
    expect(messages[0].col).to.be(6)
    expect(messages[0].raw).to.be('      tag.text = \'\';')
    expect(messages[0].type).to.be('warning')
  })

  it('Tag methods not in order should result in an error', function () {
    var code = `<tag><script>
      var tag = this
      tag.edit = edit;
      tag.add = add;
      function add(event) {
          /* ... */
      }
      function edit(event) {
          /* ... */
      }
    </script></tag>`
    var messages = HTMLHint.verify(code, ruleOptions)
    expect(messages.length).to.be(1)
    expect(messages[0].rule.id).to.be(ruleId)
    expect(messages[0].message).to.be('Expected tag methods to be in order.')
    expect(messages[0].line).to.be(4)
    expect(messages[0].col).to.be(6)
    expect(messages[0].raw).to.be('      tag.add = add;')
    expect(messages[0].type).to.be('warning')
  })

  it('Tag methods not after tag declaration and tag properties should result in an error', function () {
    var code = `<tag><script>
      var tag = this
      var id = 1;
      tag.add = add;
      function add(event) {
          /* ... */
      }
    </script></tag>`
    var messages = HTMLHint.verify(code, ruleOptions)
    expect(messages.length).to.be(1)
    expect(messages[0].rule.id).to.be(ruleId)
    expect(messages[0].message).to.be('Put tag methods after tag declaration and tag properties.')
    expect(messages[0].line).to.be(4)
    expect(messages[0].col).to.be(6)
    expect(messages[0].raw).to.be('      tag.add = add;')
    expect(messages[0].type).to.be('warning')
  })

  it('Ruled script should not result in an error', function () {
    var code = `<tag><script>
      var tag = this;
      tag.text = '';
      tag.todos = [];
      tag.add = add;
      tag.edit = edit;
      tag.toggle = toggle;
      
      var id = 1, object = {}, text = '';
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
    console.log(messages)
    expect(messages.length).to.be(0)
  })

  it('empty script should not result in an error', function () {
    var code = `<tag><script></script></tag>`
    var messages = HTMLHint.verify(code, ruleOptions)
    expect(messages.length).to.be(0)
  })
})