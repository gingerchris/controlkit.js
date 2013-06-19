ControlKit.NumberInput_Internal = function(stepValue,decimalPlaces,onBegin,onChange,onFinish)
{
    ControlKit.EventDispatcher.apply(this,null);

    /*---------------------------------------------------------------------------------*/

    this._value        = 0;
    this._valueStep    = stepValue || 1.0;
    this._valueDPlace  = decimalPlaces + 1;

    /*---------------------------------------------------------------------------------*/

    this._onBegin      = onBegin  || function(){};
    this._onChange     = onChange || function(){};
    this._onFinish     = onFinish || function(){};

    /*---------------------------------------------------------------------------------*/

    var input = this._input = new ControlKit.Node(ControlKit.NodeType.INPUT_TEXT);
    input.setProperty('value',this._value);

    /*---------------------------------------------------------------------------------*/

    input.addEventListener(ControlKit.NodeEventType.KEY_DOWN, this._onInputKeyDown.bind(this));
    input.addEventListener(ControlKit.NodeEventType.KEY_UP,   this._onInputKeyUp.bind(this));
    input.addEventListener(ControlKit.NodeEventType.CHANGE,   this._onInputChange.bind(this));
};

ControlKit.NumberInput_Internal.prototype = Object.create(ControlKit.EventDispatcher.prototype);

ControlKit.NumberInput_Internal.prototype._onInputKeyDown = function(e)
{
    var step       = (e.shiftKey ? ControlKit.Preset.NUMBER_INPUT_SHIFT_MULTIPLIER : 1) * this._valueStep,
        keyCode    =  e.keyCode;

    if( keyCode == 38 ||
        keyCode == 40 )
    {
        e.preventDefault();

        var multiplier = keyCode == 38 ? 1.0 : -1.0;
        this._value   += (step * multiplier);

        this._onBegin();
        this._onChange();
        this._format();
    }
};

ControlKit.NumberInput_Internal.prototype._onInputKeyUp = function(e)
{
    var keyCode = e.keyCode;

    if( e.shiftKey    || keyCode == 38  ||
        keyCode == 40 || keyCode == 190 ||
        keyCode == 8  || keyCode == 39  ||
        keyCode == 37)   return;

    this._validate();
    this._format();
};

ControlKit.NumberInput_Internal.prototype._onInputChange = function(e)
{
    this._validate();
    this._format();
    this._onFinish();
};

ControlKit.NumberInput_Internal.prototype._validate = function()
{
    if(this.inputIsNumber())
    {
        var input = this._getInput();
        if(input != '-')this._value = Number(input);
        this._onChange();
        return;
    }

    this._setOutput(this._value);
};

ControlKit.NumberInput_Internal.prototype.inputIsNumber = function()
{
    var value = this._getInput();

    //TODO:FIX
    if(value == '-' || value == '0')return true;
    return /^\s*-?[0-9]\d*(\.\d{1,1000000})?\s*$/.test(value);
};

ControlKit.NumberInput_Internal.prototype._format = function()
{
    var string = this._value.toString(),
        index  = string.indexOf('.');

    if(index>0)string = string.slice(0,index+this._valueDPlace);

    this._setOutput(string);
};

ControlKit.NumberInput_Internal.prototype._setOutput = function(n){this._input.setProperty('value',n);};
ControlKit.NumberInput_Internal.prototype._getInput  = function() {return this._input.getProperty('value')};
ControlKit.NumberInput_Internal.prototype.getValue   = function() {return this._value;};
ControlKit.NumberInput_Internal.prototype.setValue   = function(n){this._value = n;this._format();};
ControlKit.NumberInput_Internal.prototype.getNode    = function() {return this._input;};