QUnit.test("Class.create should return a function", function (assert) {
  var klass = Class.Create({});
  assert.equal(typeof klass === 'function', true);
});

QUnit.test("Class.create should return a function " +
  "with Extend propertyof type function", function (assert) {
  var klass = Class.Create({});

  assert.equal(typeof klass.Extend === 'function', true);
});

QUnit.test("Class.create should call the Extend function", function (assert) {
  var temp_extend = Class.Extend;

  Class.Extend = function (){
    return 1;
  };
  assert.equal(Class.Create({}), 1);
  Class.Extend = temp_extend;
});

QUnit.test('Class.create should append functions ' +
    'to its instance', function (assert) {
      var testClass = Class.Create({
          init: function() { },
          dance: function() { }
        }),
        prop_array = [],
        prop;

      for (prop in new testClass()) {
        prop_array.push(prop);
      }
      assert.equal(prop_array.length, 2);
      assert.equal(prop_array[0], 'init');
      assert.equal(prop_array[1], 'dance');
});

QUnit.test("base class should extend from " +
  "the super class by appending the super class functions " +
  "with the base class functions and returning it", function (assert) {
    var test_super_class = Class.Create({
        dance: function() {},
        laugh: function() {}
      }),
      test_base_class = test_super_class.Extend({
        sing: function() {}
      }),
      prop_array = [],
      prop;


    for (prop in new test_base_class()) {
      prop_array.push(prop);
    }
    
    assert.equal(prop_array.length, 3);
    assert.equal(prop_array[0], 'sing');
    assert.equal(prop_array[1], 'dance');
    assert.equal(prop_array[2], 'laugh');
});

QUnit.test('base class methods should not leak into ' +
    'the instance of super class', function (assert) {
      var test_super_class = Class.Create({
          dance: function() {},
          laugh: function() {},
        }),
        prop_array = [],
        prop;

      test_super_class.Extend({
          sing: function() {}
      });      

      for (prop in new test_super_class()) {
        prop_array.push(prop);
      }

      assert.equal(prop_array.length, 2);
      assert.equal(prop_array[0], 'dance');
      assert.equal(prop_array[1], 'laugh');
});

QUnit.test("base class function should append the superclass functions " +
    "within the super instance varibale, if both the " +
    "functions have same name", function (assert) {
    var test_variable = false,
      test_super_class = Class.Create({
        dance: function() { 
         test_variable = true;
        },
        kick:function () {
          
        }
      }),
      test_base_class = test_super_class.Extend({
        dance: function () {
          this._super();
        },
        sing: function () {
          
        }        
      }), obj= new test_base_class();

    obj.dance();
    assert.equal(test_variable, true);
});

QUnit.test('Should pass parameter to the super class method', function (assert) {
  var test_variable = false,
      test_super_class = Class.Create({
        kick:function () {
          
        },
        dance: function(param1, param2) { 
         test_variable = param1 + param2;
        }
      }),
      test_base_class = test_super_class.Extend({
        dance: function () {
          this._super(2,4);
        },
        sing: function () {
          
        }        
      }), obj= new test_base_class();
      
    obj.dance();
    assert.equal(test_variable, 6);
});

QUnit.test('Should get return values from the super class method', function (assert) {
  var test_variable = false,
      test_super_class = Class.Create({
        kick:function () {
          
        },
        dance: function() { 
         return true;
        }
      }),
      test_base_class = test_super_class.Extend({
        dance: function () {
          test_variable = this._super();
        },
        sing: function () {
          
        }        
      }), obj= new test_base_class();
      
    obj.dance();
    assert.equal(test_variable, true);
});

QUnit.test("base class object should be instance of super class", function (assert) {
  var test_super_class = Class.Create({
      foo: function() {}
    }),
    test_base_class = test_super_class.Extend({
      bar: function () {}
    }),
    obj =  new test_base_class();
   
  assert.equal(obj instanceof test_super_class, true);
});

QUnit.test("super class object should not be instance of base class", function (assert) {
  var test_super_class = Class.Create({
      foo: function() {}
    }),
    test_base_class = test_super_class.Extend({
      bar: function () {}
    }),
    obj =  new test_super_class();
     
  assert.equal(obj instanceof test_base_class, false);
});

QUnit.test("object instances should not leak", function (assert) {
  var Foo = Class.Create({ }),
    Bar = Class.Create({ }),
    foo_obj =  new Foo(),
    bar_obj= new Bar();
     
  assert.equal(foo_obj instanceof Bar, false);
  assert.equal(bar_obj instanceof Foo, false);
});

QUnit.test("constructor should be called when a class is instantiated", function (assert) {
  var test_var = false,
    test_class = Class.Create({
      init: function() {
        test_var = true;
      },
      foo: function() {}
    });
      
  new test_class();
  assert.equal(test_var, true);
});

QUnit.test("super class constructor should not be called while " +
  "base class appending the its prototype properties", function (assert) {
  var test_var = false,
    supr= Class.Create({
      init: function() {
        test_var = true;
      }        
    });
  
  supr.Extend({});
  assert.equal(test_var, false);
});

QUnit.test('base class should inherit '+
  'the super class properties', function (assert) {
  var SuperClass = Class.Create({
    init: function () {
      this.a = 1;
    }
  }), SubClass, subclass;

  SubClass = SuperClass.Extend({
    init: function () {
      this._super();      
    }
  });  
  subclass = new SubClass();
  assert.equal(subclass.a, 1);
});

QUnit.test('Real World use scenerio testing 1', function (assert) {

  var Person = Class.Create({
    init: function(isDancing) {
      this.dancing = isDancing;
    },
    dance: function() {
      return this.dancing;
    }
  });

  var Ninja = Person.Extend({
    init: function() {
      this._super(false);
    },
    dance: function() {
      return this._super();
    },
    swingSword: function() {
      return true;
    }
  });
    
  var p = new Person(true);
  var n = new Ninja();
    
  assert.equal(p.dance(), true);
  assert.equal(n.dance(), false);
  assert.equal(n.swingSword(), true);
});

QUnit.test('Real World use scenerio testing 2', function (assert) {

  var Vehicle = Class.Create({
    init: function(wheels) {
      this.wheels = wheels;
    }
  });

  var Truck = Vehicle.Extend({
    init: function(hp, wheels) {
      this._super(wheels);
      this.horsepower = hp;

    },
    printInfo: function() {
      console.log('I am a truck and I have ' + this.wheels + ' wheels and ' + this.horsepower + ' hp.');
    }
  });
  
  var t = new Truck(350, 4);
  assert.equal(t.horsepower, 350);
  assert.equal(t.wheels,4);  
  
});