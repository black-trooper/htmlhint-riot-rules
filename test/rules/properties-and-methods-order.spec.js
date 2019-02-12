var expect = require('expect.js')
var HTMLHint = require('htmlhint').HTMLHint

var ruleId = 'properties-and-methods-order'
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
      tag.add = () => {
        
      }
      tag.show = function(){
        return this.message
      }
    </script></tag>`
    var messages = HTMLHint.verify(code, ruleOptions)
    expect(messages.length).to.be(2)
    expect(messages[0].rule.id).to.be(ruleId)
    expect(messages[0].message).to.be('Keeping tag method declaration a one-liner.')
    expect(messages[0].line).to.be(3)
    expect(messages[0].col).to.be(6)
    expect(messages[0].raw).to.be('      tag.add = () => {')
    expect(messages[1].raw).to.be('      tag.show = function(){')
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

  it('Declarations not in order should result in an error', function () {
    var code = `<tag><script>
      var tag = this
      var text = '';
      var id = 1;
    </script></tag>`
    var messages = HTMLHint.verify(code, ruleOptions)
    expect(messages.length).to.be(1)
    expect(messages[0].rule.id).to.be(ruleId)
    expect(messages[0].message).to.be('Expected declarations to be in order.')
    expect(messages[0].line).to.be(4)
    expect(messages[0].col).to.be(6)
    expect(messages[0].raw).to.be('      var id = 1;')
    expect(messages[0].type).to.be('warning')
  })

  it('Declarations not after tag properties and tag methods should result in an error', function () {
    var code = `<tag><script>
      var tag = this
      tag.add = add;
      function add(event) {
        /* ... */
      }
      var id = 1;
    </script></tag>`
    var messages = HTMLHint.verify(code, ruleOptions)
    expect(messages.length).to.be(1)
    expect(messages[0].rule.id).to.be(ruleId)
    expect(messages[0].message).to.be('Put declarations after tag properties and tag methods.')
    expect(messages[0].line).to.be(7)
    expect(messages[0].col).to.be(6)
    expect(messages[0].raw).to.be('      var id = 1;')
    expect(messages[0].type).to.be('warning')
  })

  it('Properties not in order should result in an error', function () {
    var code = `<tag><script>
      var tag = this
      var id = 1;
      var object = {};
      var text = '';
      object.data.z_index = 1;
      object.data.value = 1;
      text = 'text'
      id = 2;
    </script></tag>`
    var messages = HTMLHint.verify(code, ruleOptions)
    expect(messages.length).to.be(2)
    expect(messages[0].rule.id).to.be(ruleId)
    expect(messages[0].message).to.be('Expected properties to be in order.')
    expect(messages[0].line).to.be(7)
    expect(messages[0].col).to.be(6)
    expect(messages[0].raw).to.be('      object.data.value = 1;')
    expect(messages[1].raw).to.be('      id = 2;')
    expect(messages[0].type).to.be('warning')
  })

  it('Properties not after declarations should result in an error', function () {
    var code = `<tag><script>
      var tag = this
      tag.add = add;
      var id = 1;
      function add(event) {
        /* ... */
      }
      id = 2;
    </script></tag>`
    var messages = HTMLHint.verify(code, ruleOptions)
    expect(messages.length).to.be(1)
    expect(messages[0].rule.id).to.be(ruleId)
    expect(messages[0].message).to.be('Put properties after declarations.')
    expect(messages[0].line).to.be(8)
    expect(messages[0].col).to.be(6)
    expect(messages[0].raw).to.be('      id = 2;')
    expect(messages[0].type).to.be('warning')
  })

  it('Functions not in order should result in an error', function () {
    var code = `<tag><script>
      var tag = this
      function edit(event) {
          /* ... */
      }
      function add(event) {
          /* ... */
      }
    </script></tag>`
    var messages = HTMLHint.verify(code, ruleOptions)
    expect(messages.length).to.be(1)
    expect(messages[0].rule.id).to.be(ruleId)
    expect(messages[0].message).to.be('Expected functions to be in order.')
    expect(messages[0].line).to.be(6)
    expect(messages[0].col).to.be(6)
    expect(messages[0].raw).to.be('      function add(event) {')
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

  it('empty script should not result in an error', function () {
    var code = `<tag><script></script></tag>`
    var messages = HTMLHint.verify(code, ruleOptions)
    expect(messages.length).to.be(0)
  })
})