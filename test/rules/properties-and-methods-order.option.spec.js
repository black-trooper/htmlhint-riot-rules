var expect = require('expect.js')
var HTMLHint = require('htmlhint').HTMLHint

var ruleId = 'properties-and-methods-order'
var ruleOptions = {}
ruleOptions[ruleId] = {
  alphabetize: false
}
HTMLHint.addRule(require(`../../rules/${ruleId}.js`))

describe('Rules: ' + ruleId + ' with option', function () {
  it('Import sources not in order should result in an error', function () {
    var code = `<tag><script>
      import addMonths from 'date-fns/add_months'
      import addDays from 'date-fns/add_days'
    </script></tag>`
    var messages = HTMLHint.verify(code, ruleOptions)
    expect(messages.length).to.be(0)
  })

  it('Tag properties not in order should result in an error', function () {
    var code = `<tag><script>
      var tag = this
      tag.todos = [];
      tag.text = '';
    </script></tag>`
    var messages = HTMLHint.verify(code, ruleOptions)
    expect(messages.length).to.be(0)
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
    expect(messages.length).to.be(0)
  })

  it('Declarations not in order should result in an error', function () {
    var code = `<tag><script>
      var tag = this
      var text = '';
      var id = 1;
    </script></tag>`
    var messages = HTMLHint.verify(code, ruleOptions)
    expect(messages.length).to.be(0)
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
    expect(messages.length).to.be(0)
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
    expect(messages.length).to.be(0)
  })

  it('Ruled script without tag declaration should not result in an error', function () {
    var code = `<tag><script>
      import addDays from 'date-fns/add_days'
      import addMonths from 'date-fns/add_months'
      this.text = '';
      this.todos = [];
      this.add = add;
      this.edit = edit;
      this.on('mount', onMount);
      this.toggle = toggle;
      
      var id = 1, object = {}, text = [];
      const version = require('../package.json').version;
      id = 2;
      object = {}
      object.member = {};
      object.text = [];
      object.z_index = 1;
      obseriot.on('routing', onRouting);
      text = [1];

      function add(event) {
          /* ... */
      }

      function edit(event) {
          /* ... */
      }

      function onMount(event) {
          /* ... */
      }

      function onRouting(content) {
          /* ... */
      }

      function toggle(event) {
          /* ... */
      }
    </script></tag>`
    var messages = HTMLHint.verify(code, ruleOptions)
    expect(messages.length).to.be(0)
  })

  it('Ruled script should not result in an error', function () {
    var code = `<tag><script>
      import addDays from 'date-fns/add_days'
      import addMonths from 'date-fns/add_months'
      var tag = this;
      tag.text = '';
      tag.todos = [];
      tag.add = add;
      tag.edit = edit;
      tag.on('mount', onMount);
      tag.toggle = toggle;
      
      var id = 1, object = {}, text = '';
      const version = require('../package.json').version;
      id = 2;
      object.z_index = 1;
      obseriot.on('routing', onRouting);

      function add(event) {
          /* ... */
      }

      function edit(event) {
          /* ... */
      }

      function onMount(event) {
          /* ... */
      }

      function onRouting(content) {
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